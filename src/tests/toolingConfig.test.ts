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

    expect(pkg.scripts["verify:generated"]).toBe("bun scripts/verify-generated.ts");
    expect(pkg.scripts.check).toContain("bun run verify:generated");
  });

  it("keeps async leak detection and the Node runtime target explicit", () => {
    const pkg = readJson<PackageJson>("package.json");
    const appEntry = readFileSync(path.resolve(process.cwd(), "src/pages/_app.tsx"), "utf8");

    expect(pkg.engines?.node).toBe("24.x");
    expect(pkg.scripts["test:leaks"]).toContain("--detect-async-leaks");
    expect(pkg.scripts.check).toContain("bun run test:leaks");
    expect(appEntry).toContain("LucideProvider");
  });

  it("does not keep a stale Bun-native test preload beside the Vitest setup", () => {
    const tsconfig = readJson<TsConfig>("tsconfig.json");

    expect(existsSync(path.resolve(process.cwd(), "bunfig.toml"))).toBe(false);
    expect(existsSync(path.resolve(process.cwd(), "src/setupBunTests.ts"))).toBe(false);
    expect(tsconfig.exclude ?? []).not.toContain("src/setupBunTests.ts");
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
