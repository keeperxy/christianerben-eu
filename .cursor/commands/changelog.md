## Änderungen im Changelog eintragen

### Mehrsprachige Changelog-Struktur:
- **CHANGELOG.md** – Englische Hauptversion (Standard)
- **CHANGELOG_DE.md** – Deutsche Übersetzung (nice to have)

### Für neue Änderungen in der Entwicklung:
Füge neue Einträge unter dem Abschnitt `[Unreleased]` (EN) / `[Unveröffentlicht]` (DE) hinzu.  
Verwende folgende Kategorien:

- **Added** – Neue Features  
- **Changed** – Geänderte bestehende Funktionalität  
- **Deprecated** – Bald entfernte Features  
- **Removed** – Entfernte Features  
- **Fixed** – Fehlerbehebungen  
- **Security** – Sicherheitsrelevante Änderungen  
- **Technical** – Technische Änderungen / Abhängigkeiten  

Halte die Einträge **kurz, aber aussagekräftig**.

---

### Beim Veröffentlichen einer Version:
- Wandle `[Unreleased]` in eine Versionsnummer mit heutigem Datum um,  
  z. B. `[1.0.0] – 2024-01-20`
- Erstelle anschließend oben im Dokument einen neuen leeren Abschnitt `[Unreleased]`.
- **Wichtig**: Aktualisiere beide Dateien (EN + DE) synchron!

---

## Allgemeine Regeln

- Neueste Änderungen stehen **immer oben**.  
- Versionen werden **absteigend** sortiert (neu → alt).  
- Ähnliche Änderungen werden **unter derselben Kategorie** gruppiert.  
- Verwende **Aufzählungspunkte** für jede Änderung.  

---

## Entwicklungs-Workflow

### Für jede Code-Änderung:
1. Immer einen Eintrag im `[Unreleased]`-Abschnitt (EN) hinzufügen.  
2. Optional: Entsprechenden Eintrag im `[Unveröffentlicht]`-Abschnitt (DE) hinzufügen.  
3. Klare, beschreibende Änderungsnotizen schreiben.  
4. Änderungen nach den obigen Kategorien einordnen.  
5. Aussagekräftige Commit-Nachrichten verwenden.  

### Für Version-Releases:
1. `[Unreleased]`-Änderungen in einen neuen Versionsabschnitt verschieben (mit Datum).  
2. **Beide Dateien** (EN + DE) synchron aktualisieren.  
3. Versionsnummer in `ProjectSettings.asset` (`bundleVersion`) aktualisieren.  
4. Git-Tag für die Version erstellen.  
5. Einen neuen leeren Abschnitt `[Unreleased]` oben anlegen.

---

## Release-Prozess

1. **Änderungen prüfen:**
   - Alle Einträge unter `[Unveröffentlicht]` durchgehen.
   - Korrekte Kategorisierung und Vollständigkeit prüfen.

2. **Versionsnummer bestimmen:**
   - Neue Features → Minor erhöhen (z. B. 0.1.0 → 0.2.0)
   - Bugfixes → Patch erhöhen (z. B. 0.1.0 → 0.1.1)
   - Breaking Changes → Major erhöhen (z. B. 0.1.0 → 1.0.0)

3. **Dateien aktualisieren:**
   - `[Unreleased]` in neuen Versionsabschnitt mit Datum verschieben (EN).
   - `[Unveröffentlicht]` in neuen Versionsabschnitt mit Datum verschieben (DE).
   - Neuen leeren `[Unreleased]`-Abschnitt oben anlegen (beide Dateien).

4. **Commit und Tag:**
   - Commit mit Nachricht `release: Version X.Y.Z`
   - Git-Tag erstellen (`v0.2.0` o. ä.)
