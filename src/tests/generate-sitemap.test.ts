import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { urls, validateSitemapSources } from "../../scripts/generate-sitemap.cjs";

const pathExistsWithExactCase = (relativePath: string) => {
  const segments = relativePath.split("/");
  let current = process.cwd();

  for (const segment of segments) {
    if (!existsSync(current)) {
      return false;
    }

    const entries = readdirSync(current);
    if (!entries.includes(segment)) {
      return false;
    }

    current = path.join(current, segment);
  }

  return existsSync(current);
};

describe("generate-sitemap", () => {
  it("uses the generated llms.txt artifact to derive the llms sitemap lastmod", () => {
    const llmsUrl = urls.find(({ url }) => url === "/llms.txt");

    expect(llmsUrl?.files).toContain("public/llms.txt");
  });

  it("tracks shared privacy content for the privacy sitemap lastmod", () => {
    const privacyUrl = urls.find(({ url }) => url === "/privacy");

    expect(privacyUrl?.files).toContain("src/content/content.ts");
  });

  it("maps every sitemap source file to an existing exact-case path", () => {
    const missing = urls.flatMap(({ url, files }) =>
      files
        .filter((file) => !pathExistsWithExactCase(file))
        .map((file) => `${url}: ${file}`),
    );

    expect(missing).toEqual([]);
  });

  it("validates sitemap source mappings before writing output", () => {
    expect(() => validateSitemapSources()).not.toThrow();
  });
});
