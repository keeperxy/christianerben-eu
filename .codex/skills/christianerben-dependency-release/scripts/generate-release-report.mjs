#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    runId: "",
    baseRef: "origin/development",
    prUrl: "",
    output: "",
  };

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--run-id") options.runId = args[++i];
    else if (args[i] === "--base-ref") options.baseRef = args[++i];
    else if (args[i] === "--pr-url") options.prUrl = args[++i];
    else if (args[i] === "--output") options.output = args[++i];
    else if (args[i] === "--help") {
      console.log("Usage: bun generate-release-report.mjs --run-id id [--base-ref origin/development] [--pr-url url] [--output report.html]");
      process.exit(0);
    }
  }

  if (!options.runId) throw new Error("--run-id is required");
  return options;
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) return (result.stderr || result.stdout || "").trim();
  return result.stdout.trim();
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function percent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function relativeHref(fromFile, targetFile) {
  return relative(join(fromFile, ".."), targetFile).replaceAll("\\", "/");
}

function packageDiffSummary(baseRef) {
  const diff = run("git", ["diff", "--unified=0", `${baseRef}...HEAD`, "--", "package.json"]);
  const rows = [];
  for (const line of diff.split("\n")) {
    const match = line.match(/^([+-])\s*"([^"]+)":\s*"([^"]+)"/);
    if (!match) continue;
    const [, sign, name, version] = match;
    let row = rows.find((entry) => entry.name === name);
    if (!row) {
      row = { name, before: "", after: "" };
      rows.push(row);
    }
    if (sign === "-") row.before = version;
    if (sign === "+") row.after = version;
  }
  return rows.filter((row) => row.before || row.after);
}

const options = parseArgs();
const repoRoot = process.cwd();
const artifactRoot = join(repoRoot, ".artifacts", "dependency-update-release", options.runId);
const beforeDir = join(artifactRoot, "before");
const afterDir = join(artifactRoot, "after");
const outputPath = options.output || join(artifactRoot, "release-report.html");
const comparison = readJson(join(artifactRoot, "comparison-report.json"), {
  pass: false,
  failures: ["comparison-report.json is missing"],
  comparisons: [],
});
const beforeCapture = readJson(join(beforeDir, "capture-report.json"), { pages: [] });
const afterCapture = readJson(join(afterDir, "capture-report.json"), { pages: [] });
const changedPackages = packageDiffSummary(options.baseRef);
const diffStat = run("git", ["diff", "--stat", `${options.baseRef}...HEAD`]);
const changedFiles = run("git", ["diff", "--name-only", `${options.baseRef}...HEAD`])
  .split("\n")
  .filter(Boolean);
const generatedAt = new Date().toISOString();
const screenshots = comparison.comparisons.map((item) => ({
  ...item,
  beforeHref: relativeHref(outputPath, join(beforeDir, item.file)),
  afterHref: relativeHref(outputPath, join(afterDir, item.file)),
}));

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dependency Release Report ${escapeHtml(options.runId)}</title>
  <style>
    :root { color-scheme: light; --ink: #182230; --muted: #667085; --line: #d0d5dd; --ok: #057647; --bad: #b42318; --soft: #f2f4f7; --accent: #175cd3; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: #fcfcfd; }
    header { padding: 40px clamp(20px, 5vw, 72px) 28px; background: #ffffff; border-bottom: 1px solid var(--line); }
    main { padding: 28px clamp(20px, 5vw, 72px) 56px; }
    h1 { margin: 0 0 12px; font-size: clamp(28px, 4vw, 48px); line-height: 1.05; letter-spacing: 0; }
    h2 { margin: 0 0 16px; font-size: 22px; letter-spacing: 0; }
    p { margin: 0; color: var(--muted); }
    section { margin-top: 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .metric, .panel, .shot { border: 1px solid var(--line); border-radius: 8px; background: #fff; }
    .metric { padding: 16px; }
    .label { font-size: 12px; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing: .04em; }
    .value { margin-top: 8px; font-size: 26px; font-weight: 760; }
    .ok { color: var(--ok); }
    .bad { color: var(--bad); }
    .panel { padding: 18px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 10px 8px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 12px; text-transform: uppercase; }
    pre { margin: 0; white-space: pre-wrap; font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
    .shots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .shot { overflow: hidden; }
    .shot h3 { margin: 0; padding: 12px 14px; font-size: 15px; border-bottom: 1px solid var(--line); }
    .images { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); }
    figure { margin: 0; background: #fff; }
    img { display: block; width: 100%; max-height: 380px; object-fit: contain; background: var(--soft); }
    figcaption { padding: 8px 10px; color: var(--muted); font-size: 12px; }
    .bar { height: 8px; background: var(--soft); border-radius: 999px; overflow: hidden; }
    .bar span { display: block; height: 100%; background: var(--accent); }
    a { color: var(--accent); }
  </style>
</head>
<body>
  <header>
    <h1>Dependency Release Report</h1>
    <p>Run ${escapeHtml(options.runId)} generated ${escapeHtml(generatedAt)}${options.prUrl ? ` · <a href="${escapeHtml(options.prUrl)}">Pull request</a>` : ""}</p>
  </header>
  <main>
    <section class="grid">
      <div class="metric"><div class="label">Visual Check</div><div class="value ${comparison.pass ? "ok" : "bad"}">${comparison.pass ? "Passed" : "Needs review"}</div></div>
      <div class="metric"><div class="label">Packages</div><div class="value">${changedPackages.length}</div></div>
      <div class="metric"><div class="label">Changed Files</div><div class="value">${changedFiles.length}</div></div>
      <div class="metric"><div class="label">Screenshots</div><div class="value">${screenshots.length}</div></div>
    </section>

    <section class="panel">
      <h2>Package Changes</h2>
      ${changedPackages.length ? `<table><thead><tr><th>Package</th><th>Before</th><th>After</th></tr></thead><tbody>${changedPackages.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.before || "-")}</td><td>${escapeHtml(row.after || "-")}</td></tr>`).join("")}</tbody></table>` : "<p>No package.json dependency version changes were detected against the selected base ref.</p>"}
    </section>

    <section class="panel">
      <h2>Diff Summary</h2>
      <pre>${escapeHtml(diffStat || "No diff stat available.")}</pre>
    </section>

    <section class="panel">
      <h2>Verification</h2>
      <table>
        <tbody>
          <tr><th>Before captured</th><td>${escapeHtml(beforeCapture.capturedAt || "missing")}</td></tr>
          <tr><th>After captured</th><td>${escapeHtml(afterCapture.capturedAt || "missing")}</td></tr>
          <tr><th>Compared</th><td>${escapeHtml(comparison.comparedAt || "missing")}</td></tr>
          <tr><th>Failures</th><td>${comparison.failures?.length ? escapeHtml(comparison.failures.join("\n")) : "None"}</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Visual Comparison</h2>
      <div class="shots">
        ${screenshots.map((item) => `<article class="shot">
          <h3>${escapeHtml(item.file)} · changed ${percent(item.changedRatio)}</h3>
          <div class="images">
            <figure><img src="${escapeHtml(item.beforeHref)}" alt="Before ${escapeHtml(item.file)}"><figcaption>Before</figcaption></figure>
            <figure><img src="${escapeHtml(item.afterHref)}" alt="After ${escapeHtml(item.file)}"><figcaption>After</figcaption></figure>
          </div>
          <div style="padding: 12px 14px;"><div class="bar"><span style="width: ${Math.min(100, Number(item.changedRatio || 0) * 100).toFixed(2)}%"></span></div></div>
        </article>`).join("")}
      </div>
    </section>
  </main>
</body>
</html>
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html);
console.log(JSON.stringify({ outputPath }, null, 2));
