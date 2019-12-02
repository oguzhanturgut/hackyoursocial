const CACHE_VERSION = 3;
const CURRENT_CACHES = {
  static: `static-v${CACHE_VERSION}`,
  dynamic: `dynamic-v${CACHE_VERSION}`,
};

self.addEventListener('install', e => {
  console.log('[SW] Installing sw', e);
  const urlsToPrefetch = [
    '/',
    '/index.html',
    '/offline.html',
    '/static/media/showcase.4b31330b.jpg',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/main.chunk.js',
    '/favicon.ico',
    'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.ttf',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.woff',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.woff2',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.ttf',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.woff',
    'https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.woff2',
  ];
  e.waitUntil(
    caches.open(CURRENT_CACHES.static).then(cache => {
      console.log('Pre-caching...');
      // Static Prefetching
      cache.addAll(urlsToPrefetch);
    }),
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating sw', e);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CURRENT_CACHES.static && key !== CURRENT_CACHES.dynamic) {
            console.log('[SW] Deleting old cache...');
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      } else {
        // Dynamic Prefetching
        return fetch(e.request)
          .then(response => {
            return caches.open(CURRENT_CACHES.dynamic).then(cache => {
              const cloneResponse = response.clone();
              cache.put(e.request.url, cloneResponse);
              return response;
            });
          })
          .catch(error => {
            return caches.open(CURRENT_CACHES.static).then(cache => cache.match('/offline.html'));
          });
      }
    }),
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       console.log('fetch');
//       if (response) return response;
//       return fetch(event.request);
//     }),
//   );
//   console.log('fetching', event);
// });
