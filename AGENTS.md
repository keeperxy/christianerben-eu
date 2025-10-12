# AGENTS Instructions

This repository contains a personal portfolio built with React, TypeScript, Vite and Tailwind CSS.

## Project layout
- `src/` – application source code (pages, components, hooks).
- `public/` – static assets such as the generated `sitemap.xml`.
- `scripts/` – utility scripts executed by the build or git hooks.

## Useful commands
- `npm run dev` – start a development server on port 8080.
- `npm run build` – create a production build.
- `npm run lint` – run ESLint over the codebase.
- `npm test` – execute all unit tests via Vitest.
- `npm test <file>` – run a single test file (e.g., `npm test src/components/HeroSection.test.tsx`).

## Git hooks
A pre-commit hook is configured with Husky. When committing on the `main` branch it runs `node scripts/generate-sitemap.cjs` and stages the resulting `public/sitemap.xml` file. Ensure the sitemap is updated and committed when changes land on `main`.

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
1. Run `npm run lint` and `npm test` before committing to confirm everything passes.
2. Include a clear commit message summarising the change.
3. Reference any modified files in PR summaries when applicable.
