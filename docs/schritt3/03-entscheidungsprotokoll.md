# 03 – Entscheidungsprotokoll: Offline und Caching

Team: Cornetto Heidelbeere (Leo Bürger, Simon Horn, Noah Wagner)

## Kontext

Während einer Konferenz kann es durch viele gleichzeitige Besucher zu einer schlechten oder unterbrochenen Internetverbindung kommen. Die Session-Übersicht und das persönliche Programm sollen deshalb nach vorheriger Online-Nutzung weiterhin verfügbar sein. Auch bereits besuchte Session-Detailseiten und Speaker-Profile sollen nach Möglichkeit offline geöffnet werden können. Die Rendering-Strategie aus Schritt 2 bleibt unverändert.

## Optionen

Cache First: Ressourcen werden zuerst im Cache gesucht. Nur wenn keine gespeicherte Antwort vorhanden ist, wird eine Netzwerkanfrage durchgeführt.

Network First: Ressourcen werden zuerst über das Netzwerk angefragt. Bei fehlender Verbindung wird auf den Cache zurückgegriffen.

Stale-While-Revalidate: Eine gespeicherte Antwort wird direkt ausgeliefert, während im Hintergrund eine Aktualisierung über das Netzwerk erfolgt.

## Entscheidung

Wir verwenden Cache First für die App-Shell, statische Ressourcen und bereits besuchte Konferenzseiten. Die Umsetzung erfolgt über einen manuellen Service Worker in `public/sw.js`. Die Ressourcen werden auf drei versionierte Caches aufgeteilt:

- `cornetto-shell-v3`: Startseite, Mein Programm, Offline-Fallback, Manifest und Icons (Precache bei der Installation)
- `cornetto-pages-v3`: erfolgreich geladene Navigationsanfragen, etwa Session-Detailseiten und Speaker-Profile
- `cornetto-assets-v3`: Nuxt-Dateien unter `/_nuxt/` und die Payload der Startseite

Persönliche Session-IDs werden weiterhin in localStorage gespeichert. Die serverseitige ISR-Simulation der Session-Detailseiten bleibt bestehen.

## Konsequenzen

Bereits gespeicherte Ressourcen können ohne Internetverbindung geladen werden. Dadurch bleibt die Anwendung auch bei schlechter Verbindung nutzbar.

Cache First aktualisiert gespeicherte Inhalte nicht automatisch. Bei Änderungen an der Anwendung muss die Cache-Version angepasst werden. Für Session-Detailseiten verdeckt der Browser-Cache damit die ISR-Simulation aus Schritt 2. Bei echten Live-Daten würden wir diese Seiten auf Stale-While-Revalidate umstellen (siehe Konzept).

Noch nicht gespeicherte Seiten fehlen offline. Für sie liefert der Worker eine eigene Offline-Seite. Bei einem Erstbesuch ohne Netz gibt es noch keinen Service Worker, dann ist keine Offline-Nutzung möglich.

## Testszenarien

Alle Tests liefen im Produktionsmodus (`npm run build`, `npm run preview`) auf localhost. Jede Person hat auf ihrem eigenen Rechner getestet. Die Belege stehen in `04-verifikations-nachweis.md`.

### Szenario 1: Session-Übersicht nach Online-Nutzung offline öffnen

Ausgangslage: Nach Aktivierung des Service Workers wurde die Startseite erneut online geladen, damit die benötigten Nuxt-Dateien im Cache liegen.

Aktion: Offline-Modus aktivieren (Firefox: Datei → Offline arbeiten, Chrome: DevTools → Network → Offline). Danach die Startseite neu laden und die Filter nach Tag, Track und Level kombinieren.

Beobachtetes Verhalten:

- Leo (Firefox, HTTP-Cache in den DevTools deaktiviert): Die Übersicht erschien mit Gestaltung und Session-Liste. Die Filter ließen sich kombinieren und änderten die Trefferliste.
- Simon (Chrome): Die Übersicht wurde angezeigt, die Filter funktionierten. Zusätzlich ließ sich eine zuvor online besuchte Session-Detailseite offline öffnen.
- Noah (Chrome): Die Übersicht erschien vollständig. Mit Tag 2, Rendering & Performance und Fortgeschritten blieben 2 von 20 Sessions. Im Network-Tab schlugen dabei viele Anfragen nach `_payload.json` fehl. Nuxt lädt diese Daten für verlinkte Seiten vorab, unser Worker cacht aber nur die Payload der Startseite. Auf die Bedienung hatte das keinen Einfluss.

Ergebnis: bestanden. Beide Browser verhielten sich gleich.

### Szenario 2: „Mein Programm“ offline öffnen

Ausgangslage: Die Anwendung wurde online geöffnet, der Service Worker war aktiv. Es wurden mehrere Sessions zum persönlichen Programm hinzugefügt.

Aktion: Offline-Modus aktivieren und die Route `/my-program` direkt aufrufen, also nicht über einen Link in der App.

Beobachtetes Verhalten:

- Simon (Chrome): Die Seite öffnete sich, alle vier zuvor hinzugefügten Sessions waren sichtbar. Die Session-IDs wurden aus localStorage gelesen.
- Noah (Chrome): Vier gemerkte Sessions an beiden Tagen wurden angezeigt, zwei davon mit Hinweis auf einen Zeitkonflikt. Alle Dateien kamen laut Network-Tab aus dem Service Worker oder dem Speicher des Browsers.

Ergebnis: bestanden. Im automatisierten Test (siehe Nachweis) wurde auch der Hinweis auf einen Zeitkonflikt offline angezeigt, weil er im Browser berechnet wird.

### Szenario 3: Erstbesuch ohne vorheriges Online-Laden

Ausgangslage: Website-Daten gelöscht und Service Worker in den DevTools (Application → Storage → Clear site data) abgemeldet. Damit liegt nichts im Cache.

Aktion: Offline-Modus aktivieren und die Startseite aufrufen, ohne sie vorher online zu laden.

Beobachtetes Verhalten:

- Simon (Chrome): Der Browser zeigte seine eigene Fehlerseite mit dem Dinosaurier. Weder die App noch unsere `offline.html` wurden geladen.
- Noah (Chrome): Nach „Clear site data“ zeigte Chrome die Seite mit dem Dinosaurier und `ERR_INTERNET_DISCONNECTED`. Die Navigation wurde im Network-Tab als fehlgeschlagen angezeigt, ein Service Worker griff nicht ein.

Ergebnis: erwartetes Verhalten. Ohne einen ersten Online-Besuch kann kein Service Worker installiert sein, also gibt es auch nichts im Cache. Mehr ist technisch nicht möglich. Wir halten das für akzeptabel, weil Besucher die App vor der Konferenz einmal öffnen, etwa über den Link in der Anmeldebestätigung.

### Zusätzlicher Grenzfall: nie besuchte Detailseite

Beim Durchklicken fiel ein Unterschied auf. Ruft man offline eine nie besuchte Detailseite direkt auf (z. B. `/sessions/s09`), erscheint unsere `offline.html`. Klickt man dagegen in der offline geöffneten Übersicht auf dieselbe Session, öffnet sie sich. Die Daten stecken im gecachten JavaScript, und Nuxt rendert die Seite im Browser. Offline erreichbar ist also mehr, als der Seiten-Cache vermuten lässt, aber nur über Links innerhalb der App.
