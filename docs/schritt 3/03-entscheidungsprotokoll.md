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