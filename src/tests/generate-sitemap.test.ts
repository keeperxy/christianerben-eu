import { describe, expect, it } from "vitest";

import { urls } from "../../scripts/generate-sitemap.cjs";

describe("generate-sitemap", () => {
  it("uses the generated llms.txt artifact to derive the llms sitemap lastmod", () => {
    const llmsUrl = urls.find(({ url }) => url === "/llms.txt");

    expect(llmsUrl?.files).toContain("public/llms.txt");
  });
});
