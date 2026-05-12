#!/usr/bin/env bun
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = process.cwd();
const defaultRunId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 1000 },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: "http://localhost:3000",
    phase: "before",
    runId: defaultRunId,
  };

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--base-url") options.baseUrl = args[++i];
    else if (args[i] === "--phase") options.phase = args[++i];
    else if (args[i] === "--run-id") options.runId = args[++i];
    else if (args[i] === "--help") {
      console.log("Usage: bun capture-pages.mjs --base-url http://localhost:3000 --phase before|after [--run-id id]");
      process.exit(0);
    }
  }

  if (!["before", "after"].includes(options.phase)) {
    throw new Error("--phase must be before or after");
  }
  return options;
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    throw new Error("The screenshot scripts require Playwright. Run `bunx playwright install chromium` or execute via an environment where `playwright` is available.");
  }
}

function discoverRoutes() {
  const result = spawnSync(process.execPath, [join(scriptDir, "discover-pages.mjs"), "--explicit", "--json"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to discover routes");
  }
  return JSON.parse(result.stdout);
}

function slugFor(route, viewport) {
  const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
  return `${slug}-${viewport}.png`;
}

const options = parseArgs();
const { chromium } = await loadPlaywright();
const routes = discoverRoutes();
const outDir = join(repoRoot, ".artifacts", "dependency-update-release", options.runId, options.phase);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = {
  runId: options.runId,
  phase: options.phase,
  baseUrl: options.baseUrl,
  capturedAt: new Date().toISOString(),
  pages: [],
};

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`.trim());
    });

    for (const route of routes) {
      const url = new URL(route, options.baseUrl).toString();
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
      const status = response?.status() ?? 0;
      const title = await page.title().catch(() => "");
      const bodyText = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
      const screenshot = slugFor(route, viewport.name);
      await page.screenshot({ path: join(outDir, screenshot), fullPage: true });

      report.pages.push({
        route,
        viewport: viewport.name,
        status,
        title,
        bodyLength: bodyText.trim().length,
        consoleErrors: [...consoleErrors],
        failedRequests: [...failedRequests],
        screenshot,
      });

      consoleErrors.length = 0;
      failedRequests.length = 0;
    }

    await context.close();
  }
} finally {
  await browser.close();
}

writeFileSync(join(outDir, "capture-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ runId: options.runId, outDir, pages: report.pages.length }, null, 2));
