### Szenario 1: Session-Übersicht nach Online-Nutzung offline öffnen

**Ausgangslage:**
Die Anwendung wurde mit `npm run build` gebaut und mit
`npm run preview` gestartet. Nach Aktivierung des Service Workers
wurde die Startseite erneut online geladen, damit die benötigten
Nuxt-Dateien im Cache vorliegen.

**Aktion:**
Der normale HTTP-Cache wurde in den Entwicklerwerkzeugen deaktiviert.
Anschließend wurde Firefox in den Offline-Modus versetzt und die
Session-Übersicht mit F5 neu geladen.

**Beobachtetes Verhalten:**
Die Übersicht wurde weiterhin mit Gestaltung und Session-Liste
angezeigt. Die Filter nach Tag, Track und Level ließen sich kombinieren
und änderten die Trefferliste. Damit war die Startseite nach vorheriger
Online-Nutzung offline bedienbar. Der Test bezieht sich auf die
Übersicht; weitere Routen werden separat geprüft.

//Simon Tests und Beobachtungen
Kontext

Während einer Konferenz kann es durch viele gleichzeitige Besucher zu einer schlechten oder unterbrochenen Internetverbindung kommen. Die Session-Übersicht und das persönliche Programm sollen deshalb nach vorheriger Online-Nutzung weiterhin verfügbar sein. Auch bereits besuchte Session-Detailseiten und Speaker-Profile sollen nach Möglichkeit offline geöffnet werden können.

Optionen

Cache First: Ressourcen werden zuerst im Cache gesucht. Nur wenn keine gespeicherte Antwort vorhanden ist, wird eine Netzwerkanfrage durchgeführt.

Network First: Ressourcen werden zuerst über das Netzwerk angefragt. Bei fehlender Verbindung wird auf den Cache zurückgegriffen.

Stale While Revalidate: Eine gespeicherte Antwort wird direkt ausgeliefert, während im Hintergrund eine Aktualisierung über das Netzwerk erfolgt.

Entscheidung

Wir verwenden Cache First für die App-Shell, statische Ressourcen und bereits besuchte Konferenzseiten. Die Umsetzung erfolgt über einen manuellen Service Worker in public/sw.js.

Die Ressourcen werden auf drei versionierte Caches aufgeteilt:

cornetto-shell-v3: Startseite, Mein Programm, Offline-Fallback, Manifest und Icons.

cornetto-pages-v3: erfolgreich geladene Navigationsanfragen.

cornetto-assets-v3: Nuxt-Ressourcen und weitere statische Dateien.

Persönliche Session-IDs werden weiterhin im localStorage gespeichert.

Die serverseitige ISR-Simulation der Session-Detailseiten bleibt unverändert bestehen.

Konsequenzen

Bereits gespeicherte Ressourcen können ohne Internetverbindung geladen werden. Dadurch bleibt die Anwendung auch bei einer schlechten Netzwerkverbindung teilweise nutzbar.

Ein Nachteil ist, dass Cache First gespeicherte Inhalte nicht automatisch aktualisiert. Bei Änderungen an der Anwendung muss die Cache-Version angepasst werden.

Noch nicht gespeicherte Ressourcen können offline fehlen. Für nicht verfügbare Navigationsanfragen wird eine eigene Offline-Seite bereitgestellt. Bei einem vollständigen Erstbesuch ohne vorherige Installation des Service Workers ist keine Offline-Nutzung möglich.

Getestete Szenarien

Szenario 1: Session-Übersicht nach Online-Nutzung offline öffnen

Ausgangslage:

Die Anwendung wurde mit npm run build gebaut und anschließend mit npm run preview gestartet. Der Service Worker wurde aktiviert und die Startseite erneut online geladen, damit die benötigten Ressourcen gespeichert werden konnten.

Aktion:

In den Chrome-Entwicklerwerkzeugen wurde unter Network der Offline-Modus aktiviert. Danach wurde die Startseite erneut geladen. Zusätzlich wurden die Filter nach Tag, Track und Level ausprobiert.

Beobachtetes Verhalten:

Die Session-Übersicht wurde weiterhin angezeigt und die Filter funktionierten auch ohne Netzwerkverbindung. Zusätzlich konnte eine zuvor online besuchte Session-Detailseite offline geöffnet werden. Damit konnte die grundlegende Offline-Funktionalität der Session-Übersicht bestätigt werden.

Ergebnis: Test bestanden.

Szenario 2: Mein Programm offline öffnen

Ausgangslage:

Die Anwendung wurde online geöffnet und der Service Worker war aktiv. Insgesamt wurden vier Sessions zum persönlichen Programm hinzugefügt. Die Seite „Mein Programm“ wurde anschließend online geöffnet.

Aktion:

Über die Chrome-Entwicklerwerkzeuge wurde der Offline-Modus aktiviert. Danach wurde die Route /my-program erneut direkt aufgerufen, um die Verfügbarkeit der Seite unabhängig von der vorherigen Darstellung zu überprüfen.

Beobachtetes Verhalten:

Die Seite konnte weiterhin geöffnet werden und alle vier zuvor hinzugefügten Sessions waren sichtbar. Die benötigten Anwendungsdateien waren offline verfügbar. Die persönlichen Session-IDs konnten weiterhin aus dem localStorage gelesen werden. Damit funktionierte das Zusammenspiel zwischen dem Service Worker und der lokalen Speicherung des persönlichen Programms.

Ergebnis: Test bestanden.

Szenario 3: Erstbesuch ohne vorheriges Online-Laden

Ausgangslage:

Um einen erstmaligen Besuch der Anwendung zu simulieren, wurden die gespeicherten Website-Daten entfernt und der Service Worker über die Entwicklerwerkzeuge abgemeldet. Damit sollte ein Zustand ohne zuvor gespeicherte Anwendungsressourcen hergestellt werden.

Aktion:

Anschließend wurde der Offline-Modus aktiviert und die Startseite erneut aufgerufen, ohne die Anwendung vorher wieder online zu laden.

Beobachtetes Verhalten:

Der Browser zeigte seine eigene Fehlermeldung für eine fehlende Internetverbindung inklusive Dinosaurier-Spiel an. Die Anwendung und die eigene Offline-Seite konnten nicht geladen werden. Dieses Verhalten ist akzeptabel, da ohne vorherigen Online-Besuch kein Service Worker installiert werden kann und keine Anwendungsdateien im Cache verfügbar sind.

Ergebnis: Erwartetes Verhalten, Test bestanden.
//Simon Tests und Beobachtungen Ende