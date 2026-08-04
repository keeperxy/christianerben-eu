# AGENTS Instructions

This repository contains a personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## Project layout
- `src/` – application source code (pages, components, hooks).
- `public/` – static assets such as the generated `sitemap.xml`.
- `scripts/` – utility scripts executed by the build or git hooks.

## Useful commands
- `bun run dev` – start the Tailnet-backed dev flow via `scripts/dev-tailnet.ts` (serves over Tailscale).
- `bun run dev:local` – start a plain local `next dev` server on port 3000.
- `bun run build` – create a production build.
- `bun run lint` – run Oxlint over the codebase.
- `bun run typecheck` – run TypeScript without emitting output.
- `bun run test` – execute all unit tests via Vitest (watch mode).
- `bun run test:run` – run the unit test suite once.
- `bun run test -- <file>` – run a single test file (e.g., `bun run test -- src/components/HeroSection.test.tsx`).
- `bun run test:leaks` – run the suite with async leak detection.
- `bun run verify:generated` – verify generated artifacts (`public/llms.txt`, `public/sitemap.xml`, `src/content/content.ts`, tracked `public/cv` files) are current and valid.
- `bun run check` – the full quality gate: lint, typecheck, tests, async leak detection, generated artifact verification, and a production build.

## Git hooks
A pre-commit hook is configured in `.githooks/pre-commit`. When committing on the `development` branch it runs:
- `bun run generate:cv` and stages `public/cv`
- `bun run generate:llms` and stages `public/llms.txt`
- `bun run generate:sitemap` and stages `public/sitemap.xml`
- `bun run update:last-updated` and stages `src/content/content.ts`

## Code style guidelines
- Use PascalCase for components and interfaces, camelCase for functions/variables
- Organize imports: standard libraries, external packages, internal imports
- Use `@/` prefix for internal module imports (e.g., `@/components/ui/button`)
- Use `import type` for TypeScript types
- Components should use `React.forwardRef` and have explicit `displayName`
- Define props interfaces extending React HTML attributes
- Use interfaces for object shapes and types for unions
- Handle errors with try/catch in async operations and API functions

## Agent workflow
When modifying files in this repository:
1. Run `bun run check` before committing or opening a PR unless the operator asks for a narrower check.
2. Include a clear commit message summarising the change.
3. Reference any modified files in PR summaries when applicable.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
