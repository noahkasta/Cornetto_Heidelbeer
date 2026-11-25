# 02 – Offline-Strategie: Konzept

Team: Cornetto Heidelbeere (Leo Bürger, Simon Horn, Noah Wagner)

## Ausgangslage

Auf einer Konferenz ist das WLAN oft überlastet. Besucher öffnen die App im Vortragssaal, zwischen zwei Sessions im Flugmodus oder auf dem Weg in den nächsten Raum. Die App soll dann trotzdem das Programm und die eigene Auswahl zeigen. Wir betrachten vier Datentypen und entscheiden je Typ, ob zuerst der Cache oder zuerst das Netzwerk gefragt wird.

## App-Shell und statische Ressourcen

Für die Startseite und statische Ressourcen verwenden wir Cache First. Das HTML der Startseite, das Manifest und die beiden App-Icons werden beim Installieren des Service Workers vorab gespeichert. JavaScript- und CSS-Dateien unter `/_nuxt/` werden bei Online-Anfragen durch den aktiven Worker zusätzlich gecacht. Diese Dateien tragen einen Hash im Namen und ändern sich innerhalb einer App-Version nie. Network First würde bei schlechtem WLAN erst eine Verbindung versuchen und den Start verzögern, obwohl sich nichts geändert haben kann. Eigene Webfonts gibt es nicht, wir nutzen Systemschriften. Das Token-CSS steckt in den Nuxt-Dateien. Bei einem Update muss die Cache-Version erhöht werden, alte Caches werden beim Aktivieren entfernt.

## Session- und Speaker-Daten

Die Konferenzdaten werden beim Build aus der JSON-Datei in das JavaScript eingebunden. Sie liegen damit im selben Cache wie die App-Shell, eine eigene API gibt es nicht. Für Session-Detailseiten, Speaker-Übersicht und Speaker-Profile verwenden wir ebenfalls Cache First. Beim ersten Online-Aufruf wird die Seite gespeichert, danach kommt sie aus dem Cache. Das passt, weil sich das Programm nach der Veröffentlichung in der Regel nicht mehr ändert.

Stale-While-Revalidate wäre nötig, sobald sich Daten kurzfristig ändern, etwa ein Raumtausch am Morgen des zweiten Tages. Dann würde der Cache sofort antworten und im Hintergrund die neue Version holen. Bei Cache First sieht ein Besucher die alte Raumangabe, bis wir die Cache-Version erhöhen. Das widerspricht der ISR-Simulation aus Schritt 2. Weil unsere Daten statisch eingebunden sind, akzeptieren wir das und haben es in der Rendering-ADR vermerkt.

## „Mein Programm“

Die Seite `/my-program` wird mit der App-Shell vorab gespeichert. Die gemerkten Session-IDs liegen weiterhin in localStorage. Der Service Worker sorgt nur dafür, dass die Seite und ihr JavaScript ohne Netz erreichbar sind. Die IDs werden über `useConferenceData()` den Sessions zugeordnet, auch das klappt offline.

## Offline-Fallback und Worst Case

Für Seiten, die weder im Cache liegen noch geladen werden können, liefert der Worker eine eigene `offline.html` ohne zusätzliche Dateien. Bricht die Verbindung mitten in der Nutzung ab, bleiben Übersicht, Filter und „Mein Programm“ bedienbar. Neue Einträge im Programm werden lokal gespeichert. Eine noch nie besuchte Seite zeigt beim direkten Aufruf die Offline-Seite. Bei einem Erstbesuch ganz ohne Netz gibt es noch keinen Service Worker, dann erscheint die Fehlerseite des Browsers. Das ist akzeptabel, weil ohne einmaliges Laden nichts gespeichert sein kann.

## Übersicht

| Datentyp | Strategie | Grund |
|---|---|---|
| App-Shell, Icons, Manifest, `/_nuxt/` | Cache First (Precache + Laufzeit) | ändert sich innerhalb einer Version nicht |
| Session-/Speaker-Seiten und Daten | Cache First | Programm ist veröffentlicht und statisch |
| „Mein Programm“ | Precache der Seite, Daten in localStorage | persönlich, nur im Browser |
| Nicht gespeicherte Seiten | Netzwerk, sonst `offline.html` | verständlicher Hinweis statt Fehlerseite |
