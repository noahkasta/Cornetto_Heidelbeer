// Rehydration von "Mein Programm" erst nach der Hydration (State-Konzept Schritt 1).
// onNuxtReady läuft, wenn Nuxt die Seite fertig hydriert hat. So stimmt das HTML
// vom Server mit dem Browser überein, und erst danach wird der gespeicherte
// Stand aus localStorage übernommen.
export default defineNuxtPlugin(() => {
  const { hydrate } = useMyProgram()
  onNuxtReady(() => hydrate())
})
