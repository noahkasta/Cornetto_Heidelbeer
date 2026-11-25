const CACHE_PREFIX = 'cornetto-'

const SHELL_CACHE = 'cornetto-shell-v3'
const PAGE_CACHE = 'cornetto-pages-v3'
const ASSET_CACHE = 'cornetto-assets-v3'

// App-Shell: Diese Seiten und Dateien werden bereits bei der
// Installation des Service Workers gespeichert.
const PRECACHE_URLS = [
  '/',
  '/my-program',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Installation: App-Shell vorab speichern.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    }).then(() => self.skipWaiting())
  )
})

// Aktivierung: Alte Cornetto-Caches entfernen.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      const currentCaches = [
        SHELL_CACHE,
        PAGE_CACHE,
        ASSET_CACHE,
      ]

      return Promise.all(
        names
          .filter((name) =>
            name.startsWith(CACHE_PREFIX)
            && !currentCaches.includes(name)
          )
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Cache First: Zuerst im Cache suchen.
// Nur wenn nichts vorhanden ist, wird das Netzwerk verwendet.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  const response = await fetch(request)

  if (response.ok && response.type === 'basic') {
    await cache.put(request, response.clone())
  }

  return response
}

// Navigationen: Startseite, Sessions und Speaker-Seiten.
async function handleNavigation(request) {
  const pageCache = await caches.open(PAGE_CACHE)
  const shellCache = await caches.open(SHELL_CACHE)

  // Bereits gespeicherte Seite bevorzugen.
  const cachedPage = await pageCache.match(request)

  if (cachedPage) {
    return cachedPage
  }

  // Vorinstallierte App-Shell verwenden.
  const cachedShell = await shellCache.match(request)

  if (cachedShell) {
    return cachedShell
  }

  try {
    // Neue Seite online laden und für später speichern.
    const response = await fetch(request)

    if (response.ok && response.type === 'basic') {
      await pageCache.put(request, response.clone())
    }

    return response
  } catch {
    // Unbekannte Offline-Seite: verständlicher Fallback.
    return await shellCache.match('/offline.html')
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Nur GET-Anfragen derselben Website behandeln.
  if (
    request.method !== 'GET'
    || url.origin !== self.location.origin
  ) {
    return
  }

  // HTML-Navigationen:
  // Session-Details, Speaker-Profile und andere Seiten.
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  // Statische App-Dateien und Nuxt-Payloads.
  const isNuxtAsset = url.pathname.startsWith('/_nuxt/')
  const isManifest = url.pathname === '/manifest.webmanifest'
  const isIcon = url.pathname.startsWith('/icons/')
  const isPayload = url.pathname.endsWith('.json')
    && url.pathname.startsWith('/_payload')

  if (isNuxtAsset || isManifest || isIcon || isPayload) {
    event.respondWith(
      cacheFirst(request, ASSET_CACHE)
    )
  }
})