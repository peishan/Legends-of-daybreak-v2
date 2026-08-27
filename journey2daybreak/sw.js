// Journey to Daybreak — service worker
//
// The core problem this solves: query-string versioning and HTML meta tags
// are both just *hints* — they depend on the browser (and any CDN in front
// of GitHub Pages) choosing to respect them. A service worker doesn't have
// to hope for cooperation: it intercepts every fetch itself, so it can just
// always go to the network first for the files that matter, and only fall
// back to a cached copy if the network genuinely fails (offline). That
// makes "am I on the latest build" no longer dependent on cache headers
// behaving correctly anywhere in the chain.
//
// Bump CACHE_VERSION whenever this file changes so old caches get cleared.
const CACHE_VERSION = 'daybreak-v3';
const CORE_FILES = ['./', './index.html', './app.js', './chapters-data.js', './reader.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate this new service worker immediately, don't wait for old tabs to close
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_FILES).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_VERSION).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim()) // take control of already-open tabs right away
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isCore = CORE_FILES.some((f) => url.pathname.endsWith(f.replace('./', '')) || url.pathname.endsWith('/'));

  if (event.request.method !== 'GET') return; // don't intercept anything non-GET

  if (isCore) {
    // Network-first: always try to get the live version. Only fall back to
    // cache if the network request genuinely fails (offline).
    //
    // Important: fetch from event.request.url (a plain string), NOT
    // event.request itself. Passing the original Request object back into
    // fetch() alongside a conflicting cache option breaks specifically for
    // navigation-type requests in some browsers — which is exactly why this
    // worked on a fresh load but broke specifically on hitting Reload (a
    // reload request carries browser-assigned semantics a fresh navigation
    // doesn't). A plain URL string sidesteps that entirely.
    event.respondWith(
      fetch(event.request.url, { cache: 'no-store' })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Everything else (comic art, boss art, portraits) — cache-first is fine,
    // since images don't change once generated, and this keeps the app fast
    // and lets it work offline for content already viewed.
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
