## Context

`vitest` was upgraded from `4.0.18` to `4.1.0`.

## Why this follow-up matters

Vitest 4.1 adds `--detect-async-leaks`, which can catch hanging timers, unresolved async work, or environment leaks that do not always fail regular test runs. This project has a jsdom-based component and page test suite, so enabling the check could surface latent flakiness before it reaches CI or production changes.

## What changed upstream

- Vitest 4.1 introduced the `--detect-async-leaks` CLI flag.
- Docs: https://vitest.dev/blog/vitest-4-1
- Release notes: https://github.com/vitest-dev/vitest/releases/tag/v4.1.0

## Where we use it

- `package.json`: defines the `test` script as `vitest`
- `vitest.config.ts`: configures the shared jsdom test environment and setup file
- `src/setupTests.ts`: initializes shared test setup that could participate in leaked async state

## Suggested next step

Run the suite with `bun run test -- --run --detect-async-leaks` locally and in CI. If it is clean, update the project test workflow or a dedicated CI job to include the flag as a non-optional check.
