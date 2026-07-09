# Plan 008: Validate custom CV hash data before rendering

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report - do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ae69f03..HEAD -- src/pages/cv.tsx src/components/cv/CVDocument.tsx src/components/cv/CVDocumentDocx.tsx src/tests/pages/CV.test.tsx src/content/content.ts src/lib/cv-data.ts src/lib/cv-data.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: correctness
- **Planned at**: commit `ae69f03`, 2026-07-09

## Why this matters

The hidden CV editor can load a complete `SiteContent` object from a compressed `#data=` URL hash. The current guard checks only shallow fields, but the PDF, DOCX, and editor code dereference deeper arrays and objects directly. A stale or crafted shared URL can pass the guard and then crash the custom CV path.

## Current state

- `src/pages/cv.tsx` - owns hash encode/decode, shallow shape guard, and custom CV state.
- `src/components/cv/CVDocument.tsx` - renders custom data into PDF and directly indexes fields.
- `src/components/cv/CVDocumentDocx.tsx` - renders custom data into DOCX and directly reads nested contact/social fields.
- `src/tests/pages/CV.test.tsx` - covers invalid top-level hash fallback but not shallow-valid/deep-invalid data.
- `src/content/content.ts` - defines `SiteContent` and related interfaces.

Current excerpts:

```ts
// src/pages/cv.tsx:157-182
const isSiteContentShape = (value: unknown): value is SiteContent => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<SiteContent>;

  return (
    typeof candidate.hero?.name === 'string' &&
    Array.isArray(candidate.hero.titleElements) &&
    candidate.hero.titleElements.every(isLocalizedString) &&
    Array.isArray(candidate.about?.paragraphs) &&
    Array.isArray(candidate.experiences) &&
    Array.isArray(candidate.skills) &&
    typeof candidate.contact?.email === 'string' &&
    typeof candidate.contact?.socialLinks === 'object' &&
    candidate.contact.socialLinks !== null &&
    typeof candidate.imprint?.address === 'object' &&
    candidate.imprint.address !== null &&
    typeof candidate.skillsSection?.categories === 'object' &&
    candidate.skillsSection.categories !== null &&
    isLocalizedString(candidate.backToHome) &&
    isLocalizedString(candidate.experienceSectionTitle) &&
    isLocalizedString(candidate.experienceAchievementPrefix) &&
    isLocalizedString(candidate.downloadResume)
  );
};
```

```ts
// src/pages/cv.tsx:198-205
const decodedJson = decodeData(savedData);
const decodedData = JSON.parse(decodedJson);
if (!isSiteContentShape(decodedData)) {
  console.warn('Ignoring invalid CV data from URL hash');
  return siteContent;
}
return decodedData;
```

```tsx
// src/components/cv/CVDocument.tsx:476-479
<View style={styles.section}>
  <Text style={styles.sectionTitle}>{t({ en: "Profile", de: "Profil" })}</Text>
  <Text style={styles.description}>{t(about.paragraphs[0])}</Text>
  <Text style={styles.description}>{t(about.paragraphs[1])}</Text>
</View>
```

```ts
// src/components/cv/CVDocumentDocx.tsx:183-190
...[
  ['Email', contact.cvemail],
  ['Phone', contact.phone],
  ['Homepage', contact.homepage],
  ['LinkedIn', contact.socialLinks.linkedin],
  ['Xing', contact.socialLinks.xing],
  ['Birthday', contact.birthday],
  ['Address', `${t(imprint.address.street)}, ${t(imprint.address.city)}`],
].map(([label, value]) =>
```

```ts
// src/tests/pages/CV.test.tsx:221-234
it("ignores URL hash data that does not match the CV content shape", () => {
  const asPath = `/cv#data=${encodeHashData({
    hero: {
      name: "Incomplete Candidate",
    },
  } as SiteContent)}`;

  renderCVPage(undefined, asPath);

  expect(screen.getByRole("link", { name: /Download PDF/i })).toHaveAttribute(
    "href",
    expect.stringContaining("/cv/christian_erben_cv_en.pdf"),
  );
});
```

Repo conventions to match:

- The project already depends on Zod and uses it in `src/components/ContactSection.tsx`.
- Keep `src/pages/cv.tsx` focused on page state; new reusable parsing/validation logic belongs in `src/lib`.
- Tests use Vitest and Testing Library.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install --frozen-lockfile` | exit 0 |
| Targeted tests | `bun run test:run -- src/tests/pages/CV.test.tsx src/lib/cv-data.test.ts` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test:run` | exit 0 |
| Async leak check | `bun run test:leaks` | exit 0 |
| Generated freshness | `bun run verify:generated` | exit 0 |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `src/pages/cv.tsx`
- `src/lib/cv-data.ts` (create)
- `src/lib/cv-data.test.ts` (create)
- `src/tests/pages/CV.test.tsx`
- `plans/README.md` status row only

**Out of scope**:

- Do not redesign or remove the hidden CV editor.
- Do not change default static CV download behavior.
- Do not change generated `SiteContent` source data in `src/content/content.ts`.
- Do not add a new dependency; use existing Zod or plain validators.

## Git workflow

- Suggested branch: `advisor/008-validate-custom-cv-hash-data`
- Commit message style: `Validate custom CV hash data`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Extract hash data helpers and add failing tests

Create `src/lib/cv-data.ts` and move or reimplement the page-local encode/decode/shape logic there.

Add `src/lib/cv-data.test.ts` with these tests before implementation:

- Accepts the current `siteContent` shape.
- Rejects data where `about.paragraphs` is an empty array even if all shallow checks pass.
- Rejects an experience with a missing `description` array or malformed description item.
- Rejects `contact.socialLinks` when it is missing or not an object.
- Rejects an unknown skill category not present in `skillsSection.categories`.
- Rejects a payload above a hard maximum size before decompressing/parsing if practical. Use a modest limit such as 50 KB compressed/hash string unless the current valid encoded `siteContent` needs more; measure and choose a limit with headroom.

Export functions with explicit names, for example:

```ts
export function encodeCvData(data: SiteContent): string;
export function decodeCvData(encoded: string): SiteContent | null;
export function isCustomCvData(value: unknown): value is SiteContent;
```

**Verify**: `bun run test:run -- src/lib/cv-data.test.ts` -> fails before validation is implemented.

### Step 2: Implement deep validation without losing supported custom data

Implement validation in `src/lib/cv-data.ts`.

Recommended approach:

- Use Zod for serializable fields that custom hash data can contain.
- Do not require React component function fields such as `Skill.icon` or `SecurityComplianceItem.icon` from hash data, because serialized JSON cannot carry functions. Instead, normalize accepted custom data by merging non-serializable icon fields from `siteContent` where the runtime needs them, or keep validation focused on the fields consumed by `CVEditor`, `CVDocument`, and `CVDocumentDocx`.
- Require at least two `about.paragraphs` entries because PDF and DOCX render `[0]` and `[1]`.
- Require every localized string used by the editor/renderers to contain string `en` and `de`.
- Require arrays consumed with `.map()` to actually be arrays.
- Require skill categories to be keys of `skillsSection.categories`.
- Return `null` instead of throwing for invalid hash data; the page should fall back to `siteContent`.

If you find that a full `SiteContent` schema is too broad for this plan, create a `CustomCvData` schema that covers exactly the fields rendered by `CVEditor`, `CVDocument`, and `CVDocumentDocx`, then normalize it to `SiteContent`.

**Verify**: `bun run test:run -- src/lib/cv-data.test.ts` -> all new helper tests pass.

### Step 3: Use the helper from `src/pages/cv.tsx`

In `src/pages/cv.tsx`:

- Remove page-local `encodeData`, `decodeData`, `isLocalizedString`, and `isSiteContentShape`.
- Import `encodeCvData` and `decodeCvData` from `@/lib/cv-data`.
- In `getInitialCvData`, call `decodeCvData(savedData)`.
- On invalid data, keep current fallback behavior: log a warning and return `siteContent`.
- In `handleDataChange`, call `encodeCvData(newData)`.
- Keep the public URL format `#data=<encoded>` unchanged for valid data.

**Verify**: `bun run test:run -- src/tests/pages/CV.test.tsx src/lib/cv-data.test.ts` -> all targeted tests pass.

### Step 4: Add page-level regression tests for shallow-valid invalid hash data

In `src/tests/pages/CV.test.tsx`, add a test that builds a shallow-valid object by spreading `siteContent` and corrupting a deeper field, for example:

```ts
const invalidCustomData = {
  ...siteContent,
  about: {
    ...siteContent.about,
    paragraphs: [],
  },
};
```

Encode it with the existing test helper and render `/cv#data=...`.

Assert that:

- The page falls back to static default downloads.
- `generateCvDocx` is not called during render.
- No custom DOCX button from the lazy custom mock is necessary to render.

Add a second test for an unknown skill category if the helper test alone does not cover page integration.

**Verify**: `bun run test:run -- src/tests/pages/CV.test.tsx src/lib/cv-data.test.ts` -> all targeted tests pass.

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

Update `plans/README.md` row for Plan 008 to `DONE` only after all commands pass.

**Verify**: `git status --short` -> only in-scope files changed, plus ignored build artifacts if `build` produced them.

## Test plan

- New unit tests for `src/lib/cv-data.ts` cover valid site content, malformed nested arrays, malformed contacts/social links, unknown skill categories, invalid JSON/compression, and oversize hash input.
- Page-level CV test verifies shallow-valid/deep-invalid hash data falls back to default static CV behavior.
- Existing CV tests remain green.

## Done criteria

- [ ] CV hash decode/validation lives outside `src/pages/cv.tsx`.
- [ ] Shallow-valid/deep-invalid hash data cannot reach `CVEditor`, `CVDocument`, or `CVDocumentDocx`.
- [ ] Valid current `siteContent` can still be encoded and decoded.
- [ ] The public hash format remains `#data=<encoded>`.
- [ ] `bun run lint`, `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run build` exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- You discover external users rely on old custom hash URLs that the stricter schema would reject.
- A correct fix requires changing `SiteContent` definitions or generated content.
- The helper cannot validate without adding a dependency.
- The page no longer resembles the excerpts above.

## Maintenance notes

Future `SiteContent` changes that affect the CV editor or generated PDF/DOCX must update `src/lib/cv-data.ts` and its tests in the same PR. Reviewers should check that non-serializable fields from `src/content/content.ts` are either intentionally excluded from custom hash data or restored from defaults during normalization.
