// Service Worker von Cornetto Heidelbeere (Schritt 3)
// Die Caching-Regeln setzen das Konzept in docs/schritt3/02-offline-strategie-konzept.md um:
//   B1 App-Shell und statische Ressourcen  -> Precache + Cache First (SHELL_CACHE, ASSET_CACHE)
//   B2 Session- und Speaker-Daten           -> Cache First für Seiten (PAGE_CACHE), Daten im Nuxt-JavaScript (ASSET_CACHE)
//   B3 "Mein Programm"                       -> /my-program im Precache, Auswahl bleibt in localStorage
//   B4 Offline-Fallback                      -> /offline.html für nicht gespeicherte Seiten
// Entscheidung und Tests: docs/schritt3/03-entscheidungsprotokoll.md

const CACHE_PREFIX = 'cornetto-'

const SHELL_CACHE = 'cornetto-shell-v4'
const PAGE_CACHE = 'cornetto-pages-v4'
const ASSET_CACHE = 'cornetto-assets-v4'

// B1, B3, B4: App-Shell. Diese Seiten und Dateien werden bereits bei der
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

// Aktivierung: Alte Cornetto-Caches entfernen. Bei einer neuen App-Version
// wird die Versionsnummer (-v3) erhöht, sonst bleibt Cache First beim alten Stand.
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

// Cache First (B1): Zuerst im Cache suchen.
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

// Navigationen (B2, B3, B4): Startseite, Sessions und Speaker-Seiten.
// Reihenfolge: Seiten-Cache, App-Shell, Netzwerk, zuletzt offline.html.
// Bewusste Abweichung von der ISR-Simulation aus Schritt 2: Eine einmal
// gespeicherte Detailseite wird nicht aktualisiert (siehe Konzept, B2).
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
  self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Vorab gespeicherte Ressourcen im Shell-Cache suchen.
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE))
    return
  }

  // Nuxt-Dateien und Payloads aller Seiten berücksichtigen.
  const isNuxtAsset = url.pathname.startsWith('/_nuxt/')
  const isIcon = url.pathname.startsWith('/icons/')
  const isPayload = url.pathname.endsWith('/_payload.json')

  if (isNuxtAsset || isIcon || isPayload) {
    event.respondWith(cacheFirst(request, ASSET_CACHE))
  }
})

  // B1 und B2: statische App-Dateien und Nuxt-Payloads. Die Konferenzdaten
  // stecken im JavaScript unter /_nuxt/ und werden hier mitgecacht.
  // Lücke: Nur die Payload der Startseite wird erfasst (siehe Nachweis).
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