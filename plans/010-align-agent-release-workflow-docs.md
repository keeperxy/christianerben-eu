# Plan 010: Align agent and dependency-release workflow docs

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report - do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ae69f03..HEAD -- AGENTS.md .codex/skills/christianerben-dependency-release/SKILL.md .codex/skills/christianerben-dependency-release/references/repo-workflow.md src/tests/toolingConfig.test.ts package.json README.md CONTRIBUTING.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: Plan 009 recommended
- **Category**: docs / dx
- **Planned at**: commit `ae69f03`, 2026-07-09

## Why this matters

This repo is frequently maintained by agents. `README.md`, `CONTRIBUTING.md`, `package.json`, CI, and the dependency-release skill now point to a richer verification gate than the root `AGENTS.md` and parts of the local release skill describe. If agents follow stale instructions, they can skip typecheck, async leak detection, generated artifact verification, or look for an internal upload skill under a macOS `/Users/...` path that does not exist on this Linux host.

## Current state

- `AGENTS.md` - root agent instructions for this repo.
- `.codex/skills/christianerben-dependency-release/SKILL.md` - local dependency release skill.
- `.codex/skills/christianerben-dependency-release/references/repo-workflow.md` - release workflow reference.
- `src/tests/toolingConfig.test.ts` - existing static tests for tooling expectations.
- `package.json` - current script truth.

Current excerpts:

```md
<!-- AGENTS.md:10-15 -->
## Useful commands
- `bun run dev` – start a development server on port 3000.
- `bun run build` – create a production build.
- `bun run lint` – run Oxlint over the codebase.
- `bun run test` – execute all unit tests via Vitest.
- `bun run test -- <file>` – run a single test file (e.g., `bun run test -- src/components/HeroSection.test.tsx`).
```

```md
<!-- AGENTS.md:34-37 -->
## Agent workflow
When modifying files in this repository:
1. Run `bun run lint` and `bun run test` before committing to confirm everything passes.
2. Include a clear commit message summarising the change.
3. Reference any modified files in PR summaries when applicable.
```

```json
// package.json:17-22
"test:leaks": "bash -o pipefail -c 'vitest --run --detect-async-leaks 2>&1 | tee /tmp/vitest-async-leaks.log && ! grep -Eq \"(Async Leaks [1-9]|Leaks [1-9][0-9]* leaks)\" /tmp/vitest-async-leaks.log'",
"check": "bun run lint && bun run typecheck && bun run test:run && bun run test:leaks && bun run verify:generated && bun run build",
```

```md
<!-- .codex/skills/christianerben-dependency-release/SKILL.md:30-36 -->
4. Run and repeat until green:

```bash
bun run lint
bun run test
bun run build
```
```

```md
<!-- .codex/skills/christianerben-dependency-release/SKILL.md:79-90 -->
2. Re-run `bun run lint`, `bun run test`, `bun run build`, and screenshot comparison when generated files change.
...
address it locally, re-run the relevant verification (`bun run lint`, `bun run test`, `bun run build`, screenshots when UI output may change)
```

```md
<!-- .codex/skills/christianerben-dependency-release/SKILL.md:117 -->
read and follow `/Users/coach007/.agents/skills/internal-pages-upload/SKILL.md` at publish time so changes to that skill remain authoritative.
```

```md
<!-- .codex/skills/christianerben-dependency-release/references/repo-workflow.md:11 -->
- Commands: `bun run dev`, `bun run lint`, `bun run test`, `bun run build`
```

```md
<!-- .codex/skills/christianerben-dependency-release/references/repo-workflow.md:82 -->
Read and follow `/Users/coach007/.agents/skills/internal-pages-upload/SKILL.md` at publish time; do not copy its upload commands into this workflow.
```

Repo conventions to match:

- Docs are concise and command-focused.
- Existing tooling tests read files as text and assert important workflow contracts.
- Release workflow should stay conservative and continue using screenshots for dependency updates.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install --frozen-lockfile` | exit 0 |
| Targeted tests | `bun run test:run -- src/tests/toolingConfig.test.ts` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test:run` | exit 0 |
| Async leak check | `bun run test:leaks` | exit 0 |
| Generated freshness | `bun run verify:generated` | exit 0 |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `AGENTS.md`
- `.codex/skills/christianerben-dependency-release/SKILL.md`
- `.codex/skills/christianerben-dependency-release/references/repo-workflow.md`
- `src/tests/toolingConfig.test.ts`
- `plans/README.md` status row only

**Out of scope**:

- Do not change release branch order.
- Do not change Vercel project/team identifiers.
- Do not alter the screenshot capture or comparison scripts.
- Do not edit the global `/home/coach007/.agents/skills/internal-pages-upload/SKILL.md`.
- Do not publish anything to GitHub or Vercel.

## Git workflow

- Suggested branch: `advisor/010-align-agent-release-docs`
- Commit message style: `Align agent release workflow docs`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add static tests for workflow drift

Extend `src/tests/toolingConfig.test.ts` with assertions that:

- `AGENTS.md` contains `bun run check`.
- `AGENTS.md` distinguishes Tailnet `bun run dev` from local `bun run dev:local`.
- `.codex/skills/christianerben-dependency-release/SKILL.md` contains `bun run check`.
- `.codex/skills/christianerben-dependency-release/references/repo-workflow.md` contains `bun run check`.
- Neither dependency-release workflow file contains `/Users/coach007/.agents/skills/internal-pages-upload/SKILL.md`.
- The workflow points to `internal-pages-upload` by skill name or a portable `$HOME` / `/home/coach007` path. Prefer skill-name wording because installed skill paths can vary.

**Verify**: `bun run test:run -- src/tests/toolingConfig.test.ts` -> fails before docs are updated.

### Step 2: Update `AGENTS.md` command and workflow guidance

Update `AGENTS.md`:

- `bun run dev` starts the Tailnet-backed dev flow via `scripts/dev-tailnet.ts`, not a plain local-only server.
- `bun run dev:local` starts plain `next dev`.
- Include `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run check`.
- Replace "Run `bun run lint` and `bun run test` before committing" with "Run `bun run check` before committing or opening a PR unless the operator asks for a narrower check."
- Keep existing code style guidance.

**Verify**: `bun run test:run -- src/tests/toolingConfig.test.ts` -> AGENTS-related assertions pass; skill-related assertions may still fail until Step 3.

### Step 3: Update dependency-release skill verification commands

In `.codex/skills/christianerben-dependency-release/SKILL.md`:

- Replace local update flow commands `bun run lint`, `bun run test`, `bun run build` with `bun run check`.
- Keep screenshot capture and comparison as an additional visual gate; `bun run check` does not replace screenshots.
- In PR review/merge flow, replace repeated verification phrases with `bun run check` plus screenshot comparison when UI output or dependencies changed.
- When generated files change, say to run generators, then `bun run check`, then screenshot comparison.

In `.codex/skills/christianerben-dependency-release/references/repo-workflow.md`:

- Update the constants command list to include `bun run check` and `bun run dev:local` where relevant.
- Replace old `lint/test/build` repair loops with `bun run check` plus screenshot comparison.

**Verify**: `rg -n "bun run lint|bun run test|bun run build" .codex/skills/christianerben-dependency-release` -> any remaining hits must be explanatory only, not the primary required gate.

### Step 4: Remove machine-specific internal upload skill paths

In both dependency-release workflow files:

- Replace `/Users/coach007/.agents/skills/internal-pages-upload/SKILL.md` with skill-name-based wording such as "Use the `internal-pages-upload` skill at publish time."
- Do not paste upload tokens or curl commands into the dependency-release skill.
- Keep the rule that the status page is uploaded and the returned URL is reported.

**Verify**: `rg -n "/Users/coach007|internal-pages-upload/SKILL.md" .codex/skills/christianerben-dependency-release` -> no absolute `/Users/...` path remains.

### Step 5: Run targeted and full checks, then update index

Run:

```sh
bun run test:run -- src/tests/toolingConfig.test.ts
bun run lint
bun run typecheck
bun run test:run
bun run test:leaks
bun run verify:generated
bun run build
```

Update `plans/README.md` row for Plan 010 to `DONE` only after all commands pass.

**Verify**: `git status --short` -> only in-scope files changed.

## Test plan

- Static tooling test prevents `AGENTS.md` from drifting away from `bun run check`.
- Static tooling test prevents dependency-release workflow files from reverting to `lint/test/build` as the primary gate.
- Static tooling test prevents reintroducing the macOS `/Users/.../internal-pages-upload/SKILL.md` path.

## Done criteria

- [ ] Agent-facing docs identify `bun run check` as the default full gate.
- [ ] `bun run dev` vs `bun run dev:local` behavior is accurately documented.
- [ ] Dependency-release skill uses `bun run check` plus screenshot comparison.
- [ ] Dependency-release workflow no longer contains `/Users/coach007/.agents/skills/internal-pages-upload/SKILL.md`.
- [ ] `bun run lint`, `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run build` exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The operator says release workflows intentionally use partial gates for speed.
- The dependency-release skill has a newer duplicate outside `.codex/skills` that should be treated as canonical.
- Plan 009 changes the generated artifact contract in a way that makes the proposed wording inaccurate.

## Maintenance notes

This plan intentionally adds tests for docs because these files are executable instructions for future agents. Reviewers should reject changes that make `AGENTS.md`, the release skill, and `package.json` disagree about the full verification gate.
