# Plan 005: Add A Composite Quality Gate And CI Workflow

Status: DONE

Baseline commit: `6b8e92b`

## Finding

The repo documents separate local commands for lint, test, and build, but it has no single quality-gate script and no GitHub Actions workflow in the checkout. TypeScript is installed, yet there is no `typecheck` script. This makes it easy to merge changes that pass one local check but skip another.

## Evidence

Current scripts:

```json
// package.json
"scripts": {
  "dev": "bun scripts/dev-tailnet.ts",
  "dev:local": "next dev",
  "dev:tailnet:off": "tailscale serve --https=443 off",
  "dev:tailnet:status": "tailscale serve status",
  "build": "next build",
  "start": "next start",
  "lint": "oxlint --react-plugin --nextjs-plugin --vitest-plugin --import-plugin --deny-warnings .",
  "test": "vitest",
  "generate:cv": "bun scripts/generate-cv.tsx",
  "generate:sitemap": "bun scripts/generate-sitemap.cjs",
  "generate:llms": "bun scripts/generate-llms.ts",
  "update:last-updated": "bun scripts/update-last-updated.ts"
}
```

Docs list separate commands:

```md
<!-- README.md -->
- `bun run lint` - lint the project with Oxlint
- `bun run test` - run unit tests with Vitest
- `bun run build` - create a production build
```

```md
<!-- CONTRIBUTING.md -->
2. Run `bun run lint` and `bun run test` to verify code quality and tests.
```

No `.github/` directory exists in the checkout.

## Scope

In scope:

- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- New `.github/workflows/ci.yml`

Out of scope:

- Changing deployment branches
- Adding release automation
- Changing the pre-commit hook behavior
- Adding external services beyond GitHub Actions and Bun setup
- Making unrelated dependency updates

## Implementation Steps

1. Add scripts in `package.json`.

   Keep existing script names stable and add:

   ```json
   "typecheck": "tsc --noEmit --incremental false --pretty false",
   "test:run": "vitest --run",
   "check": "bun run lint && bun run typecheck && bun run test:run && bun run build"
   ```

   Keep `test` as `vitest` for local watch/developer use.

2. Run the new typecheck script first.

   ```bash
   bun run typecheck
   ```

   Expected result: exits 0. This passed during audit with `./node_modules/.bin/tsc --noEmit --incremental false --pretty false`.

3. Add GitHub Actions workflow.

   Create `.github/workflows/ci.yml`:

   ```yaml
   name: CI

   on:
     pull_request:
     push:
       branches:
         - development
         - preproduction
         - main

   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Bun
           uses: oven-sh/setup-bun@v2
           with:
             bun-version: 1.3.4

         - name: Install dependencies
           run: bun install --frozen-lockfile

         - name: Run quality gate
           run: bun run check
   ```

   If `bun install --frozen-lockfile` fails because the current lockfile format or Bun version requires a different flag, stop and report the exact install failure rather than weakening the workflow to an unpinned install.

4. Update docs.

   In `README.md`, add `bun run typecheck`, `bun run test:run`, and `bun run check` to Useful Scripts.

   In `CONTRIBUTING.md`, change the verification instruction to:

   ```md
   Run `bun run check` before opening a pull request.
   ```

   Mention that `bun run check` includes lint, typecheck, unit tests, and production build.

5. Run the composite gate locally.

   ```bash
   bun run check
   ```

   This will write `.next` because it includes `bun run build`; `.next` is ignored. Do not stage ignored build artifacts.

## Verification

Run:

```bash
bun run typecheck
bun run test:run
bun run check
git status --short --ignored
```

Expected results:

- `bun run typecheck` exits 0.
- `bun run test:run` exits 0.
- `bun run check` exits 0.
- `git status --short --ignored` shows no tracked build artifacts; ignored `.next/` may appear only with `--ignored`.

## Done Criteria

- `package.json` exposes `typecheck`, `test:run`, and `check`.
- GitHub Actions runs the same composite gate on PRs and protected branch pushes.
- README and CONTRIBUTING point contributors at the composite gate.
- Local `bun run check` passes.

## Escape Hatches

- If Plan 003 has not landed and `test:run` still prints CV iframe network noise, do not block this plan solely on noisy output if exit code is 0. Record the residual noise in the PR summary and link Plan 003.
- If `bun run build` needs deployment-only env not available in CI, prefer making the app gracefully build without optional env over removing build from the check. Stop and report if a truly required secret is missing.
