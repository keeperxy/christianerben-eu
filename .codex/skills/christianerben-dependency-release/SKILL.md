---
name: christianerben-dependency-release
description: End-to-end dependency update and release workflow for the christianerben-eu Next.js portfolio. Use when asked to update all packages, including major versions, verify the portfolio visually with screenshots, create a PR against development, merge through development to preproduction to main, and check Vercel deployments for this repository.
---

# Christianerben Dependency Release

Use this skill to perform a full dependency release for `/home/coach007/dev/sites/christianerben-eu`. Keep the workflow conservative: update everything only when updates exist, verify locally and visually, then promote through the configured branch chain with Vercel checks at each stage.

Read `references/repo-workflow.md` before starting. Use the bundled scripts from this skill for page discovery, screenshot capture, and tolerant visual comparison.

## Preflight

1. Work from `/home/coach007/dev/sites/christianerben-eu`.
2. Require a clean worktree except for files explicitly related to this release. If unrelated changes exist, stop and ask before continuing.
3. Start from `development`, update it from `origin/development`, and verify GitHub and Vercel auth before making changes.
4. Check for available updates with Bun. If no package updates are available, stop early without creating a branch, screenshots, or PR.
5. Create `codex/update-dependencies-<timestamp>` from updated `development`.

## Local Update Flow

1. Start the app with `bun run dev` on port 3000.
2. Capture baseline screenshots:

```bash
bun .codex/skills/christianerben-dependency-release/scripts/capture-pages.mjs --base-url http://localhost:3000 --phase before
```

3. Update all dependencies and devDependencies to `latest` with Bun, including major versions. Update both `package.json` and `bun.lock`.
4. Run and repeat until green:

```bash
bun run lint
bun run test
bun run build
```

5. Fix failures autonomously when they are caused by the update. Keep fixes scoped.
6. Restart the dev server after build-affecting fixes.
7. Capture after screenshots:

```bash
bun .codex/skills/christianerben-dependency-release/scripts/capture-pages.mjs --base-url http://localhost:3000 --phase after --run-id <run-id>
```

8. Compare screenshots tolerantly:

```bash
bun .codex/skills/christianerben-dependency-release/scripts/compare-screenshots.mjs --run-id <run-id>
```

Treat blank pages, Next error pages, severe layout collapse, unexpected browser console errors, and HTTP failures as blockers. Do not require pixel-perfect equality.

## PR Review And Merge Flow

1. Before opening the PR, run the generator commands on the PR branch so hook-generated files are current:

```bash
bun run generate:cv
bun run generate:llms
bun run generate:sitemap
bun run update:last-updated
```

2. Re-run `bun run lint`, `bun run test`, `bun run build`, and screenshot comparison when generated files change.
3. Push the branch and open a PR against `development`.
4. Self-review the PR diff, fix issues, and wait for required checks.
5. Watch the Codex GitHub review status before merging:
   - Use `github:github` for initial PR metadata and broad PR comment triage.
   - Use `github:gh-address-comments` when review threads, requested changes, unresolved inline comments, or resolution state matter. Prefer its bundled GraphQL workflow through `gh` for thread-aware reads.
   - Use `github:gh-fix-ci` only when GitHub Actions checks fail and logs are needed.
   - Use PR reaction emojis as the authoritative Codex review lifecycle signal: the eyes emoji means review has started; the thumbs-up emoji means review has finished.
   - Do not merge while the eyes emoji is present without a later thumbs-up completion signal for the current head commit.
   - After the thumbs-up emoji appears, inspect review threads and PR comments. If actionable unresolved review feedback appears, address it locally, re-run the relevant verification (`bun run lint`, `bun run test`, `bun run build`, screenshots when UI output may change), push again, and repeat the emoji-based review watch from the beginning.
   - After every new push, assume the Codex review lifecycle restarts. Wait for a fresh eyes emoji followed by a fresh thumbs-up emoji for the new head commit before continuing.
   - Do not reply on GitHub, resolve threads, or submit reviews unless the user explicitly asks for those write actions.
6. Merge locally into updated `development`, then run `.githooks/pre-commit` on the real `development` branch. Include any generated files in the merge commit.
7. Push `development`, wait for Vercel deployment `READY`, and fetch logs/fix/retry on `ERROR` or `CANCELED`.
8. Merge and push `development -> preproduction`, wait for Vercel `READY`.
9. Merge and push `preproduction -> main`, wait for Vercel `READY`.
10. Finish with a concise plain-text summary in the final response. Prefer this shape:
    - run id, job/status/session/cwd/finished timestamp when available
    - one-sentence completion outcome
    - merged PR URL and final branch commit
    - visual artifact path, if screenshots were captured
    - package upgrades as `name old -> new`
    - validation commands that passed
    - Vercel deployment results for `development`, `preproduction`, and `main`
    - GitHub review/check watch outcome and any residual notes

## Useful Scripts

- `scripts/discover-pages.mjs`: lists real Pages Router routes, excluding API routes and special Next files.
- `scripts/capture-pages.mjs`: captures desktop and mobile screenshots under `.artifacts/dependency-update-release/<run-id>/<phase>/`.
- `scripts/compare-screenshots.mjs`: compares `before` and `after` screenshots with tolerant thresholds and writes `comparison-report.json`.

All generated artifacts must remain under `.artifacts/` and must not be committed.
