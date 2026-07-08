import { compressToUint8Array, decompressFromUint8Array } from "lz-string";
import { z } from "zod";
import type { SiteContent } from "@/content/content";

// Current encoded siteContent is ~36 KB; the limit leaves room for edited CVs
// while rejecting absurdly large payloads before decompression.
export const MAX_ENCODED_CV_DATA_LENGTH = 100_000;

const localizedString = z.looseObject({
  en: z.string(),
  de: z.string(),
});

const skillCategory = z.enum([
  "languages",
  "management",
  "security",
  "infrastructure",
  "tools",
  "ai",
  "compliance",
]);

const experienceCategoryTexts = z.looseObject({
  title: localizedString,
  subtitle: localizedString,
});

// Validates the fields consumed by CVEditor, CVDocument, and CVDocumentDocx.
// Non-serializable fields such as icon components never survive
// JSON.stringify, so they are intentionally not required here and the custom
// CV render path must not depend on them.
const customCvDataSchema = z.looseObject({
  hero: z.looseObject({
    name: z.string(),
    description: localizedString,
    titleElements: z.array(localizedString),
  }),
  about: z.looseObject({
    // PDF and DOCX render paragraphs [0] and [1] directly.
    paragraphs: z.array(localizedString).min(2),
  }),
  securityCompliance: z.looseObject({
    title: localizedString,
    items: z.array(
      z.looseObject({
        title: localizedString,
        items: z.array(localizedString),
      }),
    ),
  }),
  experiences: z.array(
    z.looseObject({
      title: localizedString,
      company: z.string(),
      period: localizedString,
      location: localizedString,
      experienceCategory: z.enum(["key", "additional"]).optional(),
      description: z.array(
        z.looseObject({
          type: z.enum(["text", "achievement"]),
          text: localizedString,
        }),
      ),
      tags: z.array(localizedString),
    }),
  ),
  experienceCategories: z
    .looseObject({
      key: experienceCategoryTexts,
      additional: experienceCategoryTexts,
    })
    .optional(),
  projectsSectionTitle: localizedString,
  projects: z.array(
    z.looseObject({
      title: localizedString,
      description: localizedString,
      tags: z.array(localizedString),
    }),
  ),
  skills: z.array(
    z.looseObject({
      name: localizedString,
      category: skillCategory,
      level: z.number(),
    }),
  ),
  skillsSection: z.looseObject({
    title: localizedString,
    categories: z.looseObject(
      Object.fromEntries(
        skillCategory.options.map((category) => [category, localizedString]),
      ),
    ),
  }),
  contact: z.looseObject({
    email: z.string(),
    cvemail: z.string(),
    phone: z.string(),
    homepage: z.string().optional(),
    birthday: z.string().optional(),
    socialLinks: z.looseObject({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      xing: z.string().optional(),
      x: z.string().optional(),
      bluesky: z.string().optional(),
      freelancermap: z.string().optional(),
    }),
  }),
  imprint: z.looseObject({
    companyName: localizedString,
    address: z.looseObject({
      street: localizedString,
      city: localizedString,
      country: localizedString,
    }),
  }),
  backToHome: localizedString,
  experienceSectionTitle: localizedString,
  experienceAchievementPrefix: localizedString,
  downloadResume: localizedString,
});

export function isCustomCvData(value: unknown): value is SiteContent {
  return customCvDataSchema.safeParse(value).success;
}

export function encodeCvData(data: SiteContent): string {
  const compressed = compressToUint8Array(JSON.stringify(data));
  let binary = "";
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return window.btoa(binary);
}

export function decodeCvData(encoded: string): SiteContent | null {
  if (encoded.length > MAX_ENCODED_CV_DATA_LENGTH) {
    return null;
  }

  try {
    const binary = window.atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const json = decompressFromUint8Array(bytes);
    if (!json) {
      return null;
    }

    const parsed: unknown = JSON.parse(json);
    return isCustomCvData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
