import { describe, expect, it } from "vitest";
import { siteContent, type SiteContent } from "@/content/content";
import {
  decodeCvData,
  encodeCvData,
  isCustomCvData,
  MAX_ENCODED_CV_DATA_LENGTH,
} from "@/lib/cv-data";

// Custom hash data is produced via JSON.stringify, which drops icon component
// functions. This mirrors exactly what a real shared URL contains.
const serializableSiteContent = (): SiteContent =>
  JSON.parse(JSON.stringify(siteContent)) as SiteContent;

describe("cv-data", () => {
  it("round-trips the current site content through encode and decode", () => {
    const encoded = encodeCvData(serializableSiteContent());
    const decoded = decodeCvData(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.hero.name).toBe(siteContent.hero.name);
    expect(decoded?.about.paragraphs.length).toBe(siteContent.about.paragraphs.length);
  });

  it("accepts the serializable site content shape", () => {
    expect(isCustomCvData(serializableSiteContent())).toBe(true);
  });

  it("rejects data with fewer than two about paragraphs", () => {
    const data = serializableSiteContent();
    data.about.paragraphs = [];

    expect(isCustomCvData(data)).toBe(false);
    expect(decodeCvData(encodeCvData(data))).toBeNull();
  });

  it("rejects an experience with a missing description array", () => {
    const data = serializableSiteContent();
    delete (data.experiences[0] as Partial<SiteContent["experiences"][number]>)
      .description;

    expect(isCustomCvData(data)).toBe(false);
  });

  it("rejects an experience with a malformed description item", () => {
    const data = serializableSiteContent();
    data.experiences[0].description[0] = {
      type: "text",
      text: "not localized",
    } as unknown as SiteContent["experiences"][number]["description"][number];

    expect(isCustomCvData(data)).toBe(false);
  });

  it("rejects missing or non-object social links", () => {
    const missing = serializableSiteContent();
    delete (missing.contact as Partial<SiteContent["contact"]>).socialLinks;
    expect(isCustomCvData(missing)).toBe(false);

    const malformed = serializableSiteContent();
    malformed.contact.socialLinks =
      "linkedin" as unknown as SiteContent["contact"]["socialLinks"];
    expect(isCustomCvData(malformed)).toBe(false);
  });

  it("rejects missing footer copyright data used by the editor", () => {
    const data = serializableSiteContent();
    delete (data as Partial<SiteContent>).footer;

    expect(isCustomCvData(data)).toBe(false);
    expect(decodeCvData(encodeCvData(data))).toBeNull();
  });

  it("rejects a skill with an unknown category", () => {
    const data = serializableSiteContent();
    data.skills[0].category =
      "quantum" as unknown as SiteContent["skills"][number]["category"];

    expect(isCustomCvData(data)).toBe(false);
  });

  it("rejects oversize encoded payloads before decoding", () => {
    const oversized = "A".repeat(MAX_ENCODED_CV_DATA_LENGTH + 1);

    expect(decodeCvData(oversized)).toBeNull();
  });

  it("keeps the current encoded site content well under the size limit", () => {
    const encoded = encodeCvData(serializableSiteContent());

    expect(encoded.length).toBeLessThan(MAX_ENCODED_CV_DATA_LENGTH / 2);
  });

  it("returns null for garbage input instead of throwing", () => {
    expect(decodeCvData("not-valid-base64!!!")).toBeNull();
    expect(decodeCvData("aGVsbG8gd29ybGQ=")).toBeNull();
  });
});
