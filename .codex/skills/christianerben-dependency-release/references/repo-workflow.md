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

## GitHub Review Watch

After opening the PR, leave time for delayed GitHub reviews before merging. Start with the GitHub plugin's general `github` skill for PR metadata. Route review-thread work to `gh-address-comments`, because unresolved inline comments and requested changes require thread-aware reads through `gh api graphql`. Route failing GitHub Actions checks to `gh-fix-ci`.

Default watch window: poll every 5 minutes for up to 30 minutes after the PR is opened. Extend the wait if checks are still pending, review activity is ongoing, or the user explicitly asks for a longer watch. Address actionable unresolved review feedback, push fixes, and restart the relevant verification loop before merging.

## Final Summary

Do not generate a separate HTML report. Finish the release with a concise plain-text summary in the final user response, modelled after an automation run log. Include the most useful operational facts:

- run id, job/status/session/cwd/finished timestamp when available
- one-sentence completion outcome
- merged PR URL and final branch commit
- visual artifact path, if screenshots were captured
- package upgrades as `name old -> new`
- validation commands that passed
- Vercel deployment results for `development`, `preproduction`, and `main`
- GitHub review/check watch outcome and any residual notes
