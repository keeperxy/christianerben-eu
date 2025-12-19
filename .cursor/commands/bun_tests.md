Teste die Anwendung mit Bun.

Führe nacheinander folgende Schritte aus:
1. `bun run lint`
   - Analysiere alle Lint-Fehler.
   - Behebe die Fehler direkt im Code, bis der Lint-Durchlauf ohne Fehler erfolgreich ist.

2. `bun run build`
   - Analysiere alle Build-Fehler.
   - Behebe die Fehler direkt im Code, bis der Build erfolgreich durchläuft.

Wiederhole die Schritte automatisch, falls nach Fixes neue Fehler auftreten.
Am Ende müssen sowohl `bun run lint` als auch `bun run build` ohne Fehler durchlaufen.