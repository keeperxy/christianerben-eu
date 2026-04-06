import React from "react";
import { render } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";
import { vi } from "vitest";
import {
  SettingsContext,
  type SettingsContextType,
} from "./contexts/settings-hook";

export function createMockRouter(
  overrides: Partial<NextRouter> = {}
): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    back: vi.fn<() => void>(),
    beforePopState: vi.fn<(cb: Parameters<NextRouter["beforePopState"]>[0]) => void>(),
    prefetch: vi.fn<(url: string, asPath?: string, options?: Parameters<NextRouter["prefetch"]>[2]) => Promise<void>>().mockResolvedValue(undefined),
    push: vi.fn<NextRouter["push"]>().mockResolvedValue(true),
    reload: vi.fn<() => void>(),
    replace: vi.fn<NextRouter["replace"]>().mockResolvedValue(true),
    forward: vi.fn<() => void>(),
    events: {
      on: vi.fn<NextRouter["events"]["on"]>(),
      off: vi.fn<NextRouter["events"]["off"]>(),
      emit: vi.fn<NextRouter["events"]["emit"]>(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides,
  };
}

export function renderWithSettings(
  ui: React.ReactElement,
  ctx?: Partial<SettingsContextType>,
  routerOverrides?: Partial<NextRouter>
) {
  const contextValue: SettingsContextType = {
    language: "en",
    theme: "light",
    setLanguage: () => {},
    setTheme: () => {},
    t: (text) => text["en"],
    ...ctx,
  };

  return render(
    <RouterContext.Provider value={createMockRouter(routerOverrides)}>
      <SettingsContext.Provider value={contextValue}>
        {ui}
      </SettingsContext.Provider>
    </RouterContext.Provider>
  );
}
