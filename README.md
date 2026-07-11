# Cyber Threat Tracker

A Progressive Web App (PWA) that aggregates 22 cyber threat intelligence RSS feeds into a single, real-time dashboard.

![Version](https://img.shields.io/badge/version-v0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **22 RSS feed sources** — CISA, Bleeping Computer, The Hacker News, CrowdStrike, Cisco Talos, Mandiant, Securelist, Unit 42, SANS ISC, and more
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
- **Offline support** — service worker caches the app shell
- **PWA installable** — add to home screen on iOS / Android / desktop

## Sources

| Source | Category |
|--------|----------|
| CISA Advisories | Government |
| CISA Alerts | Government |
| CISA Current Activity | Government |
| Bleeping Computer | News |
| The Hacker News | News |
| Dark Reading | News |
| SecurityWeek | News |
| Krebs on Security | News |
| CrowdStrike | Threat Intel |
| Cisco Talos | Threat Intel |
| Mandiant | Threat Intel |
| Recorded Future | Threat Intel |
| IBM Security | Threat Intel |
| Securelist (Kaspersky) | Threat Intel |
| Unit 42 (Palo Alto) | Threat Intel |
| SANS ISC | Threat Intel |
| Abuse.ch | Threat Intel |
| ANY.RUN | Threat Intel |
| Google Project Zero | Vulnerability Research |
| GreyNoise | Threat Intel |
| VirusTotal | Threat Intel |
| MISP | Open Source Intel |

## Running Locally

No build step or server required. Open `index.html` directly in a browser, or serve from any static file server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080`.

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | App shell, layout, settings modal |
| `app.js` | Feed fetching, parsing, rendering, state |
| `styles.css` | CSS variables, dark/light themes, layout |
| `sw.js` | Service worker — cache-first for app shell, network-first for feeds |
| `manifest.json` | PWA manifest |
| `threat-feeds.opml` | Static OPML export of all 22 feeds |

RSS feeds are fetched client-side via a proxy chain to work around browser CORS restrictions:
1. **rss2json.com** — returns clean JSON (primary)
2. **allorigins.win/raw** — returns raw XML (fallback)
3. **Direct fetch** — for feeds with CORS headers (last resort)

## Customization

Open the **Settings** gear icon to enable/disable any feed. Use the **Add Custom Feed** form at the bottom to add any RSS URL — the app tests the feed live before saving it.

Custom feeds are stored in `localStorage` and persist across sessions.

## Changelog

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
