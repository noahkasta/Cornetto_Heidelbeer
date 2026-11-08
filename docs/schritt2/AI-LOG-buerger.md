# AI-LOG – Leo – Schritt 2

## 1. Kombinierbare Session-Filter

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Wie kombinierre ich Filter nach Track, Tag und Level miteinander?
Welche Verknüpfung macht sinn?

**KI-Antwort, sinngemäß:**
Bei einer UND-Verknüpfung muss eine Session alle aktiven Filter erfüllen.
Nicht gesetzte Filter schränken das Ergebnis nicht ein. Dadurch kann
eine Person beispielsweise gezielt Einsteiger-Sessions eines bestimmten
Tracks am ersten Konferenztag anzeigen lassen.

**Projektbezug / Verständnis:**
Diese Logik entspricht der geforderten Filterfunktion. Die Filter sollen
die bestehende Session-Liste einschränken und beliebig kombinierbar sein.


## 2. Filterlogik als Composable

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Warum ist es bei uns sinnvoll, die Filterlogik auszulagern und die Filterfelder woanders darzustellen?

**KI-Antwort, sinngemäß:**
Das Composable verwaltet Filterwerte und berechnet die Ergebnisliste.
Die Filterleiste stellt die Eingabefelder dar. Diese Trennung ermöglicht,
die Darstellung zu verändern, ohne die Filterlogik neu schreiben zu
müssen. Eine computed-Ableitung kann die Ergebnisliste automatisch
an Änderungen der reaktiven Filterwerte anpassen.

**Projektbezug / Verständnis:**
Damit lässt sich die Trennung von Logik und Darstellung konkret anwenden.
Die überschaubare Filterfunktion benötigt dafür keine zusätzliche State-Management-Bibliothek.


## 3. Base- und Feature-Komponenten

**Datum:** 06.11.2026
**Tool:** ChatGPT

**Frage:**
Warum sind Base-Komponenten von SessionCard und SessionList anders?
Welche Verantwortung sollte dort liegen?

**KI-Antwort, sinngemäß:**
Base-Komponenten bilden allgemeine Oberflächenelemente wie Buttons
oder Auswahlfelder ab. Sie kennen keine Konferenzdaten.
SessionCard stellt eine Session dar; SessionList organisiert mehrere
Karten und kann beispielsweise einen Hinweis bei leerer Liste anzeigen.

**Projektbezug / Verständnis:**
Allgemeine Gestaltung und Bedienung können zentral umgesetzt werden.
Konferenzspezifische Inhalte bleiben in den Feature-Komponenten.
Die Design-Tokens aus Schritt 1 unterstützen dabei einheitliches Styling.

## 4. weitere Fragen und Fehlerbehebungen werden im Hinblick auf die Länge dieses Dokumentes ausgelassen

