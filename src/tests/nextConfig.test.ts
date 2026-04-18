import { describe, expect, it } from "vitest";

describe("next config", () => {
  it("sets an explicit turbopack root for dev server resolution", async () => {
    const { default: nextConfig } = await import("../../next.config.mjs");

    expect(nextConfig.turbopack?.root).toBe(process.cwd());
  });

  it("adds an RFC 8288 Link header on the homepage for agent discovery", async () => {
    const { default: nextConfig } = await import("../../next.config.mjs");

    expect(nextConfig.headers).toBeTypeOf("function");

    const headerRules = await nextConfig.headers?.();
    const homeHeaders = headerRules?.find((rule) => rule.source === "/");

    expect(homeHeaders).toBeDefined();
    expect(homeHeaders?.headers).toContainEqual({
      key: "Link",
      value: '</llms.txt>; rel="describedby"; type="text/plain"',
    });
    expect(homeHeaders?.headers).toContainEqual({
      key: "Vary",
      value: "Accept",
    });
  });

  it("rewrites markdown accept requests on the homepage to a markdown endpoint", async () => {
    const { default: nextConfig } = await import("../../next.config.mjs");

    expect(nextConfig.rewrites).toBeTypeOf("function");

    const rewriteRules = await nextConfig.rewrites?.();
    const beforeFilesRules = Array.isArray(rewriteRules) ? rewriteRules : rewriteRules?.beforeFiles;
    const markdownRewrite = beforeFilesRules?.find((rule) => rule.source === "/");

    expect(markdownRewrite).toMatchObject({
      destination: "/api/markdown/homepage",
    });
    expect(markdownRewrite?.has).toContainEqual({
      type: "header",
      key: "accept",
      value: ".*[Tt][Ee][Xx][Tt]/[Mm][Aa][Rr][Kk][Dd][Oo][Ww][Nn].*",
    });
  });
});
