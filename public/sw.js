const CACHE_NAME = 'helmies-site-v1';

const urlsToCache = [
  '/',
  '/manifest.json'
];

const BYPASS_CACHE_PATTERNS = [
  /\/src\//,
  /\/assets\/.*\.js$/,
  /\/assets\/.*\.css$/,
  /\.js\?/,
  /api\//,
  /supabase/
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (!url.protocol.startsWith('http')) return;

  const shouldBypass = BYPASS_CACHE_PATTERNS.some(p => p.test(url.pathname) || p.test(url.href));

  if (shouldBypass) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache).catch(() => {});
        });

        return response;
      });
    })
  );
});
