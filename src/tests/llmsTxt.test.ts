import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("generated llms.txt", () => {
  const content = readFileSync(path.resolve(process.cwd(), "public/llms.txt"), "utf8");

  it("meets the Lighthouse Agentic Browsing content checks", () => {
    expect(content.length).toBeGreaterThanOrEqual(50);
    expect(content).toMatch(/^#\s+.+/m);
    expect(content).toMatch(/\[[^\]]+\]\([^)]+\)/);
  });

  it("links to the primary website routes", () => {
    for (const route of ["/", "/cv", "/imprint", "/privacy", "/sitemap"]) {
      expect(content).toContain(`https://christianerben.eu${route}`);
    }
  });
});
