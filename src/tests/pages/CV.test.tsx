import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compressToUint8Array } from "lz-string";
import CV from "@/pages/cv";
import { siteContent, type SiteContent } from "@/content/content";
import type { SettingsContextType } from "@/contexts/settings-hook";
import { generateCvDocx } from "@/components/cv/CVDocumentDocx";
import { renderWithSettings } from "@/test-utils";

vi.mock("@react-pdf/renderer", () => {
  const Container = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  const Primitive = () => null;

  return {
    PDFViewer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pdf-viewer">{children}</div>
    ),
    PDFDownloadLink: ({
      children,
    }: {
      children: (props: { loading: boolean }) => React.ReactNode;
    }) => <>{children({ loading: false })}</>,
    Document: Container,
    Page: Container,
    Text: Container,
    View: Container,
    Image: Primitive,
    Link: Container,
    Svg: Container,
    Path: Primitive,
    Line: Primitive,
    Rect: Primitive,
    G: Container,
    StyleSheet: {
      create: (styles: unknown) => styles,
    },
    Font: {
      register: () => {},
    },
  };
});

vi.mock("@/components/cv/CVDocumentDocx", () => ({
  generateCvDocx: vi.fn<() => Promise<Blob>>(() =>
    Promise.resolve(
      new Blob(["mock docx"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ),
  ),
}));

vi.mock("@/components/cv/CvDownloadButtonsCustom", () => ({
  __esModule: true,
  default: ({ language, cvData }: { language: "en" | "de"; cvData: SiteContent }) => (
    <button onClick={() => generateCvDocx({ language, data: cvData })}>
      Download DOCX
    </button>
  ),
}));

vi.mock("@/components/cv/CVPreviewFrame", () => ({
  __esModule: true,
  default: ({
    src,
    title,
    "data-testid": testId,
  }: {
    src: string;
    title: string;
    "data-testid"?: string;
  }) => <div data-testid={testId} data-src={src} title={title} />,
}));

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const encodeHashData = (data: SiteContent) => {
  const compressed = compressToUint8Array(JSON.stringify(data));
  let binary = "";

  for (let index = 0; index < compressed.length; index++) {
    binary += String.fromCharCode(compressed[index]);
  }

  return window.btoa(binary);
};

const renderCVPage = (ctx?: Partial<SettingsContextType>) => {
  const context: SettingsContextType = {
    language: "en",
    theme: "light",
    setLanguage: vi.fn<SettingsContextType["setLanguage"]>(),
    setTheme: vi.fn<SettingsContextType["setTheme"]>(),
    t: (text) => text.en,
    ...ctx,
  };

  return renderWithSettings(
    <CV />,
    context,
    { pathname: "/cv", asPath: "/cv" }
  );
};

describe("CV page", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn<(options?: ScrollToOptions | number, y?: number) => void>() as typeof window.scrollTo;
    if (!URL.createObjectURL) {
      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        writable: true,
        value: () => "",
      });
    }
    if (!URL.revokeObjectURL) {
      Object.defineProperty(URL, "revokeObjectURL", {
        configurable: true,
        writable: true,
        value: () => {},
      });
    }
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.location.hash = "";
  });

  afterAll(() => {
    if (originalCreateObjectURL) {
      URL.createObjectURL = originalCreateObjectURL;
    } else {
      Reflect.deleteProperty(URL, "createObjectURL");
    }
    if (originalRevokeObjectURL) {
      URL.revokeObjectURL = originalRevokeObjectURL;
    } else {
      Reflect.deleteProperty(URL, "revokeObjectURL");
    }
  });

  it("renders the CV viewer and download controls", () => {
    renderCVPage();

    expect(screen.getByText(siteContent.backToHome.en)).toBeInTheDocument();
    expect(screen.getByText(/Curriculum Vitae/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Download PDF/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Download DOCX/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /With certificates/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("cv-preview").length).toBeGreaterThan(0);
  });

  it("uses static download links and switches the PDF certificate variant when toggled", async () => {
    renderCVPage();

    const user = userEvent.setup();
    const toggle = screen.getAllByRole("button", { name: /With certificates/i })[0];
    const preview = screen.getAllByTestId("cv-preview")[0];
    const pdfLink = screen.getByRole("link", { name: /Download PDF/i });
    const docxLink = screen.getByRole("link", { name: /Download DOCX/i });

    expect(preview).toHaveAttribute("data-src", expect.stringContaining("/cv/christian_erben_cv_en.pdf"));
    expect(pdfLink).toHaveAttribute("href", expect.stringContaining("/cv/christian_erben_cv_en.pdf"));
    expect(pdfLink).toHaveAttribute("download", "christian_erben_cv_en.pdf");
    expect(docxLink).toHaveAttribute("href", expect.stringContaining("/cv/christian_erben_cv_en.docx"));
    expect(docxLink).toHaveAttribute("download", "christian_erben_cv_en.docx");

    await user.click(pdfLink);
    await user.click(docxLink);

    expect(pdfLink.getAttribute("download")).toMatch(
      /^christian_erben_cv_en_\d{4}-\d{2}-\d{2}\.pdf$/,
    );
    expect(docxLink.getAttribute("download")).toMatch(
      /^christian_erben_cv_en_\d{4}-\d{2}-\d{2}\.docx$/,
    );

    await user.click(toggle);

    expect(preview).toHaveAttribute(
      "data-src",
      expect.stringContaining("/cv/christian_erben_cv_en_with_certificates.pdf"),
    );
    expect(pdfLink).toHaveAttribute(
      "href",
      expect.stringContaining("/cv/christian_erben_cv_en_with_certificates.pdf"),
    );
    expect(pdfLink).toHaveAttribute("download", "christian_erben_cv_en_with_certificates.pdf");
    expect(docxLink).toHaveAttribute("href", expect.stringContaining("/cv/christian_erben_cv_en.docx"));

    await user.click(pdfLink);
    expect(pdfLink.getAttribute("download")).toMatch(
      /^christian_erben_cv_en_\d{4}-\d{2}-\d{2}_with_certificates\.pdf$/,
    );
  });

  it("keeps custom CV data on lazy generated DOCX downloads", async () => {
    window.location.hash = `data=${encodeHashData({
      ...siteContent,
      hero: {
        ...siteContent.hero,
        name: "Custom Candidate",
      },
    })}`;

    renderCVPage();

    const user = userEvent.setup();
    const customDocxButtons = await screen.findAllByRole("button", { name: /Download DOCX/i });

    expect(customDocxButtons.length).toBeGreaterThan(0);
    await user.click(customDocxButtons[0]);
    expect(generateCvDocx).toHaveBeenCalledTimes(1);
  });
});
