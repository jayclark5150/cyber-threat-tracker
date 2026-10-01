# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running Locally

No build step. Serve the directory with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`. Opening `index.html` directly as a `file://` URL will work for most features but the service worker won't register.

Without `feeds.json` the app live-fetches every feed through rss2json (slow, rate-limited). Build a local snapshot with `python3 scripts/build_feeds.py` (stdlib only; output is git-ignored).

There are no tests, no linter config, and no package.json.

## Architecture

This is a **vanilla JS single-page app** — no framework, no bundler, no build pipeline. The entire application logic lives in three files:

- **`app.js`** — all state, feed fetching, parsing, rendering, and event wiring. No modules; everything is in one `'use strict'` script.
- **`VERSION`** in `app.js` is the single source for the version shown in the header badge and the chart toolbar; also update the README badge/changelog when bumping it.
- **`index.html`** — static app shell with all DOM structure. Elements are referenced by ID via the `$ = id => document.getElementById(id)` shorthand in `app.js`.
- **`styles.css`** — CSS custom properties drive the dark/light theme; `data-theme` on `<html>` switches between them.
- **`sw.js`** — service worker. Cache name is `ctt-v10`; increment it whenever cached assets change so old caches are evicted on activate. `feeds.json` is network-first with the last copy kept for offline.
- **`scripts/build_feeds.py`** — server-side snapshot builder (Python stdlib). Reads the feed list from `app.js`, writes `feeds.json` (per feed: `ok, fetched, items, error?, failingSince?`; top level: `generated, kevIds`).
- **`scripts/check_feed_health.py`** — run by the workflow after the build; opens/closes `feed-health` issues via `gh` for feeds failing 24h+. Test with `--dry-run`.
- **`.github/workflows/update-feeds.yml`** — runs the builder every 15 min and on push, then deploys to GitHub Pages (Pages source must be "GitHub Actions"; the site is not served from the branch).

## Feed Fetching

The feed list is `FEEDS` in `app.js`, written as **strict JSON** between `/*FEEDS:START*/` and `/*FEEDS:END*/` so `scripts/build_feeds.py` can parse it. Keep it valid JSON (double quotes, no comments or trailing commas). Optional fields: `cors: true` (fetch directly before the proxy), `type: "kev"` (CISA KEV JSON — only available via the snapshot).

Custom feeds (`custom: true`, stored in `ctt-custom`) have `cors` learned at runtime: `fetchFeed()` tries direct first while it's unknown, records which strategy worked in `feed.cors`, and `refreshAll()` persists changes via `saveAllFeeds()`. "Suggest a feed" opens `.github/ISSUE_TEMPLATE/feed-suggestion.yml` pre-filled through URL params matching the form field ids (`feed-name`, `feed-url`).

`refreshAll()` loads in three layers:
1. **Cache** — `loadCache()` renders the previous visit's items from `localStorage` before any network request.
2. **Snapshot** — `loadSnapshot()` fetches `feeds.json` (`{generated, feeds: {[url]: {ok, error, fetched, items}}}`). Entries are used when the snapshot is under `SNAPSHOT_MAX_AGE_MS` old and `ok`.
3. **Live fallback** — custom feeds, snapshot failures, and everything when the snapshot is missing/stale go through `fetchFeed()`: `viaDirect` then `viaRss2json` for `cors` feeds, the reverse otherwise. Results render progressively via `scheduleRender()`.

Fetchers return raw items `{title, link, desc, ts, kev?, ransomware?}`; `makeItem()` turns them into display items (tags, priority, id, read state). Tagging/priority logic lives only in `app.js`, never in the builder. `buildItems()` merges enabled feeds and de-duplicates by link (first feed in list order wins). `commitItems(items, background)` holds background updates behind the "N new stories" button when the list is scrolled down.

`makeItem()` also extracts CVE IDs (`cves`) and sets `exploited` when one is in `kevSet` (from `feeds.json` `kevIds`), which forces priority to critical. `feedStatus` (name → `{ok, error, fetched, failingSince}`) drives the health display in Settings. `knownIds` tracks seen story ids so `notifyNewCritical()` alerts only on new ones (never on the first load); notification clicks go through `sw.js` `notificationclick` → `postMessage` → `openItemById()`.

On failure a feed keeps its last-known items (`lastGoodByFeed`), both in the browser and in the builder (`--previous`).

## State & localStorage

| Key | Purpose |
|-----|---------|
| `ctt-v2` | Per-feed enabled/disabled map (built-in feeds) |
| `ctt-custom` | Array of user-added custom feed objects |
| `ctt-read` | Array of read article IDs (capped at 3000) |
| `ctt-cache` | Last items per feed (raw form) + `savedAt` + `kevIds`, for instant startup |
| `ctt-notify` | `'1'` when desktop alerts for new Critical stories are on |

All `localStorage` writes go through `safeSetItem()` to swallow quota/policy errors silently. All reads are wrapped in try/catch for the same reason.

## Security Notes

- Article `link` values from feeds are sanitized before assignment to `href` — only `http:` and `https:` URLs are allowed; anything else (including `javascript:`) is replaced with `#`.
- Feed URLs in the OPML export are XML-escaped.
- The Chart.js CDN script tag includes a Subresource Integrity hash.
