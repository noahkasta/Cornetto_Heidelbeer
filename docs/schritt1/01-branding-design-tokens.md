# 01 – Branding & Design Tokens

**Team:** Cornetto Heidelbeere
**Plattform:** Konferenz-App für die fiktive Web-Frontend-Konferenz „FrontendNow“

## Markenkonzept

Cornetto Heidelbeere macht aus dem Konferenzprogramm einen verlässlichen Begleiter, der sich anfühlt wie ein Eis zwischen zwei Vorträgen: frisch, kompakt und ohne Aufwand. Statt nüchterner Tabellen setzen wir auf kräftige Heidelbeer-Töne, eine cremige Basis und einen Chartreuse-Akzent, der Wichtiges wie das eigene Programm sofort sichtbar macht. Dazu kommen klare Kontraste und eine Oberfläche, die auch im abgedunkelten Saal und bei schlechtem WLAN funktioniert.

## Farbpalette (primitive Tokens)

| Token | Hex | Verwendung |
|---|---|---|
| `blueberry-500` | `#464196` | Hauptfarbe |
| `ink-900` | `#1E1B3A` | Fließtext |
| `cream-50` | `#FFF8EA` | Seitenhintergrund |
| `lavender-100` | `#EEEBFF` | Karten, Hover-Flächen |
| `chartreuse-400` | `#C8F03C` | Signalfarbe, nur als Fläche |
| `waffle-300` | `#F2C27A` | Warmer Zweitakzent |
| `cyan-700` | `#0E7490` | Links |
| `berry-600` | `#C2185B` | Fehler und Hinweise |
| `muted-600` | `#5B5878` | Sekundärtext |

Alle Text/Hintergrund-Paare wurden nach WCAG 2.1 auf AA geprüft, die Werte stehen als Kommentare in `tokens/tokens.css`. Die einzige Kombination, die durchfällt, ist Chartreuse auf Cream (1,2:1). Sie ist deshalb nur als Fläche mit dunklem Text oder auf dunklem Grund erlaubt.

## Begründung der Token-Architektur

Unsere Tokens sind in zwei Schichten aufgebaut. Die **primitiven Tokens** halten Rohwerte, etwa `--blueberry-500: #464196` oder `--space-4: 1rem`, und benennen nur, was etwas *ist*. Die **semantischen Tokens** wie `--color-surface`, `--color-text-primary` oder `--color-accent` benennen, *wofür* ein Wert dient, und verweisen auf primitive Tokens. Komponenten dürfen ausschließlich semantische Tokens verwenden. Wir haben diese Architektur nach vier Kriterien gewählt.

**Wartbarkeit.** Jeder Rohwert steht genau einmal in der Datei. Wenn wir das Blau anpassen, ändern wir eine Zeile, und alle Stellen, die `--color-primary` nutzen, folgen automatisch. Mit direkten Hex-Werten in den Komponenten müssten wir jede Verwendung einzeln suchen.

**Theming-Erweiterbarkeit.** Ein späterer Dark Mode soll ohne Strukturbruch möglich sein. Weil Komponenten nur semantische Namen kennen, genügt es, die semantischen Tokens in einem zweiten Theme neu zuzuordnen, zum Beispiel `--color-surface` von Cream auf Ink. Komponenten und primitive Tokens bleiben unverändert. Wir haben diese Struktur vorbereitet und im Stylesheet kommentiert, aber bewusst noch keine Dark-Mode-Palette umgesetzt.

**Konsistenz.** Spacing und Typografie folgen festen Skalen (4px-Raster, Größenverhältnis 1,25). Dadurch gibt es keine Zufallswerte wie 13px oder 17px, und Abstände und Schriftgrößen wirken über alle Seitentypen einheitlich, also Übersicht, Detailseiten und „Mein Programm“.

**Barrierefreiheit.** Weil Text- und Hintergrundfarben als feste semantische Paare definiert sind, haben wir jede Kombination einmal geprüft und dokumentiert. Die Regel für Chartreuse steckt im Token `--color-on-accent`, sodass sie nicht in jeder Komponente neu bedacht werden muss.

**Verworfene Alternative: flache Tokens.** Wir haben auch erwogen, nur eine Ebene zu verwenden, also direkt `--color-blue` im Einsatz. Das wäre schneller aufgesetzt, koppelt aber den Namen an den Wert. Bei einem Theme-Wechsel müssten wir entweder Namen ändern oder Komponenten anfassen, was die Konsistenz gefährdet. Der Mehraufwand von zwei Schichten ist klein, der Nutzen für die späteren Schritte groß.

## Tokens-Datei

Die vollständigen Tokens liegen in `tokens/tokens.css` (Farben, Spacing-Skala, Typografie-Skala, Radien, semantische Zuordnung).
