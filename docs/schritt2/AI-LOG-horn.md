# AI-LOG – Simon – Schritt 2

## 1. Dynamische Detailseiten

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Wie lassen sich in Nuxt eigene URLs pro Sessions erstellen,
ohne für jede der Sessions eine eigene Seitendatei anzulegen?

**KI-Antwort, sinngemäß:**
Eine dynamische Route wie pages/sessions/[id].vue verwendet eine
gemeinsame Seitenvorlage. Über den Routenparameter wird die passende
Session aus der zentralen Datenschicht ausgewählt. Für unbekannte IDs
sollte eine passende Fehlerseite angezeigt werden.

**Projektbezug / Verständnis:**
Alle Sessions haben dieselbe Datenstruktur. Eine gemeinsame Vorlage
verhindert doppelte Implementierungen und ermöglicht trotzdem aufrufbare und verlinkbare Detailseiten.


## 2. Beziehungen zwischen Sessions und Speakern

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Warum ist im Datensatz speakerIds und sessionIds statt Kopien der jeweils zugehörigen Objekte?
Wie verwendet man die Beziehungen auf den Profilseiten am besten?

**KI-Antwort, sinngemäß:**
IDs verknüpfen die Datensätze, ohne Inhalte mehrfach zu speichern.
Die zugehörigen Objekte werden anhand dieser IDs aus der zentralen
Datenschicht ermittelt. Da eine Session mehrere Speaker haben kann,
müssen alle Einträge aus speakerIds berücksichtigt werden.

**Projektbezug / Verständnis:**
Die Detailseiten und Profile können dieselben Daten verwenden.
Das passt zur Verlinkung und berücksichtigt auch das Podium bei mehreren Speakern.


## 3. SSG und ISR bei Konferenzinhalten

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Warum besser statisch erzeugte Seiten zu Speaker-Profilen?
Welchen extra Nutzen könnte ISR für haben, wenn sich z.b der Zeitplan später ändert?
 
**KI-Antwort, sinngemäß:**
SSG erzeugt Seiten beim Build und passt zu Inhalten, die zwischen
Deployments unverändert bleiben. ISR kann zwischengespeicherte Seiten
später erneuern. Dafür muss der laufenden Anwendung eine aktualisierte
Datenquelle zur Verfügung stehen; eine beim Build eingebundene JSON-Datei
wird durch ISR allein nicht automatisch aktuell.

**Projektbezug / Verständnis:**
Die unveränderlichen Beispieldaten sprechen für ne statische Ausgabe.
Zeitplanänderungen sind ein sinnvoller Anlass, ISR konzeptionell zu
vergleichen.

## 4. weitere Fragen und Fehlerbehebungen werden im Hinblick auf die Länge dieses Dokumentes ausgelassen

## 5. Caching-Strategien und Service Worker

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Wie kann ich die geplante Cache-First-Strategie in unserer bestehenden Nuxt-Anwendung umsetzen? Welche Ressourcen müssen gespeichert werden, damit die Anwendung offline funktioniert?

KI-Antwort, sinngemäß:

Der vorhandene Service Worker kann erweitert werden. Eine Aufteilung in separate Caches für die App-Shell, bereits besuchte Seiten und statische Ressourcen ermöglicht eine übersichtlichere Verwaltung. Alte Cache-Versionen können bei der Aktivierung des neuen Service Workers gelöscht werden.

Projektbezug / Verständnis:

Der vorgeschlagene Code wurde in public/sw.js übernommen. Da unsere Konferenzdaten bereits beim Build eingebunden werden, benötigen wir keinen eigenen API-Cache. Die persönlichen Session-IDs bleiben unabhängig davon im localStorage gespeichert.

## 6. Offline-Fallback und Erstbesuch

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Was soll passieren, wenn eine Seite offline aufgerufen wird, die vorher noch nicht gespeichert wurde?

KI-Antwort, sinngemäß:

Eine eigene statische Offline-Seite kann angezeigt werden, wenn eine Navigationsanfrage weder aus dem Cache noch über das Netzwerk beantwortet werden kann. Bei einem vollständigen Erstbesuch ohne Internetverbindung ist dies nicht möglich, da noch kein Service Worker installiert wurde.

Projektbezug / Verständnis:

Die Datei public/offline.html wurde erstellt und in die Liste der vorab gespeicherten Ressourcen aufgenommen. Beim Test eines Erstbesuchs ohne Internetverbindung wurde erwartungsgemäß die Fehlerseite des Browsers angezeigt.

## 7. Fehlerbehebung beim Produktions-Build

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Warum wird die neu erstellte offline.html mit einem 404-Fehler angezeigt?

KI-Antwort, sinngemäß:

Die Anwendung wird im Preview-Modus aus dem bereits erstellten Produktions-Build ausgeführt. Änderungen an öffentlichen Dateien müssen deshalb durch einen erneuten Build übernommen werden.

Projektbezug / Verständnis:

Nach einem erneuten npm run build und dem anschließenden Start mit npm run preview konnte die Offline-Seite erfolgreich aufgerufen werden.

## 8. Probleme bei der Service-Worker-Registrierung

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Warum kann der Service Worker nach dem Entfernen der Website-Daten nicht mehr registriert werden?

KI-Antwort, sinngemäß:

Die Netzwerkeinstellungen, der Browser-Cache und die Einstellungen des Service Workers sollten überprüft werden. Zusätzlich kann die Registrierung in einem neuen Inkognito-Fenster getestet werden, um Probleme mit dem bisherigen Browserzustand einzugrenzen.

Projektbezug / Verständnis:

Die Registrierung schlug zunächst auch bei einem manuellen Registrierungsversuch fehl. In einem frischen Inkognito-Fenster funktionierte der Service Worker wieder. Die genaue Ursache konnte nicht eindeutig festgestellt werden.

## 9. Überprüfung der Offline-Funktionalität

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Wie kann ich überprüfen, ob die implementierte Offline-Strategie tatsächlich funktioniert?

KI-Antwort, sinngemäß:

Die Anwendung sollte zuerst online im Produktionsmodus geladen werden. Anschließend kann die Internetverbindung über die Browser-Entwicklerwerkzeuge simuliert deaktiviert werden. Die relevanten Seiten müssen erneut geladen werden, damit nicht nur die bereits dargestellten Inhalte überprüft werden.

Projektbezug / Verständnis:

Folgende Tests wurden selbst im Browser durchgeführt:

Session-Übersicht inklusive Filterung nach Tag, Track und Level.

Bereits besuchte Session-Detailseite.

Persönliches Programm mit vier gespeicherten Sessions.

Erstbesuch ohne vorheriges Online-Laden.

Speaker-Übersicht und Speaker-Profil inklusive zugehöriger Sessions.

Alle Tests zeigten das erwartete Verhalten.

## 10. Zusammenspiel zwischen ISR und Cache First

Datum: 25.11.2026

Tool: ChatGPT

Frage:

Wie kann ich die ISR-Simulation überprüfen, wenn der Service Worker die Session-Detailseiten bereits im Browser speichert?

KI-Antwort, sinngemäß:

Für den Test muss der Service Worker vorübergehend umgangen werden. Andernfalls kann Cache First die serverseitige Aktualisierung verdecken. Bei Stale-While-Revalidate kann nach Ablauf des Cache-Intervalls zunächst noch die alte Version ausgeliefert werden, während die neue Version im Hintergrund erzeugt wird.

Projektbezug / Verständnis:

Die ISR-Simulation wurde anhand der angezeigten Zeitstempel überprüft:

Erster Aufruf: 14:49:30

Innerhalb von 60 Sekunden: 14:49:30

Nach Ablauf des Cache-Intervalls: 14:50:49

Die Ergebnisse entsprechen dem erwarteten Verhalten. Die Formulierung zur maximalen Aktualität wurde im ADR und in der Session-Detailseite präzisiert.
