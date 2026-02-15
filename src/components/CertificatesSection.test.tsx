import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import CertificatesSection from "@/components/CertificatesSection";
import { siteContent } from "@/content/content";
import { renderWithSettings } from "@/test-utils";

describe("CertificatesSection", () => {
  it("renders all badge slots and certificate pdf links", () => {
    renderWithSettings(<CertificatesSection />);

    const badgeImages = screen.getAllByTestId("credly-badge-image");
    expect(badgeImages).toHaveLength(siteContent.certificates.badges.length);

    for (const badge of siteContent.certificates.badges) {
      const links = screen.getAllByRole("link").filter((link) => link.getAttribute("href") === badge.publicUrl);
      expect(links.length).toBe(1);
      expect(links[0]).toHaveAttribute("target", "_blank");
    }

    for (const certificate of siteContent.certificates.documents) {
      const links = screen.getAllByRole("link").filter((link) => link.getAttribute("href") === certificate.filePath);
      expect(links.length).toBeGreaterThanOrEqual(2);
    }
  });
});
