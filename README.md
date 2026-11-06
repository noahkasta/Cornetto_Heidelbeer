# Cornetto Heidelbeere

Konferenz-App für die fiktive zweitägige Web-Frontend-Konferenz "FrontendNow" in Wien. Entstanden im Kurs Next Generation Web Frontends (FH Technikum Wien) als Teamprojekt.

Die App zeigt alle Sessions mit Filtern, Session-Detailseiten, Speaker-Profile und einen persönlichen Zeitplan ("Mein Programm"). Es gibt kein Backend: Die Daten kommen aus `data/conference_data.json`, das persönliche Programm wird im Browser (localStorage) gespeichert.

## Stand

Schritt 1 (Planung und Architekturentscheidungen): Branding, Design Tokens, Architektur-ADRs, State-Konzept und lauffähiges Grundgerüst. Features wie Filter und "Mein Programm" folgen in den nächsten Schritten. Wir haben das projekt gemeinsam aufgesetzt und während einer Discord Session zusammen erstellt, die Commit history bildet unsere gemeinsam erarbeiteten Inhalte ab.

Schritt 2 (Rendering-Strategie und Kernfunktionen): Session-Übersicht mit kombinierbaren Filtern, Detailseiten für alle 20 Sessions, Profile für alle 18 Speaker und "Mein Programm" mit Persistenz über einen Reload hinweg.

## Voraussetzungen

- Node.js 22 oder neuer (aktuelle LTS-Version empfohlen)
- npm

Mit nvm genügt im Projektordner `nvm use`, falls eine `.nvmrc` vorhanden ist.

## Setup

```bash
git clone <Repository-URL>
cd cornetto_heidelbeer
npm install
npm run dev
```

Danach läuft die App unter http://localhost:3000.

Weitere Befehle:

```bash
npm run build     # Produktions-Build (rendert Übersicht und Speaker-Seiten vor)
npm run preview   # Build lokal ansehen, http://localhost:3000
```

Im Dev-Modus (`npm run dev`) rendert Nuxt jede Seite auf Anfrage. Vorrendern und Cache greifen dort nicht. Die Rendering-Strategie sieht man nur mit `npm run build` und `npm run preview`.

## Rendering-Strategie (Schritt 2)

Pro Anwendungsteil festgelegt in [ADR Rendering-Strategie](docs/schritt2/01-rendering-strategie-adr.md), umgesetzt über `routeRules` in `nuxt.config.ts`:

| Route | Teil | Strategie | Umsetzung |
|---|---|---|---|
| `/` | Session-Übersicht mit Filtern | SSG, Filtern im Browser | `prerender: true`, `useSessionFilters()` |
| `/sessions/[id]` | Session-Details | ISR (Simulation) | `swr: 60` |
| `/speakers`, `/speakers/[id]` | Speaker-Liste und -Profile | SSG | `prerender: true`, Routen aus dem Datensatz |
| `/my-program` | Mein Programm | CSR | `ssr: false`, `useMyProgram()` mit localStorage |

ISR prüfen: Nach `npm run build` und `npm run preview` eine Detailseite direkt aufrufen (z. B. `/sessions/s05`) und neu laden. Unten steht, wann die Seite erzeugt wurde. Innerhalb von 60 Sekunden bleibt die Zeit gleich, weil die Seite aus dem Cache kommt.

## Projektstruktur

```
tokens/tokens.css          Design Tokens (primitiv und semantisch)
data/conference_data.json  Gemeinsamer Datensatz (schreibgeschützt)
docs/schritt1/             Dokumentation zu Schritt 1
docs/schritt2/             Dokumentation zu Schritt 2
app/
  pages/                   Seiten: index, sessions/[id], speakers/index, speakers/[id], my-program
  layouts/                 Seitenlayouts
  components/
    base/                  Allgemeine UI-Bausteine
    layout/                Header, Container
    feature/               Sessions, Speaker, Programm
  composables/             Logik: useConferenceData, useSessionFilters, useMyProgram
  plugins/                 my-program.client.ts (Rehydration aus localStorage)
  types/                   Typen für den Datensatz
  utils/                   Formatierung von Datum und Uhrzeit
  assets/css/              Globale Styles
```

Die Struktur folgt ADR 02. Die Komponenten stellen nur dar, die Logik liegt in den Composables.

## Dokumentation (Schritt 1)

- [Branding und Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [Architektur-ADR: Komponenten- und Ordnerstruktur](docs/schritt1/02-architektur-adr.md)
- [State-Management-Konzept](docs/schritt1/03-state-management-konzept.md)
- [Technologie-ADR: Projekt-Setup mit Nuxt](docs/schritt1/04-technologie-adr.md)

## Dokumentation (Schritt 2)

- [Rendering-Strategie-ADR](docs/schritt2/01-rendering-strategie-adr.md)
- AI-LOGs: [Leo Bürger](docs/schritt2/AI-LOG-buerger.md), [Noah Wagner](docs/schritt2/AI-LOG-wagner.md), [Simon Horn](docs/schritt2/AI-LOG-horn.md)

## Team

Team Cornetto Heidelbeere: Leo Bürger, Noah Wagner, Simon Horn

## Anpassungen 3er Team
