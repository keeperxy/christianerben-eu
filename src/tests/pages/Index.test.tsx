import React from "react";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithSettings } from "@/test-utils";
import { siteContent } from "@/content/content";

vi.mock("@/components/ProjectsSection", () => ({
  __esModule: true,
  default: () => (
    <section id="projects">
      <h2>{siteContent.projectsSectionTitle.en}</h2>
    </section>
  ),
}));

vi.mock("@/components/SkillsSection", () => ({
  __esModule: true,
  default: () => (
    <section id="skills">
      <h2>{siteContent.skillsSection.title.en}</h2>
    </section>
  ),
}));

vi.mock("@/components/ContactSection", () => ({
  __esModule: true,
  default: () => (
    <section id="contact">
      <h2>{siteContent.contact.title.en}</h2>
    </section>
  ),
}));

import Index from "@/pages/index";

describe("Index page", () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const originalMatchMedia = globalThis.matchMedia;

  beforeAll(() => {
    // jsdom does not implement IntersectionObserver which the experience section expects.
    class IntersectionObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
    globalThis.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false;
      },
    })) as unknown as typeof window.matchMedia;
  });

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    globalThis.matchMedia = originalMatchMedia;
  });

  it("renders the main homepage sections", async () => {
    renderWithSettings(<Index />);

    const heroHeading = new RegExp(
      `${siteContent.hero.name}.*${siteContent.hero.titleElements[0].en}`,
      "i",
    );
    // Use getAllByRole since the hero heading appears multiple times (in header and hero section)
    const heroHeadings = await screen.findAllByRole("heading", { name: heroHeading });
    expect(heroHeadings.length).toBeGreaterThan(0);
    expect(heroHeadings[0]).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: siteContent.about.title.en })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: siteContent.experienceSectionTitle.en })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: siteContent.contact.title.en })).toBeInTheDocument();
  });
});
