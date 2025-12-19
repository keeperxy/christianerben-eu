import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
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
  generateCvDocx: vi.fn(() =>
    Promise.resolve(
      new Blob(["mock docx"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ),
  ),
}));

vi.mock("@/components/cv/CvDownloadButtonsCustom", () => ({
  __esModule: true,
  default: ({ language, cvData }: { language: "en" | "de"; cvData: unknown }) => (
    <button onClick={() => generateCvDocx({ language, data: cvData })}>
      Download DOCX
    </button>
  ),
}));

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const renderCVPage = (
  ctx?: Partial<SettingsContextType>,
  initialData?: SiteContent
) => {
  const context: SettingsContextType = {
    language: "en",
    theme: "light",
    setLanguage: vi.fn(),
    setTheme: vi.fn(),
    t: (text) => text.en,
    ...ctx,
  };

  return renderWithSettings(
    <CV initialData={initialData} />,
    context,
    { pathname: "/cv", asPath: "/cv" }
  );
};

describe("CV page", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn() as typeof window.scrollTo;
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
    expect(screen.getByRole("button", { name: /Download PDF/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download DOCX/i })).toBeInTheDocument();
    expect(screen.getByTestId("cv-preview")).toBeInTheDocument();
  });

  it("triggers a DOCX download when the button is clicked", async () => {
    renderCVPage();

    // There may be multiple DOCX buttons (e.g., in header and CV section), so use getAllByRole
    const docxButtons = await screen.findAllByRole("button", { name: /Download DOCX/i });
    expect(docxButtons.length).toBeGreaterThan(0);
    // The button triggers a download via onClick handler, not via href
    expect(docxButtons[0]).toHaveTextContent(/Download DOCX/i);
  });
});
