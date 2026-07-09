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

const expectedCvArtifacts = [
  "public/cv/christian_erben_cv_en.pdf",
  "public/cv/christian_erben_cv_en_with_certificates.pdf",
  "public/cv/christian_erben_cv_en.docx",
  "public/cv/christian_erben_cv_de.pdf",
  "public/cv/christian_erben_cv_de_with_certificates.pdf",
  "public/cv/christian_erben_cv_de.docx",
];

const validArtifactContent = (file: string) =>
  file.endsWith(".pdf")
    ? Buffer.from("%PDF-1.7 fixture content")
    : Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from("docx fixture")]);

describe("verify-generated script", () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  const setUpRepo = ({
    corruptArtifact,
    omitArtifact,
    generatorScript = "#!/usr/bin/env sh\nexit 0\n",
  }: {
    corruptArtifact?: string;
    omitArtifact?: string;
    generatorScript?: string;
  } = {}) => {
    const bunPath = spawnSync("bun", ["--print", "process.execPath"], {
      encoding: "utf8",
      stdio: "pipe",
    }).stdout.trim();
    expect(bunPath).not.toBe("");

    tempDir = mkdtempSync(path.join(tmpdir(), "verify-generated-"));
    const fakeBinDir = path.join(tempDir, "bin");
    mkdirSync(path.join(tempDir, "public/cv"), { recursive: true });
    mkdirSync(path.join(tempDir, "src/content"), { recursive: true });
    mkdirSync(fakeBinDir);

    writeFileSync(path.join(tempDir, "public/llms.txt"), "original llms");
    writeFileSync(path.join(tempDir, "public/sitemap.xml"), "original sitemap");
    writeFileSync(
      path.join(tempDir, "src/content/content.ts"),
      "export const content = 'original';\n",
    );

    const artifactsOnDisk = expectedCvArtifacts.filter((file) => file !== omitArtifact);
    for (const file of artifactsOnDisk) {
      writeFileSync(
        path.join(tempDir, file),
        file === corruptArtifact ? "not a real binary" : validArtifactContent(file),
      );
    }

    spawnSync("git", ["init"], { cwd: tempDir, stdio: "ignore" });
    spawnSync(
      "git",
      [
        "add",
        "public/llms.txt",
        "public/sitemap.xml",
        "src/content/content.ts",
        ...artifactsOnDisk,
      ],
      {
        cwd: tempDir,
        stdio: "ignore",
      },
    );

    const fakeBunPath = path.join(fakeBinDir, "bun");
    writeFileSync(fakeBunPath, generatorScript);
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

    return { result, tempDir };
  };

  it("restores tracked generated files when a generator command fails", () => {
    const { result, tempDir: dir } = setUpRepo({
      generatorScript:
        "#!/usr/bin/env sh\nprintf 'stale generated data' > public/llms.txt\nexit 42\n",
    });

    expect(result.status).toBe(42);
    expect(readFileSync(path.join(dir, "public/llms.txt"), "utf8")).toBe("original llms");
  });

  it("passes when generated files are fresh and CV artifacts look valid", () => {
    const { result } = setUpRepo();

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Generated artifacts are current.");
  });

  it("fails when a tracked CV artifact has an invalid file signature", () => {
    const { result } = setUpRepo({
      corruptArtifact: "public/cv/christian_erben_cv_de.docx",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("public/cv/christian_erben_cv_de.docx");
    expect(result.stderr).toContain("generate:cv");
  });

  it("fails when an expected CV artifact is not tracked", () => {
    const { result } = setUpRepo({
      omitArtifact: "public/cv/christian_erben_cv_en_with_certificates.pdf",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("public/cv/christian_erben_cv_en_with_certificates.pdf");
  });
});
