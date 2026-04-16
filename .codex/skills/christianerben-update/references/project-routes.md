# Project Routes

## Screenshot Targets

The current user-facing page inventory comes from `src/pages`:

- `src/pages/index.tsx` -> `/`
- `src/pages/cv.tsx` -> `/cv`
- `src/pages/imprint.tsx` -> `/imprint`
- `src/pages/privacy.tsx` -> `/privacy`
- `src/pages/sitemap.tsx` -> `/sitemap`
- `src/pages/404.tsx` -> `/404`

Always prefer the output of `scripts/discover_routes.py` when files under `src/pages` change.

## Exclusions

Do not treat these as visual routes:

- `src/pages/_app.tsx`
- `src/pages/_document.tsx`
- `src/pages/api/**`
- `/sitemap.xml`
- `/llms.txt`
- files under `public/cv/`

## Stability Notes

- Capture against `http://localhost:3000` unless the local server is running elsewhere. The Next.js dev server warns about cross-origin HMR access when screenshots hit `127.0.0.1`.
- Force a stable rendering environment: Chromium, light color scheme, consistent locale, and the same wait time before every shot.
- The home page lazy-loads multiple sections, so the screenshot pass should wait briefly after `#__next` is present.
- The `/cv` page has lazy functionality for editor and download tooling, but the default route renders predictably enough for full-page snapshots.
