---
name: christianerben-update
description: Check whether this `christianerben-eu` portfolio has outdated Bun dependencies first, and only if updates exist create a dedicated update branch, run `bun update --latest`, refresh the lockfile, capture before-and-after screenshots of every user-facing route in `src/pages`, compare the screenshots, diagnose large visual diffs, fix any regressions, and open a pull request against `development`.
---

# Christianerben Update

## Overview

Keep dependency upgrades in this repository safe by checking for outdated packages before doing any heavy work. If `bun outdated` shows no actionable updates, stop immediately and skip branch creation, screenshots, and PR work. Only run the screenshot-first workflow when there is a real dependency change to validate.

## Workflow

1. Check `git status --short` before changing dependencies. Stop only if unrelated local changes would make the update result or screenshot baseline ambiguous.
2. Run `bun outdated --no-progress` from the repository root before creating a branch or taking screenshots.
3. If `bun outdated` reports no outdated dependencies, stop immediately and report that no update run is needed. Do not create a branch, do not capture screenshots, and do not open a PR.
4. Create a dedicated branch only after confirming that updates exist. Use a clear name such as `codex/christianerben-update-2026-04-17` or `codex/christianerben-update-next-react`.
5. Read [`./references/project-routes.md`](references/project-routes.md) from this skill folder when the current route inventory matters.
6. Derive the current route list with `scripts/discover_routes.py` instead of hardcoding routes when there is any doubt.
7. Ensure browser tooling exists. If Playwright Chromium is missing, run `bunx playwright install chromium`.
8. Start the local site from the repository root with `bun run dev` on port `3000`. Use `http://localhost:3000` for screenshots so Next.js dev-mode origin checks stay quiet.
9. Capture baseline screenshots with `scripts/capture_screenshots.py`. Default to both `desktop` and `mobile` modes unless the request explicitly narrows the scope.
10. Run `bun update --latest` from the repository root. Use Bun for dependency upgrades and let it update `package.json` and `bun.lock`.
11. Run follow-up validation immediately after the update:
   - `bun run lint`
   - `bun run test`
   - `bun run build`
12. Restart the app if the update invalidated the current dev server, then capture a fresh `after` screenshot set with the same routes and modes.
13. Compare the two screenshot sets with `scripts/compare_screenshots.py`. Read the JSON summary and inspect the generated diff overlays.
14. Treat large diffs as bugs. Identify the affected route, inspect the owning page/component pair, determine the root cause, and implement the smallest viable fix.
15. Re-run the relevant checks and recapture screenshots until the remaining diffs are understood and acceptable.
16. Stage only the relevant files, create a focused commit, and push the branch once the update, tests, build, and screenshot comparison are all green.
17. Open a pull request from the update branch into `development`. The PR body should summarize the updated packages, validation steps, screenshot comparison result, and any fixes or pins that were required.

## Route Rules

- Capture every user-facing route that maps to a page file in `src/pages`.
- Include `/`, `/cv`, `/imprint`, `/privacy`, `/sitemap`, and `/404` unless the page inventory changes.
- Exclude `src/pages/api/**`, `_app`, `_document`, and non-HTML generated assets such as `/sitemap.xml`, `/llms.txt`, and files under `public/cv/`.
- Prefer `scripts/discover_routes.py --json` over manual lists if new files were added under `src/pages`.

## Visual Diff Rules

- Treat screenshots as mandatory only when dependencies were actually updated in this repository.
- Keep the environment stable across captures: same base URL, same browser, same color scheme, same locale, same wait time.
- Use the same route inventory for both passes. Do not silently skip a broken route on the second pass.
- Prefer `desktop,mobile` as the default mode set, because layout regressions often only appear on one breakpoint.
- Use the diff overlay to localize changes before editing code.
- Re-run the screenshot capture after each fix. Do not trust a visual spot-check of the browser alone.

## Diagnosing Regressions

- Map each failing screenshot back to its page file under `src/pages` and the components rendered by that page.
- Check runtime and build errors first when a page is obviously broken.
- Look for likely upgrade-sensitive areas in this repo:
  - Next.js, React, or router behavior
  - Tailwind or typography spacing changes
  - Radix UI primitives and class composition
  - lazy-loaded sections on `/`
  - theme or locale defaults that affect rendering
- Keep fixes narrow and directly tied to the regression. Do not fold unrelated refactors into an update pass.
- If a dependency is incompatible and the breakage is not worth a larger refactor, pin or selectively downgrade only the offending package and document the reason.

## Commands

```bash
git status --short
bun outdated --no-progress

# Stop here if no outdated dependencies are reported.

git switch -c codex/christianerben-update-2026-04-17

python3 .codex/skills/christianerben-update/scripts/discover_routes.py --json

python3 .codex/skills/christianerben-update/scripts/capture_screenshots.py \
  --base-url http://localhost:3000 \
  --output-dir .artifacts/update-checks/2026-04-17/before \
  --modes desktop,mobile

bun update --latest
bun run lint
bun run test
bun run build

python3 .codex/skills/christianerben-update/scripts/capture_screenshots.py \
  --base-url http://localhost:3000 \
  --output-dir .artifacts/update-checks/2026-04-17/after \
  --modes desktop,mobile

python3 .codex/skills/christianerben-update/scripts/compare_screenshots.py \
  .artifacts/update-checks/2026-04-17/before \
  .artifacts/update-checks/2026-04-17/after \
  --diff-dir .artifacts/update-checks/2026-04-17/diff

git add package.json bun.lock src next.config.mjs
git commit -m "chore: update bun dependencies"
git push -u origin codex/christianerben-update-2026-04-17
gh pr create --base development --head codex/christianerben-update-2026-04-17 \
  --title "chore: update bun dependencies" \
  --body "Update Bun dependencies to latest versions, include the validation commands that passed, summarize the screenshot comparison result, and note any fixes or pins that were required."
```

## Bundled Resources

- Read [`./references/project-routes.md`](references/project-routes.md) for the current route inventory and repo-specific exclusions.
- Use `scripts/discover_routes.py` to derive the screenshot route list from `src/pages`.
- Use `scripts/capture_screenshots.py` to create stable Playwright screenshots for each route and viewport mode.
- Use `scripts/compare_screenshots.py` to quantify differences, emit diff overlays, and fail fast on large regressions.
