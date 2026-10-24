'use strict';

/* Feed definitions. Kept as strict JSON between the markers so the GitHub Actions
   snapshot builder (scripts/build_feeds.py) can read the same list. Optional fields:
   cors: true  - feed sends CORS headers, so fetch it directly before trying the proxy
   type: 'kev' - CISA Known Exploited Vulnerabilities JSON; only available via feeds.json */
const FEEDS = /*FEEDS:START*/[
  {"name": "CISA Advisories", "url": "https://www.cisa.gov/cybersecurity-advisories/all.xml", "color": "#5b8df0", "initials": "CI", "group": "Government", "enabled": true},
  {"name": "CISA Alerts", "url": "https://www.cisa.gov/cybersecurity-advisories/cybersecurity-advisories.xml", "color": "#b71c1c", "initials": "CA", "group": "Government", "enabled": true},
  {"name": "CISA Cur. Activity", "url": "https://www.cisa.gov/cybersecurity-advisories/alerts.xml", "color": "#e65100", "initials": "CC", "group": "Government", "enabled": true},
  {"name": "CISA KEV", "url": "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", "color": "#d50000", "initials": "KV", "group": "Government", "enabled": true, "type": "kev"},
  {"name": "Canadian Cyber Centre", "url": "https://www.cyber.gc.ca/api/cccs/atom/v1/get?feed=alerts_advisories&lang=en", "color": "#c62828", "initials": "CY", "group": "Government", "enabled": true, "cors": true},
  {"name": "NCSC UK", "url": "https://www.ncsc.gov.uk/api/1/services/v1/news-rss-feed.xml", "color": "#1565c0", "initials": "NC", "group": "Government", "enabled": true},
  {"name": "Krebs on Security", "url": "https://krebsonsecurity.com/feed/", "color": "#f7a650", "initials": "KS", "group": "News", "enabled": true},
  {"name": "Bleeping Computer", "url": "https://www.bleepingcomputer.com/feed/", "color": "#4dbb7e", "initials": "BC", "group": "News", "enabled": true},
  {"name": "The Hacker News", "url": "https://feeds.feedburner.com/TheHackersNews", "color": "#a855f7", "initials": "HN", "group": "News", "enabled": true},
  {"name": "Dark Reading", "url": "https://www.darkreading.com/rss.xml", "color": "#38c4c4", "initials": "DR", "group": "News", "enabled": true, "cors": true},
  {"name": "SecurityWeek", "url": "https://www.securityweek.com/feed/", "color": "#ff6464", "initials": "SW", "group": "News", "enabled": true},
  {"name": "The Record", "url": "https://therecord.media/feed", "color": "#ffb300", "initials": "TR", "group": "News", "enabled": true, "cors": true},
  {"name": "Security Affairs", "url": "https://securityaffairs.com/feed", "color": "#8d6e63", "initials": "SA", "group": "News", "enabled": true},
  {"name": "Help Net Security", "url": "https://www.helpnetsecurity.com/feed/", "color": "#29b6f6", "initials": "HS", "group": "News", "enabled": true},
  {"name": "Cybersecurity Dive", "url": "https://www.cybersecuritydive.com/feeds/news/", "color": "#66bb6a", "initials": "CD", "group": "News", "enabled": true, "cors": true},
  {"name": "Schneier on Security", "url": "https://www.schneier.com/feed/atom/", "color": "#9e9e9e", "initials": "BS", "group": "News", "enabled": true},
  {"name": "The Register", "url": "https://www.theregister.com/security/headlines.atom", "color": "#e53935", "initials": "RG", "group": "News", "enabled": true, "cors": true},
  {"name": "Wired Security", "url": "https://www.wired.com/feed/category/security/latest/rss", "color": "#eeeeee", "initials": "WI", "group": "News", "enabled": true, "cors": true},
  {"name": "Troy Hunt", "url": "https://www.troyhunt.com/rss/", "color": "#1e88e5", "initials": "TH", "group": "News", "enabled": true},
  {"name": "Cisco Talos", "url": "https://blog.talosintelligence.com/rss/", "color": "#ff7043", "initials": "CT", "group": "Threat Intel", "enabled": true},
  {"name": "SANS ISC", "url": "https://isc.sans.edu/rssfeed_full.xml", "color": "#ffd600", "initials": "SI", "group": "Threat Intel", "enabled": true},
  {"name": "Securelist", "url": "https://securelist.com/feed/", "color": "#ef5350", "initials": "SL", "group": "Threat Intel", "enabled": true, "cors": true},
  {"name": "Unit 42", "url": "https://unit42.paloaltonetworks.com/feed/", "color": "#26c6da", "initials": "U4", "group": "Threat Intel", "enabled": true},
  {"name": "Recorded Future", "url": "https://www.recordedfuture.com/feed", "color": "#00b4d8", "initials": "RF", "group": "Threat Intel", "enabled": true},
  {"name": "Microsoft Security", "url": "https://www.microsoft.com/en-us/security/blog/feed/", "color": "#00a4ef", "initials": "MS", "group": "Threat Intel", "enabled": true},
  {"name": "Check Point Research", "url": "https://research.checkpoint.com/feed/", "color": "#e91e63", "initials": "CP", "group": "Threat Intel", "enabled": true},
  {"name": "ESET WeLiveSecurity", "url": "https://feeds.feedburner.com/eset/blog", "color": "#00897b", "initials": "ES", "group": "Threat Intel", "enabled": true},
  {"name": "Rapid7", "url": "https://blog.rapid7.com/rss/", "color": "#f4511e", "initials": "R7", "group": "Threat Intel", "enabled": true},
  {"name": "Proofpoint", "url": "https://www.proofpoint.com/us/threat-insight-blog.xml", "color": "#3949ab", "initials": "PP", "group": "Threat Intel", "enabled": true},
  {"name": "SentinelLabs", "url": "https://www.sentinelone.com/labs/feed/", "color": "#7b1fa2", "initials": "S1", "group": "Threat Intel", "enabled": true},
  {"name": "Wiz", "url": "https://www.wiz.io/feed/rss.xml", "color": "#2979ff", "initials": "WZ", "group": "Threat Intel", "enabled": true},
  {"name": "Huntress", "url": "https://www.huntress.com/blog/rss.xml", "color": "#43a047", "initials": "HU", "group": "Threat Intel", "enabled": false},
  {"name": "Volexity", "url": "https://www.volexity.com/feed/", "color": "#546e7a", "initials": "VO", "group": "Threat Intel", "enabled": true},
  {"name": "The DFIR Report", "url": "https://thedfirreport.com/feed/", "color": "#8bc34a", "initials": "DF", "group": "Threat Intel", "enabled": true},
  {"name": "Red Canary", "url": "https://redcanary.com/feed/", "color": "#e53935", "initials": "RC", "group": "Threat Intel", "enabled": true},
  {"name": "MISP", "url": "https://www.misp-project.org/feed.xml", "color": "#7e57c2", "initials": "MI", "group": "Threat Intel", "enabled": true},
  {"name": "ANY.RUN", "url": "https://any.run/cybersecurity-blog/feed/", "color": "#00e5ff", "initials": "AR", "group": "Threat Intel", "enabled": true, "cors": true},
  {"name": "GreyNoise", "url": "https://www.greynoise.io/blog/rss.xml", "color": "#78909c", "initials": "GN", "group": "Threat Intel", "enabled": true},
  {"name": "VirusTotal", "url": "https://blog.virustotal.com/feeds/posts/default", "color": "#26a69a", "initials": "VT", "group": "Threat Intel", "enabled": true},
  {"name": "Google Threat Intel", "url": "https://cloudblog.withgoogle.com/topics/threat-intelligence/rss/", "color": "#4285f4", "initials": "GT", "group": "Threat Intel", "enabled": true},
  {"name": "GitHub Security", "url": "https://github.blog/security/feed/", "color": "#8b949e", "initials": "GH", "group": "Threat Intel", "enabled": true, "cors": true},
  {"name": "AWS Security", "url": "https://aws.amazon.com/blogs/security/feed/", "color": "#ff9900", "initials": "AW", "group": "Threat Intel", "enabled": true},
  {"name": "Google Proj Zero", "url": "https://projectzero.google/feed.xml", "color": "#ffca28", "initials": "G0", "group": "Vulnerability Research", "enabled": true},
  {"name": "Zero Day Initiative", "url": "https://www.zerodayinitiative.com/rss/published/", "color": "#fdd835", "initials": "ZD", "group": "Vulnerability Research", "enabled": true},
  {"name": "Exploit-DB", "url": "https://www.exploit-db.com/rss.xml", "color": "#ec6c1f", "initials": "ED", "group": "Vulnerability Research", "enabled": true},
  {"name": "Cisco PSIRT", "url": "https://sec.cloudapps.cisco.com/security/center/psirtrss20/CiscoSecurityAdvisory.xml", "color": "#049fd9", "initials": "CS", "group": "Vendor Advisories", "enabled": true, "cors": true},
  {"name": "Fortinet PSIRT", "url": "https://filestore.fortinet.com/fortiguard/rss/ir.xml", "color": "#da291c", "initials": "FT", "group": "Vendor Advisories", "enabled": true, "cors": true},
  {"name": "ransomware.live", "url": "https://www.ransomware.live/rss.xml", "color": "#ad1457", "initials": "RL", "group": "Ransomware", "enabled": false}
]/*FEEDS:END*/;

/* ── Threat tag rules ── */
const TAG_RULES = [
  { tag: 'Ransomware',    color: '#ff4757', bg: '#ff475718',
    words: ['ransomware','ransom','lockbit','conti','blackcat','clop','akira','black basta','hive','revil','darkside'] },
  { tag: 'Vulnerability', color: '#ff8c00', bg: '#ff8c0018',
    words: ['cve-','vulnerability','zero-day','0-day','patch tuesday','unpatched','rce','remote code','lpe','privilege escalation','buffer overflow','sql injection','xss'] },
  { tag: 'APT',           color: '#a855f7', bg: '#a855f718',
    words: ['apt','threat actor','nation-state','state-sponsored','lazarus','cozy bear','fancy bear','volt typhoon','salt typhoon','sandworm','charming kitten','kimsuky','turla'] },
  { tag: 'Phishing',      color: '#e8b400', bg: '#e8b40018',
    words: ['phishing','spear-phishing','smishing','vishing','social engineering','credential harvesting','business email compromise','bec'] },
  { tag: 'Malware',       color: '#ff6b6b', bg: '#ff6b6b18',
    words: ['malware','backdoor','trojan','rootkit','worm','spyware','stealer','infostealer','rat','keylogger','loader','dropper','botnet','cobalt strike'] },
  { tag: 'Data Breach',   color: '#00c2e0', bg: '#00c2e018',
    words: ['data breach','breach','leak','leaked','exposed','stolen data','exfiltrat','personal data','pii','records exposed'] },
  { tag: 'Critical Infra',color: '#ff9f43', bg: '#ff9f4318',
    words: ['critical infrastructure','ics','scada','ot security','industrial control','power grid','water','healthcare','hospital','energy sector','pipeline'] },
  { tag: 'DDoS',          color: '#00f5d4', bg: '#00f5d418',
    words: ['ddos','denial of service','distributed denial','mirai','botnet attack'] },
];

const VERSION     = 'v0.3.0';
const REPO_URL    = 'https://github.com/jayclark5150/cyber-threat-tracker';
const REFRESH_MS       = 5 * 60 * 1000;   // auto-refresh when the feeds.json snapshot is fresh
const REFRESH_SLOW_MS  = 15 * 60 * 1000;  // auto-refresh when falling back to live proxy fetches
const STALE_ON_RETURN_MS = 5 * 60 * 1000; // refresh on tab return if data is older than this
const SNAPSHOT_URL     = 'feeds.json';    // built every 15 min by .github/workflows/update-feeds.yml
const SNAPSHOT_MAX_AGE_MS = 60 * 60 * 1000; // older than this = pipeline stalled, fetch feeds live
const MAX_ITEMS_PER_FEED  = 25;
const CACHE_KEY   = 'ctt-cache';
const NOTIFY_KEY  = 'ctt-notify';
const TIME_WINDOWS = { '24h': 24 * 3600 * 1000, '7d': 7 * 24 * 3600 * 1000 };
const MAX_IMPORT  = 30;   // custom feeds are fetched live through the proxy, so cap OPML imports
const STORE_KEY   = 'ctt-v2';
const CUSTOM_KEY  = 'ctt-custom';
const READ_KEY    = 'ctt-read';
const READ_CAP    = 3000; // cap persisted read-id history to avoid unbounded growth

const CUSTOM_COLORS = [
  '#e879f9','#34d399','#fb923c','#60a5fa','#f472b6',
  '#a78bfa','#4ade80','#fbbf24','#38bdf8','#f87171',
];

function toInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}

/* ── State ── */
let allItems      = [];
let activeFilter  = 'all';   // source filter
let activeTag     = 'all';   // threat tag filter
let activePriority= 'all';   // priority filter
let activeTime    = 'all';   // time window filter: 'all' | '24h' | '7d'
let kevSet        = new Set(); // every CVE in CISA's KEV catalog (from feeds.json kevIds)
let feedStatus    = new Map(); // feed name -> { ok, error, fetched, failingSince }
let knownIds      = null;      // story ids already seen; null until the first load (no alerts then)
let searchQuery   = '';
let activeItemId  = null;
let chartMode        = 'type';
let chart            = null;
let chartCurrentMode = null;
let refreshTimer  = null;
let feeds         = loadAllFeeds();
let readIds       = loadReadIds();

/* ── DOM refs ── */
const $ = id => document.getElementById(id);
const feedLoading    = $('feed-loading');
const feedItemsEl    = $('feed-items');
const feedListEl     = $('feed-list');
const newStoriesBtn  = $('new-stories-btn');
const itemCount      = $('item-count');
const lastUpdated    = $('last-updated');
const filterBar      = $('filter-bar');
const tagBar         = $('tag-bar');
const searchInput    = $('feed-search');
const articleEmpty   = $('article-empty');
const articleContent = $('article-content');
const articleAvatar  = $('article-avatar');
const articleSrcName = $('article-source-name');
const articleDate    = $('article-date');
const articlePriority= $('article-priority-badge');
const articleTitle   = $('article-title');
const articleTagsRow = $('article-tags-row');
const articleCves    = $('article-cves');
const aiSummaryBox   = $('ai-summary-box');
const aiSummaryText  = $('ai-summary-text');
const articleDesc    = $('article-desc');
const articleLink    = $('article-link');
const readingTime    = $('reading-time');
const themeBtn       = $('theme-btn');
const exportBtn      = $('export-btn');
const refreshBtn     = $('refresh-btn');
const settingsBtn    = $('settings-btn');
const overlay        = $('settings-overlay');
const settingsClose  = $('settings-close');
const markReadBtn    = $('mark-read-btn');
const sourceList     = $('feed-source-list');
const saveSettingsBtn= $('save-settings-btn');
const chartTabBtns   = document.querySelectorAll('.chart-tab');
const toast          = $('toast');

/* Storage can throw (Safari private browsing, quota exceeded, disabled by
   policy) — swallow write failures so callers don't break mid-action. */
function safeSetItem(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) { console.warn('localStorage write failed', key, e); return false; }
}

/* ── Settings ── */
function loadAllFeeds() {
  try {
    const s      = JSON.parse(localStorage.getItem(STORE_KEY)  || '{}');
    const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    const builtIn = FEEDS.map(f => ({ ...f, enabled: s[f.name] !== undefined ? s[f.name] : f.enabled }));
    return [...builtIn, ...custom];
  } catch { return FEEDS.map(f => ({ ...f })); }
}
function saveAllFeeds() {
  const s = {};
  feeds.filter(f => !f.custom).forEach(f => { s[f.name] = f.enabled; });
  safeSetItem(STORE_KEY,  JSON.stringify(s));
  safeSetItem(CUSTOM_KEY, JSON.stringify(feeds.filter(f => f.custom)));
}

/* ── Read/unread tracking ── */
function loadReadIds() {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveReadIds() {
  const ids = [...readIds];
  if (ids.length > READ_CAP) ids.splice(0, ids.length - READ_CAP);
  safeSetItem(READ_KEY, JSON.stringify(ids));
}
function markRead(item) {
  if (item.read) return;
  item.read = true;
  readIds.add(item.id);
  saveReadIds();
  const el = feedItemsEl.querySelector(`[data-id="${CSS.escape(item.id)}"]`);
  if (el) { el.classList.add('read'); el.querySelector('.unread-dot')?.remove(); }
  updateHeader();
}
function markAllRead() {
  let changed = false;
  allItems.forEach(it => { if (!it.read) { it.read = true; readIds.add(it.id); changed = true; } });
  if (!changed) return;
  saveReadIds();
  renderFeedList();
  updateHeader();
}

/* ── Threat tag detection ── */

/* Multi-word phrases and prefix patterns (ending in '-') use substring matching.
   Single words use word-boundary matching to prevent false positives like
   'apt' in 'laptop'/'captcha', 'rat' in 'grateful', 'ics' in 'topics'. */
function wordMatches(haystack, w) {
  if (w.includes(' ') || w.endsWith('-')) return haystack.includes(w);
  return new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(haystack);
}

function detectTags(title, desc) {
  const haystack = (title + ' ' + desc).toLowerCase();
  return TAG_RULES.filter(r => r.words.some(w => wordMatches(haystack, w)));
}

function getPriority(tags) {
  if (!tags.length) return 'low';
  const names = tags.map(t => t.tag);
  if (names.some(n => ['Ransomware','APT','Critical Infra'].includes(n))) return 'critical';
  if (names.some(n => ['Vulnerability','Malware','Data Breach'].includes(n))) return 'high';
  if (names.some(n => ['Phishing','DDoS'].includes(n))) return 'medium';
  return 'low';
}

/* ── RSS fetch & parse ── */

const FETCH_TIMEOUT_MS = 6000;

/* rss2json — returns clean JSON (free tier: max 10 items per feed) */
async function viaRss2json(feedUrl) {
  const u = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  const r = await fetch(u, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!r.ok) throw new Error(`rss2json HTTP ${r.status}`);
  const d = await r.json();
  if (d.status !== 'ok') throw new Error(d.message || 'rss2json error');
  return parseJsonItems(d.items || []);
}

/* Direct fetch — only works for feeds that send CORS headers; fails fast otherwise */
async function viaDirect(feedUrl) {
  const r = await fetch(feedUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!r.ok) throw new Error(`direct HTTP ${r.status}`);
  const text = await r.text();
  if (!text.trim().startsWith('<')) throw new Error('Not XML');
  return parseXmlItems(text);
}

/* Returns raw items ({ title, link, desc, ts }), newest first, capped per feed.
   Feeds marked cors:true skip the proxy entirely when the direct fetch works.
   Custom feeds whose CORS support is still unknown try direct first (a CORS
   rejection fails instantly), and remember which method worked in feed.cors. */
async function fetchFeed(feed) {
  if (feed.type === 'kev') throw new Error('CISA KEV is only available from the feeds.json snapshot');
  const directFirst = feed.cors ?? !!feed.custom;
  const strategies = directFirst ? [viaDirect, viaRss2json] : [viaRss2json, viaDirect];
  let lastErr;
  for (const strategy of strategies) {
    try {
      const items = await strategy(feed.url);
      if (feed.custom) {
        const cors = strategy === viaDirect;
        if (feed.cors !== cors) { feed.cors = cors; customCorsChanged = true; }
      }
      return items.sort((a, b) => b.ts - a.ts).slice(0, MAX_ITEMS_PER_FEED);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
let customCorsChanged = false; // set by fetchFeed; refreshAll persists it via saveAllFeeds()

function parseDate(s) {
  const t = s ? Date.parse(s) : NaN;
  return Number.isNaN(t) ? Date.now() : t;
}

/* rss2json returns "YYYY-MM-DD HH:MM:SS" in UTC with no zone marker; without the 'Z'
   the browser would read it as local time. */
function rss2jsonDate(s) {
  if (!s) return '';
  return s.replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? '' : 'Z');
}

function parseJsonItems(items) {
  return items.map(item => ({
    title: item.title || '(no title)',
    link:  item.link || item.guid || '',
    desc:  stripHtml(item.description || item.content || '').slice(0, 600),
    ts:    parseDate(rss2jsonDate(item.pubDate)),
  }));
}

/* Prefer <link rel="alternate"> (article URL) over <link rel="self"> (feed URL).
   Atom feeds put the article URL in rel=alternate; RSS feeds use <link> text content. */
function pickXmlLink(node) {
  const links = [...node.querySelectorAll('link')];
  const pref  = links.find(l => (l.getAttribute('rel') || 'alternate') === 'alternate')
             || links[0];
  if (!pref) return '';
  return pref.getAttribute('href') || pref.textContent?.trim() || '';
}

function parseXmlItems(xmlText) {
  const xml   = new DOMParser().parseFromString(xmlText, 'text/xml');
  const nodes = [...xml.querySelectorAll('item, entry')];
  return nodes.map(node => {
    const get = (...tags) => { for (const t of tags) { const v = node.querySelector(t)?.textContent?.trim(); if (v) return v; } return ''; };
    return {
      title: get('title') || '(no title)',
      link:  pickXmlLink(node) || get('guid', 'id') || '',
      desc:  stripHtml(get('description', 'summary', 'content')).slice(0, 600),
      ts:    parseDate(get('pubDate', 'published', 'updated', 'dc\\:date')),
    };
  });
}

/* Turn a raw item (from a live fetch, feeds.json or the local cache) into a display item.
   KEV entries are always Critical: they are confirmed to be exploited in the wild. */
function makeItem(feed, raw, i) {
  const title = raw.title || '(no title)';
  const desc  = raw.desc || '';
  const link  = (raw.link || '').trim();
  // Some feeds mislabel time zones, so never show a story as published in the future
  const ts    = Number.isFinite(raw.ts) ? Math.min(raw.ts, Date.now()) : Date.now();
  const cves  = extractCves(title + ' ' + desc);
  const exploited = !raw.kev && cves.some(c => kevSet.has(c));
  let tags    = detectTags(title, desc);
  if (raw.kev) {
    const want = ['Vulnerability', ...(raw.ransomware ? ['Ransomware'] : [])];
    tags = TAG_RULES.filter(r => want.includes(r.tag) || tags.includes(r));
  }
  const id = link ? `${feed.name}:${link}` : `${feed.name}-${i}-${ts}`;
  return {
    id, source: feed.name, color: feed.color, initials: feed.initials,
    title, link, desc, date: new Date(ts), ts, tags,
    // KEV entries and stories about a KEV-listed CVE are confirmed exploited in the wild
    priority: raw.kev || exploited ? 'critical' : getPriority(tags),
    kev: !!raw.kev, ransomware: !!raw.ransomware, cves, exploited,
    read: readIds.has(id),
  };
}

function extractCves(text) {
  return [...new Set((text.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || []).map(c => c.toUpperCase()))];
}

function makeItems(feed, raws) {
  return raws.map((raw, i) => makeItem(feed, raw, i));
}

function stripHtml(html) {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
}

/* Only allow absolute http(s) URLs through to an href — feed <link>/<guid> values are
   untrusted. Passing no base to URL() means relative paths throw and return null,
   preventing a relative '/path' from resolving against the app origin. */
function safeExternalUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : null;
  } catch { return null; }
}

/* ── Refresh ── */
const FETCH_CONCURRENCY = 5;   // cap simultaneous proxy requests to avoid rate-limit bursts
const FETCH_STAGGER_MS  = 200; // pause between a lane's fetches

/* Runs feedList through fetchFeed with bounded concurrency + a per-lane stagger.
   Each lane is offset by laneIdx * FETCH_STAGGER_MS before its first fetch so the
   initial burst is spread out. onSettled(feed, result) fires as each feed finishes,
   so the list can fill in progressively instead of waiting for the slowest feed. */
async function fetchAllStaggered(feedList, onSettled) {
  let next = 0;
  async function lane(laneIdx) {
    if (laneIdx > 0) await new Promise(r => setTimeout(r, laneIdx * FETCH_STAGGER_MS));
    while (next < feedList.length) {
      const feed = feedList[next++];
      let result;
      try { result = { status: 'fulfilled', value: await fetchFeed(feed) }; }
      catch (e) { result = { status: 'rejected', reason: e }; }
      onSettled(feed, result);
      if (next < feedList.length) await new Promise(r => setTimeout(r, FETCH_STAGGER_MS));
    }
  }
  const laneCount = Math.min(FETCH_CONCURRENCY, feedList.length);
  await Promise.all(Array.from({ length: laneCount }, (_, i) => lane(i)));
}

/* Most recent successful fetch per feed name — lets a transient failure fall back
   to last-known articles instead of blanking that source out of the dashboard. */
let lastGoodByFeed = new Map();
let lastRefreshAt  = 0;      // ms timestamp of the data currently shown (snapshot build time or fetch time)
let lastCheckedAt  = 0;      // ms timestamp of the last completed refresh attempt
let refreshing     = false;
let pendingItems   = null;   // background-refresh results held back while the user is scrolled down

/* Pre-built snapshot of every built-in feed, produced server-side by GitHub Actions.
   One same-origin request replaces 40+ proxy calls. Returns null if unavailable. */
async function loadSnapshot() {
  try {
    const r = await fetch(SNAPSHOT_URL, { cache: 'no-cache', signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const d = await r.json();
    return d && d.feeds && d.generated ? d : null;
  } catch { return null; }
}

/* Merge every enabled feed's items, drop cross-feed duplicates (e.g. the same CISA
   advisory in two CISA feeds — the first feed in the list wins), newest first. */
function buildItems() {
  const seen = new Set();
  const out  = [];
  feeds.filter(f => f.enabled).forEach(f => {
    (lastGoodByFeed.get(f.name) || []).forEach(it => {
      const key = it.link.replace(/\/+$/, '');
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      out.push(it);
    });
  });
  return out.sort((a, b) => b.ts - a.ts);
}

function renderAll() {
  renderSourceChips();
  renderFeedList();
  updateChart();
  updateHeader();
}

/* Show newItems now, unless this is a background refresh and the user has scrolled
   down the list — then hold them behind a "N new stories" button so the list
   doesn't jump while they're reading. */
function commitItems(newItems, background) {
  newItems.forEach(i => { i.read = readIds.has(i.id); }); // stories may have been read since they were built
  const known = new Set(allItems.map(i => i.id));
  const added = newItems.filter(i => !known.has(i.id)).length;
  if (background && allItems.length && added && feedListEl.scrollTop > 40) {
    pendingItems = newItems;
    newStoriesBtn.textContent = `${added} new stor${added === 1 ? 'y' : 'ies'} ↑`;
    newStoriesBtn.hidden = false;
    return;
  }
  allItems = newItems;
  pendingItems = null;
  newStoriesBtn.hidden = true;
  if (allItems.length) feedLoading.style.display = 'none';
  renderAll();
}

let renderQueued = false;
function scheduleRender(background) {
  if (renderQueued) return;
  renderQueued = true;
  setTimeout(() => { renderQueued = false; commitItems(buildItems(), background); }, 250);
}

function saveCache() {
  const out = {};
  lastGoodByFeed.forEach((items, name) => {
    out[name] = items.map(({ title, link, desc, ts, kev, ransomware }) =>
      ({ title, link, desc, ts, ...(kev && { kev }), ...(ransomware && { ransomware }) }));
  });
  safeSetItem(CACHE_KEY, JSON.stringify({ savedAt: lastRefreshAt, kevIds: [...kevSet], feeds: out }));
}

/* Show the articles from the previous visit immediately, before any network request. */
function loadCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!c || !c.feeds) return false;
    if (c.kevIds) kevSet = new Set(c.kevIds);
    feeds.forEach(f => { if (c.feeds[f.name]) lastGoodByFeed.set(f.name, makeItems(f, c.feeds[f.name])); });
    lastRefreshAt = c.savedAt || 0;
    commitItems(buildItems(), false);
    knownIds = new Set(allItems.map(i => i.id));
    return allItems.length > 0;
  } catch { return false; }
}

/* background: an automatic refresh (timer, tab return, startup with cached data) —
   no loading spinner, no failure toasts, and new stories may be held back. */
async function refreshAll(background = false) {
  if (refreshing) return;
  const enabled = feeds.filter(f => f.enabled);
  if (!enabled.length) { showToast('No feeds enabled'); return; }
  refreshing = true;

  refreshBtn.classList.add('spinning');
  if (!allItems.length) feedLoading.style.display = 'flex';

  try {
    const snap  = await loadSnapshot();
    const fresh = !!snap && Date.now() - Date.parse(snap.generated) < SNAPSHOT_MAX_AGE_MS;
    const live  = [];

    if (snap?.kevIds?.length) kevSet = new Set(snap.kevIds);

    enabled.forEach(feed => {
      const entry = snap?.feeds[feed.url];
      if (entry) feedStatus.set(feed.name, { ok: entry.ok, error: entry.error, fetched: entry.fetched, failingSince: entry.failingSince });
      if (entry?.items?.length && (fresh && entry.ok || !lastGoodByFeed.has(feed.name))) {
        lastGoodByFeed.set(feed.name, makeItems(feed, entry.items));
      }
      /* Live-fetch custom feeds, feeds the pipeline failed on, and everything when the
         snapshot is missing or stale. KEV can't be fetched live (no CORS, not RSS). */
      if (!(fresh && entry?.ok) && feed.type !== 'kev') live.push(feed);
    });
    if (snap) scheduleRender(background);

    let errors = 0, staleFallbacks = 0;
    await fetchAllStaggered(live, (feed, r) => {
      if (r.status === 'fulfilled') {
        lastGoodByFeed.set(feed.name, makeItems(feed, r.value));
        feedStatus.set(feed.name, { ok: true, fetched: Date.now() });
        scheduleRender(background);
      } else {
        console.warn(feed.name, r.reason);
        const prev = feedStatus.get(feed.name);
        feedStatus.set(feed.name, { ok: false, error: r.reason?.message || String(r.reason),
          fetched: prev?.fetched, failingSince: prev?.ok === false ? prev.failingSince ?? Date.now() : Date.now() });
        errors++;
        if (lastGoodByFeed.has(feed.name)) staleFallbacks++;
      }
    });

    lastRefreshAt = fresh ? Date.parse(snap.generated) : Date.now();
    lastCheckedAt = Date.now();
    const finalItems = buildItems();
    commitItems(finalItems, background);
    if (knownIds) notifyNewCritical(finalItems.filter(i => !knownIds.has(i.id)));
    knownIds = new Set([...(knownIds || []), ...finalItems.map(i => i.id)]);
    saveCache();
    if (customCorsChanged) { customCorsChanged = false; saveAllFeeds(); }

    if (!background && errors) {
      showToast(staleFallbacks
        ? `${errors} feed(s) failed — showing last known articles for ${staleFallbacks}`
        : `${errors} feed(s) failed`, 4000);
    }

    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => refreshAll(true), fresh ? REFRESH_MS : REFRESH_SLOW_MS);
  } finally {
    refreshing = false;
    feedLoading.style.display = 'none';
    refreshBtn.classList.remove('spinning');
    updateHeader();
  }
}

/* ── Header ── */
function updateHeader() {
  const items = visibleItems();
  const n = items.length;
  const unread = items.filter(it => !it.read).length;
  itemCount.textContent = `${n} item${n !== 1 ? 's' : ''}` + (unread ? ` · ${unread} unread` : '');
  lastUpdated.textContent = lastRefreshAt ? `Updated ${relTime(new Date(lastRefreshAt))}` : '';
  lastUpdated.title = lastRefreshAt ? new Date(lastRefreshAt).toLocaleString() : '';
}

/* ── Filtering ── */
function visibleItems() {
  return allItems.filter(it => {
    if (activeFilter !== 'all' && it.source !== activeFilter) return false;
    if (activeTag === 'Exploited') { if (!it.kev && !it.exploited) return false; }
    else if (activeTag !== 'all' && !it.tags.some(t => t.tag === activeTag)) return false;
    if (activeTime !== 'all' && Date.now() - it.ts > TIME_WINDOWS[activeTime]) return false;
    if (activePriority !== 'all' && it.priority !== activePriority) return false;
    if (searchQuery && !it.title.toLowerCase().includes(searchQuery) && !it.desc.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

/* ── Source chips ── */
function renderSourceChips() {
  filterBar.innerHTML = '';
  const all = makeSourceChip('All Sources', 'all', null);
  filterBar.appendChild(all);
  [...new Set(allItems.map(i => i.source))].forEach(src => {
    const feed = feeds.find(f => f.name === src);
    filterBar.appendChild(makeSourceChip(src, src, feed?.color));
  });
}

function makeSourceChip(label, value, color) {
  const btn = document.createElement('button');
  btn.className = 'filter-chip' + (activeFilter === value ? ' active' : '');
  btn.dataset.source = value;
  if (color) {
    const dot = document.createElement('span');
    dot.className = 'chip-dot';
    dot.style.background = color;
    btn.appendChild(dot);
  }
  btn.appendChild(document.createTextNode(label));
  btn.addEventListener('click', () => {
    activeFilter = value;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderFeedList(); updateChart(); updateHeader();
  });
  return btn;
}

/* ── Tag bar (static, set active state) ── */
function initTagBar() {
  tagBar.querySelectorAll('.tag-chip[data-tag]').forEach(chip => {
    chip.addEventListener('click', () => {
      activeTag = chip.dataset.tag;
      tagBar.querySelectorAll('.tag-chip[data-tag]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderFeedList(); updateChart(); updateHeader();
    });
  });
}

/* ── Priority bar (static, set active state) ── */
function initPriorityBar() {
  tagBar.querySelectorAll('.priority-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.priority;
      activePriority = activePriority === val ? 'all' : val;
      tagBar.querySelectorAll('.priority-chip').forEach(c => c.classList.remove('active'));
      if (activePriority !== 'all') chip.classList.add('active');
      renderFeedList(); updateChart(); updateHeader();
    });
  });
}

/* ── Time window bar (24h / 7 days; click again to clear) ── */
function initTimeBar() {
  tagBar.querySelectorAll('.time-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.time;
      activeTime = activeTime === val ? 'all' : val;
      tagBar.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
      if (activeTime !== 'all') chip.classList.add('active');
      renderFeedList(); updateChart(); updateHeader();
    });
  });
}

/* ── Feed list ── */
function renderFeedList() {
  const items = visibleItems();
  feedItemsEl.innerHTML = '';

  if (!items.length) {
    feedItemsEl.innerHTML = '<div class="loading-state"><p style="color:#46465e">No stories found</p></div>';
    return;
  }

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = `feed-item priority-${item.priority}${item.read ? ' read' : ''}${item.id === activeItemId ? ' active' : ''}`;
    el.dataset.id = item.id;

    /* Meta row */
    const meta = document.createElement('div');
    meta.className = 'feed-item-meta';

    if (!item.read) {
      const dot = document.createElement('span');
      dot.className = 'unread-dot';
      meta.appendChild(dot);
    }

    const av = document.createElement('div');
    av.className = 'source-avatar-sm';
    av.style.background = item.color;
    av.textContent = item.initials;

    const src = document.createElement('span');
    src.className = 'feed-item-source';
    src.textContent = item.source;

    const time = document.createElement('span');
    time.className = 'feed-item-time';
    time.textContent = relTime(item.date);

    meta.append(av, src, time);

    /* Title */
    const title = document.createElement('div');
    title.className = 'feed-item-title';
    title.textContent = item.title;

    /* Tags */
    const tagsRow = document.createElement('div');
    tagsRow.className = 'feed-item-tags';
    if (item.exploited) {
      const pill = document.createElement('span');
      pill.className = 'threat-pill exploited-pill';
      pill.textContent = 'Exploited';
      pill.title = "Mentions a CVE in CISA's Known Exploited Vulnerabilities catalog";
      tagsRow.appendChild(pill);
    }
    item.tags.slice(0, 3).forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'threat-pill';
      pill.textContent = t.tag;
      pill.style.color = t.color;
      pill.style.background = t.bg;
      tagsRow.appendChild(pill);
    });

    el.append(meta, title);
    if (tagsRow.childElementCount) el.appendChild(tagsRow);
    el.addEventListener('click', () => selectItem(item));
    feedItemsEl.appendChild(el);
  });
}

function relTime(date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/* ── Article view ── */
function selectItem(item) {
  activeItemId = item.id;
  document.querySelectorAll('.feed-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === item.id);
  });
  markRead(item);

  articleEmpty.hidden = true;
  articleContent.hidden = false;
  document.getElementById('article-view').scrollTop = 0;
  document.getElementById('right-panel').scrollTop = 0;
  if (window._showArticlePanel) window._showArticlePanel();

  /* Source header */
  articleAvatar.style.background = item.color;
  articleAvatar.textContent = item.initials;
  articleSrcName.textContent = item.source;
  articleDate.textContent = item.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  /* Priority badge */
  articlePriority.className = `priority-badge ${item.priority}`;
  const labels = { critical: 'Critical', high: 'High', medium: 'Medium', low: '' };
  articlePriority.textContent = labels[item.priority] || '';

  articleTitle.textContent = item.title;

  /* Tags */
  articleTagsRow.innerHTML = '';
  item.tags.forEach(t => {
    const pill = document.createElement('span');
    pill.className = 'threat-pill';
    pill.textContent = t.tag;
    pill.style.color = t.color;
    pill.style.background = t.bg;
    articleTagsRow.appendChild(pill);
  });

  /* CVEs mentioned, linked to NVD; KEV-listed ones flagged as exploited */
  articleCves.innerHTML = '';
  item.cves.slice(0, 12).forEach(cve => {
    const a = document.createElement('a');
    const inKev = kevSet.has(cve);
    a.className = 'cve-chip' + (inKev ? ' exploited' : '');
    a.href = `https://nvd.nist.gov/vuln/detail/${cve}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = inKev ? `${cve} · Exploited` : cve;
    a.title = inKev ? "In CISA's Known Exploited Vulnerabilities catalog — open in NVD" : 'Open in NVD';
    articleCves.appendChild(a);
  });
  articleCves.hidden = !item.cves.length;

  /* AI summary box */
  if (item.desc && item.desc.length > 80) {
    aiSummaryBox.classList.remove('hidden');
    aiSummaryText.textContent = item.desc.slice(0, 280) + (item.desc.length > 280 ? '…' : '');
    articleDesc.textContent = item.desc.length > 280 ? item.desc : '';
  } else {
    aiSummaryBox.classList.add('hidden');
    articleDesc.textContent = item.desc || 'No description available.';
  }

  const safeLink = safeExternalUrl(item.link);
  if (safeLink) {
    articleLink.href = safeLink;
    articleLink.style.display = '';
  } else {
    articleLink.removeAttribute('href');
    articleLink.style.display = 'none';
  }

  readingTime.textContent = '';
}

/* ── Charts ── */
function updateChart() {
  if (typeof Chart === 'undefined') return; // CDN unavailable (e.g. offline)
  if (chart && chartCurrentMode !== chartMode) { chart.destroy(); chart = null; }
  const light = document.documentElement.dataset.theme === 'light';
  Chart.defaults.color       = light ? '#6a6a90' : '#46465e';
  Chart.defaults.borderColor = light ? '#dde2f0' : '#1a1a2e';
  const ctx = $('threat-chart').getContext('2d');
  if (chartMode === 'pie')       renderDonut(ctx, light);
  else if (chartMode === 'type') renderTypeDonut(ctx, light);
  else                           renderLine(ctx);
  chartCurrentMode = chartMode;
}

function renderDonut(ctx, light) {
  const items = visibleItems();
  const counts = {}, colorMap = {};
  items.forEach(it => {
    counts[it.source] = (counts[it.source] || 0) + 1;
    colorMap[it.source] = it.color;
  });
  const labels = Object.keys(counts);
  const data   = labels.map(l => counts[l]);
  const colors = labels.map(l => colorMap[l]);
  const border = light ? '#f0f4f8' : '#0b0b14';
  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[0].borderColor = border;
    chart.options.plugins.legend.display = labels.length >= 2;
    chart.update('none');
    return;
  }
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderColor: border, borderWidth: 2, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '64%',
      plugins: {
        legend: { display: labels.length >= 2, position: 'right',
          labels: { boxWidth: 9, padding: 12, font: { size: 11 }, color: '#6668a0' } },
        tooltip: { callbacks: { label: c => ` ${c.label}: ${c.parsed}` } },
      },
    },
  });
}

function renderTypeDonut(ctx, light) {
  const items = visibleItems();
  const counts = {}, colorMap = {};
  items.forEach(it => {
    it.tags.forEach(t => {
      counts[t.tag] = (counts[t.tag] || 0) + 1;
      colorMap[t.tag] = t.color;
    });
    if (!it.tags.length) {
      counts['Untagged'] = (counts['Untagged'] || 0) + 1;
      colorMap['Untagged'] = '#2e2e48';
    }
  });
  const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const data   = labels.map(l => counts[l]);
  const colors = labels.map(l => colorMap[l]);
  const border = light ? '#f0f4f8' : '#0b0b14';
  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[0].borderColor = border;
    chart.options.plugins.legend.display = labels.length >= 2;
    chart.update('none');
    return;
  }
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderColor: border, borderWidth: 2, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '64%',
      plugins: {
        legend: { display: labels.length >= 2, position: 'right',
          labels: { boxWidth: 9, padding: 12, font: { size: 11 }, color: '#6668a0' } },
        tooltip: { callbacks: { label: c => ` ${c.label}: ${c.parsed} articles` } },
      },
    },
  });
}

/* Stable local-day key: YYYY-MM-DD in the viewer's timezone */
function localDayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function renderLine(ctx) {
  const items = visibleItems();
  const days = 7;
  const dayKeys = [];      // for bucketing (stable)
  const dayLabels = [];    // for display (human-readable)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dayKeys.push(localDayKey(d));
    dayLabels.push(d.toLocaleDateString([], { month: 'short', day: 'numeric' }));
  }
  const sources = [...new Set(items.map(i => i.source))];
  const datasets = sources.map(src => {
    const feed = feeds.find(f => f.name === src);
    const color = feed?.color || '#888';
    const perDay = {};
    items.filter(i => i.source === src).forEach(i => { const k = localDayKey(i.date); perDay[k] = (perDay[k]||0)+1; });
    return {
      label: src, data: dayKeys.map(k => perDay[k]||0),
      borderColor: color, backgroundColor: color+'20',
      borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0.3, fill: false,
    };
  });
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels: dayLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: datasets.length >= 2, position: 'top',
          labels: { boxWidth: 9, padding: 10, font: { size: 11 }, color: '#6668a0' } },
      },
      scales: {
        x: { grid: { color: '#1a1a2e' }, ticks: { font: { size: 10 }, color: '#46465e' } },
        y: { grid: { color: '#1a1a2e' }, ticks: { font: { size: 10 }, color: '#46465e', precision: 0 }, beginAtZero: true },
      },
    },
  });
}

/* ── Settings modal ── */
function feedStatusLine(feed) {
  const st = feedStatus.get(feed.name);
  if (!st) return { text: feed.enabled ? 'Not checked yet' : '', cls: '' };
  if (st.ok) return { text: `✓ Updated ${relTime(new Date(st.fetched || Date.now()))}`, cls: 'ok' };
  const since = st.failingSince ? `Failing since ${relTime(new Date(st.failingSince))}` : 'Last fetch failed';
  return { text: `✗ ${since}${st.fetched ? ` · last worked ${relTime(new Date(st.fetched))}` : ''}`, cls: 'fail', title: st.error || '' };
}

function renderSettingsHeader() {
  const head = document.createElement('div');
  head.className = 'settings-head';

  const enabled = feeds.filter(f => f.enabled);
  const failing = enabled.filter(f => feedStatus.get(f.name)?.ok === false);
  const health = document.createElement('div');
  health.className = 'health-summary ' + (failing.length ? 'fail' : 'ok');
  health.textContent = failing.length
    ? `${failing.length} of ${enabled.length} enabled feeds failing: ${failing.map(f => f.name).join(', ')}`
    : `All ${enabled.length} enabled feeds healthy`;

  const alerts = document.createElement('div');
  alerts.className = 'source-row';
  const label = document.createElement('span');
  label.className = 'source-name';
  label.textContent = 'Desktop alerts for new Critical stories';
  const tog = document.createElement('button');
  const on = notifyEnabled();
  tog.className = 'source-toggle' + (on ? ' on' : '');
  tog.setAttribute('role', 'switch');
  tog.setAttribute('aria-checked', String(on));
  tog.setAttribute('aria-label', 'Desktop alerts for new Critical stories');
  tog.addEventListener('click', () => toggleNotifications(tog));
  alerts.append(label, tog);

  head.append(health, alerts);
  return head;
}

function openSettings() {
  sourceList.innerHTML = '';
  sourceList.appendChild(renderSettingsHeader());
  feeds.forEach((feed, idx) => {
    const row = document.createElement('div');
    row.className = 'source-row';

    const dot = document.createElement('div');
    dot.className = 'source-color';
    dot.style.background = feed.color;

    const nameEl = document.createElement('span');
    nameEl.className = 'source-name';
    nameEl.textContent = feed.name;
    if (feed.custom) {
      const badge = document.createElement('span');
      badge.className = 'custom-badge';
      badge.textContent = 'custom';
      nameEl.appendChild(badge);
    }

    const tog = document.createElement('button');
    tog.className = 'source-toggle' + (feed.enabled ? ' on' : '');
    tog.dataset.idx = idx;
    tog.setAttribute('role', 'switch');
    tog.setAttribute('aria-checked', String(feed.enabled));
    tog.setAttribute('aria-label', `Enable ${feed.name}`);
    tog.addEventListener('click', () => {
      const on = tog.classList.toggle('on');
      tog.setAttribute('aria-checked', String(on));
    });

    const info = document.createElement('div');
    info.className = 'source-info';
    const status = feedStatusLine(feed);
    const statusEl = document.createElement('span');
    statusEl.className = 'source-status ' + status.cls;
    statusEl.textContent = status.text;
    if (status.title) statusEl.title = status.title;
    info.append(nameEl, statusEl);

    row.append(dot, info, tog);

    if (feed.custom) {
      const sug = document.createElement('button');
      sug.className = 'source-suggest';
      sug.title = 'Suggest adding this feed for everyone';
      sug.setAttribute('aria-label', `Suggest ${feed.name} as a built-in feed`);
      sug.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
      sug.addEventListener('click', () => suggestFeed(feed.name, feed.url));
      row.appendChild(sug);

      const del = document.createElement('button');
      del.className = 'source-delete';
      del.title = 'Remove this feed';
      del.setAttribute('aria-label', `Remove ${feed.name}`);
      del.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
      del.addEventListener('click', () => deleteFeed(feed));
      row.appendChild(del);
    }

    sourceList.appendChild(row);
  });
  overlay.classList.remove('hidden');
}

function closeSettings() { overlay.classList.add('hidden'); }

function deleteFeed(feed) {
  /* Check before filtering whether the open article belongs to this feed */
  const activeIsFromFeed = activeItemId !== null &&
    allItems.some(it => it.id === activeItemId && it.source === feed.name);

  feeds    = feeds.filter(f => f.url !== feed.url);
  allItems = allItems.filter(it => it.source !== feed.name);
  lastGoodByFeed.delete(feed.name);
  saveCache();

  if (activeIsFromFeed) {
    articleContent.hidden = true;
    articleEmpty.hidden   = false;
    activeItemId = null;
  }

  saveAllFeeds();
  renderSourceChips();
  renderFeedList();
  updateChart();
  updateHeader();
  openSettings();
}

function applySettings() {
  sourceList.querySelectorAll('.source-toggle').forEach(t => {
    feeds[+t.dataset.idx].enabled = t.classList.contains('on');
  });
  saveAllFeeds();
  closeSettings();
  commitItems(buildItems(), false); // apply enable/disable immediately, even if a refresh is in flight
  refreshAll();
}

/* ── Add custom feed ── */
async function testAndAddFeed() {
  const nameInput = $('new-feed-name');
  const urlInput  = $('new-feed-url');
  const addBtn    = $('add-feed-btn');
  const name = nameInput.value.trim();
  const url  = urlInput.value.trim();

  if (!name)                              { showToast('Enter a feed name'); return; }
  if (!url || !url.startsWith('http'))    { showToast('Enter a valid RSS URL (https://…)'); return; }
  if (feeds.some(f => f.url === url))     { showToast('Feed already added'); return; }
  if (feeds.some(f => f.name === name))   { showToast('A feed with that name already exists'); return; }

  const customCount = feeds.filter(f => f.custom).length;
  const color    = CUSTOM_COLORS[customCount % CUSTOM_COLORS.length];
  const initials = toInitials(name);
  const newFeed  = { name, url, color, initials, enabled: true, custom: true };

  addBtn.textContent = 'Testing…';
  addBtn.disabled = true;

  try {
    const items = makeItems(newFeed, await fetchFeed(newFeed));
    if (!items.length) throw new Error('Feed returned 0 items — is this a valid RSS URL?');

    customCorsChanged = false; // newFeed.cors was just set by the test fetch and is saved below
    feeds.push(newFeed);
    saveAllFeeds();
    nameInput.value = '';
    urlInput.value  = '';
    showToast(`Added "${name}" — ${items.length} item${items.length !== 1 ? 's' : ''} found` +
      (newFeed.cors ? ' · loads directly' : ' · loads via proxy'), 4000);
    lastGoodByFeed.set(newFeed.name, items);
    commitItems(buildItems(), false);
    saveCache();
    openSettings();
  } catch (e) {
    const msg = /429/.test(e.message)
      ? 'This feed needs the rss2json proxy, which is rate-limiting new feeds right now. Try again later, or use "Suggest a feed for everyone".'
      : `Could not load: ${e.message}`;
    showToast(msg, 6000);
  } finally {
    addBtn.textContent = 'Test & Add';
    addBtn.disabled = false;
  }
}

/* ── Desktop alerts ── */
function notifyEnabled() {
  try { return localStorage.getItem(NOTIFY_KEY) === '1' && 'Notification' in window && Notification.permission === 'granted'; }
  catch { return false; }
}

async function toggleNotifications(tog) {
  let on = !tog.classList.contains('on');
  if (on) {
    if (!('Notification' in window)) { showToast('This browser does not support notifications'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { showToast('Notifications are blocked — allow them in your browser\'s site settings', 4500); on = false; }
  }
  safeSetItem(NOTIFY_KEY, on ? '1' : '0');
  tog.classList.toggle('on', on);
  tog.setAttribute('aria-checked', String(on));
  if (on) showToast("You'll be alerted about new Critical stories while the app is open in the background", 4500);
}

/* Alert about new Critical stories (from the last 24h) found by a refresh,
   but only when the user isn't already looking at the app. */
function notifyNewCritical(newItems) {
  if (!notifyEnabled() || document.hasFocus()) return;
  const fresh = newItems.filter(i => i.priority === 'critical' && Date.now() - i.ts < TIME_WINDOWS['24h']);
  if (!fresh.length) return;
  const title = fresh.length === 1 ? `Critical · ${fresh[0].source}` : `${fresh.length} new Critical stories`;
  const opts  = { body: fresh.slice(0, 3).map(i => i.title).join('\n'), icon: 'icons/icon-192.png',
                  tag: 'ctt-critical', data: { id: fresh[0].id } };
  /* Service-worker notifications also work on Android, where new Notification() throws */
  const pageNotify = () => {
    try {
      const n = new Notification(title, opts);
      n.onclick = () => { window.focus(); openItemById(opts.data.id); n.close(); };
    } catch (e) { console.warn('notification failed', e); }
  };
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistration()
      .then(reg => reg ? reg.showNotification(title, opts) : pageNotify())
      .catch(pageNotify);
  } else pageNotify();
}

function openItemById(id) {
  if (pendingItems?.some(i => i.id === id)) commitItems(pendingItems, false);
  const item = allItems.find(i => i.id === id);
  if (!item) return;
  selectItem(item);
  feedItemsEl.querySelector(`[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest' });
}

/* ── OPML import ── */
async function importOpml(file) {
  let doc;
  try { doc = new DOMParser().parseFromString(await file.text(), 'text/xml'); }
  catch { showToast('Could not read that file'); return; }
  const outlines = [...doc.querySelectorAll('outline[xmlUrl]')];
  if (doc.querySelector('parsererror') || !outlines.length) { showToast('No feeds found — is this an OPML file?'); return; }

  let added = 0, skipped = 0, overCap = 0;
  for (const o of outlines) {
    const url = (o.getAttribute('xmlUrl') || '').trim();
    if (!/^https?:\/\//i.test(url) || feeds.some(f => f.url === url)) { skipped++; continue; }
    if (added >= MAX_IMPORT) { overCap++; continue; }
    let base = (o.getAttribute('title') || o.getAttribute('text') || '').trim();
    if (!base) { try { base = new URL(url).hostname; } catch { skipped++; continue; } }
    let name = base;
    for (let n = 2; feeds.some(f => f.name === name); n++) name = `${base} (${n})`;
    const color = CUSTOM_COLORS[feeds.filter(f => f.custom).length % CUSTOM_COLORS.length];
    feeds.push({ name, url, color, initials: toInitials(name), enabled: true, custom: true });
    added++;
  }

  saveAllFeeds();
  openSettings();
  showToast(`Imported ${added} feed${added !== 1 ? 's' : ''}` +
    (skipped ? ` · ${skipped} already present or invalid` : '') +
    (overCap ? ` · ${overCap} not imported (limit ${MAX_IMPORT} per import)` : ''), 5000);
  if (added) refreshAll();
}

/* ── Suggest a feed ── */
/* Opens a GitHub issue pre-filled from .github/ISSUE_TEMPLATE/feed-suggestion.yml
   (query params matching the form's field ids fill those fields). */
function suggestFeed(name = '', url = '') {
  const params = new URLSearchParams({ template: 'feed-suggestion.yml', title: `Feed suggestion: ${name || ''}`.trim() });
  if (name) params.set('feed-name', name);
  if (url)  params.set('feed-url', url);
  window.open(`${REPO_URL}/issues/new?${params}`, '_blank', 'noopener');
}

/* ── Toast ── */
let toastTimer;
function showToast(msg, ms = 3000) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

/* ── OPML export ── */
function escapeXmlAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exportOPML() {
  const now = new Date().toUTCString();
  const items = feeds.filter(f => f.type !== 'kev').map(f => {  // KEV is JSON, not RSS
    const name = escapeXmlAttr(f.name);
    const url  = escapeXmlAttr(f.url);
    return `      <outline type="rss" text="${name}" title="${name}" xmlUrl="${url}"/>`;
  }).join('\n');

  const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <head>
    <title>Cyber Threat Intelligence Feeds</title>
    <dateCreated>${now}</dateCreated>
  </head>
  <body>
    <outline text="Cyber Threat Intelligence" title="Cyber Threat Intelligence">
${items}
    </outline>
  </body>
</opml>`;

  const blob   = new Blob([opml], { type: 'text/x-opml' });
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objUrl;
  a.download = 'threat-feeds.opml';
  a.click();
  setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
  showToast('Exported threat-feeds.opml');
}

/* ── Events ── */
if (exportBtn) exportBtn.addEventListener('click', exportOPML);

const addFeedBtn  = $('add-feed-btn');
const newFeedUrl  = $('new-feed-url');
const newFeedName = $('new-feed-name');
if (addFeedBtn) addFeedBtn.addEventListener('click', testAndAddFeed);
$('import-opml-btn')?.addEventListener('click', () => $('import-opml-input').click());
$('import-opml-input')?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  e.target.value = '';  // allow re-importing the same file
  if (file) importOpml(file);
});
navigator.serviceWorker?.addEventListener('message', e => {
  if (e.data?.type === 'open-item') openItemById(e.data.id);
});
$('suggest-feed-link')?.addEventListener('click', e => {
  e.preventDefault();
  suggestFeed($('new-feed-name').value.trim(), $('new-feed-url').value.trim());
});
if (newFeedUrl)  newFeedUrl.addEventListener('keydown',  e => { if (e.key === 'Enter') testAndAddFeed(); });
if (newFeedName) newFeedName.addEventListener('keydown', e => { if (e.key === 'Enter') $('new-feed-url')?.focus(); });
refreshBtn.addEventListener('click',   () => refreshAll());
newStoriesBtn.addEventListener('click', () => {
  if (pendingItems) commitItems(pendingItems, false);
  feedListEl.scrollTop = 0;
});

/* Background tabs throttle timers, so also refresh when the user comes back
   (or reconnects) and the data is getting old. */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - lastCheckedAt > STALE_ON_RETURN_MS) refreshAll(true);
});
window.addEventListener('online', () => refreshAll(true));
/* Keep the "Updated 5m ago" label current */
setInterval(() => { if (document.visibilityState === 'visible') updateHeader(); }, 60 * 1000);
markReadBtn.addEventListener('click',  markAllRead);
settingsBtn.addEventListener('click',  openSettings);
settingsClose.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', applySettings);
overlay.addEventListener('click', e => { if (e.target === overlay) closeSettings(); });

chartTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    chartTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chartMode = btn.dataset.chart;
    updateChart();
  });
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.toLowerCase().trim();
  renderFeedList(); updateChart(); updateHeader();
});

/* ── Keyboard navigation (↑/↓ move selection through the story list) ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
  if (!overlay.classList.contains('hidden')) return;

  const items = visibleItems();
  if (!items.length) return;

  e.preventDefault();
  let idx = items.findIndex(it => it.id === activeItemId);
  idx = e.key === 'ArrowDown' ? Math.min(idx < 0 ? 0 : idx + 1, items.length - 1)
                               : Math.max(idx < 0 ? 0 : idx - 1, 0);

  const item = items[idx];
  selectItem(item);
  feedItemsEl.querySelector(`[data-id="${CSS.escape(item.id)}"]`)?.scrollIntoView({ block: 'nearest' });
});

/* ── Theme toggle ── */
(function () {
  const html = document.documentElement;
  let saved = 'dark';
  try { saved = localStorage.getItem('ctt-theme') || 'dark'; } catch (e) { console.warn('localStorage read failed', e); }
  html.dataset.theme = saved;

  function syncLabel() {
    const label = html.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
  }
  syncLabel();

  themeBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    safeSetItem('ctt-theme', next);
    syncLabel();
    if (chart) { chart.destroy(); chart = null; updateChart(); }
  });
}());

/* ── Vertical divider (left ↔ right) ── */
(function () {
  const vDiv     = $('vertical-divider');
  const leftPanel= $('left-panel');
  let drag = false, startX = 0, startW = 0;

  function begin(x) {
    drag = true; startX = x;
    startW = leftPanel.getBoundingClientRect().width;
    vDiv.classList.add('dragging');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }
  function move(x) {
    if (!drag) return;
    const mainW  = $('main').getBoundingClientRect().width;
    const newW   = Math.min(mainW - 300, Math.max(180, startW + (x - startX)));
    leftPanel.style.width = newW + 'px';
  }
  function end() {
    if (!drag) return;
    drag = false;
    vDiv.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (chart) chart.resize();
  }

  vDiv.addEventListener('mousedown',  e => { begin(e.clientX); e.preventDefault(); });
  document.addEventListener('mousemove', e => move(e.clientX));
  document.addEventListener('mouseup',   end);
  vDiv.addEventListener('touchstart',  e => { begin(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove',  e => { if (drag) { move(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
  document.addEventListener('touchend',   end);
}());

/* ── Resizable right-panel divider ── */
(function () {
  const divider    = $('right-divider');
  const articleView= $('article-view');
  const rightPanel = $('right-panel');

  let dragging = false;
  let startY   = 0;
  let startH   = 0;

  function beginDrag(clientY) {
    dragging = true;
    startY   = clientY;
    startH   = articleView.getBoundingClientRect().height;
    divider.classList.add('dragging');
    document.body.style.cursor     = 'ns-resize';
    document.body.style.userSelect = 'none';
  }

  function onMove(clientY) {
    if (!dragging) return;
    const panelH  = rightPanel.getBoundingClientRect().height;
    const minH    = 60;
    const maxH    = panelH - 80 - divider.offsetHeight; // leave 80px for chart
    const newH    = Math.min(maxH, Math.max(minH, startH + (clientY - startY)));
    articleView.style.flex   = 'none';
    articleView.style.height = newH + 'px';
    if (chart) chart.resize();
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor     = '';
    document.body.style.userSelect = '';
    if (chart) chart.resize();
  }

  divider.addEventListener('mousedown',  e => { beginDrag(e.clientY); e.preventDefault(); });
  document.addEventListener('mousemove', e => onMove(e.clientY));
  document.addEventListener('mouseup',   endDrag);

  /* touch support */
  divider.addEventListener('touchstart',  e => { beginDrag(e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove',  e => { if (dragging) { onMove(e.touches[0].clientY); e.preventDefault(); } }, { passive: false });
  document.addEventListener('touchend',   endDrag);
}());

/* ── Mobile panel navigation ── */
(function () {
  const main      = $('main');
  const backBtn   = $('mobile-back');

  function isMobile() { return window.innerWidth <= 767; }

  function showArticlePanel() {
    if (isMobile()) main.classList.add('article-open');
  }

  function showListPanel() {
    main.classList.remove('article-open');
  }

  /* Expose for selectItem */
  window._showArticlePanel = showArticlePanel;

  /* Back button */
  if (backBtn) backBtn.addEventListener('click', showListPanel);

  /* Swipe right → back to list */
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!isMobile()) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (dx > 60 && Math.abs(dy) < Math.abs(dx) && main.classList.contains('article-open')) {
      showListPanel();
    }
  }, { passive: true });

  /* On resize to desktop, reset panel state */
  window.addEventListener('resize', () => {
    if (!isMobile()) showListPanel();
    if (chart) chart.resize();
  });
}());

/* ── Service worker ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(console.warn));
}

/* ── Init ── */
$('version-badge').textContent = VERSION;
$('app-version').textContent   = VERSION;
initTagBar();
initPriorityBar();
initTimeBar();
/* With cached articles on screen, refresh quietly in the background. */
refreshAll(loadCache());
