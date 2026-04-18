import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("robots.txt", () => {
  it("declares content usage preferences for AI systems in the wildcard user-agent block", () => {
    const robotsTxtPath = path.resolve(process.cwd(), "public", "robots.txt");
    const robotsTxt = readFileSync(robotsTxtPath, "utf8");

    expect(robotsTxt).toMatch(
      /User-agent:\s*\*\n(?:[^\n]*\n)*?Content-Signal:\s*ai-train=no,\s*search=yes,\s*ai-input=no\n(?:[^\n]*\n)*?Allow:\s*\//,
    );
  });
});
