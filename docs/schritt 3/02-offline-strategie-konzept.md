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
Session- und Speaker-Seiten
//Simon
Für die Session-Detailseiten, die Speaker-Übersicht und die einzelnen Speaker-Profile verwenden wir Cache First. Beim ersten direkten Online-Aufruf einer Seite wird die erfolgreiche Antwort im Cache gespeichert. Bei weiteren Aufrufen wird zuerst geprüft, ob die Seite bereits im Cache vorhanden ist.

Die Konferenzdaten werden beim Build aus der JSON-Datei eingebunden. Deshalb benötigen wir keinen zusätzlichen Cache für eine externe API.

Ein Nachteil dieser Strategie ist, dass bereits gespeicherte Session-Detailseiten trotz der serverseitigen ISR-Simulation veraltet bleiben können. Da sich unsere Beispieldaten während der Laufzeit nicht ändern, akzeptieren wir diese Einschränkung.

Mein Programm

Die Seite „Mein Programm“ wird gemeinsam mit der App-Shell bei der Installation des Service Workers gespeichert. Die benötigten JavaScript-Dateien werden bei Online-Anfragen zusätzlich gecacht.

Die persönlichen Session-IDs bleiben weiterhin im localStorage gespeichert. Der Service Worker ist nur dafür zuständig, die benötigten Anwendungsdateien offline bereitzustellen. Die Zuordnung der IDs zu den Sessions erfolgt weiterhin über useConferenceData().

Offline-Fallback

Für Navigationsanfragen, bei denen weder eine gespeicherte Seite noch eine Netzwerkverbindung verfügbar ist, verwenden wir eine eigene offline.html. Diese benötigt keine zusätzlichen JavaScript- oder CSS-Dateien.

Bei einem vollständigen Erstbesuch ohne Internetverbindung kann auch diese Seite nicht angezeigt werden, da der Service Worker noch nicht installiert wurde. Eine Browser-Fehlerseite ist in diesem Fall akzeptabel.
//Simon Ende