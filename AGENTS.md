# AGENTS Instructions

This repository is a personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS, running on a Bun-first toolchain.

## Project layout
- `src/` - application source code (pages, components, hooks, contexts, utilities)
- `public/` - static assets and generated outputs (for example `public/sitemap.xml`)
- `scripts/` - utility scripts for content generation and maintenance tasks
- `.githooks/` - repository git hooks used during local commits

## Runtime and package management
- Use Bun for installs and all script execution.
- Install dependencies with `bun install`.
- Run project scripts with `bun run <script>`.

## Useful commands
- `bun run dev` - start the Next.js development server
- `bun run build` - create a production build
- `bun run start` - start the production server
- `bun run lint` - run Oxlint with the repository policy
- `bun test` - run the full test suite
- `bun test <file>` - run a specific test file when targeted execution is needed

## Linting policy
- Oxlint is the single linting tool for this repository.
- Keep lint configuration strict and aligned with the migration issue scope.
- Treat lint output as blocking for merge readiness.

## Testing policy
- Use Bun's test runner for all test execution.
- Keep tests deterministic and avoid hidden global state between test files.
- Prefer targeted test runs during iteration, then run the full suite before commit.

## Import policy
- Use relative internal imports across the codebase.
- Do not introduce alias-based internal imports.
- Keep `import type` usage for type-only imports where applicable.

## Git hooks
- The active pre-commit hook is `.githooks/pre-commit`.
- It executes only on the `development` branch and runs:
  - `bun run generate:cv`
  - `bun run generate:llms`
  - `bun run generate:sitemap`
  - `bun run update:last-updated`
- Those generated files must be committed when changed by the hook.

## Code style guidelines
- Use PascalCase for components and interfaces.
- Use camelCase for functions and variables.
- Organize imports consistently: standard library, external packages, internal modules.
- Use `React.forwardRef` with explicit `displayName` for reusable UI primitives.
- Prefer interfaces for object shapes and type aliases for unions where it improves clarity.
- Handle async error paths explicitly with `try/catch` in boundary operations.

## Agent workflow
When modifying files in this repository:
1. Run `bun run lint` and `bun test` before committing.
2. Run `bun run build` before shipping substantial changes.
3. Write clear commit messages describing intent and scope.
4. Reference modified files and validation results in PR summaries.
