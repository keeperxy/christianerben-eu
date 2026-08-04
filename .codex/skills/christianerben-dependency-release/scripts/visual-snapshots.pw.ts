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
      // Exercise every observer-driven timeline card explicitly, then assert
      // that the page settled naturally instead of masking hidden cards.
      const timelineItems = [...document.querySelectorAll<HTMLElement>(".timeline-item")];
      for (const item of timelineItems) {
        const targetOffset = item.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
        window.scrollTo(0, Math.max(0, targetOffset));
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
      }
      for (let pass = 0; pass < 3; pass += 1) {
        const hiddenItems = [...document.querySelectorAll<HTMLElement>(".timeline-item.opacity-0")];
        if (hiddenItems.length === 0) break;
        for (const item of hiddenItems) {
          item.scrollIntoView({ block: "center", inline: "nearest" });
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
        }
      }
      const hiddenTimelineItems = [...document.querySelectorAll<HTMLElement>(".timeline-item.opacity-0")];
      if (hiddenTimelineItems.length > 0) {
        const details = hiddenTimelineItems.map((item) => ({
          text: item.innerText.slice(0, 120),
          rect: item.getBoundingClientRect().toJSON(),
        }));
        throw new Error(`IntersectionObserver left ${hiddenTimelineItems.length} timeline card(s) hidden: ${JSON.stringify(details)}`);
      }
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
