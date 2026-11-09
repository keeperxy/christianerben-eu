import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CVEditor from "@/components/cv/CVEditor";
import { siteContent, type SiteContent } from "@/content/content";
import { isCustomCvData } from "@/lib/cv-data";
import { renderWithSettings } from "@/test-utils";

const renderEditor = () => {
  const onChange = vi.fn<(data: SiteContent) => void>();
  renderWithSettings(<CVEditor data={siteContent} onChange={onChange} language="en" />);
  return { onChange, user: userEvent.setup() };
};

const lastChange = (onChange: ReturnType<typeof vi.fn<(data: SiteContent) => void>>) =>
  onChange.mock.calls.at(-1)?.[0];

describe("CVEditor skills", () => {
  it("only offers skill categories that the shared CV link accepts", async () => {
    const { onChange, user } = renderEditor();

    await user.click(screen.getByRole("button", { name: "Skills" }));
    const category = screen.getAllByRole("combobox", { name: "Category" })[0];
    await user.selectOptions(category, "compliance");

    const changed = lastChange(onChange);
    expect(changed?.skills[0].category).toBe("compliance");
    expect(isCustomCvData(changed)).toBe(true);
  });

  it("keeps the skill level numeric so the shared CV link stays valid", async () => {
    const { onChange, user } = renderEditor();

    await user.click(screen.getByRole("button", { name: "Skills" }));
    const level = screen.getAllByRole("combobox", { name: "Level (1-5)" })[0];
    await user.selectOptions(level, "2");

    const changed = lastChange(onChange);
    expect(changed?.skills[0].level).toBe(2);
    expect(isCustomCvData(changed)).toBe(true);
  });
});
