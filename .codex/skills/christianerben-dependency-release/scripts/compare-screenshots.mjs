#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    runId: "",
    threshold: 0.08,
  };

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--run-id") options.runId = args[++i];
    else if (args[i] === "--threshold") options.threshold = Number(args[++i]);
    else if (args[i] === "--help") {
      console.log("Usage: bun compare-screenshots.mjs --run-id id [--threshold 0.08]");
      process.exit(0);
    }
  }

  if (!options.runId) throw new Error("--run-id is required");
  return options;
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    throw new Error("The comparison script requires Playwright. Run `bunx playwright install chromium` or execute via an environment where `playwright` is available.");
  }
}

function loadCaptureReport(dir) {
  const path = join(dir, "capture-report.json");
  if (!existsSync(path)) throw new Error(`Missing capture report: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function reportPageProblems(capture) {
  const problems = [];
  for (const page of capture.pages) {
    const label = `${page.route} ${page.viewport}`;
    if (page.status < 200 || page.status >= 400) problems.push(`${label}: HTTP ${page.status}`);
    if (page.bodyLength < 40) problems.push(`${label}: page appears blank`);
    if (/404|500|application error|internal server error/i.test(page.title)) {
      if (page.route !== "/404") problems.push(`${label}: error-like title "${page.title}"`);
    }
    for (const message of page.consoleErrors) problems.push(`${label}: console error: ${message}`);
    for (const failure of page.failedRequests) problems.push(`${label}: request failed: ${failure}`);
  }
  return problems;
}

function imageDataUrl(filePath) {
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function comparePair(page, beforePath, afterPath) {
  return page.evaluate(
    async ({ beforeUrl, afterUrl }) => {
      async function loadImage(src) {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        await img.decode();
        return img;
      }

      const before = await loadImage(beforeUrl);
      const after = await loadImage(afterUrl);
      const width = Math.min(before.width, after.width, 480);
      const height = Math.min(before.height, after.height, 800);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      ctx.drawImage(before, 0, 0, width, height);
      const a = ctx.getImageData(0, 0, width, height).data;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(after, 0, 0, width, height);
      const b = ctx.getImageData(0, 0, width, height).data;

      let total = 0;
      let changed = 0;
      let afterNonWhite = 0;
      for (let i = 0; i < a.length; i += 4) {
        total += 1;
        const diff = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
        if (diff > 80) changed += 1;
        if (b[i] < 245 || b[i + 1] < 245 || b[i + 2] < 245) afterNonWhite += 1;
      }

      return {
        beforeSize: { width: before.width, height: before.height },
        afterSize: { width: after.width, height: after.height },
        changedRatio: changed / total,
        afterNonWhiteRatio: afterNonWhite / total,
      };
    },
    {
      beforeUrl: imageDataUrl(beforePath),
      afterUrl: imageDataUrl(afterPath),
    },
  );
}

const options = parseArgs();
const root = join(process.cwd(), ".artifacts", "dependency-update-release", options.runId);
const beforeDir = join(root, "before");
const afterDir = join(root, "after");
const reportPath = join(root, "comparison-report.json");
mkdirSync(root, { recursive: true });

if (!existsSync(beforeDir) || !existsSync(afterDir)) {
  throw new Error(`Missing before/after screenshot directories for run ${options.runId}`);
}

const beforeCapture = loadCaptureReport(beforeDir);
const afterCapture = loadCaptureReport(afterDir);
const files = readdirSync(beforeDir).filter((file) => file.endsWith(".png"));
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage();
const comparisons = [];
const failures = [
  ...reportPageProblems(beforeCapture).map((problem) => `before: ${problem}`),
  ...reportPageProblems(afterCapture).map((problem) => `after: ${problem}`),
];

try {
  for (const file of files) {
    const beforePath = join(beforeDir, file);
    const afterPath = join(afterDir, file);
    if (!existsSync(afterPath)) {
      failures.push(`${file}: missing after screenshot`);
      continue;
    }

    const result = await comparePair(page, beforePath, afterPath);
    comparisons.push({ file, ...result });
    if (result.afterNonWhiteRatio < 0.02) failures.push(`${file}: after screenshot appears blank`);
    if (result.changedRatio > options.threshold) {
      failures.push(`${file}: changed ratio ${result.changedRatio.toFixed(3)} exceeds threshold ${options.threshold}`);
    }
  }
} finally {
  await browser.close();
}

const report = {
  runId: options.runId,
  threshold: options.threshold,
  comparedAt: new Date().toISOString(),
  pass: failures.length === 0,
  failures,
  comparisons,
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.pass ? 0 : 1;
