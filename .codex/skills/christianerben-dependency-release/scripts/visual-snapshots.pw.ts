import { expect, test } from "@playwright/test";

import { discoverPages } from "./discover-pages.mjs";

const repoRoot = process.env.VISUAL_REPO_ROOT;
if (!repoRoot) throw new Error("VISUAL_REPO_ROOT is required.");

const routes = discoverPages(repoRoot, true);

function screenshotName(route: string): string {
  const normalized = route.replace(/^\/+|\/+$/g, "") || "home";
  return `${normalized.replace(/[^a-zA-Z0-9]+/g, "-")}.png`;
}

for (const route of routes) {
  test(`visual ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    await page.addInitScript(() => {
      window.setInterval = (() => 0) as typeof window.setInterval;
    });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`.trim(),
      );
    });

    const response = await page.goto(route, { waitUntil: "load" });
    const status = response?.status() ?? 0;
    const title = await page.title();
    const bodyText = await page.locator("body").innerText();

    // Allow hydrated components to register their viewport observers before scrolling.
    await page.waitForTimeout(1_000);
    await page.evaluate(async () => {
      await document.fonts?.ready;
      // Use overlapping scroll steps so every IntersectionObserver-driven
      // timeline card gets a chance to enter the viewport before capture.
      const viewportStep = Math.max(Math.floor(window.innerHeight / 3), 1);
      for (
        let offset = 0;
        offset < document.documentElement.scrollHeight;
        offset += viewportStep
      ) {
        window.scrollTo(0, offset);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      // Let intersection-triggered transitions finish before the full-page capture.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 1_000));
      await Promise.all(
        [...document.images].map((image) => image.decode().catch(() => undefined)),
      );
      // Capture the settled post-scroll state even when an observer callback
      // was coalesced while the page was being advanced through long cards.
      document.querySelectorAll(".timeline-item").forEach((item) => {
        item.classList.remove("opacity-0");
      });
      window.scrollTo(0, 0);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    const expectedNotFound = route === "/404" && status === 404;
    expect(
      (status >= 200 && status < 400) || expectedNotFound,
      `${route}: unexpected HTTP ${status}`,
    ).toBe(true);
    expect(bodyText.trim().length, `${route}: page appears blank`).toBeGreaterThanOrEqual(40);
    if (route !== "/404") {
      expect(title, `${route}: error-like page title`).not.toMatch(
        /404|500|application error|internal server error/i,
      );
    }

    await expect(page).toHaveScreenshot(screenshotName(route), {
      animations: "disabled",
      fullPage: true,
    });

    const unexpectedConsoleErrors = consoleErrors.filter(
      (message) =>
        !(
          route === "/404" &&
          (/Failed to load resource: the server responded with a status of 404/.test(message) ||
            /404 Error: User attempted to access non-existent route: \/404/.test(message))
        ),
    );
    const unexpectedRequestFailures = failedRequests.filter(
      (failure) =>
        !(
          route === "/cv" &&
          /^GET .*\/cv\/christian_erben_cv_(en|de)(?:_with_certificates)?\.pdf net::ERR_ABORTED$/.test(
            failure,
          )
        ),
    );
    expect(unexpectedConsoleErrors, `${route}: unexpected console errors`).toEqual([]);
    expect(unexpectedRequestFailures, `${route}: unexpected request failures`).toEqual([]);
  });
}
