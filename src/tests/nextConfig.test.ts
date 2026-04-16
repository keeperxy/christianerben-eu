import { describe, expect, it } from "vitest";

describe("next config", () => {
  it("sets an explicit turbopack root for dev server resolution", async () => {
    const { default: nextConfig } = await import("../../next.config.mjs");

    expect(nextConfig.turbopack?.root).toBe(process.cwd());
  });
});
