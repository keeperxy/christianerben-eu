---
name: christianerben-dependency-release
description: End-to-end dependency update and release workflow for the christianerben-eu Next.js portfolio. Use when asked to update all packages, including major versions, verify the portfolio visually with screenshots, create a PR against development, merge through development to preproduction to main, and check Vercel deployments for this repository.
---

# Christianerben Dependency Release

Use this skill to perform a full dependency release for `/dev/sites/christianerben-eu`. Keep the workflow conservative: update everything only when updates exist, verify locally and visually, then promote through the configured branch chain with Vercel checks at each stage. A request to execute this skill fully authorizes the complete repository workflow described here; do not stop after the package update or PR creation.

Read `references/repo-workflow.md` before starting. Use the bundled Playwright Test workflow for page discovery, stable baseline snapshots, and tolerant visual comparison. When the invocation names `$git-code-review-autopilot` or `$internal-pages-upload`, read and follow those installed skills at their handoff points; their current instructions remain authoritative.

## Preflight

1. Work from `~/dev/sites/christianerben-eu`.
2. Require a clean worktree except for files explicitly related to this release. If unrelated changes exist, stop and ask before continuing.
3. Start from `development`, update it from `origin/development`, and verify GitHub and Vercel auth before making changes.
4. Check for available updates with Bun. If no package updates are available, stop early without creating a branch, screenshots, or PR.
5. Create `codex/update-dependencies-<timestamp>` from updated `development`.

## Local Update Flow

1. Ensure the exact local Playwright dependency and Chromium are available:

```bash
bun install --frozen-lockfile
bunx --no-install playwright install chromium
```

2. Store stable baseline snapshots. Playwright starts and stops a fresh local Next.js server for this phase:

```bash
bun run visual:baseline --artifact-dir .artifacts/dependency-update-release/<run-id>
```

3. Update all dependencies and devDependencies to `latest` with Bun, including major versions. Update both `package.json` and `bun.lock`.
4. Run and repeat until green:

```bash
bun run check
```

This is the full quality gate (lint, typecheck, tests, async leak detection, generated artifact verification, production build). Screenshot capture and comparison remain a separate, additional visual gate; `bun run check` does not replace them.

5. Fix failures autonomously when they are caused by the update. Keep fixes scoped.
6. Compare the updated site with the stored baseline. Playwright starts another fresh local Next.js server:

```bash
bun run visual:compare --artifact-dir .artifacts/dependency-update-release/<run-id>
```

7. The visual commands use the exact pinned `@playwright/test` version, four workers, desktop/mobile projects, full-page screenshots, font and visible-image waits, reduced motion, disabled animations, fixed locale/timezone/device scale, and two consecutive stable screenshots. They reject missing baselines and route-set drift before starting Playwright.
8. Treat blank pages, Next error pages, severe layout collapse, unexpected browser console errors, request failures, HTTP failures, or a visual delta above the configured tolerance as blockers. Do not require pixel-perfect equality. Playwright retains its JSON report, traces, actual images, and diffs under the run artifact directory when applicable.

## Relevant Update Follow-Up

After dependency updates are known and before opening the PR, review upstream release notes, changelogs, migration guides, and official documentation for the changed packages. Focus on new features, framework capabilities, security or performance options, deprecations, and config changes that are relevant to this repository's Next.js portfolio.

If a relevant optional improvement exists, create a separate GitHub issue before merging the dependency PR. The issue must describe:

- what the update includes
- how the repository could use the new feature or changed capability
- what would need to change to activate or adopt it
- advantages of enabling it
- disadvantages, risks, migration cost, or reasons to defer it

Keep these issues separate from the dependency PR unless the change is required to keep the update working. If no relevant follow-up exists, mention that in the final summary instead of creating a placeholder issue.

## PR Review And Merge Flow

1. Before opening the PR, run the generator commands on the PR branch so hook-generated files are current:

```bash
bun run generate:cv
bun run generate:llms
bun run generate:sitemap
bun run update:last-updated
```

2. When generated files change, re-run `bun run check` and the screenshot comparison.
3. Push the branch and open a PR against `development`.
4. Hand the PR to `$git-code-review-autopilot`. That skill owns the complete current-head GitHub check, Codex review, thread-response, repeat-after-push, and merge gate. Do not merge before it returns a successful review outcome.
5. Merge locally into updated `development`, then run `.githooks/pre-commit` on the real `development` branch. Include any generated files in the merge commit.
6. Push `development`, wait for Vercel deployment `READY`, and fetch logs/fix/retry on `ERROR` or `CANCELED`.
7. Merge and push `development -> preproduction`, wait for Vercel `READY`.
8. Merge and push `preproduction -> main`, wait for Vercel `READY`.
9. After the final `main` deployment is `READY`, clean up the local repository:
   - switch back to `development`
   - update `development` from `origin/development`
   - delete the local and remote `codex/update-dependencies-<timestamp>` branch after it has been merged
   - remove any temporary local worktree or checkout created only for the update run
   - keep `.artifacts/` uncommitted and leave the worktree clean unless the user explicitly asks to keep artifacts or branches
10. Write the structured Git update status JSON required by `$internal-pages-upload`, then use that skill's canonical dark Gantt renderer to create `.artifacts/dependency-update-release/<run-id>/status.html`. Keep the report and every supporting artifact uncommitted. Include:
    - run id, job/status/session/cwd/finished timestamp when available
    - one-sentence completion outcome
    - what was changed and what steps were performed
    - merged PR URL and final branch commit
    - follow-up issue URLs created for relevant update features, or a note that no relevant follow-up was found
    - final local branch and cleanup result
    - visual artifact path, if screenshots were captured
    - package upgrades as `name old -> new`
    - validation commands that passed
    - Vercel deployment results for `development`, `preproduction`, and `main`
    - GitHub review/check watch outcome and any residual notes
    - local artifact paths as text, not embedded local images
    - escaped dynamic text before inserting it into HTML
11. Publish and verify the final HTML status page by handing it to `$internal-pages-upload` with the required 14-day TTL. Do not duplicate upload implementation details here; the installed upload skill remains authoritative.
12. Finish with the returned internal report URL first. Then list every available tracking or follow-up issue URL, PR URL, and deployment URL for `development`, `preproduction`, and `main`, followed by the local `.artifacts/.../status.html` path. Explicitly say when a link category has no available link. Include any upload failure note if publishing did not complete.

## Useful Scripts

- `scripts/run-visual-check.mjs`: validates inputs and route coverage, then runs the pinned local Playwright Test workflow.
- `scripts/playwright.visual.config.ts`: configures managed Next.js servers, deterministic desktop/mobile projects, stable comparison thresholds, and failure artifacts.
- `scripts/visual-snapshots.pw.ts`: verifies page health and full-page snapshots for every release route.
- `scripts/discover-pages.mjs`: lists real Pages Router routes or the explicit release route set.

All generated artifacts must remain under `.artifacts/` and must not be committed.
