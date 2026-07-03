import { readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const generatedPaths = [
  "public/llms.txt",
  "public/sitemap.xml",
  "src/content/content.ts",
];

class CommandFailedError extends Error {
  constructor(
    command: string,
    args: string[],
    readonly status: number,
  ) {
    super(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new CommandFailedError(command, args, result.status ?? 1);
  }
}

async function captureTrackedFiles() {
  const result = spawnSync("git", ["ls-files", "--", ...generatedPaths], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "Failed to list generated files.");
  }

  return await Promise.all(
    result.stdout
    .split("\n")
    .filter(Boolean)
    .map(async (file) => ({
      file,
      content: await readFile(file),
    })),
  );
}

async function restoreFiles(snapshot: Array<{ file: string; content: Buffer }>) {
  await Promise.all(
    snapshot.map(async ({ file, content }) => {
      await writeFile(file, content);
    }),
  );

  const tracked = new Set(snapshot.map(({ file }) => file));
  const untracked = spawnSync(
    "git",
    ["ls-files", "--others", "--exclude-standard", "--", ...generatedPaths],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "pipe",
    },
  );

  if (untracked.status !== 0) {
    return;
  }

  await Promise.all(
    untracked.stdout
      .split("\n")
      .filter((file) => file && !tracked.has(file))
      .map((file) => rm(file, { force: true })),
  );
}

async function listChangedGeneratedFiles(snapshot: Array<{ file: string; content: Buffer }>) {
  const changedFiles: string[] = [];

  for (const { file, content } of snapshot) {
    const current = await readFile(file);
    if (!content.equals(current)) {
      changedFiles.push(file);
    }
  }

  return changedFiles;
}

async function main() {
  const snapshot = await captureTrackedFiles();

  try {
    run("bun", ["run", "generate:llms"]);
    run("bun", ["run", "generate:sitemap"]);
    run("bun", ["run", "update:last-updated"]);
  } catch (error) {
    await restoreFiles(snapshot);
    throw error;
  }

  const changedFiles = await listChangedGeneratedFiles(snapshot);
  if (changedFiles.length === 0) {
    console.log("Generated artifacts are current.");
    return;
  }

  await restoreFiles(snapshot);
  console.error("Generated artifacts are stale. Run the generator commands and commit the results:");
  for (const file of changedFiles) {
    console.error(` - ${file}`);
  }
  process.exit(1);
}

main().catch((error) => {
  if (error instanceof CommandFailedError) {
    process.exit(error.status);
  }

  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
