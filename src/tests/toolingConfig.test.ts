import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readJson = <T>(relativePath: string): T =>
  JSON.parse(readFileSync(path.resolve(process.cwd(), relativePath), "utf8")) as T;

interface PackageJson {
  dependencies?: Record<string, string>;
  engines?: Record<string, string>;
  scripts: Record<string, string>;
}

interface TsConfig {
  exclude?: string[];
}

describe("tooling configuration", () => {
  it("includes generated artifact freshness in the composite quality gate", () => {
    const pkg = readJson<PackageJson>("package.json");
    const ciWorkflow = readFileSync(path.resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8");

    expect(pkg.scripts["verify:generated"]).toBe("bun scripts/verify-generated.ts");
    expect(pkg.scripts.check).toContain("bun run verify:generated");
    expect(pkg.dependencies?.["@pdf-lib/fontkit"]).toBe("1.1.1");
    expect(ciWorkflow).toContain("fetch-depth: 0");
    expect(ciWorkflow).toContain("bun run check");
    expect(ciWorkflow).toContain(
      "ghcr.io/verapdf/cli@sha256:b334d330037bba9b641ff3f8b1acb29beadee9060b3028aa297d0b0f9393e17a",
    );
    expect(ciWorkflow).toContain("-f 2b --format text");
  });

  it("verifies all tracked CV artifacts in the generated freshness gate", () => {
    const verifyScript = readFileSync(
      path.resolve(process.cwd(), "scripts/verify-generated.ts"),
      "utf8",
    );

    for (const artifact of [
      "public/cv/christian_erben_cv_en.pdf",
      "public/cv/christian_erben_cv_en_with_certificates.pdf",
      "public/cv/christian_erben_cv_en.docx",
      "public/cv/christian_erben_cv_de.pdf",
      "public/cv/christian_erben_cv_de_with_certificates.pdf",
      "public/cv/christian_erben_cv_de.docx",
    ]) {
      expect(verifyScript).toContain(artifact);
    }

    expect(verifyScript).toContain('PDFName.of("Metadata")');
    expect(verifyScript).toContain('PDFName.of("OutputIntents")');
    expect(verifyScript).toContain("<pdfaid:part>");
    expect(verifyScript).toContain("<pdfaid:conformance>");
  });

  it("keeps async leak detection and the Node runtime target explicit", () => {
    const pkg = readJson<PackageJson>("package.json");
    const appEntry = readFileSync(path.resolve(process.cwd(), "src/pages/_app.tsx"), "utf8");

    expect(pkg.engines?.node).toBe("24.x");
    expect(pkg.scripts["test:leaks"]).toContain("--detect-async-leaks");
    expect(pkg.scripts["test:leaks"]).not.toContain("PIPESTATUS");
    expect(pkg.scripts["test:leaks"]).toContain("&& ! grep");
    expect(pkg.scripts.check).toContain("bun run test:leaks");
    expect(appEntry).toContain("LucideProvider");
  });

  it("does not keep a stale Bun-native test preload beside the Vitest setup", () => {
    const tsconfig = readJson<TsConfig>("tsconfig.json");

    expect(existsSync(path.resolve(process.cwd(), "bunfig.toml"))).toBe(false);
    expect(existsSync(path.resolve(process.cwd(), "src/setupBunTests.ts"))).toBe(false);
    expect(tsconfig.exclude ?? []).not.toContain("src/setupBunTests.ts");
  });

  it("keeps agent-facing workflow docs aligned with the composite quality gate", () => {
    const agentsMd = readFileSync(path.resolve(process.cwd(), "AGENTS.md"), "utf8");
    const releaseSkill = readFileSync(
      path.resolve(process.cwd(), ".codex/skills/christianerben-dependency-release/SKILL.md"),
      "utf8",
    );
    const releaseReference = readFileSync(
      path.resolve(
        process.cwd(),
        ".codex/skills/christianerben-dependency-release/references/repo-workflow.md",
      ),
      "utf8",
    );

    expect(agentsMd).toContain("bun run check");
    expect(agentsMd).toContain("bun run dev:local");
    expect(agentsMd).toContain("Tailnet");
    expect(releaseSkill).toContain("bun run check");
    expect(releaseReference).toContain("bun run check");

    for (const workflowDoc of [releaseSkill, releaseReference]) {
      expect(workflowDoc).not.toContain("/Users/coach007");
      expect(workflowDoc).toContain("internal-pages-upload");
    }
  });

  it("does not ship an unused Supabase client dependency or generated client", () => {
    const pkg = readJson<PackageJson>("package.json");

    expect(pkg.dependencies?.["@supabase/supabase-js"]).toBeUndefined();
    expect(pkg.dependencies?.["@tanstack/react-query"]).toBeUndefined();
    expect(pkg.dependencies?.["next-themes"]).toBeUndefined();
    expect(pkg.dependencies?.sonner).toBeUndefined();
    expect(pkg.dependencies?.["lovable-tagger"]).toBeUndefined();
    expect(existsSync(path.resolve(process.cwd(), "src/integrations/supabase/client.ts"))).toBe(false);
    expect(existsSync(path.resolve(process.cwd(), "src/integrations/supabase/types.ts"))).toBe(false);
    expect(existsSync(path.resolve(process.cwd(), "src/App.css"))).toBe(false);
  });
});
