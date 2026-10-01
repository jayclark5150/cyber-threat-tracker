const CACHE = 'ctt-v8';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  /* Network-first for the rss2json proxy */
  if (url.hostname === 'api.rss2json.com') {
    e.respondWith(
      fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  /* Leave other cross-origin requests (direct feed fetches, Chart.js CDN) to the browser */
  if (url.origin !== self.location.origin) return;

  /* feeds.json snapshot: network-first, keep the last good copy for offline use */
  if (url.pathname.endsWith('/feeds.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(url.pathname, copy));
        }
        return res;
      }).catch(() => caches.match(url.pathname).then(hit => hit || Response.error()))
    );
    return;
  }

  /* Cache-first for app shell */
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
