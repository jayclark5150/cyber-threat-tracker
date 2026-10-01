# Cyber Threat Tracker

A Progressive Web App (PWA) that aggregates 39 cyber threat intelligence sources into a single, real-time dashboard.

![Version](https://img.shields.io/badge/version-v0.2.2-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **39 sources** — CISA (including the Known Exploited Vulnerabilities catalog), Canadian Cyber Centre, NCSC UK, Bleeping Computer, The Hacker News, The Record, Cisco Talos, Microsoft, Unit 42, Securelist, SANS ISC, Zero Day Initiative, and more
- **Fast startup** — a pre-built `feeds.json` snapshot (refreshed every 15 minutes by GitHub Actions) loads in one request, and the last-seen stories are shown instantly from the browser cache
- **Threat tag detection** — articles are automatically tagged: Ransomware, Vulnerability, APT, Phishing, Malware, Data Breach, Critical Infra, DDoS
- **Priority scoring** — Critical / High / Medium labels based on threat type
- **Live activity charts** — By Source (donut), By Threat Type (donut), Over Time (line) — powered by Chart.js
- **Custom feeds** — add and remove your own RSS sources directly in the app
- **OPML export** — export all feeds for import into any RSS reader
- **Dark / light mode** — persisted across sessions
- **Read/unread tracking** — opened stories are marked read and dimmed, with an unread count in the header and a "mark all read" action
- **Priority filter chips** — filter the story list by Critical / High / Medium / Low, independent of the source and threat-tag filters
- **Keyboard navigation** — ↑/↓ arrows move the selection through the story list
- **Resizable panels** — drag the vertical divider to resize the feed list, drag the horizontal divider to resize the article/chart split
- **Background refresh** — every 5 minutes and whenever you return to the tab; new stories wait behind a "N new stories" button if you've scrolled down, so the list doesn't jump while you read
- **Offline support** — service worker caches the app shell and the latest snapshot
- **PWA installable** — add to home screen on iOS / Android / desktop

## Sources

| Source | Category |
|--------|----------|
| CISA Advisories | Government |
| CISA Alerts | Government |
| CISA Cur. Activity | Government |
| CISA KEV | Government |
| Canadian Cyber Centre | Government |
| NCSC UK | Government |
| Krebs on Security | News |
| Bleeping Computer | News |
| The Hacker News | News |
| Dark Reading | News |
| SecurityWeek | News |
| The Record | News |
| Security Affairs | News |
| Help Net Security | News |
| Cybersecurity Dive | News |
| Schneier on Security | News |
| Cisco Talos | Threat Intel |
| SANS ISC | Threat Intel |
| Securelist | Threat Intel |
| Unit 42 | Threat Intel |
| Recorded Future | Threat Intel |
| Microsoft Security | Threat Intel |
| Check Point Research | Threat Intel |
| ESET WeLiveSecurity | Threat Intel |
| Rapid7 | Threat Intel |
| Proofpoint | Threat Intel |
| SentinelLabs | Threat Intel |
| Wiz | Threat Intel |
| Huntress | Threat Intel |
| Volexity | Threat Intel |
| The DFIR Report | Threat Intel |
| Red Canary | Threat Intel |
| MISP | Threat Intel |
| ANY.RUN | Threat Intel |
| GreyNoise | Threat Intel |
| VirusTotal | Threat Intel |
| Google Proj Zero | Vulnerability Research |
| Zero Day Initiative | Vulnerability Research |
| ransomware.live (off by default) | Ransomware |

CISA KEV entries are always marked **Critical**, since each one is confirmed to be exploited in the wild.
ransomware.live lists ransomware leak-site victim posts as they appear; enable it in Settings if you want that volume.

## Running Locally

No build step is required. Serve the folder with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`. Without a local `feeds.json` the app fetches every feed live
through the proxy (slower, and rate-limited). To use a snapshot locally, build one first:

```bash
python3 scripts/build_feeds.py   # writes feeds.json (git-ignored); Python 3.10+, no dependencies
```

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | App shell, layout, settings modal |
| `app.js` | Feed list, fetching, parsing, rendering, state |
| `styles.css` | CSS variables, dark/light themes, layout |
| `sw.js` | Service worker — cache-first for the app shell, network-first for `feeds.json` and the proxy |
| `manifest.json` | PWA manifest |
| `threat-feeds.opml` | Static OPML export of the built-in RSS feeds |
| `scripts/build_feeds.py` | Fetches every built-in feed server-side and writes `feeds.json` |
| `.github/workflows/update-feeds.yml` | Runs the builder every 15 minutes and deploys the site to GitHub Pages |

### How feeds load

1. **Cache** — stories from the previous visit are shown immediately from `localStorage`.
2. **Snapshot** — `feeds.json` is fetched from the same site. It is rebuilt every 15 minutes by
   GitHub Actions, which fetches feeds server-side (no CORS limits, no proxy rate limits, up to
   25 stories per feed).
3. **Live fallback** — custom feeds, any feed the snapshot failed on, and every feed if the
   snapshot is missing or more than an hour old are fetched in the browser: directly for feeds
   that allow it (`cors: true`), otherwise via **rss2json.com**. Stories appear as each feed
   arrives. If a fetch fails, the feed keeps its last-known stories.

The feed list lives in `app.js` between `/*FEEDS:START*/` and `/*FEEDS:END*/` as strict JSON,
so the snapshot builder reads the same list. Keep it valid JSON (double quotes, no trailing
commas or comments).

### Deployment

The site is deployed by the workflow, not directly from the branch: **Settings → Pages →
Source** must be **GitHub Actions**. Pushing to `main` redeploys; you can also run it from the
**Actions** tab. GitHub pauses scheduled workflows after 60 days without repository activity —
re-enable it from the Actions tab if the snapshot stops updating.

## Customization

Open the **Settings** gear icon to enable/disable any feed. Use the **Add Custom Feed** form at the bottom to add any RSS URL — the app tests the feed live before saving it.

Custom feeds are stored in `localStorage` and persist across sessions. They only appear in the
browser where you added them, and are fetched live by your browser rather than from the
`feeds.json` snapshot:

- When you add a feed, the app first tries loading it **directly**. If the feed allows that
  (it sends CORS headers), it's remembered and always loaded directly — fast, and no proxy limits.
- Otherwise it's loaded through the **rss2json** proxy, which caps feeds at 10 stories and
  sometimes rate-limits new feeds. If that happens, try again later.

### Suggesting a feed for everyone

To get a source added to the built-in list (collected every 15 minutes, visible to all users),
use **Suggest a feed for everyone** under the Add Custom Feed form, or the paper-plane button
next to any custom feed. It opens a pre-filled
[feed suggestion issue](https://github.com/jayclark5150/cyber-threat-tracker/issues/new?template=feed-suggestion.yml)
on GitHub (a GitHub account is required).

## Changelog

### v0.2.2 (2026-10-01)

- **Custom feeds load directly when possible** — when a feed is added, the app tests a direct
  load first and remembers whether the feed allows it. Feeds that do never touch the rss2json
  proxy. Existing custom feeds are detected on their next refresh.
- **Suggest a feed for everyone** — a link under Add Custom Feed and a button on each custom feed
  open a pre-filled GitHub issue (new `feed-suggestion` issue form) to propose it as a built-in feed
- Clearer message when rss2json is rate-limiting new feeds

### v0.2.1 (2026-10-01)

- App version is now also shown in the chart toolbar, so it's visible on mobile (the header badge is hidden on small screens). Both read from `VERSION` in `app.js`.

### v0.2.0 (2026-10-01)

Faster loading:
- **feeds.json snapshot** built every 15 minutes by GitHub Actions — the app now loads one
  same-origin file instead of making 20+ proxy requests. In testing, the first story appeared in
  **0.7 s instead of 27 s**, and all sources loaded (the old version lost half its sources to
  rss2json rate limiting)
- **Instant startup** from the previous visit's stories, cached in `localStorage`
- **Progressive rendering** — when fetching live, stories appear as each feed arrives instead of
  after the slowest feed
- Feeds with CORS headers are fetched directly; proxy timeouts cut from 12 s to 6 s; the
  allorigins.win proxy (frequently down) was removed
- Chart.js and `app.js` are loaded with `defer` so they don't block first paint

Refresh:
- Auto-refresh every 5 minutes (15 when falling back to live fetching), and on returning to the
  tab or reconnecting if the data is more than 5 minutes old
- "N new stories" button holds back background updates while you're scrolled down the list
- Header shows how old the data is ("Updated 4m ago")
- The service worker keeps the latest snapshot for offline use

Sources:
- Fixed: Cisco Talos (feed moved), SecurityWeek, ANY.RUN, Google Project Zero, CISA Alerts and
  CISA Current Activity (URLs redirected)
- Removed dead feeds: CrowdStrike (empty response), Mandiant (now a web page), Abuse.ch (404),
  IBM Security (now a web page)
- Added: CISA KEV, Canadian Cyber Centre, NCSC UK, The Record, Security Affairs, Help Net
  Security, Cybersecurity Dive, Schneier on Security, Microsoft Security, Check Point Research,
  ESET, Rapid7, Proofpoint, SentinelLabs, Wiz, Huntress, Volexity, The DFIR Report, Red Canary,
  Zero Day Initiative, ransomware.live (off by default)
- Duplicate stories that appear in more than one feed (e.g. the CISA feeds) are shown once

Fixes:
- rss2json dates are UTC but were parsed as local time, shifting story times by the UTC offset

### v0.1.1 (2026-09-12)

Bug fixes from a multi-agent Claude Code review pass:

- **Stable article IDs** — IDs are now derived from each article's link/guid rather than its position in the feed response. Previously, a feed prepending one new item would shift every existing item's index, silently marking all previously-read stories as unread again.
- **Atom feed link resolution** — `<link rel="self">` (the feed's own subscription URL) is no longer picked over `<link rel="alternate">` (the article URL). Affects Atom feeds such as Google Project Zero and VirusTotal; article links previously navigated to the feed URL instead of the article.
- **Tag false-positive fix** — threat-tag keyword matching now uses word-boundary matching for single-token words. Previously, `apt` matched "l**apt**op" and "c**apt**cha"; `ics` matched "top**ics**"; `rce` matched "sour**ce**"; `rat` matched "grate**ful**". Multi-word phrases (e.g. "nation-state", "cobalt strike") continue to use substring matching.
- **Custom feed deletion** — the check for whether the open article belongs to a deleted feed now uses an exact source-name comparison instead of a string prefix, which could match articles from a different feed with a similar name (e.g. deleting "Foo" would incorrectly clear the panel for items from "Foo-Extra").
- **Fetch stagger** — all five fetch lanes were firing simultaneously on startup despite the code comment stating they should be spread out. Each lane now starts offset by `laneIdx × 200 ms` to avoid bursting the free rss2json proxy quota.
- **Stale article link** — when a feed item has no valid URL, the "Read Full Story" button is hidden but its `href` was retaining the previous item's URL. The `href` attribute is now removed, preventing screen readers or keyboard users from activating the wrong link.
- **Relative URL injection** — `safeExternalUrl` now rejects relative paths from feed items (e.g. `/logout`) that previously resolved against the app's own origin and passed the http/https check.
- **Chart flicker** — the By Source and By Threat donut charts now update data in place (`chart.update('none')`) instead of destroying and recreating the Chart.js instance on every filter change or search keystroke. The chart is only recreated when switching between chart modes.
- **OPML download race** — `URL.revokeObjectURL` is now deferred by 1 second after `a.click()` so the browser has time to queue the download before the object URL is released.
- Removed the misleading per-article reading-time estimate — descriptions are always truncated to 600 characters in the proxy response, making the estimate always "1 min read" regardless of actual article length.

### v0.1.0 (2026-07-11)

New features:
- Read/unread tracking for stories, with a "mark all read" action and an unread count in the header
- Priority filter chips (Critical / High / Medium / Low) alongside the source and threat-tag filters
- Keyboard navigation (↑/↓) through the story list
- Search now matches article descriptions, not just titles
- Fixed missing PWA install icons and favicon (`manifest.json` referenced files that didn't exist)
- Feed refresh now caps concurrent requests and falls back to last-known articles on a transient feed failure, instead of bursting the free rss2json/allorigins proxy quota and blanking a source out on error
- Added `aria-label`s to icon-only controls (header buttons, feed toggle/delete buttons) for screen reader support
- Renamed the misleading "AI Summary" label — it was always just a truncated description, not an LLM-generated summary
- Updated the CISA Advisories feed to its current URL

This release also went through a Claude Code review pass, which found and fixed:
- An unsanitized article link that could carry a `javascript:` URI from a malicious/compromised feed into `href`
- Unguarded `localStorage` calls — a storage failure (private browsing, quota exceeded, disabled by policy) could throw during page init and silently prevent the whole app from loading feeds
- Feed URLs weren't escaped in the OPML export, which could produce invalid XML

## License

MIT
