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
    back: vi.fn(),
    beforePopState: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    push: vi.fn().mockResolvedValue(true),
    reload: vi.fn(),
    replace: vi.fn().mockResolvedValue(true),
    forward: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
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
