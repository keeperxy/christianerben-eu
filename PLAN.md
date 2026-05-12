# Repo-Lokaler Skill: christianerben-dependency-release

## Summary

- Einen repo-lokalen Codex-Skill unter `.codex/skills/christianerben-dependency-release/` erstellen.
- Der Skill aktualisiert alle Packages inklusive Major-Updates, bricht ohne verfuegbare Updates frueh ab, erstellt Vorher/Nachher-Screenshots aller Pages, vergleicht sie visuell tolerant, fixt Fehler selbststaendig und fuehrt anschliessend PR-, Merge- und Vercel-Deployment-Pruefungen durch.
- Vercel-Guard: akzeptiert das aktuell gefundene Team `Christian's projects` / `christians-projects-693c521b` mit Projekt `christianerben-eu` (`prj_0P9YPvnH3AoHjgps5Sady3gnc3IW`).

## Key Changes

- Skill per `skill-creator` initialisieren:
  - Name: `christianerben-dependency-release`
  - Pfad: `.codex/skills`
  - Ressourcen: `scripts,references`
  - `agents/openai.yaml` mit passendem Display-Namen und Default-Prompt generieren.
- `SKILL.md` enthaelt die verbindliche End-to-End-Prozedur:
  - Preflight: sauberen Worktree pruefen, von `development` starten, `origin/development` aktualisieren, GitHub/Vercel Auth pruefen.
  - Updates pruefen mit Bun; wenn keine Updates vorhanden sind, ohne Branch, Screenshots oder PR abbrechen.
  - Branch `codex/update-dependencies-<timestamp>` erstellen.
  - Baseline-Screenshots vor Updates aufnehmen.
  - Updates mit Bun auf `latest` durchfuehren, Lockfile und `package.json` aktualisieren.
  - `bun run lint`, `bun run test`, `bun run build` ausfuehren.
  - Bei Fehlern selbststaendig reparieren und die Pruefungen wiederholen.
  - Dev-Server neu starten und Nachher-Screenshots aufnehmen.
  - Screenshots tolerant vergleichen: keine blank/error pages, keine groben Layout-Brueche, keine unerwarteten Console-/HTTP-Fehler; kein pixelgenauer Vergleich.
  - PR gegen `development` erstellen, Self-Review durchfuehren, Checks pruefen und erst danach mergen.
- `references/repo-workflow.md` dokumentiert die projektspezifischen Konstanten:
  - Repo: `/home/coach007/dev/sites/christianerben-eu`
  - Branches: `development -> preproduction -> main`
  - Pages fuer Screenshots: `/`, `/cv`, `/imprint`, `/privacy`, `/sitemap`, `/404`
  - Commands: `bun run dev`, `bun run lint`, `bun run test`, `bun run build`
  - Pre-commit-Hook-Hinweis: `.githooks/pre-commit` laeuft nur auf Branch `development`; der Skill muss vor dem finalen Development-Merge die generierten Commands explizit auf dem PR-Branch ausfuehren und beim finalen lokalen Merge auf `development` den echten Hook ausfuehren.
- Skill-Scripts ergaenzen:
  - Page-Discovery/Capture-Script fuer Next Pages Router, Screenshots in `.artifacts/dependency-update-release/<run-id>/`.
  - Vergleichs-Script mit tolerantem visuellen Report und Exit-Code fuer Pass/Fail.
  - Vercel-Polling-Anleitung im Skill: nach Pushes bis zu 5 Minuten pollend auf `READY` warten, bei `ERROR`/`CANCELED` Logs holen und selbst fixen.

## Merge & Deployment Flow

- PR immer gegen `development`.
- Vor dem finalen Merge:
  - PR-Branch ist gruen: Tests, Build, Screenshots, Self-Review.
  - Lokales `development` aktualisieren.
  - PR-Branch lokal in `development` mergen.
  - `.githooks/pre-commit` auf dem echten `development`-Branch ausfuehren.
  - Falls dadurch Dateien entstehen oder geaendert werden, diese in den Merge-Commit aufnehmen.
  - `development` pushen.
- Danach mit Vercel pruefen:
  - Deployment fuer `development` suchen und bis `READY` pollend warten.
  - Dann `preproduction` aktualisieren, `development` mergen, pushen, Vercel-Deployment pruefen.
  - Dann `main` aktualisieren, `preproduction` mergen, pushen, Vercel-Deployment pruefen.
- Bei Deployment-Fehlern:
  - Build Logs ueber den Vercel-Connector holen.
  - Fehler lokal fixen.
  - Tests/Build/Screenshots wiederholen.
  - Flow an der fehlgeschlagenen Stelle fortsetzen.
- Bekannter aktueller Risikopunkt: `scripts/vercel-deploy-check.sh` wirkt invertiert, weil erlaubte Branches aktuell mit `exit 1` enden; falls Vercel daran scheitert, soll der Skill das als reparierbaren Repo-Fehler behandeln.

## Test Plan

- Skill-Struktur mit `quick_validate.py .codex/skills/christianerben-dependency-release` validieren.
- Route-Discovery-Script gegen das aktuelle Repo testen und sicherstellen, dass nur echte Pages und keine API-Routen gescreenshotet werden.
- Screenshot-Script trocken gegen einen lokalen Dev-Server testen; Artefakte muessen ausschliesslich unter `.artifacts/` liegen und untracked/ignored bleiben.
- Vergleichs-Script mit identischen Screenshots und einem absichtlich kaputten Screenshot pruefen.
- Skill-Anleitung manuell gegen die Repo-Regeln querlesen: Bun, Branch-Reihenfolge, Pre-commit-Hook, Vercel-Team/Projekt, PR-Ziel `development`.

## Assumptions

- Ablage ist repo-lokal, wie gewaehlt; falls repo-lokale Skills nicht automatisch geladen werden, wird der Skill per explizitem Pfad nutzbar sein.
- Update-Strategie ist "alle Updates", inklusive Major-Versionen.
- Review bedeutet Self-Review durch den Agenten, nicht menschliche Reviewer anfordern.
- Screenshot-Artefakte werden nie committed und am Ende geloescht.
