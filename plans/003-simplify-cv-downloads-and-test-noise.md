# Plan 003: Simplify CV Downloads And Remove Test Network Noise

Status: DONE

Baseline commit: `6b8e92b`

## Finding

The default CV download buttons fetch static public files into memory, create object URLs, and synthesize link clicks. Those files are already available under `public/cv`, so normal anchor downloads are simpler and more reliable.

The CV page tests render an iframe whose `src` points at `/cv/*.pdf`. Under Happy DOM, that iframe attempts real localhost fetches during tests. The full test suite exits 0, but it prints `ECONNREFUSED` / abort errors for `http://localhost:3000/cv/christian_erben_cv_en.pdf`.

## Evidence

Static download implementation:

```ts
// src/pages/cv.tsx
const response = await fetch(href);
...
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const link = document.createElement('a');

link.href = url;
link.download = buildStaticFilename(ext);
link.click();
```

PDF preview iframe:

```tsx
// src/pages/cv.tsx
<iframe
  src={`/cv/christian_erben_cv_${language}${isDefaultData && includeCertificates ? "_with_certificates" : ""}.pdf#toolbar=0&navpanes=0`}
  className="max-w-[796px] w-full h-full min-h-[600px] border-0 rounded"
  title={language === 'en' ? 'Curriculum Vitae' : 'Lebenslauf'}
  data-testid="cv-preview"
/>
```

Current test named as a download test does not click:

```ts
// src/tests/pages/CV.test.tsx
it("triggers a DOCX download when the button is clicked", async () => {
  renderCVPage();

  const docxButtons = await screen.findAllByRole("button", { name: /Download DOCX/i });
  expect(docxButtons.length).toBeGreaterThan(0);
  expect(docxButtons[0]).toHaveTextContent(/Download DOCX/i);
});
```

The `Button` component supports `asChild`, so links can keep the same styling:

```tsx
// src/components/ui/button.tsx
const Comp = asChild ? Slot : "button"
```

## Scope

In scope:

- `src/pages/cv.tsx`
- `src/tests/pages/CV.test.tsx`
- Possibly a small extracted preview component if it makes testing cleaner

Out of scope:

- Regenerating CV PDFs/DOCX files
- Changing CV content or layout
- Removing the hidden custom CV editor
- Replacing `@react-pdf/renderer` or `docx`
- Changing the public `/cv/...` asset paths

## Implementation Steps

1. Update tests first for the desired behavior.

   In `src/tests/pages/CV.test.tsx`, replace the weak DOCX test with assertions that default static download controls are links:

   - `Download PDF` is a link with `href` containing `/cv/christian_erben_cv_en.pdf`.
   - The PDF link has a `download` attribute matching `christian_erben_cv_en_<YYYY-MM-DD>.pdf` or a stable regex.
   - `Download DOCX` is a link with `href` containing `/cv/christian_erben_cv_en.docx`.
   - Toggling "With certificates" changes the PDF link href and preview iframe src to `_with_certificates.pdf`; the DOCX link stays on the normal `.docx`.

   The test should fail before implementation because the controls are currently buttons, not links.

2. Suppress real iframe network work in tests.

   Prefer one of these approaches, in this order:

   - Stub Happy DOM's fetch path for `/cv/*.pdf` in the CV test setup and return a small fake PDF response.
   - If that does not stop iframe network noise, extract the iframe into a small component inside `src/pages/cv.tsx` or a new local component, then mock that component in `CV.test.tsx` while keeping one focused test that asserts the computed `src` string.

   Do not hide `console.error` globally. The goal is to stop the real network work, not silence errors.

3. Replace static blob downloads with normal links.

   In the `isDefaultData` branch of `CvDownloadButtons`, remove `handleStaticDownload`, `staticLoading`, `URL.createObjectURL`, and the synthetic click flow.

   Use `Button asChild`:

   ```tsx
   <Button asChild className="rounded-full shadow-lg hover-scale" variant="secondary">
     <a href={staticPdfHref} download={buildStaticFilename("pdf")}>
       <Download className="mr-2 h-4 w-4" />
       {language === "en" ? "Download PDF" : "PDF herunterladen"}
     </a>
   </Button>
   ```

   Do the same for DOCX. On mobile, use anchor elements in the menu with the same `href` and `download` behavior.

4. Keep custom-data downloads unchanged.

   When `cvData !== siteContent`, the code should still lazy-load `CvDownloadButtonsCustom` and generate PDF/DOCX from custom data. Do not pull heavy PDF/DOCX generation into the default path.

5. Run the focused test and inspect output.

   ```bash
   bun run test -- src/tests/pages/CV.test.tsx --run
   ```

   Expected after implementation: tests pass without localhost `ECONNREFUSED` output.

## Verification

Run:

```bash
bun run test -- src/tests/pages/CV.test.tsx --run
bun run lint
bun run test -- --run
./node_modules/.bin/tsc --noEmit --incremental false --pretty false
```

Expected results:

- CV tests pass.
- Full Vitest run exits 0 and no longer prints Happy DOM localhost PDF fetch errors.
- Oxlint and TypeScript exit 0.

## Done Criteria

- Default CV PDF and DOCX downloads are normal links to static files.
- Certificate toggle still affects the PDF preview and PDF download link.
- Custom CV data still uses lazy custom PDF/DOCX generation.
- The CV tests exercise actual link/download behavior rather than only checking button text.
- Full test output is free of the previous Happy DOM `ECONNREFUSED` iframe noise.

## Escape Hatches

- If `Button asChild` causes accessibility or styling regressions, keep anchors styled directly with the existing `buttonVariants` helper instead of reverting to blob fetches.
- If Happy DOM still fetches iframe URLs after fetch stubbing, extract and mock the preview component in tests rather than silencing console output.
