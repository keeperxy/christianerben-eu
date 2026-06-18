import { describe, expect, it } from "vitest";

import {
  buildPortlessProxyStopArgs,
  buildNextDevArgs,
  buildTailnetServeArgs,
  buildTailnetServeResetArgs,
  formatStartupUrls,
  parseTailnetUrl,
} from "../../scripts/dev-tailnet";

describe("dev tailnet startup", () => {
  it("binds the Next.js dev server to the local loopback interface", () => {
    expect(buildNextDevArgs("3000")).toEqual([
      "x",
      "next",
      "dev",
      "-H",
      "127.0.0.1",
      "-p",
      "3000",
    ]);
  });

  it("prepares Tailscale Serve on HTTPS port 443", () => {
    expect(buildPortlessProxyStopArgs()).toEqual(["proxy", "stop"]);
    expect(buildTailnetServeResetArgs()).toEqual(["serve", "reset"]);
    expect(buildTailnetServeArgs("http://127.0.0.1:3000")).toEqual([
      "serve",
      "--bg",
      "--yes",
      "--https=443",
      "http://127.0.0.1:3000",
    ]);
  });

  it("parses the current Tailscale DNS name into an HTTPS URL", () => {
    const status = JSON.stringify({
      Self: {
        DNSName: "lyra.tailb44a3.ts.net.",
      },
    });

    expect(parseTailnetUrl(status)).toBe("https://lyra.tailb44a3.ts.net/");
  });

  it("prints both clickable local and Tailnet URLs", () => {
    expect(
      formatStartupUrls({
        localTarget: "http://127.0.0.1:3000",
        tailnetUrl: "https://lyra.tailb44a3.ts.net/",
      }),
    ).toEqual([
      "Local: http://127.0.0.1:3000",
      "Tailnet HTTPS: https://lyra.tailb44a3.ts.net/ -> http://127.0.0.1:3000",
    ]);
  });
});
