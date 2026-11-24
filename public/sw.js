const CACHE_NAME = 'cornetto-static-v2'

const PRECACHE_URLS = [
  '/',
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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  const isPrecached = PRECACHE_URLS.includes(url.pathname)
  const isNuxtAsset = url.pathname.startsWith('/_nuxt/')
  const isStartPayload = url.pathname === '/_payload.json'

  if (
    event.request.method !== 'GET'
    || url.origin !== self.location.origin
    || !(isPrecached || isNuxtAsset || isStartPayload)
  ) {
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)

      if (cached) {
        return cached
      }

      const response = await fetch(event.request)

      if (response.ok) {
        await cache.put(event.request, response.clone())
      }

      return response
    })
  )
})