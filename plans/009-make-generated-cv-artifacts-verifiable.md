# Plan 009: Make generated CV artifacts verifiable

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report - do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ae69f03..HEAD -- scripts/verify-generated.ts scripts/generate-cv.tsx src/tests/verifyGeneratedScript.test.ts src/tests/toolingConfig.test.ts .githooks/pre-commit CONTRIBUTING.md package.json public/cv`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `ae69f03`, 2026-07-09

## Why this matters

The repository tracks generated PDF/DOCX CV artifacts in `public/cv`. The pre-commit hook regenerates and stages them only on the `development` branch, but the composite CI gate verifies only `public/llms.txt`, `public/sitemap.xml`, and `src/content/content.ts`. On fresh installs or CI, stale CV binaries can slip through if the hook is not installed or not run.

## Current state

- `.githooks/pre-commit` - regenerates `public/cv`, `public/llms.txt`, `public/sitemap.xml`, and `src/content/content.ts` on `development`.
- `scripts/verify-generated.ts` - snapshots only three generated paths and restores them after running generators.
- `.github/workflows/ci.yml` - runs `bun run check`, which calls `verify:generated`.
- `scripts/generate-cv.tsx` - writes tracked CV PDFs/DOCX files and certificate variants.
- `src/tests/verifyGeneratedScript.test.ts` and `src/tests/toolingConfig.test.ts` - existing tooling tests to extend.

Current excerpts:

```sh
# .githooks/pre-commit:14-17
bun run generate:cv && git add public/cv || exit 1
bun run generate:llms && git add public/llms.txt || exit 1
bun run generate:sitemap && git add public/sitemap.xml || exit 1
bun run update:last-updated && git add src/content/content.ts || exit 1
```

```ts
// scripts/verify-generated.ts:4-8
const generatedPaths = [
  "public/llms.txt",
  "public/sitemap.xml",
  "src/content/content.ts",
];
```

```yaml
# .github/workflows/ci.yml:26-28
      - name: Run quality gate
        run: bun run check
```

```tsx
// scripts/generate-cv.tsx:250-259
async function generatePdf(language: "en" | "de", includeCertificates = false) {
  const suffix = includeCertificates ? "_with_certificates" : "";
  const pdfPath = path.join(CV_OUTPUT_DIR, `christian_erben_cv_${language}${suffix}.pdf`);

  await renderToFile(
    <CVDocument
      language={language}
      data={siteContent}
      profileImageSrc={PROFILE_IMAGE_PATH}
      includeCertificates={includeCertificates}
```

```ts
// scripts/generate-cv.tsx:272-274
const docxPath = path.join(CV_OUTPUT_DIR, `christian_erben_cv_${language}.docx`);
const profileImageData = new Uint8Array(await readFile(PROFILE_IMAGE_PATH));
const blob = await generateCvDocx({ language, data: siteContent, profileImageData });
```

Local audit note: `git config --get core.hooksPath` returned no value in this checkout, so `.githooks/pre-commit` is not guaranteed to run for local commits unless configured elsewhere.

Repo conventions to match:

- `scripts/verify-generated.ts` already snapshots tracked files, runs generators, compares bytes, restores changed files, and exits 1 with a concrete stale-file list.
- Tests for tooling scripts live under `src/tests`.
- Avoid byte-for-byte assertions over PDFs/DOCX in unit tests unless deterministic output is proven.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install --frozen-lockfile` | exit 0 |
| Targeted tests | `bun run test:run -- src/tests/verifyGeneratedScript.test.ts src/tests/toolingConfig.test.ts` | exit 0 |
| Generated freshness | `bun run verify:generated` | exit 0, generated artifacts are current |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test:run` | exit 0 |
| Async leak check | `bun run test:leaks` | exit 0 |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `scripts/verify-generated.ts`
- `scripts/generate-cv.tsx` only if needed to make verification deterministic or testable
- `src/tests/verifyGeneratedScript.test.ts`
- `src/tests/toolingConfig.test.ts`
- `CONTRIBUTING.md`
- `.githooks/pre-commit` only if hook behavior must be documented/adjusted
- `package.json` only if a new script is necessary
- `plans/README.md` status row only

**Out of scope**:

- Do not redesign the CV document layout.
- Do not remove tracked CV artifacts.
- Do not compare generated PDF/DOCX bytes blindly if timestamps or metadata make output nondeterministic.
- Do not install or configure git hooks globally.

## Git workflow

- Suggested branch: `advisor/009-verify-generated-cv-artifacts`
- Commit message style: `Verify generated CV artifacts`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Determine whether CV binary output is deterministic enough for byte comparison

Run:

```sh
bun run generate:cv
git diff --stat -- public/cv
git diff --name-only -- public/cv
```

If `git diff --name-only -- public/cv` is empty after a clean generation, byte comparison is viable.

If it is not empty:

- Inspect whether the diff is due to expected content drift or nondeterministic metadata/dates.
- Restore tracked generated files before continuing with `git restore -- public/cv` only if those changes were created by this step.
- Prefer a manifest/invariant approach rather than byte comparison.

**Verify**: record the result in the PR summary. Do not commit generated changes from this exploratory step unless they are legitimate stale artifacts and the operator wants them included.

### Step 2: Add tests that describe the chosen verification contract

Extend `src/tests/verifyGeneratedScript.test.ts` and/or `src/tests/toolingConfig.test.ts` before changing the verifier.

Expected assertions:

- `scripts/verify-generated.ts` includes a CV verification path, either `public/cv` or a generated manifest path.
- `package.json` `check` continues to include `bun run verify:generated`.
- CI continues to run `bun run check`.
- The verifier restores tracked files after generator execution, matching existing behavior.

If using a manifest approach, add tests that assert the manifest/check covers all six expected tracked CV files:

- `public/cv/christian_erben_cv_en.pdf`
- `public/cv/christian_erben_cv_en_with_certificates.pdf`
- `public/cv/christian_erben_cv_en.docx`
- `public/cv/christian_erben_cv_de.pdf`
- `public/cv/christian_erben_cv_de_with_certificates.pdf`
- `public/cv/christian_erben_cv_de.docx`

**Verify**: `bun run test:run -- src/tests/verifyGeneratedScript.test.ts src/tests/toolingConfig.test.ts` -> fails before implementation.

### Step 3: Extend `verify-generated` safely

Choose one path:

Path A - deterministic byte freshness:

- Add all tracked `public/cv` files to `generatedPaths`.
- Add `run("bun", ["run", "generate:cv"])` before the other generators.
- Ensure restore logic handles binary files, which it already does via Buffers.
- Keep stale output listing concrete file paths.

Path B - manifest/invariant freshness:

- Add a lightweight verification step that runs `generate:cv` in a temporary directory or checks the tracked artifacts for existence, non-zero size, expected names, expected language/variant count, and valid file signatures (`%PDF` for PDF, ZIP header for DOCX).
- If generation cannot be redirected without refactoring, prefer checking tracked artifact invariants and documenting that byte freshness remains a manual release step.
- Keep the check inside `verify:generated` so CI covers it.

Do not leave generated artifacts modified if the verifier fails. The script must restore tracked generated files the same way it does today.

**Verify**: `bun run verify:generated` -> exits 0 on a clean checkout and prints a clear success message.

### Step 4: Document the final contract

Update `CONTRIBUTING.md`:

- Say `bun run check` is the default pre-PR gate.
- Say generated CV artifacts are verified by `verify:generated` if you chose Path A, or state exactly what is verified and what still requires an explicit `bun run generate:cv` release step if you chose Path B.
- Keep the hook note, but do not imply the hook is installed automatically.

If `.githooks/pre-commit` needs wording changes in comments only, keep them minimal.

**Verify**: `bun run test:run -- src/tests/toolingConfig.test.ts` -> passes.

### Step 5: Run the full gate and update the plan index

Run:

```sh
bun run lint
bun run typecheck
bun run test:run
bun run test:leaks
bun run verify:generated
bun run build
```

Update `plans/README.md` row for Plan 009 to `DONE` only after all commands pass.

**Verify**: `git status --short` -> only in-scope files changed, plus intentional generated CV changes if Step 1 proved they were legitimately stale and the operator approved including them.

## Test plan

- Tooling tests assert the composite gate still includes generated verification.
- New/updated verifier tests assert the CV artifact contract.
- `bun run verify:generated` is the integration check for actual generator behavior.

## Done criteria

- [ ] CI/local `bun run check` covers a declared CV artifact verification contract.
- [ ] The verifier cannot leave tracked generated files dirty after a failed freshness check.
- [ ] The expected EN/DE PDF/DOCX and certificate variants are covered.
- [ ] Contributor docs no longer imply the hook is the only safety net.
- [ ] `bun run lint`, `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run build` exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- `generate:cv` is nondeterministic and there is no cheap invariant check that provides useful signal.
- Redirecting generation to a temp directory requires broad refactoring of `scripts/generate-cv.tsx`.
- Fresh generation changes tracked CV artifacts and you cannot tell whether the changes are legitimate content drift.
- The fix requires removing tracked CV binaries.

## Maintenance notes

Generated binary verification is easy to make flaky. Reviewers should prefer stable invariants over byte-for-byte snapshots unless determinism is proven. If future CV generation adds variants, the verifier tests must force the expected artifact list to be updated in the same PR.
