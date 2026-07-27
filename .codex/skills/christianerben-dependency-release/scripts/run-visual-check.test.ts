import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  buildCommand,
  buildEnvironment,
  parseArgs,
  readRouteManifest,
  validateComparison,
  writeRouteManifest,
} from "./run-visual-check.mjs";

const temporaryDirectories: string[] = [];

function makeTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "dependency-visual-check-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("dependency release visual runner", () => {
  it("uses the pinned local Playwright CLI and update mode for baselines", () => {
    expect(buildCommand("baseline").slice(0, 4)).toEqual([
      "bunx",
      "--no-install",
      "playwright",
      "test",
    ]);
    expect(buildCommand("baseline")).toContain("--update-snapshots=all");
    expect(buildCommand("compare")).not.toContain("--update-snapshots=all");
  });

  it("configures isolated baseline and result directories", () => {
    const artifactDir = makeTemporaryDirectory();
    const environment = buildEnvironment(artifactDir, 3, "/tmp/repo");
    expect(environment.VISUAL_BASELINE_DIR).toBe(join(artifactDir, "before"));
    expect(environment.VISUAL_RESULTS_DIR).toBe(join(artifactDir, "results"));
    expect(environment.VISUAL_WORKERS).toBe("3");
  });

  it("writes and reads the exact route manifest", () => {
    const artifactDir = makeTemporaryDirectory();
    const manifestPath = writeRouteManifest(artifactDir, ["/", "/cv"]);
    expect(existsSync(manifestPath)).toBe(true);
    expect(JSON.parse(readFileSync(manifestPath, "utf8")).routes).toEqual(["/", "/cv"]);
    expect(readRouteManifest(artifactDir)).toEqual(["/", "/cv"]);
  });

  it("rejects comparison without a baseline", () => {
    const artifactDir = makeTemporaryDirectory();
    expect(() => validateComparison(artifactDir, ["/"])).toThrow(
      "no baseline screenshots found",
    );
    mkdirSync(join(artifactDir, "before"));
    writeRouteManifest(artifactDir, ["/"]);
    expect(() => validateComparison(artifactDir, ["/"])).toThrow(
      "no baseline screenshots found",
    );
  });

  it("rejects route-set drift before Playwright starts", () => {
    const artifactDir = makeTemporaryDirectory();
    writeRouteManifest(artifactDir, ["/", "/removed"]);
    mkdirSync(join(artifactDir, "before"));
    writeFileSync(join(artifactDir, "before", "home-desktop.png"), "png");
    expect(() => validateComparison(artifactDir, ["/", "/added"])).toThrow(
      'removed=["/removed"], added=["/added"]',
    );
  });

  it("validates required arguments and worker count", () => {
    expect(parseArgs(["baseline", "--artifact-dir", "/tmp/run", "--workers", "2"])).toEqual({
      mode: "baseline",
      artifactDir: "/tmp/run",
      workers: 2,
    });
    expect(() => parseArgs(["compare", "--artifact-dir", "/tmp/run", "--workers", "0"])).toThrow(
      "--workers must be a positive integer",
    );
  });
});
