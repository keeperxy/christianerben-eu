import React from "react";
import { renderHook } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { createMockRouter } from "@/test-utils";

const renderScrollToTop = () => {
  const router = createMockRouter();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
  const hook = renderHook(() => useScrollToTop(), { wrapper });
  const on = vi.mocked(router.events.on);
  const [event, handler] = on.mock.calls[0];

  return { router, hook, event, handler: handler as () => void };
};

const mockReducedMotion = (matches: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches, media: query }) as MediaQueryList,
  );

describe("useScrollToTop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls smoothly after route changes when no motion preference is set", () => {
    const matchMedia = mockReducedMotion(false);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { event, handler } = renderScrollToTop();

    expect(event).toBe("routeChangeComplete");
    handler();

    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("scrolls instantly after route changes when reduced motion is preferred", () => {
    mockReducedMotion(true);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { handler } = renderScrollToTop();

    handler();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("reads the motion preference at scroll time", () => {
    const matchMedia = mockReducedMotion(false);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { handler } = renderScrollToTop();

    matchMedia.mockImplementation(
      (query: string) => ({ matches: true, media: query }) as MediaQueryList,
    );
    handler();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("removes the route change listener on unmount", () => {
    const { router, hook, handler } = renderScrollToTop();

    hook.unmount();

    expect(router.events.off).toHaveBeenCalledWith("routeChangeComplete", handler);
  });
});
