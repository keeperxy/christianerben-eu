# Änderungsprotokoll

Alle bedeutsamen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unveröffentlicht]

### Added (Neu hinzugefügt)
- Neue DEGIT-AG-Erfahrung zur KI-Trainingsplattform und Evaluierung von KI-Werkzeugen ergänzt

### Changed (Geändert)
- Profil-, About- und Projektbilder auf WebP umgestellt für schnellere Ladezeiten

### Technical (Technisch)
- Alle Dependencies auf neueste Versionen aktualisiert (außer Major Updates) mit npm
- Frontend auf Next.js 16 mit Bun-Toolchain und Tailwind CSS 4 umgestellt (statt Vite/React Router)

### Fixed (Behoben)
- Initiale Sprachauswahl zwischen Server und Client angeglichen, um Hydration-Mismatches bei lokalisierten Überschriften zu vermeiden
- Positionierung der Hero-Badges wieder auf das gewünschte Layout zurückgesetzt
- Vitest-Testdateien aus `src/pages` entfernt, damit der Next.js-Build nicht fehlschlägt
- Seiten-Dateinamen auf Kleinbuchstaben vereinheitlicht, um 404er auf case-sensitiven Deployments zu vermeiden
- Standard-Seitentitel hinzugefügt für konsistentes SEO-Meta
- Absender des Kontaktformulars auf `Kontaktformular <website@christianerben.eu>` für Resend gesetzt

## [0.1.0] – 2025-10-30

### Added (Neu hinzugefügt)
- CV-Erstellungsfunktionalität mit PDF- und DOCX-Unterstützung
- E-Mail-Versandfunktionalität mit Payload-Validierung
- CV-Editor-Modus erreichbar über 7-Klick-Interaktion
- Mehrsprachige Unterstützung (Englisch und Deutsch) für CV-Dokumente
- Dynamische Profilbildbehandlung bei der CV-Erstellung
- .cursorignore-Konfigurationsdatei
- shadcn-ui-Component-Library-Integration
- Supabase-Integration für Backend-Services
- LLMs.txt-Generierungsscript für KI-Dokumentation
- Sitemap-Generierung mit Pre-Commit-Hook

### Changed (Geändert)
- SkillsSection-Component überarbeitet mit react-icons-Paket
- Dokumenten-Generierungslogik für bessere Wartbarkeit aktualisiert
- Verbessertes Datumsformat für CV-Download-Buttons für Konsistenz
- Letztes Aktualisierungsdatum in den Site-Inhalten

### Fixed (Behoben)
- Anpassung des Abstands zu dekorativen Elementen und Sidebar-Breite im CV-Layout
- Kontakt-E-Mail und LinkedIn-Profil-URL aktualisiert
- Cloudflare Pages Deployment-Konfiguration

## [0.0.1] – 2025-10-13

### Added (Neu hinzugefügt)
- Initialer Portfolio-Website-Setup
- Hero-Section mit Profilbild und animierten dekorativen Elementen
- About-Section mit persönlicher Einführung
- Experience-Section mit Timeline-Ansicht
- Projects-Section mit ausgewählten Arbeiten
- Skills-Section mit technischen Kompetenzen
- Contact-Section mit E-Mail-Formular
- CV-Seite mit Multi-Format-Download (PDF, DOCX)
- Theme-Switcher (Hell/Dunkel-Modus)
- Sprach-Switcher (Englisch/Deutsch)
- Responsive Navigations-Header
- Footer mit Social-Links
- Impressum und Datenschutz-Seiten
- Sitemap-Seite für SEO
- Projekt-Screenshots
- Favicon und Site-Icons

### Changed (Geändert)
- Branding aktualisiert auf christianerben.eu Domain
- Site-Inhalte mit Stakeholder-Kommunikations-Skills verfeinert
- Persönliche Informationen aktualisiert
- Veraltetes SOC2-Zertifizierungsbild entfernt
- US-Flagge durch CE-Custom-Image ersetzt
