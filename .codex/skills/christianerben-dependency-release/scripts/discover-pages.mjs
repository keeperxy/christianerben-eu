#!/usr/bin/env bun
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const explicitRoutes = ["/", "/cv", "/imprint", "/privacy", "/sitemap", "/404"];
const excludedNames = new Set(["_app", "_document", "_error"]);
const pageExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"]);

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  return {
    json: args.has("--json"),
    explicit: args.has("--explicit"),
  };
}

function extensionOf(filePath) {
  for (const ext of pageExtensions) {
    if (filePath.endsWith(ext)) return ext;
  }
  return "";
}

function routeFromFile(filePath, pagesDir) {
  const ext = extensionOf(filePath);
  if (!ext) return null;

  const rel = relative(pagesDir, filePath);
  const parts = rel.split(sep);
  if (parts[0] === "api") return null;

  const last = parts.at(-1).slice(0, -ext.length);
  if (excludedNames.has(last)) return null;

  parts[parts.length - 1] = last === "index" ? "" : last;
  const route = `/${parts.filter(Boolean).join("/")}`;
  return route === "" ? "/" : route;
}

function walk(dir, pagesDir) {
  const routes = [];
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      if (entry !== "api") routes.push(...walk(filePath, pagesDir));
      continue;
    }
    const route = routeFromFile(filePath, pagesDir);
    if (route) routes.push(route);
  }
  return routes;
}

function uniqueSorted(routes) {
  return [...new Set(routes)].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
}

export function discoverPages(repoRoot = process.cwd(), explicit = false) {
  if (explicit) return [...explicitRoutes];
  const pagesDir = join(repoRoot, "src", "pages");
  return uniqueSorted(walk(pagesDir, pagesDir));
}

if (import.meta.main) {
  const options = parseArgs();
  const routes = discoverPages(process.cwd(), options.explicit);
  if (options.json) {
    console.log(JSON.stringify(routes, null, 2));
  } else {
    console.log(routes.join("\n"));
  }
}
