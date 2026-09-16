import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compressToUint8Array } from "lz-string";
import CV from "@/pages/cv";
import { siteContent, type SiteContent } from "@/content/content";
import type { SettingsContextType } from "@/contexts/settings-hook";
import { generateCvDocx } from "@/components/cv/CVDocumentDocx";
import { downloadCvFile } from "@/lib/cv-download";
import { renderWithSettings } from "@/test-utils";

const toast = vi.hoisted(() => vi.fn<(options: unknown) => void>());

vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));
vi.mock("@/lib/cv-download", () => ({ downloadCvFile: vi.fn<typeof downloadCvFile>(() => Promise.resolve()) }));

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

const renderCVPage = (ctx?: Partial<SettingsContextType>, asPath = "/cv") => {
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
    { pathname: "/cv", asPath }
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
    expect(screen.getByRole("button", { name: /Download CV options/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to dark mode/i })).toBeInTheDocument();
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
    expect(pdfLink).toHaveAttribute("download");
    expect(docxLink).toHaveAttribute("href", expect.stringContaining("/cv/christian_erben_cv_en.docx"));
    expect(docxLink).toHaveAttribute("download");

    await user.click(pdfLink);
    await user.click(docxLink);

    expect(downloadCvFile).toHaveBeenCalledWith(
      expect.stringContaining("/cv/christian_erben_cv_en.pdf"), "en", "pdf", false,
    );
    expect(downloadCvFile).toHaveBeenCalledWith(
      expect.stringContaining("/cv/christian_erben_cv_en.docx"), "en", "docx", false,
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
    expect(pdfLink).toHaveAttribute("download");
    expect(docxLink).toHaveAttribute("href", expect.stringContaining("/cv/christian_erben_cv_en.docx"));

    await user.click(pdfLink);
    expect(downloadCvFile).toHaveBeenLastCalledWith(
      expect.stringContaining("/cv/christian_erben_cv_en_with_certificates.pdf"), "en", "pdf", true,
    );
  });

  it("downloads the selected German certificate variant from the mobile menu", async () => {
    renderCVPage({ language: "de", t: (text) => text.de });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: siteContent.cv.certificateToggleOn.de }));
    await user.click(screen.getByRole("button", { name: "CV-Downloadoptionen" }));
    const links = screen.getAllByRole("link", { name: "PDF herunterladen" });
    await user.click(links[links.length - 1]);
    expect(downloadCvFile).toHaveBeenLastCalledWith(
      expect.stringContaining("/cv/christian_erben_cv_de_with_certificates.pdf"), "de", "pdf", true,
    );
    expect(screen.getAllByRole("link", { name: "PDF herunterladen" })).toHaveLength(1);
  });

  it("reports download failures without navigating to the static file", async () => {
    vi.mocked(downloadCvFile).mockRejectedValueOnce(new Error("Network error"));
    renderCVPage();
    await userEvent.setup().click(screen.getByRole("link", { name: "Download PDF" }));
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      variant: "destructive", title: "Download failed",
    }));
  });

  it("keeps custom CV data on lazy generated DOCX downloads", async () => {
    const asPath = `/cv#data=${encodeHashData({
      ...siteContent,
      hero: {
        ...siteContent.hero,
        name: "Custom Candidate",
      },
    })}`;

    renderCVPage(undefined, asPath);

    const user = userEvent.setup();
    const customDocxButtons = await screen.findAllByRole("button", { name: /Download DOCX/i });

    expect(customDocxButtons.length).toBeGreaterThan(0);
    await user.click(customDocxButtons[0]);
    expect(generateCvDocx).toHaveBeenCalledTimes(1);
  });

  it("ignores URL hash data that does not match the CV content shape", () => {
    const asPath = `/cv#data=${encodeHashData({
      hero: {
        name: "Incomplete Candidate",
      },
    } as SiteContent)}`;

    renderCVPage(undefined, asPath);

    expect(screen.getByRole("link", { name: /Download PDF/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/cv/christian_erben_cv_en.pdf"),
    );
  });

  it("ignores shallow-valid hash data whose nested fields would crash rendering", () => {
    const asPath = `/cv#data=${encodeHashData({
      ...siteContent,
      about: {
        ...siteContent.about,
        paragraphs: [],
      },
    })}`;

    renderCVPage(undefined, asPath);

    expect(screen.getByRole("link", { name: /Download PDF/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/cv/christian_erben_cv_en.pdf"),
    );
    expect(screen.getByRole("link", { name: /Download DOCX/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/cv/christian_erben_cv_en.docx"),
    );
    expect(generateCvDocx).not.toHaveBeenCalled();
  });

  it("ignores hash data containing an unknown skill category", () => {
    const asPath = `/cv#data=${encodeHashData({
      ...siteContent,
      skills: [
        {
          ...siteContent.skills[0],
          category: "quantum",
        },
      ],
    } as unknown as SiteContent)}`;

    renderCVPage(undefined, asPath);

    expect(screen.getByRole("link", { name: /Download PDF/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/cv/christian_erben_cv_en.pdf"),
    );
    expect(generateCvDocx).not.toHaveBeenCalled();
  });
});
