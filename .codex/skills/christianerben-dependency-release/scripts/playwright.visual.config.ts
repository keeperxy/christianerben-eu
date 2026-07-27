import path from "node:path";

import { defineConfig } from "@playwright/test";

const repoRoot = process.env.VISUAL_REPO_ROOT;
const baselineDir = process.env.VISUAL_BASELINE_DIR;
const resultsDir = process.env.VISUAL_RESULTS_DIR;
const baseURL = process.env.VISUAL_BASE_URL ?? "http://127.0.0.1:4321";
const workers = Number(process.env.VISUAL_WORKERS ?? "4");

if (!repoRoot || !baselineDir || !resultsDir) {
  throw new Error("Run visual checks through run-visual-check.mjs so artifact paths are configured.");
}
if (!Number.isInteger(workers) || workers < 1) {
  throw new Error("VISUAL_WORKERS must be a positive integer.");
}

export default defineConfig({
  testDir: path.dirname(import.meta.filename),
  testMatch: "visual-snapshots.pw.ts",
  outputDir: resultsDir,
  snapshotPathTemplate: path.join(baselineDir, "{arg}-{projectName}{ext}"),
  fullyParallel: true,
  workers,
  retries: 0,
  reporter: [
    ["line"],
    ["json", { outputFile: path.join(resultsDir, "playwright-report.json") }],
  ],
  timeout: 45_000,
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.08,
      threshold: 0.1,
      timeout: 15_000,
    },
  },
  use: {
    baseURL,
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "de-DE",
    reducedMotion: "reduce",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run dev:local -- --hostname 127.0.0.1 --port 4321",
    cwd: repoRoot,
    env: process.env,
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 1200 } },
    },
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 1000 } },
    },
  ],
});
