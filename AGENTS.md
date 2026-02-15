# AGENTS Instructions

This repository contains a personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## Project layout
- `src/` – application source code (pages, components, hooks).
- `public/` – static assets such as the generated `sitemap.xml`.
- `scripts/` – utility scripts executed by the build or git hooks.

## Useful commands
- `bun run dev` – start a development server on port 3000.
- `bun run build` – create a production build.
- `bun run lint` – run Oxlint over the codebase.
- `bun run test` – execute all unit tests via Vitest.
- `bun run test -- <file>` – run a single test file (e.g., `bun run test -- src/components/HeroSection.test.tsx`).

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
1. Run `bun run lint` and `bun run test` before committing to confirm everything passes.
2. Include a clear commit message summarising the change.
3. Reference any modified files in PR summaries when applicable.
