# Local Implementation Notes

Date: 2026-07-03
Branch: `t3code/run-skill` local worktree only
Base commit when this implementation was finalized: `fde3438`

This file is a local handoff note for the issue and PR.

Issue: https://github.com/keeperxy/christianerben-eu/issues/121

## Draft Issue

Title: Harden portfolio runtime, generated assets, accessibility, and dependency surface

Summary:

- Remove request-time language cookie coupling and keep language persistence client-side.
- Harden API contracts for contact mail and markdown export.
- Add generated artifact verification to the local quality gate.
- Improve mobile navigation, CV controls, skills tabs, and privacy/hero rendering accessibility.
- Remove unused Supabase, React Query, Sonner, next-themes, lovable-tagger, stale Bun test preload, and unused shadcn/Radix UI modules.
- Regenerate public CV, sitemap, and llms artifacts.

## Draft PR

Title: Harden portfolio quality gates and trim unused runtime surface

Body outline:

- Added `verify:generated` and included it in `bun run check`.
- Made generated `llms.txt` and `sitemap.xml` freshness checks deterministic for clean trees.
- Hardened `/api/send-mail` with an optional durable rate-limit endpoint and fail-closed behavior when configured.
- Restricted `/api/markdown/homepage` to `GET` and `HEAD`.
- Removed raw HTML rendering from hero and privacy copy.
- Fixed mobile header sheet labeling and close behavior, CV button labels and hash fallback validation, About grid classes, and Skills mobile tab labels.
- Removed unused providers, integrations, UI modules, and dependencies.
- Added regression coverage for the above.

## Scope Implemented

- `src/contexts/SettingsContext.tsx`: removed the language cookie write while keeping `document.documentElement.lang` and localStorage persistence.
- `src/components/Header.tsx`: controlled the mobile sheet, added a visually hidden sheet title, closed the menu on navigation, and consolidated scroll work behind `requestAnimationFrame`.
- `src/components/AboutSection.tsx`: replaced the dynamic Tailwind class with concrete responsive grid classes.
- `src/components/HeroSection.tsx` and `src/pages/privacy.tsx`: removed `dangerouslySetInnerHTML`.
- `src/pages/cv.tsx` and `src/components/cv/CvDownloadButtonsCustom.tsx`: added accessible control labels and runtime validation for URL-hash content before using custom CV data.
- `src/components/SkillsSection.tsx`: kept tab labels visible, replaced fixed seven-column tabs with an auto-fit minimum-width grid to prevent label overlap, and added accessible skill level labels.
- `src/pages/api/markdown/homepage.ts`: returns markdown only for `GET`/`HEAD`; other methods return `405` with `Allow: GET, HEAD`.
- `src/pages/api/send-mail.ts`: added optional durable rate limiting via `CONTACT_RATE_LIMIT_ENDPOINT`, optional `CONTACT_RATE_LIMIT_ENDPOINT_TOKEN`, and optional `CONTACT_RATE_LIMIT_KEY_SECRET`; configured endpoint failures fail closed.
- `scripts/verify-generated.ts`: added a generated-file freshness gate for tracked text artifacts.
- `src/tests/verifyGeneratedScript.test.ts`: verifies the generated-file gate restores tracked files even when a generator command fails.
- `scripts/generate-llms.ts` and `scripts/generate-sitemap.cjs`: made clean-tree freshness dates derive from git history and dirty source trees derive from the current date.
- `scripts/vercel-deploy-check.sh`: preserves Vercel Ignored Build Step semantics, where non-zero allows selected branches to build and zero skips other branches.
- `src/setupTests.ts`: added testing-library cleanup after each test.
- Removed stale/unused local surfaces: `bunfig.toml`, `src/setupBunTests.ts`, `src/App.css`, `src/integrations/supabase/*`, `supabase/config.toml`, `src/components/ui/sonner.tsx`, and unused shadcn/Radix UI modules.
- Removed unused dependencies including Supabase, React Query, next-themes, Sonner, lovable-tagger, and unused Radix/shadcn support packages.
- Regenerated `public/cv/*`, `public/llms.txt`, and `public/sitemap.xml`.

## Verification

- `bun run test:run -- src/components/SkillsSection.test.tsx`: passed, 2 tests.
- `bun run lint`: passed after the Skills tab overlap follow-up.
- `bun run typecheck`: passed after the Skills tab overlap follow-up.
- `bun run build`: passed after the Skills tab overlap follow-up.
- `bun run test:run -- src/tests/verifyGeneratedScript.test.ts`: passed, 1 test.
- `bun run check`: passed.
  - `bun run lint`: passed.
  - `bun run typecheck`: passed.
  - `bun run test:run`: passed, 22 files and 69 tests.
  - `bun run verify:generated`: passed.
  - `bun run build`: passed.
- `git diff --check`: passed.
- Local server smoke test against `bun run dev:local -- -H 127.0.0.1 -p 3000`:
  - `GET /`: `200 text/html`.
  - `GET /cv`: `200 text/html`.
  - `GET /privacy`: `200 text/html`.
  - `GET /api/markdown/homepage`: `200 text/markdown`.
  - `POST /api/markdown/homepage`: `405`, `Allow: GET, HEAD`.

## Notes For Review

- The T3 preview navigation/open/status tools were not available in this session, so no screenshot-based browser QA was recorded. The local Next server smoke test above passed.
- `CONTACT_RATE_LIMIT_ENDPOINT` must be configured in deployment for cross-instance durable rate limiting. Set `CONTACT_RATE_LIMIT_KEY_SECRET` with it to keep durable client keys stable and non-guessable. Without an endpoint, the existing in-memory fallback remains.
- CV binary generation still produces byte-level changes, so `verify:generated` intentionally checks deterministic text artifacts and `src/content/content.ts`; the pre-commit hook still regenerates CV assets.
- The dependency and UI module cleanup is intentionally broad. Reviewers should scan imports and package removal carefully, even though lint, typecheck, test, and build pass.
