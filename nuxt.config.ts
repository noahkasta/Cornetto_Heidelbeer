// https://nuxt.com/docs/api/configuration/nuxt-config
import conferenceData from './data/conference_data.json'

// Speaker-Routen kennen wir beim Build, deshalb erzeugen wir die Liste aus dem Datensatz.
const speakerRoutes = conferenceData.speakers.map(speaker => `/speakers/${speaker.id}`)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~~/tokens/tokens.css', '~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],

  // Rendering-Strategie pro Anwendungsteil, siehe docs/schritt2/01-rendering-strategie-adr.md
  routeRules: {
    // Punkt 3: Session-Übersicht vorgerendert (SSG), gefiltert wird im Browser
    '/': { prerender: true },
    // Punkt 1: Speaker-Liste und -Profile vorgerendert (SSG)
    '/speakers': { prerender: true },
    '/speakers/**': { prerender: true },
    // Punkt 2: Session-Details als ISR-Simulation (stale-while-revalidate, 60 s)
    '/sessions/**': { swr: 60, prerender: false },
    // Punkt 4: Mein Programm nur im Browser (CSR), Daten kommen aus localStorage
    '/my-program': { ssr: false },
  },

  nitro: {
    prerender: {
      // Nur die oben genannten Routen vorrendern. Ohne diese Einstellung würde
      // der Crawler den Links folgen und auch die Session-Details statisch erzeugen.
      crawlLinks: false,
      routes: ['/', '/speakers', ...speakerRoutes],
    },
  },
})
