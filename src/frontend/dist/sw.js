// Ramp Track Service Worker
// Strategy: network-first for API calls, stale-while-revalidate for static assets

const CACHE_NAME = 'ramptrack-v1';

// Core static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Pass through ICP canister API calls — never cache these
  if (url.pathname.startsWith('/api/')) return;

  // Pass through requests to different origins
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate for everything else
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type !== 'opaque') {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached); // Return cached copy if network fails

        // Return cached immediately if available, otherwise wait for network
        return cached || networkFetch;
      })
    )
  );
});
