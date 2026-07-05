# Cyber Threat Tracker

A Progressive Web App (PWA) that aggregates 22 cyber threat intelligence RSS feeds into a single, real-time dashboard.

![Version](https://img.shields.io/badge/version-v0.0.1-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **22 RSS feed sources** — CISA, Bleeping Computer, The Hacker News, CrowdStrike, Cisco Talos, Mandiant, Securelist, Unit 42, SANS ISC, and more
- **Threat tag detection** — articles are automatically tagged: Ransomware, Vulnerability, APT, Phishing, Malware, Data Breach, Critical Infra, DDoS
- **Priority scoring** — Critical / High / Medium labels based on threat type
- **Live activity charts** — By Source (donut), By Threat Type (donut), Over Time (line) — powered by Chart.js
- **Custom feeds** — add and remove your own RSS sources directly in the app
- **OPML export** — export all feeds for import into any RSS reader
- **Dark / light mode** — persisted across sessions
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

## License

MIT
