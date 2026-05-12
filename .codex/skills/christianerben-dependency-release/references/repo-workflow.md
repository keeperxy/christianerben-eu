# christianerben-eu Dependency Release Reference

## Constants

- Repo: `/home/coach007/dev/sites/christianerben-eu`
- Release branches: `development -> preproduction -> main`
- PR target: `development`
- Vercel team: `Christian's projects` / `christians-projects-693c521b`
- Vercel project: `christianerben-eu` / `prj_0P9YPvnH3AoHjgps5Sady3gnc3IW`
- Screenshot pages: `/`, `/cv`, `/imprint`, `/privacy`, `/sitemap`, `/404`
- Commands: `bun run dev`, `bun run lint`, `bun run test`, `bun run build`

## Hook And Generated Files

The pre-commit hook lives at `.githooks/pre-commit`. On the `development` branch it runs:

```bash
bun run generate:cv
bun run generate:llms
bun run generate:sitemap
bun run update:last-updated
```

Run these generator commands explicitly on the PR branch before final verification. During the final local merge to `development`, run the real hook on `development` and include any resulting generated files in the merge commit.

## Visual Verification

Capture desktop and mobile screenshots for `/`, `/cv`, `/imprint`, `/privacy`, `/sitemap`, and `/404`. The comparison is tolerant: expect small rendering differences after dependency upgrades, but fail for blank pages, error pages, severe layout breaks, missing routes, failed network responses, or unexpected console errors.

## Vercel Checks

After each push to `development`, `preproduction`, and `main`, poll the matching Vercel deployment for up to 5 minutes until it reaches `READY`. If deployment becomes `ERROR` or `CANCELED`, fetch build logs, fix the issue locally, re-run lint/test/build/screenshots, and resume from the failed branch.

Known risk: `scripts/vercel-deploy-check.sh` may be inverted because allowed branches can exit with status `1`. If Vercel fails on this script, treat it as a repairable repository bug.
