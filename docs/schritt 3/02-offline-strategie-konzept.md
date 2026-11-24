### App-Shell und statische Ressourcen
// vorschlag Leo
Für die Startseite und statische Ressourcen verwenden wir Cache First.
Das HTML der Startseite, das Manifest und die beiden App-Icons werden
beim Installieren des Service Workers vorab gespeichert. JavaScript-
und CSS-Dateien unter `/_nuxt/` sowie die Payload der Startseite werden
bei passenden Online-Anfragen durch den aktiven Worker zusätzlich
gecacht.

Diese Strategie passt zur Konferenznutzung bei unzuverlässigem WLAN:
Bereits gespeicherte Ressourcen sind ohne erneute Netzwerkanfrage
verfügbar. Network First würde dagegen zunächst eine Verbindung
versuchen, obwohl sich diese Dateien innerhalb einer veröffentlichten
App-Version nicht ändern.

Für unseren Test wird die Startseite nach Aktivierung des Workers
noch einmal online geladen. Anschließend soll sie offline einschließlich
Gestaltung und Filterfunktion verfügbar sein. Noch nicht gespeicherte
Ressourcen benötigen weiterhin eine Verbindung. Bei Aktualisierungen
muss die Cache-Version angepasst werden; alte statische Caches werden
beim Aktivieren der neuen Worker-Version entfernt.
//vorschlag ende