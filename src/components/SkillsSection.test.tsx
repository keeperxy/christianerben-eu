import React from "react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SkillsSection from "@/components/SkillsSection";
import { siteContent } from "@/content/content";
import { renderWithSettings } from "@/test-utils";

describe("SkillsSection", () => {
  it("renders labeled skill tabs and switches the visible skill category", async () => {
    const user = userEvent.setup();
    renderWithSettings(<SkillsSection />);

    const securityTab = screen.getByRole("tab", {
      name: siteContent.skillsSection.categories.security.en,
    });
    await user.click(securityTab);

    const firstSecuritySkill = siteContent.skills.find((skill) => skill.category === "security");
    expect(firstSecuritySkill).toBeDefined();
    expect(screen.getByRole("heading", { name: firstSecuritySkill?.name.en })).toBeInTheDocument();
  });

  it("keeps skill tab labels visible on small screens", () => {
    const source = readFileSync(path.resolve(process.cwd(), "src/components/SkillsSection.tsx"), "utf8");

    expect(source).not.toContain("max-[480px]:hidden");
    expect(source).not.toContain("xl:grid-cols-7");
    expect(source).toContain("grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]");
    expect(source).toContain("whitespace-normal");
  });

  it("exposes skill levels as accessible meters", () => {
    renderWithSettings(<SkillsSection />);

    const firstManagementSkill = siteContent.skills.find((skill) => skill.category === "management");
    expect(firstManagementSkill).toBeDefined();

    const meter = screen.getByRole("meter", {
      name: `${firstManagementSkill?.name.en} level ${firstManagementSkill?.level} of 5`,
    });
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "5");
    expect(meter).toHaveAttribute("aria-valuenow", String(firstManagementSkill?.level));
  });
});
