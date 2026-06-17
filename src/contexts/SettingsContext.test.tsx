import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SettingsProvider } from "@/contexts/SettingsContext";
import { useSettings } from "@/contexts/settings-hook";

const setNavigatorLanguages = (languages: readonly string[]) => {
  Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    get: () => languages,
  });
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    get: () => languages[0] ?? "en-US",
  });
};

const createLocalStorage = (): Storage => {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
  };
};

const LanguageProbe = () => {
  const { language, setLanguage } = useSettings();

  return (
    <>
      <p data-testid="language">{language}</p>
      <button type="button" onClick={() => setLanguage("de")}>
        Switch to German
      </button>
    </>
  );
};

const renderProvider = () =>
  render(
    <SettingsProvider>
      <LanguageProbe />
    </SettingsProvider>,
  );

describe("SettingsProvider", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createLocalStorage(),
    });
    setNavigatorLanguages(["en-US"]);
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.document.documentElement.removeAttribute("lang");
    window.document.cookie = "language=; Path=/; Max-Age=0";
    setNavigatorLanguages(["en-US"]);
  });

  it("defaults to English when no stored preference exists", async () => {
    setNavigatorLanguages(["en-US"]);

    renderProvider();

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    await waitFor(() =>
      expect(window.document.documentElement).toHaveAttribute("lang", "en"),
    );
  });

  it("applies a valid stored language after mount", async () => {
    setNavigatorLanguages(["en-US"]);
    window.localStorage.setItem("language", "de");

    renderProvider();

    await waitFor(() => expect(screen.getByTestId("language")).toHaveTextContent("de"));
    expect(window.document.documentElement).toHaveAttribute("lang", "de");
  });

  it("ignores invalid stored languages", async () => {
    setNavigatorLanguages(["en-US"]);
    window.localStorage.setItem("language", "fr");

    renderProvider();

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    await waitFor(() =>
      expect(window.document.documentElement).toHaveAttribute("lang", "en"),
    );
  });

  it("uses a German browser preference on first visit without stored language", async () => {
    setNavigatorLanguages(["de-DE", "en-US"]);

    renderProvider();

    await waitFor(() => expect(screen.getByTestId("language")).toHaveTextContent("de"));
    expect(window.localStorage.getItem("language")).toBe("de");
    expect(window.document.cookie).toContain("language=de");
  });

  it("persists language changes to the document, localStorage, and cookie", async () => {
    setNavigatorLanguages(["en-US"]);
    const user = userEvent.setup();

    renderProvider();
    await user.click(screen.getByRole("button", { name: /Switch to German/i }));

    await waitFor(() =>
      expect(window.document.documentElement).toHaveAttribute("lang", "de"),
    );
    expect(window.localStorage.getItem("language")).toBe("de");
    expect(window.document.cookie).toContain("language=de");
  });
});
