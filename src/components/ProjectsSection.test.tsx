import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithSettings } from "../test-utils";
import { siteContent } from "@/content/content";
import ProjectsSection from "./ProjectsSection";

const firstProject = siteContent.projects[0];

describe("ProjectsSection", () => {
  it("renders the English heading and first project card content", () => {
    renderWithSettings(<ProjectsSection />);

    expect(
      screen.getByRole("heading", { name: siteContent.projectsSectionTitle.en }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstProject.title.en)).toBeInTheDocument();
    expect(screen.getByText(firstProject.description.en)).toBeInTheDocument();
    expect(screen.getByAltText(firstProject.imageAlt.en)).toBeInTheDocument();
    expect(screen.getAllByText(firstProject.tags[0].en).length).toBeGreaterThan(0);
  });

  it("renders German content when the German language is active", () => {
    renderWithSettings(<ProjectsSection />, {
      language: "de",
      t: (text) => text.de,
    });

    expect(
      screen.getByRole("heading", { name: siteContent.projectsSectionTitle.de }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstProject.title.de)).toBeInTheDocument();
    expect(screen.getByAltText(firstProject.imageAlt.de)).toBeInTheDocument();
  });
});
