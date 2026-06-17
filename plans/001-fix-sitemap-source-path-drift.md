# Plan 001: Fix Sitemap Source Path Drift

Status: DONE

Baseline commit: `6b8e92b`

## Finding

`scripts/generate-sitemap.cjs` maps sitemap entries to source files for `lastmod` calculation, but several page paths use wrong-case filenames or stale filenames. The current generator silently ignores missing files, and the only sitemap test checks that `/llms.txt` includes `public/llms.txt`.

On the developer Mac, the case-insensitive filesystem can mask `src/pages/Index.tsx` by resolving it to `src/pages/index.tsx`. The Git tree and Linux/Vercel environments are case-sensitive, so the mapping is still wrong.

## Evidence

Current mapping excerpts:

```js
// scripts/generate-sitemap.cjs
files: ['src/pages/Index.tsx', ...]
files: ['src/pages/CV.tsx', ...]
files: ['src/pages/Imprint.tsx', ...]
files: ['src/pages/Privacy.tsx', ...]
files: ['src/pages/Sitemap.tsx', ...]
files: ['public/llms.txt', 'src/pages/LLMs.tsx', ...]
```

Actual pages-router filenames:

```text
src/pages/index.tsx
src/pages/cv.tsx
src/pages/imprint.tsx
src/pages/privacy.tsx
src/pages/sitemap.tsx
```

The generator catches and ignores missing files:

```js
// scripts/generate-sitemap.cjs
} catch (e) {
  // File might not exist yet, skip
}
```

The existing regression test only checks one mapping:

```ts
// src/tests/generate-sitemap.test.ts
expect(llmsUrl?.files).toContain("public/llms.txt");
```

## Scope

In scope:

- `scripts/generate-sitemap.cjs`
- `src/tests/generate-sitemap.test.ts`
- `public/sitemap.xml`, only if generated after the code change

Out of scope:

- Changing site routes or route priorities
- Reworking `scripts/generate-llms.ts`
- Changing `robots.txt`
- Any dependency updates

## Implementation Steps

1. Write a failing test first in `src/tests/generate-sitemap.test.ts`.

   Add coverage that every file listed in every `urls[].files` entry exists with exact case. Do not use plain `fs.existsSync` alone, because it passes on a case-insensitive filesystem. Use a helper that walks path segments with `fs.readdirSync` and checks that each segment is present by exact string match.

   Suggested helper shape:

   ```ts
   import { existsSync, readdirSync } from "node:fs";
   import path from "node:path";

   const pathExistsWithExactCase = (relativePath: string) => {
     const segments = relativePath.split("/");
     let current = process.cwd();

     for (const segment of segments) {
       if (!existsSync(current)) {
         return false;
       }

       const entries = readdirSync(current);
       if (!entries.includes(segment)) {
         return false;
       }

       current = path.join(current, segment);
     }

     return existsSync(current);
   };
   ```

   Test expectation:

   ```ts
   const missing = urls.flatMap(({ url, files }) =>
     files
       .filter((file) => !pathExistsWithExactCase(file))
       .map((file) => `${url}: ${file}`),
   );

   expect(missing).toEqual([]);
   ```

   Run:

   ```bash
   bun run test -- src/tests/generate-sitemap.test.ts --run
   ```

   Expected before implementation: the new test fails with the wrong-case page paths and the nonexistent `src/pages/LLMs.tsx`.

2. Fix the mappings in `scripts/generate-sitemap.cjs`.

   Replace wrong-case page paths with lowercase pages-router filenames:

   - `src/pages/Index.tsx` -> `src/pages/index.tsx`
   - `src/pages/CV.tsx` -> `src/pages/cv.tsx`
   - `src/pages/Imprint.tsx` -> `src/pages/imprint.tsx`
   - `src/pages/Privacy.tsx` -> `src/pages/privacy.tsx`
   - `src/pages/Sitemap.tsx` -> `src/pages/sitemap.tsx`

   Replace `src/pages/LLMs.tsx` because no such page exists. The `/llms.txt` artifact is generated from `scripts/generate-llms.ts` and `src/content/content.ts`, so include those along with `public/llms.txt`.

3. Stop silently accepting stale mappings.

   Add and export a helper such as `validateSitemapSources()` that checks every mapped file path before `writeSitemap()` writes `public/sitemap.xml`. It should throw an error listing the missing mappings when any are absent.

   Keep `getLatestMtime(files)` focused on calculating mtimes. If you leave the catch block in place for defensive behavior, the explicit validation helper must be covered and called by `writeSitemap()`.

4. Update the existing sitemap test to call the validation helper if exported.

   The tests should verify:

   - `/llms.txt` still includes `public/llms.txt`.
   - Every mapped file exists with exact case.
   - `validateSitemapSources()` does not throw for the current mapping.

5. Regenerate `public/sitemap.xml` only after tests pass:

   ```bash
   bun run generate:sitemap
   ```

   If the generated `lastmod` dates change, keep the change only if it follows from the corrected file mapping.

## Verification

Run:

```bash
bun run test -- src/tests/generate-sitemap.test.ts --run
bun run lint
bun run test -- --run
```

Expected results:

- The sitemap test passes.
- Oxlint exits 0.
- Vitest exits 0. Until Plan 003 is implemented, Vitest may still print Happy DOM PDF iframe network noise.

## Done Criteria

- `scripts/generate-sitemap.cjs` no longer contains wrong-case page paths.
- `src/pages/LLMs.tsx` is not referenced.
- Tests fail if a future sitemap mapping points at a nonexistent or wrong-case file.
- `public/sitemap.xml` is regenerated if and only if the script output changes.

## Escape Hatches

- If the executor finds that `/llms.txt` should be backed by a real Next page, stop and report that product decision instead of inventing `src/pages/llms.tsx`.
- If exact-case path validation is flaky on macOS, do not fall back to `existsSync`; use `git ls-files` or segment-by-segment `readdirSync` matching.
