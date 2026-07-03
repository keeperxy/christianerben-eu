import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

const runDeployCheck = (branch: string) =>
  spawnSync("bash", ["scripts/vercel-deploy-check.sh"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      VERCEL_GIT_BRANCH: branch,
      VERCEL_GIT_COMMIT_REF: branch,
    },
  });

describe("Vercel deployment branch check", () => {
  it.each(["development", "preproduction", "main"])(
    "allows deployments from %s",
    (branch) => {
      const result = runDeployCheck(branch);

      expect(result.status).toBe(1);
      expect(result.stdout).toContain("Deployment allowed");
    },
  );

  it("blocks deployments from other branches", () => {
    const result = runDeployCheck("feature/example");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Deployment blocked");
  });
});
