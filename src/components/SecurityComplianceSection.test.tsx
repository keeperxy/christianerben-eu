import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithSettings } from "../test-utils";
import { siteContent } from "@/content/content";
import SecurityComplianceSection from "./SecurityComplianceSection";

const firstItem = siteContent.securityCompliance.items[0];

describe("SecurityComplianceSection", () => {
  it("renders the English heading, subtitle, and first card content", () => {
    renderWithSettings(<SecurityComplianceSection />);

    expect(
      screen.getByRole("heading", { name: siteContent.securityCompliance.title.en }),
    ).toBeInTheDocument();
    const subtitle = siteContent.securityCompliance.subtitle;
    expect(subtitle).toBeDefined();
    expect(screen.getByText(subtitle!.en)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: firstItem.title.en })).toBeInTheDocument();
    expect(screen.getByText(firstItem.items[0].en)).toBeInTheDocument();
  });

  it("renders German content when the German language is active", () => {
    renderWithSettings(<SecurityComplianceSection />, {
      language: "de",
      t: (text) => text.de,
    });

    expect(
      screen.getByRole("heading", { name: siteContent.securityCompliance.title.de }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: firstItem.title.de })).toBeInTheDocument();
    expect(screen.getByText(firstItem.items[0].de)).toBeInTheDocument();
  });
});
