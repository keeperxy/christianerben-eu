import { access, copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const adapterPath = fileURLToPath(import.meta.url);
const upstreamAdapterPath = process.env.NEXT_ADAPTER_PATH;
let upstreamAdapterPromise;

function resolveAdapterPath(specifier) {
  if (specifier.startsWith("file://")) {
    return fileURLToPath(specifier);
  }

  if (path.isAbsolute(specifier)) {
    return specifier;
  }

  try {
    return require.resolve(specifier);
  } catch {
    return specifier;
  }
}

async function loadUpstreamAdapter() {
  if (!upstreamAdapterPath) {
    return null;
  }

  const resolvedPath = resolveAdapterPath(upstreamAdapterPath);
  if (path.resolve(resolvedPath) === path.resolve(adapterPath)) {
    return null;
  }

  upstreamAdapterPromise ??= import(pathToFileURL(resolvedPath).href).then(
    (module) => module.default ?? module,
  );

  return upstreamAdapterPromise;
}

async function prepareStatic404({ distDir }) {
  const sourcePath = path.join(distDir, "server", "pages", "404.html");
  const targetPath = path.join(distDir, "output", "static", "404.html");

  await access(sourcePath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  console.log(`Prepared Vercel static 404 output at ${targetPath}`);
}

const adapter = {
  name: "vercel-static-404",

  async modifyConfig(config, context) {
    const upstreamAdapter = await loadUpstreamAdapter();
    const modifiedConfig = upstreamAdapter?.modifyConfig
      ? await upstreamAdapter.modifyConfig(config, context)
      : config;

    return {
      ...modifiedConfig,
      adapterPath,
    };
  },

  async onBuildComplete(context) {
    await prepareStatic404(context);

    const upstreamAdapter = await loadUpstreamAdapter();
    if (upstreamAdapter?.onBuildComplete) {
      await upstreamAdapter.onBuildComplete(context);
    }
  },
};

export default adapter;
