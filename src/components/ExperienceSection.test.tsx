import React from "react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import ExperienceSection from "@/components/ExperienceSection";
import { siteContent } from "@/content/content";
import { renderWithSettings } from "@/test-utils";

describe("ExperienceSection", () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeAll(() => {
    class IntersectionObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it("renders key and additional category sections", async () => {
    renderWithSettings(<ExperienceSection />);
    const categories = siteContent.experienceCategories;
    if (!categories) {
      throw new Error("Expected experience categories to be configured");
    }

    expect(
      await screen.findByRole("heading", {
        name: siteContent.experienceSectionTitle.en,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: categories.key.title.en,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: categories.additional.title.en,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Member of the Board")).toBeInTheDocument();
    expect(await screen.findByText("Network Administrator (Palo Alto / Fortinet)")).toBeInTheDocument();
  });
});
