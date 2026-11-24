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


# Schritt PWA

## 4. Aufgaben von Service Worker und Nuxt-Plugin

**Datum:** 24.11.2026
**Tool:** ChatGPT

**Frage:**
Warum benötigen wir sowohl `public/sw.js` als auch
`app/plugins/service-worker.client.ts`? Welche Aufgabe übernimmt
welche Datei?

**KI-Antwort:**
Das Nuxt-Plugin registriert den Service Worker beim Browser.
Die Datei `sw.js` enthält dagegen die eigentliche Service-Worker-Logik.
Dort reagieren wir auf `install`, `activate` und `fetch`, speichern
Dateien und beantworten passende Anfragen aus dem Cache.
Der Service Worker läuft in einem eigenen Ausführungskontext und hat
keinen direkten Zugriff auf die Vue-Komponenten oder den DOM der Seite.

**Projektbezug / Verständnis:**
Das Plugin ist für die Registrierung zuständig. Die Caching-Regeln
stehen zentral in `sw.js`. Diese Trennung erleichtert die Abstimmung
mit Simon, der weitere Caching-Regeln für die Konferenzseiten ergänzt.


## 5. Browser-Ausführung und Entwicklungsmodus

**Datum:** 24.11.2026
**Tool:** ChatGPT

**Frage:**
Warum heißt unser Plugin `service-worker.client.ts`, und wozu
verwenden wir zusätzlich `if (import.meta.dev) return`?

**KI-Antwort:**
Die Endung `.client.ts` sorgt dafür, dass Nuxt das Plugin nur im
Browser ausführt. Dort steht `navigator.serviceWorker` zur Verfügung.
Die zusätzliche Abfrage beendet das Plugin im Entwicklungsmodus.
Dadurch wird der Worker über dieses Plugin erst im Produktions-Build
registriert. Ein bereits registrierter Worker bleibt jedoch aktiv;
die Abfrage meldet ihn nicht automatisch ab.

**Projektbezug / Verständnis:**
Wir prüfen das Caching mit `npm run build` und `npm run preview`.
So beziehen sich die Tests auf die erzeugten Produktionsdateien.
Vor der Rückkehr zur normalen Entwicklung muss ein noch aktiver
Worker gegebenenfalls im Browser abgemeldet werden.


## 6. Precaching im install-Event

**Datum:** 24.11.2026
**Tool:** ChatGPT

**Frage:**
Was bewirken `event.waitUntil()` und `cache.addAll(PRECACHE_URLS)`
in unserem install-Handler? Ist damit bereits die gesamte App offline?

**KI-Antwort:**
`cache.addAll()` lädt die aufgeführten Ressourcen und speichert ihre
Antworten im Cache. `event.waitUntil()` verknüpft diese asynchrone
Arbeit mit der Installation des Workers. Schlägt sie fehl, scheitert
die Installation dieser Worker-Version. Gespeichertes HTML allein
reicht für eine interaktive Nuxt-Seite nicht aus. Zusätzlich werden
die benötigten JavaScript-, CSS- und gegebenenfalls Payload-Dateien
benötigt. Der fetch-Handler muss passende Anfragen aus dem Cache
beantworten.

**Projektbezug / Verständnis:**
Wir speichern Startseite, Manifest und Icons vorab.
Die benötigten Nuxt-Dateien werden zusätzlich beim Online-Laden
durch den aktiven Worker gespeichert. Deshalb gehört ein erneutes
Online-Laden nach der Aktivierung zu unserem Testablauf.


## 7. Auswahl der Nuxt-Ressourcen und Cache First

**Datum:** 24.11.2026
**Tool:** ChatGPT

**Frage:**
Warum prüft unser fetch-Handler auf `/_nuxt/` und `/_payload.json`?
Was passiert danach bei einer passenden Anfrage, und warum verwenden
wir beim Speichern `response.clone()`?

**KI-Antwort:**
Nuxt legt erzeugte JavaScript- und CSS-Dateien unter `/_nuxt/` ab.
Die Pfadprüfung erfasst sie auch bei wechselnden Dateinamen.
Die zusätzliche Prüfung berücksichtigt eine ausgelagerte Payload
der Startseite. Bei einer passenden GET-Anfrage derselben Herkunft
sucht unser Handler zuerst im Cache. Bei einem Treffer liefert er die
gespeicherte Antwort aus. Andernfalls lädt er die Ressource und speichert
eine erfolgreiche Antwort. `response.clone()` stellt eine Kopie bereit,
weil der Antwortinhalt nicht unabhängig zweimal verbraucht werden kann.

**Projektbezug / Verständnis:**
Unsere Regel berücksichtigt die tatsächlichen Nuxt-Ressourcen.
Für statische App-Dateien passt Cache First, weil bereits geladene
Ressourcen ohne Netzwerk verfügbar sein sollen. Nicht gespeicherte
Ressourcen benötigen weiterhin eine Verbindung.


## 8. Cache-Versionen und gezieltes Aufräumen

**Datum:** 24.11.2026
**Tool:** ChatGPT

**Frage:**
Warum verwenden wir `cornetto-static-v2` und löschen im
activate-Handler nur andere Caches mit dem Präfix `cornetto-static-`?

**KI-Antwort:**
Der neue Name trennt diese Cache-Version von der vorherigen.
Bei Aktivierung entfernt unser Handler ältere Caches dieser
Namensfamilie. Durch die Prüfung des Präfixes bleiben andere Caches
erhalten. Eine neue Worker-Version kann zunächst im Zustand
`waiting` bleiben, solange die vorherige Version noch Seiten
kontrolliert. Das Anlegen des neuen Caches allein beweist deshalb
noch nicht, dass der neue Worker bereits aktiviert ist.

**Projektbezug / Verständnis:**
Die Bereinigung betrifft unseren statischen Cache. Spätere
Daten-Caches von Simon werden dadurch nicht versehentlich gelöscht.
Bei Tests kontrollieren wir sowohl den Cache-Inhalt als auch
die Aktivierung des Workers.

