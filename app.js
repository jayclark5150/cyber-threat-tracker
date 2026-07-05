'use strict';

/* ── Feed definitions ── */
const FEEDS = [
  // Core news feeds
  { name: 'CISA Advisories',   url: 'https://www.cisa.gov/news.xml',                              color: '#5b8df0', initials: 'CI', enabled: true  },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/',                           color: '#f7a650', initials: 'KS', enabled: true  },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/',                      color: '#4dbb7e', initials: 'BC', enabled: true  },
  { name: 'The Hacker News',   url: 'https://feeds.feedburner.com/TheHackersNews',                color: '#a855f7', initials: 'HN', enabled: true  },
  { name: 'Dark Reading',      url: 'https://www.darkreading.com/rss.xml',                        color: '#38c4c4', initials: 'DR', enabled: true  },
  { name: 'SecurityWeek',      url: 'https://feeds.feedburner.com/securityweek',                  color: '#ff6464', initials: 'SW', enabled: true  },
  // Top 10 Threat Intelligence Feeds 2026
  { name: 'CrowdStrike',       url: 'https://www.crowdstrike.com/blog/feed/',                     color: '#e91e8c', initials: 'CS', enabled: true  },
  { name: 'Cisco Talos',       url: 'https://blog.talosintelligence.com/feeds/posts/default',     color: '#ff7043', initials: 'CT', enabled: true  },
  { name: 'SANS ISC',          url: 'https://isc.sans.edu/rssfeed_full.xml',                      color: '#ffd600', initials: 'SI', enabled: true  },
  { name: 'Securelist',        url: 'https://securelist.com/feed/',                               color: '#ef5350', initials: 'SL', enabled: true  },
  { name: 'Unit 42',           url: 'https://unit42.paloaltonetworks.com/feed/',                  color: '#26c6da', initials: 'U4', enabled: true  },
  { name: 'Recorded Future',   url: 'https://www.recordedfuture.com/feed',                        color: '#00b4d8', initials: 'RF', enabled: true  },
  { name: 'Mandiant',          url: 'https://www.mandiant.com/resources/blog/rss.xml',            color: '#f44336', initials: 'MD', enabled: true  },
  { name: 'IBM Security',      url: 'https://securityintelligence.com/feed/',                     color: '#42a5f5', initials: 'IB', enabled: true  },
  { name: 'MISP',              url: 'https://www.misp-project.org/feed.xml',                      color: '#7e57c2', initials: 'MI', enabled: true  },
  { name: 'Abuse.ch',          url: 'https://abuse.ch/blog/feed/',                               color: '#9ccc65', initials: 'AB', enabled: true  },
  { name: 'ANY.RUN',           url: 'https://any.run/cybersecurity-blog/rss/',                    color: '#00e5ff', initials: 'AR', enabled: true  },
  { name: 'Google Proj Zero',  url: 'https://googleprojectzero.blogspot.com/feeds/posts/default', color: '#ffca28', initials: 'G0', enabled: true  },
  // Additional sources (ISC list)
  { name: 'GreyNoise',         url: 'https://www.greynoise.io/blog/rss.xml',                      color: '#78909c', initials: 'GN', enabled: true  },
  { name: 'VirusTotal',        url: 'https://blog.virustotal.com/feeds/posts/default',             color: '#26a69a', initials: 'VT', enabled: true  },
  { name: 'CISA Alerts',       url: 'https://www.cisa.gov/uscert/ncas/alerts.xml',                color: '#b71c1c', initials: 'CA', enabled: true  },
  { name: 'CISA Cur. Activity',url: 'https://www.cisa.gov/uscert/ncas/current-activity.xml',     color: '#e65100', initials: 'CC', enabled: true  },
];

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
    words: ['malware','backdoor','trojan','rootkit','worm','spyware','stealer','infostealer','rat ','keylogger','loader','dropper','botnet','cobalt strike'] },
  { tag: 'Data Breach',   color: '#00c2e0', bg: '#00c2e018',
    words: ['data breach','breach','leak','leaked','exposed','stolen data','exfiltrat','personal data','pii','records exposed'] },
  { tag: 'Critical Infra',color: '#ff9f43', bg: '#ff9f4318',
    words: ['critical infrastructure','ics','scada','ot security','industrial control','power grid','water','healthcare','hospital','energy sector','pipeline'] },
  { tag: 'DDoS',          color: '#00f5d4', bg: '#00f5d418',
    words: ['ddos','denial of service','distributed denial','mirai','botnet attack'] },
];

const VERSION     = 'v0.0.1';
const REFRESH_MS  = 15 * 60 * 1000;
const STORE_KEY   = 'ctt-v2';
const CUSTOM_KEY  = 'ctt-custom';

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
let searchQuery   = '';
let activeItemId  = null;
let chartMode     = 'type';
let chart         = null;
let refreshTimer  = null;
let feeds         = loadAllFeeds();

/* ── DOM refs ── */
const $ = id => document.getElementById(id);
const feedLoading    = $('feed-loading');
const feedItemsEl    = $('feed-items');
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
const sourceList     = $('feed-source-list');
const saveSettingsBtn= $('save-settings-btn');
const chartTabBtns   = document.querySelectorAll('.chart-tab');
const toast          = $('toast');

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
  localStorage.setItem(STORE_KEY,  JSON.stringify(s));
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(feeds.filter(f => f.custom)));
}

/* ── Threat tag detection ── */
function detectTags(title, desc) {
  const haystack = (title + ' ' + desc).toLowerCase();
  return TAG_RULES.filter(r => r.words.some(w => haystack.includes(w)));
}

function getPriority(tags) {
  if (!tags.length) return 'low';
  const names = tags.map(t => t.tag);
  if (names.some(n => ['Ransomware','APT','Critical Infra'].includes(n))) return 'critical';
  if (names.some(n => ['Vulnerability','Malware','Data Breach'].includes(n))) return 'high';
  if (names.some(n => ['Phishing','DDoS'].includes(n))) return 'medium';
  return 'low';
}

/* ── RSS fetch & parse — multi-proxy fallback ── */

const PROXY_STRATEGIES = [
  /* 1. rss2json — returns clean JSON */
  async (feedUrl) => {
    const u = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const r = await fetch(u, { signal: AbortSignal.timeout(12000) });
    if (!r.ok) throw new Error(`rss2json HTTP ${r.status}`);
    const d = await r.json();
    if (d.status !== 'ok') throw new Error(d.message || 'rss2json error');
    return { type: 'json', data: d };
  },
  /* 2. allorigins /raw — returns raw XML */
  async (feedUrl) => {
    const u = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    const r = await fetch(u, { signal: AbortSignal.timeout(12000) });
    if (!r.ok) throw new Error(`allorigins HTTP ${r.status}`);
    const text = await r.text();
    if (!text.trim().startsWith('<')) throw new Error('Not XML');
    return { type: 'xml', data: text };
  },
  /* 3. direct fetch — works for feeds with CORS headers */
  async (feedUrl) => {
    const r = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error(`direct HTTP ${r.status}`);
    const text = await r.text();
    if (!text.trim().startsWith('<')) throw new Error('Not XML');
    return { type: 'xml', data: text };
  },
];

async function fetchFeed(feed) {
  let lastErr;
  for (const strategy of PROXY_STRATEGIES) {
    try {
      const result = await strategy(feed.url);
      return result.type === 'json'
        ? parseJsonItems(result.data.items, feed)
        : parseXmlItems(result.data, feed);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function parseJsonItems(items, feed) {
  return items.map((item, i) => {
    const date    = item.pubDate ? new Date(item.pubDate.replace(' ', 'T')) : new Date();
    const rawDesc = item.description || item.content || '';
    const desc    = stripHtml(rawDesc).slice(0, 600);
    const title   = item.title || '(no title)';
    const tags    = detectTags(title, desc);
    return {
      id: `${feed.name}-${i}-${date.getTime()}`,
      source: feed.name, color: feed.color, initials: feed.initials,
      title, link: item.link || item.guid || '',
      desc, date, ts: date.getTime(), tags, priority: getPriority(tags),
    };
  });
}

function parseXmlItems(xmlText, feed) {
  const xml   = new DOMParser().parseFromString(xmlText, 'text/xml');
  const nodes = [...xml.querySelectorAll('item, entry')];
  return nodes.map((node, i) => {
    const get   = (...tags) => { for (const t of tags) { const v = node.querySelector(t)?.textContent?.trim(); if (v) return v; } return ''; };
    const pubDate = get('pubDate', 'published', 'updated', 'dc\\:date');
    const date  = pubDate ? new Date(pubDate) : new Date();
    const rawDesc = get('description', 'summary', 'content');
    const desc  = stripHtml(rawDesc).slice(0, 600);
    const title = get('title') || '(no title)';
    const link  = node.querySelector('link')?.textContent?.trim()
               || node.querySelector('link')?.getAttribute('href')
               || get('guid') || '';
    const tags  = detectTags(title, desc);
    return {
      id: `${feed.name}-${i}-${date.getTime()}`,
      source: feed.name, color: feed.color, initials: feed.initials,
      title, link, desc, date, ts: date.getTime(), tags, priority: getPriority(tags),
    };
  });
}

function stripHtml(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent || '';
}

/* ── Refresh ── */
async function refreshAll(quiet = false) {
  const enabled = feeds.filter(f => f.enabled);
  if (!enabled.length) { showToast('No feeds enabled'); return; }

  refreshBtn.classList.add('spinning');
  if (!quiet) feedLoading.style.display = 'flex';

  const results = await Promise.allSettled(enabled.map(f => fetchFeed(f)));
  let errors = 0;
  const fresh = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') fresh.push(...r.value);
    else { console.warn(enabled[i].name, r.reason); errors++; }
  });

  allItems = fresh.sort((a, b) => b.ts - a.ts);

  feedLoading.style.display = 'none';
  refreshBtn.classList.remove('spinning');

  renderSourceChips();
  renderFeedList();
  updateChart();
  updateHeader();

  if (!quiet && errors) showToast(`${errors} feed(s) failed`);

  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => refreshAll(true), REFRESH_MS);
}

/* ── Header ── */
function updateHeader() {
  const n = visibleItems().length;
  itemCount.textContent = `${n} item${n !== 1 ? 's' : ''}`;
  lastUpdated.textContent = 'Updated ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Filtering ── */
function visibleItems() {
  return allItems.filter(it => {
    if (activeFilter !== 'all' && it.source !== activeFilter) return false;
    if (activeTag !== 'all' && !it.tags.some(t => t.tag === activeTag)) return false;
    if (searchQuery && !it.title.toLowerCase().includes(searchQuery)) return false;
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
  tagBar.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeTag = chip.dataset.tag;
      tagBar.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
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
    el.className = `feed-item priority-${item.priority}${item.id === activeItemId ? ' active' : ''}`;
    el.dataset.id = item.id;

    /* Meta row */
    const meta = document.createElement('div');
    meta.className = 'feed-item-meta';

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
    item.tags.slice(0, 3).forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'threat-pill';
      pill.textContent = t.tag;
      pill.style.color = t.color;
      pill.style.background = t.bg;
      tagsRow.appendChild(pill);
    });

    el.append(meta, title);
    if (item.tags.length) el.appendChild(tagsRow);
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

  /* AI summary box */
  if (item.desc && item.desc.length > 80) {
    aiSummaryBox.classList.remove('hidden');
    aiSummaryText.textContent = item.desc.slice(0, 280) + (item.desc.length > 280 ? '…' : '');
    articleDesc.textContent = item.desc.length > 280 ? item.desc : '';
  } else {
    aiSummaryBox.classList.add('hidden');
    articleDesc.textContent = item.desc || 'No description available.';
  }

  articleLink.href = item.link;

  /* Reading time */
  const words = item.desc.split(/\s+/).length;
  const mins  = Math.max(1, Math.ceil(words / 200));
  readingTime.textContent = `${mins} min read`;
}

/* ── Charts ── */
function updateChart() {
  if (chart) { chart.destroy(); chart = null; }
  const light = document.documentElement.dataset.theme === 'light';
  Chart.defaults.color       = light ? '#6a6a90' : '#46465e';
  Chart.defaults.borderColor = light ? '#dde2f0' : '#1a1a2e';
  const ctx = $('threat-chart').getContext('2d');
  if (chartMode === 'pie')  renderDonut(ctx);
  else if (chartMode === 'type') renderTypeDonut(ctx);
  else renderLine(ctx);
}

function renderDonut(ctx) {
  const items = visibleItems();
  const counts = {}, colorMap = {};
  items.forEach(it => {
    counts[it.source] = (counts[it.source] || 0) + 1;
    colorMap[it.source] = it.color;
  });
  const labels = Object.keys(counts);
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: labels.map(l => counts[l]), backgroundColor: labels.map(l => colorMap[l]),
        borderColor: light ? '#f0f4f8' : '#0b0b14', borderWidth: 2, hoverOffset: 6 }],
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

function renderTypeDonut(ctx) {
  const items = visibleItems();
  const counts = {};
  const colorMap = {};
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
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: labels.map(l => counts[l]), backgroundColor: labels.map(l => colorMap[l]),
        borderColor: light ? '#f0f4f8' : '#0b0b14', borderWidth: 2, hoverOffset: 6 }],
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

function renderLine(ctx) {
  const items = visibleItems();
  const days = 7;
  const dayLabels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dayLabels.push(d.toLocaleDateString([], { month: 'short', day: 'numeric' }));
  }
  const dayKey = d => d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const sources = [...new Set(items.map(i => i.source))];
  const datasets = sources.map(src => {
    const feed = feeds.find(f => f.name === src);
    const color = feed?.color || '#888';
    const perDay = {};
    items.filter(i => i.source === src).forEach(i => { const k = dayKey(i.date); perDay[k] = (perDay[k]||0)+1; });
    return {
      label: src, data: dayLabels.map(l => perDay[l]||0),
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
function openSettings() {
  sourceList.innerHTML = '';
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
    tog.addEventListener('click', () => tog.classList.toggle('on'));

    row.append(dot, nameEl, tog);

    if (feed.custom) {
      const del = document.createElement('button');
      del.className = 'source-delete';
      del.title = 'Remove this feed';
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
  feeds    = feeds.filter(f => f.url !== feed.url);
  allItems = allItems.filter(it => it.source !== feed.name);
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
    const items = await fetchFeed(newFeed);
    if (!items.length) throw new Error('Feed returned 0 items — is this a valid RSS URL?');

    feeds.push(newFeed);
    saveAllFeeds();
    nameInput.value = '';
    urlInput.value  = '';
    showToast(`Added "${name}" — ${items.length} item${items.length !== 1 ? 's' : ''} found`);
    allItems = [...allItems, ...items].sort((a, b) => b.ts - a.ts);
    renderSourceChips();
    renderFeedList();
    updateChart();
    updateHeader();
    openSettings();
  } catch (e) {
    showToast(`Could not load: ${e.message}`, 4500);
  } finally {
    addBtn.textContent = 'Test & Add';
    addBtn.disabled = false;
  }
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
function exportOPML() {
  const now = new Date().toUTCString();
  const items = feeds.map(f => {
    const name = f.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `      <outline type="rss" text="${name}" title="${name}" xmlUrl="${f.url}"/>`;
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

  const blob = new Blob([opml], { type: 'text/x-opml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'threat-feeds.opml';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Exported threat-feeds.opml');
}

/* ── Events ── */
if (exportBtn) exportBtn.addEventListener('click', exportOPML);

const addFeedBtn  = $('add-feed-btn');
const newFeedUrl  = $('new-feed-url');
const newFeedName = $('new-feed-name');
if (addFeedBtn) addFeedBtn.addEventListener('click', testAndAddFeed);
if (newFeedUrl)  newFeedUrl.addEventListener('keydown',  e => { if (e.key === 'Enter') testAndAddFeed(); });
if (newFeedName) newFeedName.addEventListener('keydown', e => { if (e.key === 'Enter') $('new-feed-url')?.focus(); });
refreshBtn.addEventListener('click',   () => refreshAll());
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

/* ── Theme toggle ── */
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem('ctt-theme') || 'dark';
  html.dataset.theme = saved;

  themeBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('ctt-theme', next);
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
initTagBar();
refreshAll();
