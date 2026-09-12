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

There are no tests, no linter config, and no package.json.

## Architecture

This is a **vanilla JS single-page app** — no framework, no bundler, no build pipeline. The entire application logic lives in three files:

- **`app.js`** — all state, feed fetching, parsing, rendering, and event wiring. No modules; everything is in one `'use strict'` script.
- **`index.html`** — static app shell with all DOM structure. Elements are referenced by ID via the `$ = id => document.getElementById(id)` shorthand in `app.js`.
- **`styles.css`** — CSS custom properties drive the dark/light theme; `data-theme` on `<html>` switches between them.
- **`sw.js`** — service worker. Cache name is `ctt-v6`; increment it whenever cached assets change so old caches are evicted on activate.

## Feed Fetching

RSS feeds are fetched client-side through a three-strategy proxy fallback (see `PROXY_STRATEGIES` in `app.js`):
1. `rss2json.com` — returns clean JSON (primary)
2. `allorigins.win/raw` — returns raw XML (fallback)
3. Direct fetch — for feeds with CORS headers (last resort)

`fetchFeed()` tries each strategy in order and throws only if all three fail. On failure the feed retains its last-known articles rather than blanking out, to avoid bursting the free proxy quota and losing visible content.

## State & localStorage

| Key | Purpose |
|-----|---------|
| `ctt-v2` | Per-feed enabled/disabled map (built-in feeds) |
| `ctt-custom` | Array of user-added custom feed objects |
| `ctt-read` | Array of read article IDs (capped at 3000) |

All `localStorage` writes go through `safeSetItem()` to swallow quota/policy errors silently. All reads are wrapped in try/catch for the same reason.

## Security Notes

- Article `link` values from feeds are sanitized before assignment to `href` — only `http:` and `https:` URLs are allowed; anything else (including `javascript:`) is replaced with `#`.
- Feed URLs in the OPML export are XML-escaped.
- The Chart.js CDN script tag includes a Subresource Integrity hash.
