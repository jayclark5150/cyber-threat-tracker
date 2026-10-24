# Changelog

## [0.3.0] - 2026-10-01
- Link CVE IDs to NVD; flag stories mentioning a CISA KEV CVE as Exploited (Critical priority, new filter chip)
- Feed health: per-feed status in Settings; GitHub Actions workflow opens/closes feed-health issues for feeds failing 24h+
- Opt-in desktop alerts for new Critical stories while the app is in the background
- 24h / 7 days time filter; OPML import (max 30 per import)
- Clamp future-dated items to fetch time (Fortinet mislabels time zones)
- Add Google Threat Intel, Cisco PSIRT, Fortinet PSIRT, Exploit-DB, GitHub Security, The Register, Wired Security, Troy Hunt, AWS Security (48 total sources)

## [0.2.2] - 2026-09-01
- Custom feeds try a direct load first and remember whether the feed sends CORS headers
- "Suggest a feed for everyone" link and per-feed button open a pre-filled GitHub issue

## [0.2.1] - 2026-08-15
- Show app version in the chart toolbar

## [0.2.0] - 2026-08-01
- GitHub Actions builds feeds.json every 15 min and deploys Pages; app loads one same-origin file instead of 20+ proxy calls
- Show cached stories instantly; render live fetches progressively
- Direct fetch for CORS-enabled feeds, 6s timeouts
- De-duplicate stories across feeds; fix rss2json UTC date parsing
- Add CISA KEV and 16 more sources (39 total)

## [0.1.0] - 2026-07-01
- Initial release: PWA with dark/light UI, 23 threat intelligence sources, live activity charts
