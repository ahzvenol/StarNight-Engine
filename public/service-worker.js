self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting())
});

self.addEventListener('fetch', event => {
    if (!event.request.url.match('/static/'))
        event.respondWith(fetch(event.request));
    else
        event.respondWith(
            caches.match(event.request)
            .then((res) =>
                res || fetch(event.request)
                .then(response => caches.open('cache')
                    .then((cache) =>
                        cache.put(event.request, response.clone())
                        .then(() => response)
                    )
                )
            )
        )
})

self.addEventListener('message', event => {
    if (event.data === 'clean') {
        event.waitUntil(caches.keys().then((keys) =>
            Promise.all(keys.map((key) => caches.delete(key)))
        ))
    }
})