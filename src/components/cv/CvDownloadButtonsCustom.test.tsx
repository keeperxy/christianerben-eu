import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteContent } from "@/content/content";
import CvDownloadButtonsCustom from "./CvDownloadButtonsCustom";

vi.mock("./CVDocument", () => ({ default: () => null }));
vi.mock("./CVDocumentDocx", () => ({
  generateCvDocx: vi.fn<() => Promise<Blob>>(async () => new Blob(["custom CV"])),
}));
vi.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: ({ fileName, onClick, children }: {
    fileName: string;
    onClick: React.MouseEventHandler<HTMLAnchorElement>;
    children: (props: { loading: boolean }) => React.ReactNode;
  }) => (
    <a href="blob:custom-pdf" download={fileName} onClick={(event) => { event.preventDefault(); onClick(event); }}>
      {children({ loading: false })}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("custom CV download filenames", () => {
  it.each(["de", "en"] as const)("refreshes %s PDF and DOCX names after midnight", async (language) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 16, 23, 55));
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn<() => string>(() => "blob:custom-docx"),
      revokeObjectURL: vi.fn<(url: string) => void>(),
    });
    let docxName = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      docxName = this.download;
    });
    render(<CvDownloadButtonsCustom language={language} cvData={siteContent} />);

    vi.setSystemTime(new Date(2026, 8, 17, 0, 5));
    const pdfLink = screen.getByRole("link", { name: /PDF/ });
    fireEvent.click(pdfLink);
    expect(pdfLink).toHaveAttribute("download", `Christian_Erben_2026-09-17_${language}.pdf`);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /DOCX/ }));
    });
    expect(docxName).toBe(`Christian_Erben_2026-09-17_${language}.docx`);
  });
});
