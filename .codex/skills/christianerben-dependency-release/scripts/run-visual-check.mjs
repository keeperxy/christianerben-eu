#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { discoverPages } from "./discover-pages.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(scriptDir, "../../../..");
export const configPath = join(scriptDir, "playwright.visual.config.ts");
const manifestName = "visual-routes.json";

export function buildCommand(mode) {
  const command = [
    "bunx",
    "--no-install",
    "playwright",
    "test",
    "--config",
    configPath,
  ];
  if (mode === "baseline") command.push("--update-snapshots=all");
  return command;
}

export function buildEnvironment(artifactDir, workers, root = repoRoot) {
  const resolvedArtifacts = resolve(artifactDir);
  return {
    ...process.env,
    NODE_ENV: "development",
    VISUAL_REPO_ROOT: resolve(root),
    VISUAL_BASELINE_DIR: join(resolvedArtifacts, "before"),
    VISUAL_RESULTS_DIR: join(resolvedArtifacts, "results"),
    VISUAL_BASE_URL: "http://127.0.0.1:4321",
    VISUAL_WORKERS: String(workers),
  };
}

export function writeRouteManifest(artifactDir, routes) {
  const manifestPath = join(resolve(artifactDir), manifestName);
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify({ routes }, null, 2)}\n`);
  return manifestPath;
}

export function readRouteManifest(artifactDir) {
  const manifestPath = join(resolve(artifactDir), manifestName);
  if (!existsSync(manifestPath)) {
    throw new Error(`invalid or missing route manifest: ${manifestPath}`);
  }
  let payload;
  try {
    payload = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    throw new Error(`invalid or missing route manifest: ${manifestPath}`);
  }
  if (
    !payload ||
    !Array.isArray(payload.routes) ||
    !payload.routes.every((route) => typeof route === "string")
  ) {
    throw new Error(`invalid route manifest: ${manifestPath}`);
  }
  return payload.routes;
}

export function parseArgs(args) {
  const [mode, ...rest] = args;
  if (!["baseline", "compare"].includes(mode)) {
    throw new Error("Usage: run-visual-check.mjs baseline|compare --artifact-dir <path> [--workers 4]");
  }
  let artifactDir = "";
  let workers = 4;
  for (let index = 0; index < rest.length; index += 1) {
    if (rest[index] === "--artifact-dir") artifactDir = rest[++index] ?? "";
    else if (rest[index] === "--workers") workers = Number(rest[++index]);
    else throw new Error(`Unknown argument: ${rest[index]}`);
  }
  if (!artifactDir) throw new Error("--artifact-dir is required");
  if (!Number.isInteger(workers) || workers < 1) {
    throw new Error("--workers must be a positive integer");
  }
  return { mode, artifactDir, workers };
}

export function validateComparison(artifactDir, currentRoutes) {
  const baselineDir = join(resolve(artifactDir), "before");
  if (
    !existsSync(baselineDir) ||
    !readdirSync(baselineDir).some((fileName) => fileName.endsWith(".png"))
  ) {
    throw new Error(`no baseline screenshots found in ${baselineDir}`);
  }
  const baselineRoutes = readRouteManifest(artifactDir);
  const removed = baselineRoutes.filter((route) => !currentRoutes.includes(route)).sort();
  const added = currentRoutes.filter((route) => !baselineRoutes.includes(route)).sort();
  if (removed.length || added.length) {
    throw new Error(
      `visual route set changed since baseline: removed=${JSON.stringify(removed)}, added=${JSON.stringify(added)}`,
    );
  }
}

export function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  const routes = discoverPages(repoRoot, true);
  if (options.mode === "compare") validateComparison(options.artifactDir, routes);

  const [command, ...commandArgs] = buildCommand(options.mode);
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    env: buildEnvironment(options.artifactDir, options.workers),
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status === 0) {
    if (options.mode === "baseline") writeRouteManifest(options.artifactDir, routes);
    const action = options.mode === "baseline" ? "stored" : "matched";
    console.log(`Visual screenshots ${action}: ${join(resolve(options.artifactDir), "before")}`);
  }
  return result.status ?? 1;
}

if (import.meta.main) process.exitCode = main();
