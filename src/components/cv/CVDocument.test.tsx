import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CVDocument from "@/components/cv/CVDocument";
import { siteContent } from "@/content/content";

vi.mock("@react-pdf/renderer", () => {
  const Container = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  const Document = ({
    author,
    children,
    conformance,
    language,
    title,
  }: {
    author?: string;
    children?: React.ReactNode;
    conformance?: string;
    language?: string;
    title?: string;
  }) => (
    <section
      data-testid="pdf-document"
      data-author={author}
      data-conformance={conformance}
      data-language={language}
      data-title={title}
    >
      {children}
    </section>
  );
  const Text = ({
    children,
    hyphenationPenalty,
  }: {
    children?: React.ReactNode;
    hyphenationPenalty?: number;
  }) => (
    <span data-hyphenation-penalty={hyphenationPenalty?.toString()}>
      {children}
    </span>
  );
  const Link = ({
    children,
    href,
    hyphenationPenalty,
  }: {
    children?: React.ReactNode;
    href?: string;
    hyphenationPenalty?: number;
  }) => (
    <a href={href} data-hyphenation-penalty={hyphenationPenalty?.toString()}>
      {children}
    </a>
  );
  const Primitive = () => null;

  return {
    Document,
    Page: Container,
    Text,
    View: Container,
    Image: Primitive,
    Link,
    Svg: Container,
    Path: Primitive,
    Line: Primitive,
    Rect: Primitive,
    G: Container,
    StyleSheet: { create: (styles: unknown) => styles },
    Font: { register: () => {} },
  };
});

describe("CVDocument hyphenation policy", () => {
  it("disables automatic hyphenation for body copy but not short labels", () => {
    render(
      <CVDocument
        language="en"
        profileImageSrc="/profile.jpg"
        includeCertificates
      />,
    );

    const expectBodyPenalty = (element: HTMLElement) => {
      expect(element).toHaveAttribute("data-hyphenation-penalty", "Infinity");
    };
    const expectNoPenalty = (element: HTMLElement) => {
      expect(element).not.toHaveAttribute("data-hyphenation-penalty");
    };
    const getBullet = (text: string) =>
      screen.getByText(
        (_, element) => element?.tagName === "SPAN" && element.textContent === `• ${text}`,
      );

    expectBodyPenalty(screen.getByText(siteContent.hero.description.en));
    expectBodyPenalty(screen.getByText(siteContent.about.paragraphs[0].en));
    expectBodyPenalty(
      getBullet(siteContent.experiences[0].description[0].text.en),
    );
    expectBodyPenalty(getBullet(siteContent.securityCompliance.items[0].items[0].en));
    expectBodyPenalty(
      screen.getByText(siteContent.experienceCategories!.key.subtitle.en),
    );
    expectBodyPenalty(screen.getByText(siteContent.projects[0].description.en));

    expectNoPenalty(screen.getByText("Profile"));
    screen
      .getAllByText(siteContent.experiences[0].tags[1].en)
      .forEach(expectNoPenalty);
    expectNoPenalty(
      screen.getByText(siteContent.skills.find((skill) => skill.category === "security")!.name.en),
    );

    const certificate = siteContent.certificates.documents[0];
    screen.getAllByText(`Issuer: ${certificate.issuer.en}`).forEach(expectNoPenalty);
    const certificateHref = `${siteContent.contact.homepage}${encodeURI(certificate.filePath)}`;
    expectNoPenalty(screen.getByRole("link", { name: certificateHref }));
  });

  it.each([
    ["en", "en-US", `${siteContent.hero.name} - CV`],
    ["de", "de-DE", `${siteContent.hero.name} - Lebenslauf`],
  ] as const)("declares PDF/A-2b metadata for %s", (language, expectedLanguage, expectedTitle) => {
    render(<CVDocument language={language} profileImageSrc="/profile.jpg" />);

    expect(screen.getByTestId("pdf-document")).toHaveAttribute(
      "data-conformance",
      "PDF/A-2b",
    );
    expect(screen.getByTestId("pdf-document")).toHaveAttribute(
      "data-language",
      expectedLanguage,
    );
    expect(screen.getByTestId("pdf-document")).toHaveAttribute(
      "data-author",
      siteContent.hero.name,
    );
    expect(screen.getByTestId("pdf-document")).toHaveAttribute("data-title", expectedTitle);
  });
});
