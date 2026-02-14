# Contributing

This repository hosts a React + TypeScript portfolio site. To contribute changes:

1. Install dependencies with `bun install`.
2. Run `bun run lint` and `bun run test` to verify code quality and tests.
3. Make your changes in a feature branch.
4. Commit with a descriptive message and open a pull request.

The pre-commit hook in `.githooks/pre-commit` runs only when committing on `development` and updates/stages generated assets (`public/cv`, `public/llms.txt`, `public/sitemap.xml`) plus `src/content/content.ts`.
