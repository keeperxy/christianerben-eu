import { describe, expect, it } from "vitest";
import type { Experience } from "@/content/content";
import {
  groupAndSortExperiences,
  parsePeriodToSortKey,
  resolveExperienceCategory,
} from "@/lib/experience-utils";

const baseExperience = {
  title: { en: "Base Title", de: "Basistitel" },
  company: "Example Co",
  period: { en: "Jan 2024 - Present", de: "Jan 2024 - Heute" },
  location: { en: "City", de: "Stadt" },
  description: [],
  tags: [],
} satisfies Omit<Experience, "experienceCategory">;

function makeExperience(overrides: Partial<Experience>): Experience {
  return {
    ...baseExperience,
    ...overrides,
    title: overrides.title ?? baseExperience.title,
    period: overrides.period ?? baseExperience.period,
    location: overrides.location ?? baseExperience.location,
    description: overrides.description ?? baseExperience.description,
    tags: overrides.tags ?? baseExperience.tags,
  };
}

describe("parsePeriodToSortKey", () => {
  it("parses open-ended and closed ranges", () => {
    const present = parsePeriodToSortKey("Feb 2026 - Present");
    const closed = parsePeriodToSortKey("Aug 2025 - Oct 2025");
    const enDash = parsePeriodToSortKey("Feb 2026 – Present");

    expect(present).not.toBeNull();
    expect(closed).not.toBeNull();
    expect(enDash).not.toBeNull();
    expect((present as { endSort: number }).endSort).toBe(Number.POSITIVE_INFINITY);
    expect((closed as { endSort: number }).endSort).toBe(202510);
  });

  it("returns null for unsupported formats", () => {
    expect(parsePeriodToSortKey("2026/02 - Present")).toBeNull();
    expect(parsePeriodToSortKey("invalid period")).toBeNull();
  });
});

describe("resolveExperienceCategory", () => {
  it("uses explicit category when present", () => {
    const exp = makeExperience({ experienceCategory: "additional" });
    expect(resolveExperienceCategory(exp)).toBe("additional");
  });

  it("infers legacy additional projects", () => {
    const board = makeExperience({
      title: { en: "Member of the Board", de: "Vorstandsmitglied" },
      company: "DEGIT AG",
      experienceCategory: undefined,
    });

    const aiEvaluation = makeExperience({
      title: {
        en: "AI Training Platform & AI Tools Evaluation",
        de: "KI-Trainingsplattform & Evaluierung von KI-Werkzeugen",
      },
      company: "DEGIT AG",
      experienceCategory: undefined,
    });

    expect(resolveExperienceCategory(board)).toBe("additional");
    expect(resolveExperienceCategory(aiEvaluation)).toBe("additional");
  });

  it("defaults to key for unknown legacy entries", () => {
    const exp = makeExperience({
      title: { en: "Network Security", de: "Netzwerksicherheit" },
      company: "Example GmbH",
      experienceCategory: undefined,
    });

    expect(resolveExperienceCategory(exp)).toBe("key");
  });
});

describe("groupAndSortExperiences", () => {
  it("uses fixed ordering for configured additional projects and date sort for key projects", () => {
    const experiences: Experience[] = [
      makeExperience({
        title: { en: "Older Key", de: "Aelteres Key" },
        period: { en: "Apr 2018 - Dec 2018", de: "Apr 2018 - Dez 2018" },
        experienceCategory: "key",
      }),
      makeExperience({
        title: { en: "Newest Key", de: "Neuestes Key" },
        period: { en: "Feb 2026 - Present", de: "Feb 2026 - Heute" },
        experienceCategory: "key",
      }),
      makeExperience({
        title: { en: "Current Key", de: "Aktuelles Key" },
        period: { en: "Oct 2019 - Present", de: "Okt 2019 - Heute" },
        experienceCategory: "key",
      }),
      makeExperience({
        title: { en: "SchlauFabrik – Multi-tenant Compliance & AI Training Platform", de: "SchlauFabrik" },
        period: { en: "Dec 2025 - Present", de: "Dez 2025 - Heute" },
        experienceCategory: "additional",
      }),
      makeExperience({
        title: { en: "AI Training Platform & AI Tools Evaluation", de: "KI-Trainingsplattform & Evaluierung von KI-Werkzeugen" },
        period: { en: "Aug 2025 - Oct 2025", de: "Aug 2025 - Okt 2025" },
        experienceCategory: "additional",
      }),
      makeExperience({
        title: { en: "Member of the Board", de: "Vorstandsmitglied" },
        period: { en: "Apr 2020 - Present", de: "Apr 2020 - Heute" },
        experienceCategory: "additional",
      }),
    ];

    const grouped = groupAndSortExperiences(experiences);

    expect(grouped.key.map((item) => item.title.en)).toEqual(["Newest Key", "Current Key", "Older Key"]);
    expect(grouped.additional.map((item) => item.title.en)).toEqual([
      "Member of the Board",
      "SchlauFabrik – Multi-tenant Compliance & AI Training Platform",
      "AI Training Platform & AI Tools Evaluation",
    ]);
  });

  it("pushes unparseable periods to the end while preserving their relative order", () => {
    const experiences: Experience[] = [
      makeExperience({
        title: { en: "First Raw", de: "Erstes Raw" },
        period: { en: "Unknown Format", de: "Unbekanntes Format" },
        experienceCategory: "key",
      }),
      makeExperience({
        title: { en: "Second Parsed", de: "Zweites Parsed" },
        period: { en: "Jan 2024 - Present", de: "Jan 2024 - Heute" },
        experienceCategory: "key",
      }),
      makeExperience({
        title: { en: "Third Raw", de: "Drittes Raw" },
        period: { en: "No Date", de: "Kein Datum" },
        experienceCategory: "key",
      }),
    ];

    const grouped = groupAndSortExperiences(experiences);
    expect(grouped.key.map((item) => item.title.en)).toEqual(["Second Parsed", "First Raw", "Third Raw"]);
  });
});
