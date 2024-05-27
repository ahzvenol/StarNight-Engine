self.addEventListener('fetch', event => {
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