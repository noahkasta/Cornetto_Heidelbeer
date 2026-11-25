# PWA-Setup

Unsere PWA verwendet eine manuelle
Service-Worker-Registrierung. Das Nuxt-Plugin
`app/plugins/service-worker.client.ts` registriert `public/sw.js`
ausschließlich im Browser und außerhalb des Entwicklungsmodus.
Diese Lösung orientiert sich an den Lifecycle-Beispielen der
Vorlesung und hält die Umsetzung ohne zusätzliche PWA-Bibliothek
überschaubar.

Das Manifest `public/manifest.webmanifest` definiert den vollständigen
App-Namen, den Kurznamen „Cornetto“, die Start-URL `/` und
`display: standalone`. Die Theme-Farbe `#464196` entspricht unserem
Token `--color-primary`; die Hintergrundfarbe `#fff8ea` stammt aus
`--color-surface`. Dadurch übernimmt die installierte App die
Gestaltung der Website. Das Heidelbeer-Eistüten-Symbol
greift den Plattformnamen auf. Es liegt als PNG in 192 × 192 und
512 × 512 Pixeln vor.

Die Prüfung erfolgt mit `npm run build` und `npm run preview` auf
localhost. Für die Veröffentlichung ist HTTPS erforderlich.
Nach Aktivierung und erneutem Online-Laden speichert der Worker
die benötigten Nuxt-Dateien für die spätere Offline-Nutzung.