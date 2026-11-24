self.addEventListener('install', () => {
  console.log('[SW] Service Worker installiert')
})

self.addEventListener('activate', () => {
  console.log('[SW] Service Worker aktiviert')
})