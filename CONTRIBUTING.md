# Contributing

This repository hosts a React + TypeScript portfolio site. To contribute changes:

1. Install dependencies with `bun install`.
2. Run `bun run check` before opening a pull request. It includes lint, typecheck, unit tests, async leak detection, generated artifact verification, and a production build.
3. Make your changes in a feature branch.
4. Commit with a descriptive message and open a pull request.

## Generated artifacts

`bun run verify:generated` (part of `bun run check` and CI) verifies:

- `public/llms.txt`, `public/sitemap.xml`, and `src/content/content.ts` are byte-fresh against their generators.
- The six tracked CV files in `public/cv` (EN/DE PDF, certificate PDF variants, DOCX) exist, are tracked, and carry valid PDF/DOCX file signatures.

CV binaries are not byte-deterministic (embedded timestamps), so content freshness for `public/cv` is not enforced by CI. After changing CV-relevant content, run `bun run generate:cv` and commit the results.

The pre-commit hook in `.githooks/pre-commit` runs only when committing on `development` and updates/stages generated assets (`public/cv`, `public/llms.txt`, `public/sitemap.xml`) plus `src/content/content.ts`. It is a convenience, not a safety net — it only runs if `core.hooksPath` points at `.githooks`.
