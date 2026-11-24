const CACHE_NAME = 'cornetto-static-v1'

const PRECACHE_URLS = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => {
            return name.startsWith('cornetto-static-')
              && name !== CACHE_NAME
          })
          .map((name) => caches.delete(name))
      )
    })
  )
})