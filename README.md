# Cornetto Heidelbeere

Konferenz-App für die fiktive zweitägige Web-Frontend-Konferenz "FrontendNow" in Wien. Entstanden im Kurs Next Generation Web Frontends (FH Technikum Wien) als Teamprojekt.

Die App soll Sessions durchsuchen und filtern, Speaker-Profile zeigen und einen persönlichen Zeitplan ("Mein Programm") bieten. Es gibt kein Backend: Die Daten kommen aus `data/conference-data.json`, das persönliche Programm wird später im Browser gespeichert.

## Stand

Schritt 1 (Planung und Architekturentscheidungen): Branding, Design Tokens, Architektur-ADRs, State-Konzept und lauffähiges Grundgerüst. Features wie Filter und "Mein Programm" folgen in den nächsten Schritten.

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

Danach läuft die App unter http://localhost:3000. Auf der Startseite stehen der Konferenzname und die Anzahl der geladenen Sessions.

Weitere Befehle:

```bash
npm run build     # Produktions-Build
npm run preview   # Build lokal ansehen
```

## Projektstruktur

```
tokens/tokens.css          Design Tokens (primitiv und semantisch)
data/conference-data.json  Gemeinsamer Datensatz (schreibgeschützt)
docs/schritt1/             Dokumentation zu Schritt 1
app/
  pages/                   Seiten (Routen entstehen aus den Dateien)
  layouts/                 Seitenlayouts
  components/
    base/                  Allgemeine UI-Bausteine
    layout/                Header, Container
    feature/               Sessions, Speaker, Programm
  composables/             Logik (useConferenceData, später useMyProgram, useSessionFilters)
  assets/css/              Globale Styles
```

Die Struktur folgt ADR 02. Komponenten stellen nur dar, Logik liegt in Composables.

## Dokumentation (Schritt 1)

- [Branding und Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [Architektur-ADR: Komponenten- und Ordnerstruktur](docs/schritt1/02-architektur-adr.md)
- [State-Management-Konzept](docs/schritt1/03-state-management-konzept.md)
- [Technologie-ADR: Projekt-Setup mit Nuxt](docs/schritt1/04-technologie-adr.md)

## Team

Team Cornetto Heidelbeere: Vorname Nachname, Vorname Nachname
