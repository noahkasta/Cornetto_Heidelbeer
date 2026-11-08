# AI-LOG – Noah Wagner – Schritt 2

## 1. Session-IDs im persönlichen Programm

**Datum:** 06.11.2026
**Tool:** Claude

**Frage:**
Welche Vorteile hat es bei „Mein Programm“ nur Session-IDs in
localStorage zu speichern statt vollständign Session-Objekte?

**KI-Antwort, sinngemäß:**
IDs halten den gespeicherten Zustand klein und vermeiden Kopien der
Konferenzdaten. Für die Anzeige werden die ausgewählten IDs mit dem
zentralen Datensatz verknüpft. IDs, zu denen keine Session mehr existiert,
sollten beim Laden berücksichtigt und gegebenenfalls entfernt werden.

**Projektbezug / Verständnis:**
Die Konferenzdaten bleiben die zentrale Informationsquelle.
Gespeichert wird nur die persönliche Auswahl. Das passt zum Projektumfang ohne Backend und Userkonto.


## 2. Rehydration und Nuxt

**Datum:** 06.11.2026
**Tool:** Claude

**Frage:**
Was bedeutet die Rehydration bei der gespeicherten Programmauswahl genau?
Wo wird der code beim Zugriff auf localStorage in Nuxt darauf ausgeführt?

**KI-Antwort, sinngemäß:**
Hier bedeutet Rehydration, die gespeicherten IDs beim Start einzulesen
und damit den reaktiven Programm-State wiederherzustellen.
localStorage steht nur im Browser zur Verfügung. Das Einlesen muss
deshalb clientseitig erfolgen. Die gespeicherte Auswahl sollte geladen
sein, bevor der anfängliche Zustand wieder gespeichert wird.

**Projektbezug / Verständnis:**
Damit bleibt die Auswahl nach einem Reload erhalten. Gleichzeitig
verhindert die Trennung von Browser- und Server-Code Fehler bei
serverseitiger Ausführung.


## 3. Gemeinsamer State für mehrere Komponenten

**Datum:** 06.11.2026
**Tool:** Claude

**Frage:**
Wie kann Toggle-Button, Programmseite und Header auf die gleiche
Auswahl zugreifen, ohne den Zustand mehrfach zu verwalten?

**KI-Antwort, sinngemäß:**
Ein Composable kann einen gemeinsamen reaktiven State und passende
Aktionen bereitstellen. In Nuxt eignet sich dafür beispielsweise
useState mit einem gemeinsamen Schlüssel. Komponenten verwenden dann
dieselben Aktionen zum Hinzufügen und Entfernen und leiten ihre Anzeige
aus derselben Auswahl ab.

**Projektbezug / Verständnis:**
useMyProgram bündelt die Programmverwaltung. Dadurch können Buttons,
Timeline und gegebenenfalls eine Anzahl im Header konsistent reagieren.
Die Speicherung in localStorage wird ebenfalls zentral behandelt.


## 4. Zeitliche Darstellung als Timeline

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Wie sollte man ausgewählte Sessions für eine die Konferenz
sortieren und zusammenführen, damit „Mein Programm“ übersichtlich is?

**KI-Antwort, sinngemäß:**
Zuerst werden die Sessions nach Konferenztag und innerhalb eines Tages
nach Startzeit sortiert. Eine Gruppierung nach Tag macht den Ablauf
leichter lesbar. Gleichzeitig stattfindende Sessions sollten weiterhin
mit ihren tatsächlichen Zeiten angezeigt werden.

**Projektbezug / Verständnis:**
Die Timeline hilft bei der persönlichen Tagesplanung. Eine automatische
Konfliktlösung wäre eine zusätzliche Funktion und ist für die geforderte
Grundfunktion des Hinzufügens, Entfernens und Speicherns nicht notwendig.

## 5. weitere Fragen und Fehlerbehebungen werden im Hinblick auf die Länge dieses Dokumentes ausgelassen

