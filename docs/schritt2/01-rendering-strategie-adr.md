# 01 – Rendering-Strategie (ADR)

Team: Cornetto Heidelbeere (Leo, Simon, Noah)
Datum: 06.11.2026

## Einleitung

Federführend: Noah, Review: Simon

Ohne weitere Angaben rendert Nuxt jede Seite auf dem Server. Wir legen stattdessen für jeden Anwendungsteil fest, wie gerendert wird, und setzen das über routeRules in nuxt.config.ts um. Vier Kriterien entscheiden. Ändert sich der Inhalt zur Laufzeit? Sieht jede Person etwas anderes? Muss die Seite ohne JavaScript lesbar und als Link teilbar sein? Wie viel Aufwand und wie viele Fehlerquellen bringt die Strategie für uns mit? Die Daten kommen aus einer JSON-Datei, die beim Build eingebunden wird. Ein Backend gibt es nicht. Wir bauen mit npm run build und starten den Node-Server von Nitro. Dadurch können SSG, SSR, eine ISR-Simulation und CSR nebeneinander laufen.

## Punkt 1: Speaker-Profile (/speakers, /speakers/[id])

Federführend: Simon, Review: Leo

### Kontext

Ein Profil zeigt Name, Titel, Firma, Bio und die Sessions der Person. Diese Angaben stehen vor der Konferenz fest und ändern sich während der zwei Tage nicht. Es gibt 18 Profile, und ihre IDs kennen wir schon beim Build. Profile werden auch von außen aufgerufen, etwa wenn jemand den Link zu einer Speakerin teilt.

### Optionen

SSG: Alle 18 Seiten entstehen beim Build als fertiges HTML. Sie laden schnell, kosten pro Aufruf keine Rechenzeit und lassen sich in Schritt 3 einfach offline cachen.

SSR: Jede Anfrage rendert die Seite neu. Das hilft nur, wenn sich Profile ändern, und kostet bei jedem Aufruf Serverzeit.

CSR: Der Browser baut die Seite selbst. Ohne JavaScript bleibt sie leer, und Suchmaschinen sehen keinen Inhalt.

### Entscheidung

Speaker-Liste und Profile werden statisch erzeugt (SSG). In nuxt.config.ts stehen dafür prerender-Regeln. Die 18 Routen erzeugen wir aus dem Datensatz, damit keine fehlt.

### Konsequenzen

Die Seiten sind schnell und brauchen keine Server-Logik. Ändert sich eine Bio, ist ein neuer Build nötig. Das nehmen wir hin, weil es bei einer Konferenz selten vorkommt. Ein Profil enthält auch die Sessions mit dem Button für „Mein Programm“. Im statischen HTML steht dieser Button immer auf „hinzufügen“. Den echten Zustand zeigt er erst, wenn der Browser localStorage gelesen hat. Dieses kurze Umspringen akzeptieren wir.

## Punkt 2: Session-Detailseiten (/sessions/[id])

Federführend: Simon, Review: Noah

### Kontext

Eine Detailseite zeigt Titel, Abstract, Tag, Zeit, Raum, Track, Level, Format und die Speaker. Anders als bei den Profilen kann sich hier während der Konferenz etwas ändern. Ein Vortrag wird verschoben, ein Raum getauscht, jemand sagt ab. Wer die Seite aufruft, sollte den neuen Stand bald sehen. Gleichzeitig öffnen kurz vor Beginn viele Menschen dieselbe Seite.

### Optionen

SSG: Am schnellsten, aber jede Änderung am Zeitplan braucht einen neuen Build und ein neues Deployment.

SSR: Jede Anfrage rendert mit den aktuellen Daten. Die Seite ist immer aktuell, belastet den Server aber genau dann, wenn alle gleichzeitig nachsehen.

ISR: Die Seite wird gecacht und nach einer festen Zeit im Hintergrund neu erzeugt. Besucher bekommen sofort eine Antwort, die höchstens diese Zeit alt ist.

### Entscheidung

Wir verwenden ISR mit 60 Sekunden. Die Nuxt-Regel isr funktioniert nur auf Plattformen wie Vercel oder Netlify. Auf unserem Node-Server simulieren wir sie mit der Regel swr: 60. Nitro liefert dann die gecachte Seite aus und rendert sie nach Ablauf im Hintergrund neu. Jede Detailseite zeigt, wann sie erzeugt wurde. So lässt sich das Verhalten prüfen.

### Konsequenzen

Der Mechanismus steht, veränderliche Daten gibt es aber noch nicht. Die JSON-Datei ist in den Build eingebunden. Eine neu gerenderte Seite zeigt also denselben Inhalt mit neuem Zeitstempel. Für echte Aktualität müsste useConferenceData() die Daten zur Laufzeit laden. Weil alle Seiten nur über dieses Composable zugreifen, betrifft das eine Datei. Im Dev-Modus gibt es keinen Cache, getestet wird mit npm run build und npm run preview.

## Punkt 3: Session-Übersicht mit Filtern (/)

Federführend: Leo, Review: Simon

### Kontext

Die Übersicht zeigt alle 20 Sessions. Man kann nach Tag, Track und Level filtern, die Filter gelten gemeinsam (UND). Die Liste ist für alle Besucher gleich. Nur die Filterauswahl unterscheidet sich und ändert sich ständig. Bei 20 Einträgen ist Filtern im Browser keine Frage der Leistung.

### Optionen

SSG mit Filtern im Browser: Die ungefilterte Liste wird beim Build vorgerendert. Danach filtert ein Composable ohne neue Anfrage.

SSR mit Filtern im URL-Query: Der Server rendert jede Kombination, etwa /?track=ai-dx, als eigene Seite. Gefilterte Ansichten ließen sich teilen, aber jede Änderung wäre eine Anfrage an den Server.

CSR: Die Seite entsteht erst im Browser. Das ist einfach, aber ohne JavaScript bleibt sie leer, und der erste Inhalt erscheint später.

### Entscheidung

Wir rendern die Übersicht statisch und filtern im Browser. Die Logik steckt in useSessionFilters(), die Filterleiste zeigt nur an (ADR 02 aus Schritt 1). Der Filterzustand liegt in useState. Er bleibt dadurch erhalten, wenn man zu einer Detailseite und zurück wechselt.

### Konsequenzen

Die Seite ist sofort da, und Filtern reagiert ohne Verzögerung. Gefilterte Ansichten lassen sich nicht als Link teilen. Wollen wir das später, müssen wir die Filter in den URL-Query schreiben und dabei Hydration-Fehler mit dem vorgerenderten HTML vermeiden. Eine Unstimmigkeit nehmen wir bewusst in Kauf: Die Übersicht ist statisch, die Detailseiten nutzen ISR. Ändert sich eine Startzeit, zeigt die Übersicht bis zum nächsten Build den alten Wert. In der Simulation hat das keine Folgen. Mit echten Live-Daten würden wir auch die Übersicht auf swr umstellen.

## Punkt 4: „Mein Programm“ (/my-program)

Federführend: Noah, Review: Leo

### Kontext

Das Dashboard zeigt die Sessions, die sich eine Person gemerkt hat. Laut State-Konzept speichern wir dafür nur Session-IDs in localStorage unter dem Schlüssel cornetto-my-program-v1. localStorage gibt es nur im Browser. Der Server weiß also nicht, was jemand gemerkt hat, und jeder Besucher sieht etwas anderes.

### Optionen

CSR: Die Seite wird nur im Browser gerendert. Der Server liefert eine leere Hülle, danach liest useMyProgram() die IDs und zeigt die Sessions an.

SSR mit späterem Befüllen: Der Server rendert die Seite mit leerem Programm, der Browser ergänzt danach den gespeicherten Stand. Das HTML vom Server zeigt dann „noch keine Sessions“, also einen falschen Zwischenstand.

SSG: Dasselbe Problem wie bei SSR, nur schon beim Build. Persönliche Inhalte lassen sich nicht vorab erzeugen.

### Entscheidung

Wir rendern „Mein Programm“ nur im Browser (CSR), über die Regel ssr: false. Bis die gespeicherten IDs gelesen sind, zeigt die Seite „Programm wird geladen“.

### Konsequenzen

Es gibt keinen Hydration-Konflikt, weil der Server nichts rendert, was der Browser ändern müsste. Ohne JavaScript bleibt die Seite leer. Für eine persönliche Merkliste ist das vertretbar, Suchmaschinen müssen sie nicht finden. Auf den anderen Seiten bleibt der Button zum Hinzufügen serverseitig gerendert. Ein Client-Plugin liest den gespeicherten Stand erst, wenn die Seite fertig hydriert ist. Für Schritt 3 heißt das: Der Service Worker muss die App-Hülle cachen, sonst ist das Programm offline nicht erreichbar.

## Nachträge aus der Umsetzung

06.11.2026: Die Rehydration lief zuerst im Hook app:mounted. Gespeicherte Programme führten dadurch auf vorgerenderten Seiten zu Hydration-Warnungen, weil Nuxt die Seite zu diesem Zeitpunkt noch nicht fertig hydriert hatte. Wir nutzen deshalb onNuxtReady. An den Entscheidungen oben ändert das nichts.
