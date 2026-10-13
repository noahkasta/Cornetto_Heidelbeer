# ADR 04: Projekt-Setup mit Nuxt

Datum: 2026-10-13
Status: akzeptiert
Team: Cornetto Heidelbeere

## Kontext

Wir bauen eine Konferenz-App auf einem festen Datensatz mit 20 Sessions und 18 Speakern. Dafür brauchen wir mehrere Seitentypen: die Session-Übersicht mit Filtern, Session-Detailseiten, Speaker-Profile und das personalisierte Dashboard "Mein Programm". Wir haben beide kaum Erfahrung mit Vue, lernen also das Framework und das Setup gleichzeitig. In Schritt 2 und 3 kommen Rendering-Entscheidungen und eine PWA dazu. Dieser ADR betrifft nur Setup und Tooling, nicht die Rendering-Strategie.

## Optionen

Option A: Nuxt. Routen entstehen aus Dateien im Ordner pages/, wir müssen fast nichts konfigurieren. Komponenten und Composables werden automatisch importiert, und das Projekt bringt eine feste Ordnerstruktur mit. Das Szenario empfiehlt Nuxt außerdem. Dagegen spricht, dass wir mehr Konventionen lernen müssen. Auto-Imports verstecken zudem, woher ein Stück Code kommt. Nuxt führt Code auch auf dem Server aus, deshalb darf localStorage nur im Browser angesprochen werden.

Option B: Vue + Vite + vue-router. Das Setup ist schlank, hat weniger Konzepte, und wir sehen jede Verdrahtung selbst. Dafür müssten wir vue-router selbst einrichten und lernen, obwohl der Kurs es nicht behandelt, und die Ordnerstruktur komplett selbst entwerfen. Für statisch erzeugte Seiten, die in Schritt 2 relevant werden, bräuchten wir vermutlich zusätzliche Werkzeuge.

## Entscheidung

Wir verwenden Nuxt, ohne UI-Bibliothek. Das Branding soll aus unseren eigenen Design Tokens kommen, und Fertigkomponenten würden es verwässern. Den Ausschlag gibt das dateibasierte Routing. Es nimmt uns beim Einstieg Arbeit ab, und der Weg zu Schritt 2 und 3 bleibt offen.

## Konsequenzen

Wir sparen die Router-Konfiguration und starten mit einer vorgegebenen Struktur. Den Preis zahlen wir in Verständnis: Mehr passiert automatisch, und wir müssen bei Problemen erst herausfinden, was Nuxt im Hintergrund tut. Den Zugriff auf localStorage für "Mein Programm" legen wir deshalb bewusst in den Browser (onMounted oder ClientOnly). Das gehört auch ins State-Management-Konzept. Falls Nuxt uns später im Weg steht, ist ein Wechsel zu Vue + Vite aufwendig, weil Routing und Ordnerkonventionen am Framework hängen.
