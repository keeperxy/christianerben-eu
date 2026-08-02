import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourcePath = path.join(projectRoot, ".next", "server", "pages", "404.html");
const targetPath = path.join(projectRoot, ".next", "output", "static", "404.html");

async function ensureVercelStatic404() {
  await access(sourcePath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  console.log(`Prepared Vercel static 404 output at ${path.relative(projectRoot, targetPath)}`);
}

ensureVercelStatic404().catch((error: unknown) => {
  console.error("Failed to prepare Vercel static 404 output:", error);
  process.exitCode = 1;
});
