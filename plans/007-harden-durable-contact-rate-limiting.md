# Plan 007: Harden durable contact rate limiting

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report - do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ae69f03..HEAD -- src/pages/api/send-mail.ts src/tests/pages/SendMailApi.test.ts README.md .gitignore .env.example`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security / correctness / dx
- **Planned at**: commit `ae69f03`, 2026-07-09

## Why this matters

The contact API already validates payloads, escapes mail HTML, and rate limits requests. The remaining durable rate-limit path can still hang on a slow external endpoint because `fetch` has no timeout, and it derives durable keys with a public fallback secret if `CONTACT_RATE_LIMIT_ENDPOINT` is set without `CONTACT_RATE_LIMIT_KEY_SECRET`. This plan makes the optional durable limiter fail closed quickly and preserves the privacy boundary for client-address hashes.

## Current state

- `src/pages/api/send-mail.ts` - contact form API and rate limiter.
- `src/tests/pages/SendMailApi.test.ts` - existing focused API tests with mocked Resend and mocked `fetch`.
- `README.md` - documents required and optional contact env vars.
- `.gitignore` - currently ignores only `*.local` for local env-like files.

Current excerpts:

```ts
// src/pages/api/send-mail.ts:146-152
function getDurableRateLimitKey(clientAddress: string) {
  return createHmac(
    "sha256",
    process.env.CONTACT_RATE_LIMIT_KEY_SECRET || DURABLE_RATE_LIMIT_KEY_NAMESPACE,
  )
    .update(clientAddress)
    .digest("hex");
}
```

```ts
// src/pages/api/send-mail.ts:213-246
async function consumeDurableRateLimit(key: string) {
  const endpoint = process.env.CONTACT_RATE_LIMIT_ENDPOINT;
  if (!endpoint) {
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = process.env.CONTACT_RATE_LIMIT_ENDPOINT_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      key,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    }),
  });
```

```ts
// src/pages/api/send-mail.ts:249-264
async function consumeContactRateLimit(req: NextApiRequest) {
  const clientAddress = getClientAddress(req);

  try {
    const durableAllowed = await consumeDurableRateLimit(
      getDurableRateLimitKey(clientAddress),
    );
    if (durableAllowed !== null) {
      return durableAllowed;
    }
  } catch (error) {
    console.error("Contact durable rate limit failed", error);
    return false;
  }

  return consumeRateLimit(getEphemeralRateLimitKey(clientAddress));
}
```

```md
<!-- README.md:41-42 -->
- Required env: `RESEND_API_KEY` (and optional `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` for contact form delivery)
- Optional env: `CONTACT_RATE_LIMIT_ENDPOINT`, `CONTACT_RATE_LIMIT_ENDPOINT_TOKEN`, and `CONTACT_RATE_LIMIT_KEY_SECRET` to delegate contact-form rate limiting to a durable service. The endpoint receives `{ key, maxRequests, windowMs }` and must return `{ allowed: boolean }`.
```

```gitignore
# .gitignore:10-15
node_modules
dist
dist-ssr
*.local
.next
next-env.d.ts
```

Repo conventions to match:

- API tests use a local `createRequest`, `createMockResponse`, and `post()` helper in `src/tests/pages/SendMailApi.test.ts`.
- Contact API client responses are generic; provider and internal details are logged server-side but not returned.
- Use existing TypeScript style: interfaces for object shapes, `import type` for types, and double quotes in this file.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install --frozen-lockfile` | exit 0 |
| Targeted tests | `bun run test:run -- src/tests/pages/SendMailApi.test.ts` | exit 0, SendMail API tests pass |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test:run` | exit 0 |
| Async leak check | `bun run test:leaks` | exit 0 |
| Generated freshness | `bun run verify:generated` | exit 0, "Generated artifacts are current." |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `src/pages/api/send-mail.ts`
- `src/tests/pages/SendMailApi.test.ts`
- `README.md`
- `.gitignore`
- `.env.example` (create if absent)
- `plans/README.md` status row only

**Out of scope**:

- Do not change contact form UI fields in `src/components/ContactSection.tsx`.
- Do not change Resend message HTML except where needed for tests to keep compiling.
- Do not add a new hosted rate-limit service or dependency.
- Do not log or commit real secret values.

## Git workflow

- Suggested branch: `advisor/007-harden-durable-contact-rate-limiting`
- Commit message style in this repo is short and imperative, e.g. `Harden contact rate limiting`.
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add failing tests for durable limiter timeout and missing secret

In `src/tests/pages/SendMailApi.test.ts`, add two tests near the existing durable rate-limit tests.

Test A: endpoint configured without `CONTACT_RATE_LIMIT_KEY_SECRET`.

- Set `process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact"`.
- Ensure `CONTACT_RATE_LIMIT_KEY_SECRET` is deleted.
- Mock `globalThis.fetch` with `vi.fn<typeof fetch>()`.
- Call `post()`.
- Expect status `429`, no mail send, and no fetch call. The API should fail closed before transmitting a key derived with a public fallback secret.

Test B: endpoint stalls until timeout.

- Use fake timers and set `CONTACT_RATE_LIMIT_ENDPOINT` plus `CONTACT_RATE_LIMIT_KEY_SECRET`.
- Mock `fetch` to return a Promise that rejects when the supplied `AbortSignal` aborts.
- Start `const responsePromise = post();`.
- Advance timers past the configured timeout using `await vi.advanceTimersByTimeAsync(...)`.
- Await the response and expect status `429`, no mail send.
- Restore real timers in `finally`.

**Verify**: `bun run test:run -- src/tests/pages/SendMailApi.test.ts` -> fails before implementation because the missing-secret path still calls `fetch` and/or the timeout behavior is absent.

### Step 2: Require a durable HMAC secret when the durable endpoint is configured

In `src/pages/api/send-mail.ts`:

- Remove the fallback from `getDurableRateLimitKey` for the durable path.
- Add a small helper such as `getDurableRateLimitSecret()` that returns `process.env.CONTACT_RATE_LIMIT_KEY_SECRET` only when it is a non-empty string.
- In `consumeContactRateLimit`, if `CONTACT_RATE_LIMIT_ENDPOINT` is set and the secret is missing, throw or return `false` through the existing fail-closed catch path.
- Keep the in-memory ephemeral limiter unchanged when no durable endpoint is configured.
- Keep client response generic: status `429` with the existing "Too many contact requests..." message is acceptable.

Target shape:

```ts
const secret = getDurableRateLimitSecret();
if (process.env.CONTACT_RATE_LIMIT_ENDPOINT && !secret) {
  throw new Error("Durable rate limit secret is not configured.");
}
```

Use the secret when calling `createHmac`. Do not include any secret value in tests or docs.

**Verify**: `bun run test:run -- src/tests/pages/SendMailApi.test.ts` -> missing-secret test passes; timeout test may still fail until Step 3.

### Step 3: Add a short timeout to the durable limiter fetch

In `src/pages/api/send-mail.ts`:

- Add a constant such as `DURABLE_RATE_LIMIT_TIMEOUT_MS = 2_000`.
- Pass an abort signal to `fetch` in `consumeDurableRateLimit`.
- Prefer `AbortSignal.timeout(DURABLE_RATE_LIMIT_TIMEOUT_MS)` if the configured Node runtime supports it. If TypeScript complains, use `AbortController` plus `setTimeout`, clearing the timeout in a `finally`.
- Let timeout errors flow to the existing catch in `consumeContactRateLimit`, which logs and fails closed.

Do not make the timeout env-configurable unless a deployment requirement appears during implementation.

**Verify**: `bun run test:run -- src/tests/pages/SendMailApi.test.ts` -> all SendMail API tests pass.

### Step 4: Tighten local env hygiene

In `.gitignore`, replace or augment `*.local` so common secret-bearing files are ignored:

```gitignore
.env
.env.*
!.env.example
```

Keep `*.local` if it is still useful for non-env local files.

Create `.env.example` if absent. Include only variable names and harmless placeholders, for example:

```dotenv
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
CONTACT_RATE_LIMIT_ENDPOINT=
CONTACT_RATE_LIMIT_ENDPOINT_TOKEN=
CONTACT_RATE_LIMIT_KEY_SECRET=
```

Update `README.md` deployment notes to say that `CONTACT_RATE_LIMIT_KEY_SECRET` is required whenever `CONTACT_RATE_LIMIT_ENDPOINT` is set.

**Verify**: `git check-ignore .env .env.production` -> both are ignored; `git check-ignore .env.example` exits non-zero, meaning the template is not ignored.

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

Update `plans/README.md` row for Plan 007 to `DONE` only after all commands pass.

**Verify**: `git status --short` -> only in-scope files changed.

## Test plan

- New SendMail API test: durable endpoint configured without `CONTACT_RATE_LIMIT_KEY_SECRET` fails closed and does not call `fetch`.
- New SendMail API test: stalled durable endpoint aborts within the configured timeout and fails closed.
- Existing SendMail tests must remain green, especially the test that uses the durable endpoint when all env vars are configured.

## Done criteria

- [ ] `CONTACT_RATE_LIMIT_ENDPOINT` without `CONTACT_RATE_LIMIT_KEY_SECRET` cannot send a durable hash derived from a public fallback.
- [ ] Durable rate-limit fetches have a bounded timeout.
- [ ] `.env` and `.env.*` are ignored, while `.env.example` is trackable.
- [ ] `README.md` documents the secret requirement for durable rate limiting.
- [ ] `bun run lint`, `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run build` exit 0.
- [ ] No files outside the in-scope list are modified, except normal ignored build artifacts.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The contact API no longer resembles the excerpts above.
- A deployment requirement exists for durable rate limiting without `CONTACT_RATE_LIMIT_KEY_SECRET`.
- Adding a timeout requires a new runtime dependency.
- The fix appears to require changing contact form UI behavior.

## Maintenance notes

Reviewers should scrutinize that the durable limiter still fails closed: endpoint errors, invalid responses, timeout, and missing secret must not allow mail sends. If a future durable rate-limit service needs a longer timeout, require a deployment note and test update rather than silently increasing it.
