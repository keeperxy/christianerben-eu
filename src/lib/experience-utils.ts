import type { Experience, ExperienceCategory } from "@/content/content";

interface ParsedPeriod {
  endSort: number;
  startSort: number;
}

interface IndexedExperience {
  experience: Experience;
  index: number;
  parsedPeriod: ParsedPeriod | null;
}

const monthIndex: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const ADDITIONAL_PROJECT_TITLES = new Set([
  "member of the board",
  "vorstandsmitglied",
  "schlaufabrik – multi-tenant compliance & ai training platform",
  "schlaufabrik - multi-tenant compliance & ai training platform",
  "schlaufabrik – multi-tenant compliance- & ki-trainingsplattform",
  "schlaufabrik - multi-tenant compliance- & ki-trainingsplattform",
  "ai training platform & ai tools evaluation",
  "ki-trainingsplattform & evaluierung von ki-werkzeugen",
]);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function parseMonthYear(value: string): { year: number; month: number } | null {
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, monthRaw, yearRaw] = match;
  const month = monthIndex[normalize(monthRaw)];
  if (month == null) {
    return null;
  }

  return {
    month,
    year: Number(yearRaw),
  };
}

function toSortValue(year: number, month: number): number {
  return year * 100 + (month + 1);
}

export function parsePeriodToSortKey(periodEn: string): ParsedPeriod | null {
  const parts = periodEn.split("-").map((part) => part.trim());
  if (parts.length !== 2) {
    return null;
  }

  const [startRaw, endRaw] = parts;
  const start = parseMonthYear(startRaw);

  if (!start) {
    return null;
  }

  let endSort: number;
  if (normalize(endRaw) === "present") {
    endSort = Number.POSITIVE_INFINITY;
  } else {
    const end = parseMonthYear(endRaw);
    if (!end) {
      return null;
    }
    endSort = toSortValue(end.year, end.month);
  }

  return {
    endSort,
    startSort: toSortValue(start.year, start.month),
  };
}

export function resolveExperienceCategory(experience: Experience): ExperienceCategory {
  if (experience.experienceCategory) {
    return experience.experienceCategory;
  }

  const company = normalize(experience.company);
  const titleEn = normalize(experience.title.en);
  const titleDe = normalize(experience.title.de);

  if (company === "degit ag" && (titleEn === "member of the board" || titleDe === "vorstandsmitglied")) {
    return "additional";
  }

  if (company === "degit ag" && (titleEn === "ai training platform & ai tools evaluation" || titleDe === "ki-trainingsplattform & evaluierung von ki-werkzeugen")) {
    return "additional";
  }

  if (ADDITIONAL_PROJECT_TITLES.has(titleEn) || ADDITIONAL_PROJECT_TITLES.has(titleDe)) {
    return "additional";
  }

  if (titleEn.includes("schlaufabrik") || titleDe.includes("schlaufabrik")) {
    return "additional";
  }

  return "key";
}

function compareIndexedExperiences(a: IndexedExperience, b: IndexedExperience): number {
  if (!a.parsedPeriod || !b.parsedPeriod) {
    return a.index - b.index;
  }

  if (a.parsedPeriod.endSort !== b.parsedPeriod.endSort) {
    return b.parsedPeriod.endSort - a.parsedPeriod.endSort;
  }

  if (a.parsedPeriod.startSort !== b.parsedPeriod.startSort) {
    return b.parsedPeriod.startSort - a.parsedPeriod.startSort;
  }

  return a.index - b.index;
}

function getAdditionalProjectPriority(experience: Experience): number | null {
  const titleEn = normalize(experience.title.en);
  const titleDe = normalize(experience.title.de);

  if (titleEn === "member of the board" || titleDe === "vorstandsmitglied") {
    return 0;
  }

  if (titleEn.includes("schlaufabrik") || titleDe.includes("schlaufabrik")) {
    return 1;
  }

  if (
    titleEn === "ai training platform & ai tools evaluation" ||
    titleDe === "ki-trainingsplattform & evaluierung von ki-werkzeugen"
  ) {
    return 2;
  }

  return null;
}

function compareAdditionalExperiences(a: IndexedExperience, b: IndexedExperience): number {
  const aPriority = getAdditionalProjectPriority(a.experience);
  const bPriority = getAdditionalProjectPriority(b.experience);

  if (aPriority != null && bPriority != null && aPriority !== bPriority) {
    return aPriority - bPriority;
  }

  if (aPriority != null && bPriority == null) {
    return -1;
  }

  if (aPriority == null && bPriority != null) {
    return 1;
  }

  return compareIndexedExperiences(a, b);
}

export function groupAndSortExperiences(experiences: Experience[]): {
  key: Experience[];
  additional: Experience[];
} {
  const indexedExperiences: IndexedExperience[] = experiences.map((experience, index) => ({
    experience,
    index,
    parsedPeriod: parsePeriodToSortKey(experience.period.en),
  }));

  const grouped = indexedExperiences.reduce(
    (acc, item) => {
      const category = resolveExperienceCategory(item.experience);
      acc[category].push(item);
      return acc;
    },
    {
      key: [] as IndexedExperience[],
      additional: [] as IndexedExperience[],
    },
  );

  return {
    key: grouped.key.sort(compareIndexedExperiences).map((item) => item.experience),
    additional: grouped.additional.sort(compareAdditionalExperiences).map((item) => item.experience),
  };
}
