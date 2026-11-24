export default defineNuxtPlugin(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('[PWA] Service Worker registriert')
      })
      .catch((error) => {
        console.error('[PWA] Registrierung fehlgeschlagen:', error)
      })
  }
})