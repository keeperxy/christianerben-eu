# Plan 002: Harden And Test The Contact Mail API

Status: DONE

Baseline commit: `6b8e92b`

## Finding

The contact form is the most abuse-sensitive flow in the portfolio. The browser posts directly to `/api/send-mail`, and the API sends through Resend after only method checks, a hidden honeypot field, email regex validation, and minimum lengths. It also returns internal configuration/provider error text to clients and passes an HTML-escaped email string as `replyTo`.

## Evidence

Client submit path:

```ts
// src/components/ContactSection.tsx
const response = await fetch("/api/send-mail", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    verify: values.verify,
    name: values.name,
    email: values.email,
    message: values.message
  }),
});
```

Server validation and honeypot:

```ts
// src/pages/api/send-mail.ts
if (verify !== "") {
  throw new Error("Suspicious request detected.");
}

if (name.length < 2) {
  throw new Error("Name must be at least 2 characters long.");
}
```

Internal/provider details returned to callers:

```ts
// src/pages/api/send-mail.ts
return res
  .status(500)
  .json({ error: "RESEND_API_KEY is not configured on the server." });
```

```ts
// src/pages/api/send-mail.ts
const message =
  error instanceof Error ? error.message : "Failed to send contact email";
return res.status(500).json({ error: message });
```

Escaped email reused outside HTML:

```ts
// src/pages/api/send-mail.ts
const safeEmail = escapeHtml(payload.email);
...
replyTo: safeEmail,
```

Existing tests do not cover this flow. The homepage page test mocks `ContactSection` instead of rendering or submitting it.

## Scope

In scope:

- `src/pages/api/send-mail.ts`
- `src/components/ContactSection.tsx`
- A new API test file, for example `src/tests/pages/SendMailApi.test.ts`
- Optionally a focused `ContactSection` test if client/server validation messages need alignment

Out of scope:

- Replacing Resend
- Adding CAPTCHA or a third-party bot service
- Changing contact copy or site content
- Adding persistent storage
- Changing deployment env variable names except documenting them if necessary

## Implementation Steps

1. Add failing API tests first.

   Create `src/tests/pages/SendMailApi.test.ts` following the mock-response style in `src/tests/pages/HomepageMarkdown.test.ts`.

   Mock `resend` before importing the handler:

   ```ts
   const sendMock = vi.fn();

   vi.mock("resend", () => ({
     Resend: vi.fn(() => ({
       emails: {
         send: sendMock,
       },
     })),
   }));
   ```

   Cover at least:

   - `GET` returns 405 and `Allow: POST`.
   - Non-object body returns 400.
   - Honeypot `verify` rejects with 400 and does not call Resend.
   - Missing `RESEND_API_KEY` returns a generic 500 message without the env var name.
   - Successful POST calls `resend.emails.send`.
   - Successful POST uses the raw normalized email for `replyTo`, not the HTML-escaped version.
   - HTML body escapes `name`, `email`, and `message`.
   - Provider failure returns a generic 500 message, not the provider's raw `error.message`.
   - Overlong `name`, `email`, or `message` returns 400.
   - Repeated valid submissions from the same IP exceed the server-side rate limit and return 429.

   Run:

   ```bash
   bun run test -- src/tests/pages/SendMailApi.test.ts --run
   ```

   Expected before implementation: multiple failures.

2. Strengthen payload parsing.

   Keep the current small helper style or switch `parsePayload` to `zod`, which is already a dependency. Use explicit server-side limits even if the browser form has validation:

   - `name`: trim, min 2, max 100
   - `email`: trim, max 254, valid email
   - `message`: trim, min 10, max 5000
   - `verify`: string only, must be empty

   Return the raw normalized `email` separately from HTML-escaped values.

3. Align client validation.

   Update `ContactSection`'s Zod schema with the same max lengths. Add `maxLength` attributes to the input and textarea where practical:

   - name input: 100
   - email input: 254
   - message textarea: 5000

   Keep the translated validation messages from `siteContent.contact.formStatus.validation`. If adding max-length messages would require content changes, use a generic existing error message or add bilingual content in `src/content/content.ts` only if necessary.

4. Return generic public errors.

   Preserve detailed server logs:

   ```ts
   console.error("Failed to send contact email", error);
   ```

   But return stable client messages:

   - Missing API key: `Email delivery is not configured.`
   - Provider failure: `Failed to send contact email.`

   Do not include env var names or provider messages in JSON responses.

5. Fix `replyTo`.

   Use `payload.email` for `replyTo`.

   Keep `safeEmail` only for HTML interpolation and the `mailto:` href. If a mail provider expects an address object instead of a string in the installed `resend` version, use the provider-supported shape but keep the raw normalized address.

6. Add a small in-memory rate limiter.

   For this site, a module-level Map is enough as a first barrier:

   - Key by the first IP in `x-forwarded-for`, falling back to `req.socket.remoteAddress` and then `"unknown"`.
   - Allow 5 accepted attempts per hour per key.
   - Count after payload parsing and before constructing `Resend`.
   - Return `429` with a generic message when exceeded.
   - Prune expired entries during each check to avoid unbounded Map growth.

   Export only what tests need. If a reset helper is required, name it with an obvious test-only marker and keep it out of production call sites:

   ```ts
   export const __resetContactRateLimitForTests = () => rateLimitBuckets.clear();
   ```

   If the project already has Vercel/WAF rate limiting configured outside the repo, still keep the local validation and generic-error tests; document the external limit in the plan outcome instead of duplicating behavior blindly.

## Verification

Run:

```bash
bun run test -- src/tests/pages/SendMailApi.test.ts --run
bun run lint
bun run test -- --run
./node_modules/.bin/tsc --noEmit --incremental false --pretty false
```

Expected results:

- New API tests pass.
- Existing tests still pass.
- Oxlint and TypeScript exit 0.
- Until Plan 003 lands, all-tests output may still include CV iframe Happy DOM network noise.

## Done Criteria

- Valid submissions still send mail through Resend.
- Public API responses no longer expose `RESEND_API_KEY` or raw provider failure text.
- `replyTo` uses the raw normalized email address.
- Server and client enforce max lengths.
- Repeated submissions from the same IP receive 429 before calling Resend.
- The contact mail API has focused regression tests for success, validation, escaping, provider failure, missing config, and rate limiting.

## Escape Hatches

- If the installed `resend` type definitions reject `replyTo: payload.email`, inspect the package types and use the supported non-escaped equivalent. Do not keep HTML escaping in `replyTo`.
- If rate limiting in a serverless module-level Map is judged insufficient for production, keep it as defense-in-depth and add a follow-up note for Vercel Firewall or provider-level rate limiting. Do not block generic errors and validation on external infrastructure.
