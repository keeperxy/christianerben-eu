import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CV from "./CV";
import { siteContent } from "@/content/content";
import { SettingsContext, type SettingsContextType } from "@/contexts/settings-hook";
import { generateCvDocx } from "@/components/cv/CVDocumentDocx";

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

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const renderCVPage = (ctx?: Partial<SettingsContextType>) => {
  const context: SettingsContextType = {
    language: "en",
    theme: "light",
    setLanguage: vi.fn(),
    setTheme: vi.fn(),
    t: (text) => text.en,
    ...ctx,
  };

  return render(
    <MemoryRouter initialEntries={["/cv"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <SettingsContext.Provider value={context}>
        <CV />
      </SettingsContext.Provider>
    </MemoryRouter>,
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
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
  });

  it("triggers a DOCX download when the button is clicked", async () => {
    const user = userEvent.setup();
    const createObjectUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-docx");
    const revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    try {
      renderCVPage();

      const [desktopDocxButton] = screen.getAllByRole("button", { name: /Download DOCX/i });
      await user.click(desktopDocxButton);

      await waitFor(() => {
        expect(generateCvDocx).toHaveBeenCalledTimes(1);
      });

      const mockedGenerateCvDocx = vi.mocked(generateCvDocx);
      const callArgs = mockedGenerateCvDocx.mock.calls[0]?.[0];
      expect(callArgs?.language).toBe("en");
      expect(callArgs?.data?.hero?.name).toBe(siteContent.hero.name);

      await waitFor(() => {
        expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(anchorClickSpy).toHaveBeenCalledTimes(1);
      });

    } finally {
      createObjectUrlSpy.mockRestore();
      revokeObjectUrlSpy.mockRestore();
      anchorClickSpy.mockRestore();
    }
  });
});
