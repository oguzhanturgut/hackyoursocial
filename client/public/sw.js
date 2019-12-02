self.addEventListener('install', e => {
  console.log('[SW] Installing sw', e);
  const urlsToPrefetch = [
    '/',
    '/profiles',
    '/index.html',
    './static/media/showcase.4b31330b.jpg',
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
    caches.open('static-v1').then(cache => {
      console.log('Pre-caching...');
      cache.addAll(urlsToPrefetch);
    }),
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating sw', e);
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(e.request);
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
