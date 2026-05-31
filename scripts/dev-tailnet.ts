import { spawn, spawnSync } from "node:child_process";

const port = process.env.PORT ?? "3000";
const host = process.env.DEV_HOST ?? "0.0.0.0";
const localTarget = `http://127.0.0.1:${port}`;

function commandExists(command: string) {
  const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
    stdio: "pipe",
  });

  return result.status === 0;
}

function getTailnetUrl() {
  const result = spawnSync("tailscale", ["status", "--json"], {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    return "https://lyra.tailb44a3.ts.net/";
  }

  try {
    const status = JSON.parse(result.stdout) as {
      Self?: { DNSName?: string };
    };
    const dnsName = status.Self?.DNSName?.replace(/\.$/, "");

    return dnsName ? `https://${dnsName}/` : "https://lyra.tailb44a3.ts.net/";
  } catch {
    return "https://lyra.tailb44a3.ts.net/";
  }
}

function configureTailnetServe() {
  if (!commandExists("tailscale")) {
    console.warn("tailscale CLI not found; starting local Next.js dev server only.");
    return;
  }

  const result = spawnSync(
    "tailscale",
    ["serve", "--bg", "--yes", "--https=443", localTarget],
    {
      encoding: "utf8",
      stdio: "pipe",
    },
  );

  if (result.status !== 0) {
    console.warn(result.stderr.trim() || result.stdout.trim());
    console.warn("Could not configure Tailscale Serve; starting Next.js anyway.");
    return;
  }

  console.log(`Tailnet HTTPS: ${getTailnetUrl()} -> ${localTarget}`);
}

configureTailnetServe();

const nextDev = spawn("bun", ["x", "next", "dev", "-H", host, "-p", port], {
  stdio: "inherit",
});

const signalExitCodes: Partial<Record<NodeJS.Signals, number>> = {
  SIGINT: 130,
  SIGTERM: 143,
};

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
