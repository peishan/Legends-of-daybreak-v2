// Legends of Daybreak — Service Worker
// Bump CACHE_VERSION whenever you ship new game.js/styles.css/index.html so returning
// players get the update instead of a stale cached copy.
const CACHE_VERSION = 'daybreak-v1';

// Core app shell — required files. If any of these fail to fetch, install fails on
// purpose, since the game can't run without them.
const CORE_ASSETS = [
  './',
  './index.html',
  './game.js',
  './styles.css',
  './manifest.json'
];

// Optional assets — nice to have offline, but a missing one (e.g. portraits not yet
// uploaded on this deployment) must not break the whole install.
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

// Cache-first for same-origin requests (app shell, portraits, icons), so the game
// works offline once installed. Falls back to network, and if that also fails,
// serves the cached index.html for navigation requests so the app shell still loads.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts CDN) pass through normally

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Cache a copy of successfully-fetched same-origin assets for next time
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
