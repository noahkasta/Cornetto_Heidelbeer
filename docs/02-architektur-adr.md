# ADR 02: Komponenten- und Ordnerstruktur

Datum: 2026-10-13
Status: akzeptiert
Team: Cornetto Heidelbeere

## Kontext

Die Konferenz-App besteht aus fünf Seiten (Session-Übersicht, Session-Detail, Speaker-Liste, Speaker-Profil, "Mein Programm") und arbeitet mit einem festen Datensatz aus conference-data.json. Mehrere Stellen brauchen dieselbe Logik. Die Session-Karte, die Detailseite und das Dashboard müssen zum Beispiel alle wissen, ob eine Session im eigenen Programm liegt. Die Struktur muss außerdem in Schritt 2 bis 4 wachsen können, ohne dass wir sie umbauen. Dieser ADR legt fest, wie wir Komponenten ordnen und wo Logik liegt. Das Setup selbst (Nuxt) ist in ADR 04 entschieden.

## Optionen

### Ordnerstruktur

Option A: Nach Schichten, also Base, Layout und Feature. Base-Komponenten kennen nur Tokens und Props. Layout-Komponenten bauen das Seitengerüst. Feature-Komponenten gehören zu Sessions, Speakern oder dem Programm und verwenden Base-Komponenten. Die Regeln sind einfach, und man weiß sofort, wo ein neuer Baustein hingehört. Dagegen spricht, dass zusammengehörige Dateien eines Fachbereichs nicht immer nebeneinander liegen.

Option B: Feature-first, also ein Ordner pro Fachbereich (sessions, speakers, program) mit Komponenten, Logik und Typen darin. Alles zu einem Thema liegt zusammen, was bei großen Projekten hilft. Für uns wäre es mehr Struktur als nötig. Wir bräuchten zusätzlich Regeln, wo gemeinsam genutzte UI-Bausteine liegen, und wir kennen Nuxt noch zu wenig, um die Konventionen sinnvoll zu verbiegen.

### Logik

Option C: Logik direkt in den Komponenten. Das ist am schnellsten geschrieben. Die Filterlogik und der Programm-State würden aber an mehreren Stellen auftauchen, und das Teilen des Programm-States zwischen Karte, Detailseite und Dashboard wird fehleranfällig.

Option D: Logik als Composables (Headless), die Komponenten stellen nur dar. Die Logik ist testbar, einmal vorhanden und unabhängig vom Aussehen.

## Entscheidung

Wir wählen Option A für die Ordner und Option D für die Logik. Komponenten haben keine eigene Fachlogik, sie bekommen Daten und Funktionen aus Composables und zeigen sie an. Headless setzen wir gezielt bei zwei Interaktionen ein: bei der Session-Filterung (useSessionFilters) und bei "Zum Programm hinzufügen" (useMyProgram). Base-Komponenten und einfache Karten wie die Speaker-Karte bekommen keine Headless-Aufteilung, weil es dort nichts zu trennen gibt.

## Konsequenzen

Positiv: Neue Komponenten haben einen klaren Platz, die Logik liegt an einer Stelle, und die Darstellung lässt sich später austauschen, etwa für eine mobile Filteransicht. Schritt 2 bis 4 bauen auf derselben Struktur auf.

Negativ: Wir springen beim Lesen häufiger zwischen Komponente und Composable. Die Fachbereiche verteilen sich auf mehrere Ordner. Wenn das Projekt deutlich wächst, könnte Option B sinnvoll werden.

## Komponentenübersicht

Schicht Base (components/base): BaseButton, BaseBadge, BaseCard, BaseChip

Schicht Layout (components/layout): AppHeader, AppFooter, PageContainer

Schicht Feature (components/feature):
- sessions: SessionCard, SessionList, SessionFilterBar
- speakers: SpeakerCard, SpeakerProfile
- program: ProgramToggleButton, ProgramTimeline

Composables (composables): useConferenceData, useSessionFilters, useMyProgram

Seiten (pages): index (Sessions), sessions/[id], speakers/index, speakers/[id], my-program
