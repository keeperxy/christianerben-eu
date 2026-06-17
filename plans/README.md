# Improve Plans

Baseline commit: `6b8e92b`

Audit date: 2026-06-17

Scope: `/Users/coach007/dev/sites/christianerben-eu`, a Bun-powered Next.js 16 pages-router portfolio with React 19, TypeScript, Tailwind CSS 4, Oxlint, and Vitest.

The attached `improve` skill was used in read-only advisor mode. Its referenced `references/audit-playbook.md` and `references/plan-template.md` files were not present next to the attachment, so these plans follow the workflow and plan requirements visible in the attached `SKILL.md`.

## Verification Baseline

Commands run during audit:

- `bun run lint` passed.
- `bun run test -- --run` passed: 14 test files, 25 tests. The command printed Happy DOM `ECONNREFUSED` / abort noise for CV PDF iframes.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

`bun run build` was not run during the audit because it writes `.next` artifacts; executor plans may run it where explicitly listed as a done criterion.

## Recommended Order

| Order | Plan | Status | Depends On | Why First |
| --- | --- | --- | --- | --- |
| 1 | [001 Fix sitemap source path drift](001-fix-sitemap-source-path-drift.md) | DONE | None | Small, high-confidence correctness fix for generated SEO metadata. |
| 2 | [002 Harden and test the contact mail API](002-harden-and-test-contact-mail-api.md) | DONE | None | Highest security and delivery risk in the user-facing app. |
| 3 | [003 Simplify CV downloads and remove test network noise](003-simplify-cv-downloads-and-test-noise.md) | DONE | None | Improves UX and makes the test suite trustworthy before larger work. |
| 4 | [004 Restore static-first page rendering](004-restore-static-first-page-rendering.md) | DONE | 3 recommended | Performance-oriented change with a visible language-behavior tradeoff. |
| 5 | [005 Add a composite quality gate and CI workflow](005-add-quality-gate-and-ci.md) | DONE | 1, 2, 3 recommended | Locks in the improved checks once noisy tests and critical gaps are fixed. |

## Dependency Notes

- Plan 005 can be implemented earlier if desired, but it will inherit the current noisy Vitest output until Plan 003 lands.
- Plan 004 changes language initialization behavior. Keep it separate from Plan 002 and Plan 003 so any hydration or language regression is easy to isolate.
- Plan 001 is independent and should be safe to land first.

## Vetted Findings

| # | Finding | Category | Impact | Effort | Fix Risk | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Sitemap generation references wrong-case and stale source paths, while tests do not assert mapped files exist exactly. | Generated content correctness | Page-only edits can be missed by `lastmod`, especially on case-sensitive Linux/Vercel environments. | S | Low | `scripts/generate-sitemap.cjs:6-37`, `scripts/generate-sitemap.cjs:47-51`, `src/tests/generate-sitemap.test.ts:6-10`, `src/pages/index.tsx:1`, `src/pages/cv.tsx:1` |
| 2 | Contact API sends mail after only honeypot and minimum-field validation, has no rate limit, returns internal/provider error text, and reuses HTML-escaped email for `replyTo`. | Security / API correctness | Spammers can consume mail quota, clients can see provider/config details, and valid addresses with escaped characters can break reply routing. | M | Medium | `src/components/ContactSection.tsx:55-72`, `src/pages/api/send-mail.ts:29-57`, `src/pages/api/send-mail.ts:78-84`, `src/pages/api/send-mail.ts:217-230` |
| 3 | CV tests pass while Happy DOM performs real localhost PDF iframe fetches; static download buttons fetch public files into blobs instead of using normal links. | DX / UX performance | Test output hides real async/network problems, and static multi-MB downloads do unnecessary browser work. | S | Low | `src/pages/cv.tsx:36-58`, `src/pages/cv.tsx:315-320`, `src/tests/pages/CV.test.tsx:120-154`, `vitest.config.ts:4-6` |
| 4 | `_app.getInitialProps` opts the mostly static portfolio into app-level request work for language detection. | Performance / runtime behavior | Static pages that could be served as static HTML become tied to request-time language negotiation. | M | Medium | `src/pages/_app.tsx:41-68`, `src/contexts/SettingsContext.tsx:83-92`, absence of page-level `getStaticProps` / `getServerSideProps` in `src/pages` |
| 5 | The repo has no composite local quality gate or GitHub Actions workflow. | CI / tooling | Contributors can merge after running only part of lint/test/typecheck/build, and no remote check enforces the documented workflow. | M | Low | `package.json:7-19`, `README.md:24-39`, `CONTRIBUTING.md:5-10`, no `.github/` directory in the checkout |

## Direction Suggestions

1. Keep the portfolio static-first unless request-time language negotiation is intentionally worth the runtime cost.
2. Decide whether the hidden custom CV editor is a maintained product feature or internal tooling; default public downloads should stay simple and prebuilt.
3. Treat the AI-facing surface (`llms.txt`, markdown rewrite, robots content signals, sitemap) as an intentional product surface and keep it tested as one unit.
4. Consider a later dependency diet for unused shadcn/Radix primitives and unused integrations after the functional plans above land.

## Considered And Not Planned Now

- Supabase client hygiene: `src/integrations/supabase/client.ts:5-11` hardcodes a Supabase URL and publishable client key, while repo search found no active imports. Supabase publishable keys are client-side credentials by design, so this is lower priority than the contact API. If the project is unused, a later cleanup plan should remove the integration, package dependency, and `supabase/config.toml`; if it is used externally, move configuration to `NEXT_PUBLIC_*` env vars and verify Row Level Security. Do not reproduce the key in issues, plans, or logs.
- Broad dependency diet: `src/components/ui/` and `package.json` include many Radix/shadcn primitives that may be unused by routed pages. This is worth a separate maintenance sweep after CI exists, but it is riskier than the first five plans because removals can affect generated or hidden CV flows.
- API method strictness for `src/pages/api/markdown/homepage.ts`: the route currently ignores HTTP method and returns markdown for every method. This is a small improvement and can be folded into a future API contract cleanup, but it is less impactful than the contact mail endpoint.
