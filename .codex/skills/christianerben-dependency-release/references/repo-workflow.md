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

## Relevant Update Follow-Up

After updating dependencies, inspect upstream release notes, changelogs, migration guides, and official documentation for the changed packages. Look for new features, framework capabilities, security or performance options, deprecations, and configuration changes that matter for this Next.js portfolio.

Create a separate GitHub issue when an update introduces a relevant optional improvement that should be considered after the release. Keep that issue out of the dependency PR unless the adoption work is required for the package update to pass. The issue should explain:

- what the update includes
- how the repository could use the new feature or changed capability
- what would need to change to activate or adopt it
- advantages of enabling it
- disadvantages, risks, migration cost, or reasons to defer it

If no relevant optional improvement exists, do not create a placeholder issue. Note the no-op follow-up check in the final release summary.

## Vercel Checks

After each push to `development`, `preproduction`, and `main`, poll the matching Vercel deployment for up to 5 minutes until it reaches `READY`. If deployment becomes `ERROR` or `CANCELED`, fetch build logs, fix the issue locally, re-run lint/test/build/screenshots, and resume from the failed branch.

Known risk: `scripts/vercel-deploy-check.sh` may be inverted because allowed branches can exit with status `1`. If Vercel fails on this script, treat it as a repairable repository bug.

## GitHub Review Watch

After opening the PR, watch the Codex GitHub review lifecycle before merging. Start with the GitHub plugin's general `github` skill for PR metadata. Route review-thread work to `gh-address-comments`, because unresolved inline comments and requested changes require thread-aware reads through `gh api graphql`. Route failing GitHub Actions checks to `gh-fix-ci`.

Use PR reaction emojis as the authoritative Codex review lifecycle signal. The eyes emoji means review has started. The thumbs-up emoji means review has finished, and any objections should be recorded in the PR thread or review comments. The initial emoji can appear with a delay after PR creation, so do not merge just because no emoji is present immediately.

After opening the PR, wait up to 10 minutes for the initial Codex review lifecycle to start. If no eyes emoji, thumbs-up emoji, review comment, or other Codex activity appears during that startup window, comment exactly `@codex review` on the PR to trigger the remote review, then keep watching for the eyes emoji followed by the thumbs-up emoji. Do not merge while the eyes emoji is present without a later thumbs-up completion signal for the current head commit.

After the thumbs-up emoji appears, inspect review threads and PR comments. Address actionable unresolved review feedback, push fixes, restart the relevant verification loop, and then restart the emoji-based review watch from the beginning. After every new push, assume the remote Codex review starts again automatically; wait for the delayed initial eyes emoji for the new head commit, apply the same 10-minute `@codex review` fallback only if no Codex activity starts, and then wait for the matching thumbs-up completion signal before continuing.

## Local Cleanup

After `development`, `preproduction`, and `main` have been pushed and the final `main` deployment is `READY`, leave the local checkout on `development`. Update it from `origin/development`, delete the merged local `codex/update-dependencies-<timestamp>` branch, and remove any temporary local worktree or checkout created only for the update run. Keep screenshot artifacts under `.artifacts/`, do not commit them, and leave the worktree clean unless the user explicitly asks to keep a branch, worktree, or artifact.

## Final Summary

Do not generate a separate HTML report. Finish the release with a concise plain-text summary in the final user response, modelled after an automation run log. Include the most useful operational facts:

- run id, job/status/session/cwd/finished timestamp when available
- one-sentence completion outcome
- merged PR URL and final branch commit
- follow-up issue URLs created for relevant update features, or a note that no relevant follow-up was found
- final local branch and cleanup result
- visual artifact path, if screenshots were captured
- package upgrades as `name old -> new`
- validation commands that passed
- Vercel deployment results for `development`, `preproduction`, and `main`
- GitHub review/check watch outcome and any residual notes
