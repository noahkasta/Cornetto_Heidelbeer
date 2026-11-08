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

