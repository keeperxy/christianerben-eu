# Tailnet dev server recipe

## Purpose

Use this recipe when a repository should support one default command:

```sh
bun run dev
```

The command should:

- start the framework dev server on `127.0.0.1` for local tools and agents;
- expose the same app through Tailscale HTTPS on port `443`;
- print a clickable Tailnet URL in the terminal output;
- avoid Portless owning Tailnet port `443`.

This pattern is intentionally repo-local. Different frameworks need different
host, origin, HMR, or allowed-host settings.

## Recommended architecture

Keep the app server local and let Tailscale own HTTPS:

```text
Browser in tailnet
  -> https://<machine>.<tailnet>.ts.net/
  -> tailscale serve --https=443
  -> http://127.0.0.1:<app-port>
  -> framework dev server
```

For Next.js, the app command should bind only to loopback:

```sh
next dev -H 127.0.0.1 -p "${PORT:-3000}"
```

The Tailscale command should proxy that local target:

```sh
tailscale serve --bg --yes --https=443 "http://127.0.0.1:${PORT:-3000}"
```

## Why not Portless as the default

Do not make this the default:

```sh
portless <app-name> --tailscale bun run dev
```

That can recurse if `bun run dev` already starts the repo's Tailnet wrapper.
It can also leave Portless owning HTTPS port `443`, which makes the Tailnet URL
return a Portless `404` with `x-portless: 1` instead of the app.

Use Portless separately only after verifying it routes the Tailnet hostname
correctly for that repo.

## Wrapper behavior

Create a wrapper script, for example `scripts/dev-tailnet.ts`, and point
`package.json` `dev` at it:

```json
{
  "scripts": {
    "dev": "bun scripts/dev-tailnet.ts",
    "dev:local": "next dev",
    "dev:tailnet:off": "tailscale serve --https=443 off",
    "dev:tailnet:status": "tailscale serve status"
  }
}
```

The wrapper should do this in order:

1. Resolve the current Tailscale DNS name with `tailscale status --json`.
2. Export a framework-specific Tailnet host environment variable, such as
   `DEV_TAILNET_HOST`.
3. Stop Portless if it is installed:

   ```sh
   portless proxy stop
   ```

4. Reset existing Tailscale Serve state:

   ```sh
   tailscale serve reset
   ```

5. Configure Tailscale Serve on port `443`:

   ```sh
   tailscale serve --bg --yes --https=443 "http://127.0.0.1:${PORT:-3000}"
   ```

6. Print both URLs before starting or immediately before framework output:

   ```text
   Local: http://127.0.0.1:3000
   Tailnet HTTPS: https://lyra.tailb44a3.ts.net/ -> http://127.0.0.1:3000
   ```

7. Start the framework dev server on `127.0.0.1`.

## Next.js configuration

For Next.js, make the Tailnet host allowed during development:

```js
const tailnetHost = process.env.DEV_TAILNET_HOST ?? "lyra.tailb44a3.ts.net";

const nextConfig = {
  allowedDevOrigins: [tailnetHost],
};

export default nextConfig;
```

Keep the wrapper responsible for setting `DEV_TAILNET_HOST` before spawning
Next.js.

## Tests to add

Add focused tests around the wrapper helpers instead of only testing by hand.
Useful assertions:

- Next.js dev args include `-H 127.0.0.1`.
- Tailscale Serve args include `--https=443`.
- The wrapper prepares `portless proxy stop`.
- The wrapper prepares `tailscale serve reset`.
- Tailscale DNS names ending with `.` are normalized.
- Startup output contains both the local URL and Tailnet HTTPS URL.
- Framework config accepts the current Tailnet host.

Example expected values:

```ts
expect(buildNextDevArgs("3000")).toEqual([
  "x",
  "next",
  "dev",
  "-H",
  "127.0.0.1",
  "-p",
  "3000",
]);

expect(buildTailnetServeArgs("http://127.0.0.1:3000")).toEqual([
  "serve",
  "--bg",
  "--yes",
  "--https=443",
  "http://127.0.0.1:3000",
]);
```

## Verification checklist

After implementing in a repo, run:

```sh
bun run lint
bun run test -- --run
bun run typecheck
```

Then do a live smoke:

```sh
bun run dev
curl -k -I http://127.0.0.1:3000/
curl -k -I https://lyra.tailb44a3.ts.net/
curl -k -I https://lyra.tailb44a3.ts.net/_next/static/development/_buildManifest.js
tailscale serve status
sudo lsof -nP -iTCP:443 -sTCP:LISTEN
```

Expected results:

- local URL returns `200`;
- Tailnet URL returns `200`;
- Next.js static chunks return `200`;
- `tailscale serve status` shows `/ proxy http://127.0.0.1:3000`;
- `lsof` shows Tailscale owning `*:443`, not a Node/Portless process.

If `https://<tailnet-host>/` returns `404` with `x-portless: 1`, Portless is
still answering on `443`. Stop it with:

```sh
portless proxy stop
```

Then rerun `bun run dev`.

## Framework notes

For Next.js:

- bind dev server to `127.0.0.1`;
- set `allowedDevOrigins` to the Tailnet host;
- verify static chunks under `/_next/static/...`.

For Vite or Astro:

- bind the app to `127.0.0.1`;
- set the Tailnet host in `allowedHosts`;
- configure HMR for `wss` and port `443` if browser updates fail over HTTPS.

For any framework:

- keep the framework off public TLS;
- let Tailscale terminate HTTPS;
- make the printed Tailnet URL the URL agents and humans should click.
