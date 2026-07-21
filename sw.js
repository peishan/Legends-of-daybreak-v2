// Legends of Daybreak — Service Worker
// Bump CACHE_VERSION whenever you ship new game.js/styles.css/index.html so returning
// players get the update instead of a stale cached copy. NOTE: this is a fallback safety
// net only — the fetch strategy below is network-first for the app shell specifically so
// updates land automatically without needing to remember to bump this every time.
const CACHE_VERSION = 'daybreak-v2';

// Core app shell — changes often during active development. Network-first: always try
// to get the latest version when online, only falling back to cache when offline.
const CORE_ASSETS = [
  './',
  './index.html',
  './game.js',
  './styles.css',
  './manifest.json'
];

// Optional assets — images that rarely change once uploaded. Cache-first: faster loads,
// no need to re-fetch every time, and a missing one (e.g. portraits not yet uploaded on
// this deployment) must not break the whole install.
const OPTIONAL_ASSETS = [
  './icons/icon-192.png',
  './icons/icon-512.png',
  './portraits/san.jpg',
  './portraits/joel.jpg',
  './portraits/aisyah.jpg',
  './portraits/mezstorm.jpg',
  './portraits/eliz.jpg',
  './portraits/senedra.jpg',
  './portraits/zaki.jpg',
  './portraits/soel.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      // Cache optional assets individually so one missing file doesn't abort install
      await Promise.all(
        OPTIONAL_ASSETS.map((url) =>
          cache.add(url).catch(() => {
            // Missing/optional — fine, just skip it
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// App shell files get network-first: try the network for the latest version, and only
// fall back to cache if that fails (offline, or a flaky connection). This is the fix for
// the bug where a cached game.js could get permanently stuck, since a pure cache-first
// strategy never re-checks the network once something is cached.
function isAppShellRequest(url) {
  return CORE_ASSETS.some((asset) => url.pathname.endsWith(asset.replace('./', '/')) || url.pathname === '/' );
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts CDN) pass through normally

  if (event.request.mode === 'navigate' || isAppShellRequest(url)) {
    // Network-first
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (portraits, icons): cache-first, since these rarely change
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => undefined);
    })
  );
});
