import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const port = process.env.PORT ?? "3000";
const tailnetHttpsPort = "443";
const host = "127.0.0.1";
const localTarget = `http://${host}:${port}`;
const fallbackTailnetUrl = "https://lyra.tailb44a3.ts.net/";

export function commandExists(command: string) {
  const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
    stdio: "pipe",
  });

  return result.status === 0;
}

export function parseTailnetUrl(stdout: string) {
  try {
    const status = JSON.parse(stdout) as {
      Self?: { DNSName?: string };
    };
    const dnsName = status.Self?.DNSName?.replace(/\.$/, "");

    return dnsName ? `https://${dnsName}/` : fallbackTailnetUrl;
  } catch {
    return fallbackTailnetUrl;
  }
}

export function getTailnetUrl() {
  const result = spawnSync("tailscale", ["status", "--json"], {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    return fallbackTailnetUrl;
  }

  return parseTailnetUrl(result.stdout);
}

export function formatStartupUrls({
  localTarget,
  tailnetUrl,
}: {
  localTarget: string;
  tailnetUrl: string;
}) {
  return [
    `Local: ${localTarget}`,
    `Tailnet HTTPS: ${tailnetUrl} -> ${localTarget}`,
  ];
}

export function buildNextDevArgs(port: string) {
  return ["x", "next", "dev", "-H", host, "-p", port];
}

export function buildPortlessProxyStopArgs() {
  return ["proxy", "stop"];
}

export function buildTailnetServeResetArgs() {
  return ["serve", "reset"];
}

export function buildTailnetServeArgs(target: string) {
  return ["serve", "--bg", "--yes", `--https=${tailnetHttpsPort}`, target];
}

function stopPortlessProxy() {
  if (!commandExists("portless")) {
    return;
  }

  const result = spawnSync("portless", buildPortlessProxyStopArgs(), {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    console.warn(result.stderr.trim() || result.stdout.trim());
    console.warn("Could not stop Portless proxy; Tailscale HTTPS on port 443 may fail.");
  }
}

function resetTailnetServe() {
  const result = spawnSync("tailscale", buildTailnetServeResetArgs(), {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    console.warn(result.stderr.trim() || result.stdout.trim());
    console.warn("Could not reset Tailscale Serve; trying to configure it anyway.");
  }
}

function configureTailnetServe() {
  const tailnetUrl = getTailnetUrl();

  if (!commandExists("tailscale")) {
    console.warn("tailscale CLI not found; starting local Next.js dev server only.");
    console.log(formatStartupUrls({ localTarget, tailnetUrl }).join("\n"));
    return;
  }

  stopPortlessProxy();
  resetTailnetServe();

  const result = spawnSync(
    "tailscale",
    buildTailnetServeArgs(localTarget),
    {
      encoding: "utf8",
      stdio: "pipe",
    },
  );

  if (result.status !== 0) {
    console.warn(result.stderr.trim() || result.stdout.trim());
    console.warn("Could not configure Tailscale Serve; starting Next.js anyway.");
    console.log(formatStartupUrls({ localTarget, tailnetUrl }).join("\n"));
    return;
  }

  console.log(formatStartupUrls({ localTarget, tailnetUrl }).join("\n"));
}

const signalExitCodes: Partial<Record<NodeJS.Signals, number>> = {
  SIGINT: 130,
  SIGTERM: 143,
};

function run() {
  const tailnetUrl = getTailnetUrl();
  const tailnetHost = new URL(tailnetUrl).hostname;

  process.env.DEV_TAILNET_HOST = tailnetHost;

  configureTailnetServe();

  const nextDev = spawn("bun", buildNextDevArgs(port), {
    env: {
      ...process.env,
      DEV_TAILNET_HOST: tailnetHost,
    },
    stdio: "inherit",
  });

  function stop(signal: NodeJS.Signals) {
    nextDev.kill(signal);
  }

  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));

  nextDev.on("exit", (code, signal) => {
    if (signal) {
      process.exit(signalExitCodes[signal] ?? 1);
      return;
    }

    process.exit(code ?? 0);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
