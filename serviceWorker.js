const cacheName = "local";

const cacheAssets = [
    'index.html',
    'aboutUs.html',
    '/assets/style.css',
    '/assets/main.js',
]

self.addEventListener('install', (e) => {
    console.log("Service worker installed!")
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log("Service worker caching files!")
            cache.addAll(cacheAssets)
        })
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (e) => {
    console.log("Service worker activated!")
        // Can be used to clear old cache
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})


// 1. Network-First Strategy:
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});

// 2. Stale-While-Revalidate:
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(fetchResponse => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });

                return cachedResponse || fetchPromise;
            });
        })
    );
});

// 3. Network-Only Strategy:
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
    );
});


// 4. Cache-Only Strategy:
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
    );
});

// 5. Falling-Back-to-Network Strategy:
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(fetchResponse => {
                caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                });
                return fetchResponse;
            });

            return cachedResponse || fetchPromise;
        })
    );
});