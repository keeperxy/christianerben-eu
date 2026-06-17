# Plan 004: Restore Static-First Page Rendering

Status: DONE

Baseline commit: `6b8e92b`

## Finding

The portfolio is mostly static content, but `src/pages/_app.tsx` defines `MyApp.getInitialProps` to detect language from cookies and `Accept-Language`. In the Next.js pages router, app-level `getInitialProps` makes the app do request-time work that static pages otherwise do not need.

This is a deliberate tradeoff: removing it improves static-first rendering, but first-visit language detection must move to the client or a different routing strategy.

## Evidence

App-level request-time language detection:

```ts
// src/pages/_app.tsx
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const req = appContext.ctx.req;
  let initialLanguage: Language = "en";
  ...
  return { ...appProps, initialLanguage };
};
```

Client-side language persistence already exists:

```ts
// src/contexts/SettingsContext.tsx
document.documentElement.setAttribute('lang', language);
window.localStorage.setItem('language', language);
const secure = window.location.protocol === 'https:' ? '; Secure' : '';
window.document.cookie = `language=${language}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
```

Repo search found no page-level `getStaticProps` or `getServerSideProps` in `src/pages`.

## Scope

In scope:

- `src/pages/_app.tsx`
- `src/contexts/SettingsContext.tsx`
- A focused settings/provider test, for example `src/contexts/SettingsContext.test.tsx`
- Any page tests that need adjustment after language initialization changes

Out of scope:

- Migrating to the App Router
- Adding route prefixes such as `/de`
- Adding Next middleware
- Changing copy/content
- Changing the contact or CV plans

## Implementation Steps

1. Write tests for the target language behavior.

   Add a focused test for `SettingsProvider` that verifies:

   - Default language is `en` when there is no stored preference.
   - A valid `localStorage.language` value (`de` or `en`) is applied after mount.
   - Invalid stored values are ignored.
   - Changing language updates `document.documentElement.lang`, `localStorage`, and the `language` cookie.

   If preserving first-visit browser-language preference is desired, add a test for `navigator.language` or `navigator.languages` fallback. Keep this fallback client-only.

2. Remove app-level `getInitialProps`.

   In `src/pages/_app.tsx`:

   - Remove `import App from "next/app";`
   - Remove `type AppContext`.
   - Remove `AppWithLanguageProps` if it is only used for `initialLanguage`.
   - Change `MyApp` to accept normal `AppProps`.
   - Render `<SettingsProvider>` without `initialLanguage`, unless a test-proven client-only default still needs the prop.
   - Delete `MyApp.getInitialProps`.

3. Move any necessary first-visit language behavior into `SettingsProvider`.

   `SettingsProvider` already reads `localStorage` after mount. If the product still wants German browser preference on first visit, extend the existing effect:

   - Check `localStorage.language` first.
   - If absent, inspect `navigator.languages` / `navigator.language`.
   - Use `de` when the browser language starts with `de`, otherwise `en`.
   - Keep server render deterministic as `en` to avoid hydration mismatches.

   Do not read request headers in the client provider.

4. Verify build output.

   Run:

   ```bash
   bun run build
   ```

   Inspect the route output and warnings. Expected result: no app-level `getInitialProps` warning, and static pages should be eligible for static output unless another page-specific feature prevents it.

5. Update docs only if behavior changes.

   If first-visit language selection changes from server-side `Accept-Language` to client-side preference, add a short note to `README.md` or leave a PR summary note. Do not over-document internal implementation.

## Verification

Run:

```bash
bun run test -- src/contexts/SettingsContext.test.tsx --run
bun run lint
bun run test -- --run
./node_modules/.bin/tsc --noEmit --incremental false --pretty false
bun run build
```

Expected results:

- New settings tests pass.
- Existing page tests pass.
- TypeScript and Oxlint exit 0.
- Production build succeeds.
- Build output has no warning caused by `_app.getInitialProps`.

## Done Criteria

- `src/pages/_app.tsx` no longer defines `MyApp.getInitialProps`.
- Request headers are not needed to render the portfolio pages.
- Language preference still persists through localStorage and cookie.
- First-visit language behavior is explicitly covered by tests.
- Production build succeeds.

## Escape Hatches

- If server-side language negotiation is a hard requirement, stop and report that tradeoff. Do not remove `getInitialProps` while pretending behavior is unchanged.
- If build output still marks pages dynamic after removing `_app.getInitialProps`, identify the remaining dynamic cause before changing unrelated code.
