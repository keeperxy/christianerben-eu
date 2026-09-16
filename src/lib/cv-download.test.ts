import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadCvFile, getCvDownloadFilename } from "./cv-download";

describe("CV downloads", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 16, 0, 15));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(["de", "en"] as const)("names %s files using the local download date", (language) => {
    expect(getCvDownloadFilename(language, "pdf")).toBe(`Christian_Erben_2026-09-16_${language}.pdf`);
    expect(getCvDownloadFilename(language, "pdf", true)).toBe(
      `Christian_Erben_2026-09-16_${language}_with_certificates.pdf`,
    );
    expect(getCvDownloadFilename(language, "docx", true)).toBe(`Christian_Erben_2026-09-16_${language}.docx`);
    vi.setSystemTime(new Date(2026, 8, 17, 0, 5));
    expect(getCvDownloadFilename(language, "pdf")).toBe(`Christian_Erben_2026-09-17_${language}.pdf`);
  });

  it("downloads a blob with a fresh name instead of the server filename and releases it", async () => {
    const blob = new Blob(["%PDF-1.7"], { type: "application/pdf" });
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(blob, {
      headers: { "Content-Disposition": 'inline; filename="christian_erben_cv_de.pdf"' },
    }));
    const createObjectURL = vi.fn<() => string>(() => "blob:cv-download");
    const revokeObjectURL = vi.fn<(url: string) => void>();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    let savedName = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      savedName = this.download;
      expect(this.href).toBe("blob:cv-download");
      expect(this.isConnected).toBe(true);
    });

    await downloadCvFile("/cv/christian_erben_cv_de.pdf", "de", "pdf");

    expect(fetchMock).toHaveBeenCalledWith("/cv/christian_erben_cv_de.pdf");
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(savedName).toBe("Christian_Erben_2026-09-16_de.pdf");
    expect(document.querySelector('a[href="blob:cv-download"]')).toBeNull();
    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.runOnlyPendingTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:cv-download");
  });

  it("does not save an HTTP error response as a CV", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(new Response("Not found", { status: 404 })));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click");
    await expect(downloadCvFile("/cv/missing.pdf", "en", "pdf")).rejects.toThrow("HTTP 404");
    expect(click).not.toHaveBeenCalled();
  });
});
