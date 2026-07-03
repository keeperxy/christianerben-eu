import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

describe("verify-generated script", () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("restores tracked generated files when a generator command fails", () => {
    const bunPath = spawnSync("bun", ["--print", "process.execPath"], {
      encoding: "utf8",
      stdio: "pipe",
    }).stdout.trim();
    expect(bunPath).not.toBe("");

    tempDir = mkdtempSync(path.join(tmpdir(), "verify-generated-"));
    const fakeBinDir = path.join(tempDir, "bin");
    mkdirSync(path.join(tempDir, "public"), { recursive: true });
    mkdirSync(path.join(tempDir, "src/content"), { recursive: true });
    mkdirSync(fakeBinDir);

    const llmsPath = path.join(tempDir, "public/llms.txt");
    const sitemapPath = path.join(tempDir, "public/sitemap.xml");
    const contentPath = path.join(tempDir, "src/content/content.ts");
    writeFileSync(llmsPath, "original llms");
    writeFileSync(sitemapPath, "original sitemap");
    writeFileSync(contentPath, "export const content = 'original';\n");

    spawnSync("git", ["init"], { cwd: tempDir, stdio: "ignore" });
    spawnSync("git", ["add", "public/llms.txt", "public/sitemap.xml", "src/content/content.ts"], {
      cwd: tempDir,
      stdio: "ignore",
    });

    const fakeBunPath = path.join(fakeBinDir, "bun");
    writeFileSync(
      fakeBunPath,
      "#!/usr/bin/env sh\nprintf 'stale generated data' > public/llms.txt\nexit 42\n",
    );
    chmodSync(fakeBunPath, 0o755);

    const scriptPath = path.resolve(process.cwd(), "scripts/verify-generated.ts");
    const result = spawnSync(bunPath, [scriptPath], {
      cwd: tempDir,
      env: {
        ...process.env,
        PATH: `${fakeBinDir}:${process.env.PATH ?? ""}`,
      },
      encoding: "utf8",
      stdio: "pipe",
    });

    expect(result.status).toBe(42);
    expect(readFileSync(llmsPath, "utf8")).toBe("original llms");
  });
});
