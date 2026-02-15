import React from "react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderToFile } from "@react-pdf/renderer";
import type { PDFEmbeddedPage, PDFFont, PDFPage } from "pdf-lib";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import CVDocument from "../src/components/cv/CVDocument";
import { siteContent } from "../src/content/content";
import { generateCvDocx } from "../src/components/cv/CVDocumentDocx";

const LANGUAGES: Array<"en" | "de"> = ["en", "de"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const CV_OUTPUT_DIR = path.join(PUBLIC_DIR, "cv");
const PROFILE_IMAGE_PATH = path.join(PUBLIC_DIR, "profile.jpg");
// Sidebar width in PDF points for certificate page layout.
const SIDEBAR_WIDTH = 160;
const A4_PAGE_SIZE = { width: 595.28, height: 841.89 };
const CERT_PAGE_LAYOUT = {
  contentXOffset: 30,
  headerY: 56,
  titleY: 78,
  issuerY: 95,
  frameInsetLeft: 24,
  frameInsetRight: 24,
  frameY: 52,
  frameBottomInset: 170,
  frameInnerPadding: 24,
  frameBorderWidth: 1.5,
};
const CV_PDF_THEME = {
  background: "#E6E9F3",
  sidebar: "#1B6E5A",
  accent: "#3A2366",
  foreground: "#07090B",
  border: "#DBE3EF",
  footer: "#AAAAAA",
};
const FOOTER = {
  line1Y: 34,
  line2Y: 22,
  size: 8,
};

interface FooterLabels {
  pageLabel: string;
  ofLabel: string;
  updateLabel: string;
  dateLabel: string;
}

interface EmbeddedCertificateContext {
  page: PDFPage;
  embeddedCertificatePage: PDFEmbeddedPage;
  pageTitle: string;
  issuerText: string;
  baseWidth: number;
  baseHeight: number;
  fontBold: PDFFont;
  fontRegular: PDFFont;
}

function hexToRgb(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  if (normalized.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    throw new Error(`Invalid hex color format: ${hexColor}`);
  }
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return rgb(red, green, blue);
}

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

function getFooterLabels(language: "en" | "de"): FooterLabels {
  const pageLabel = language === "en" ? "Page" : "Seite";
  const ofLabel = language === "en" ? "of" : "von";
  const updateLabel = language === "en" ? "Last updated" : "Letztes Update";
  const locale = language === "en" ? "en-US" : "de-DE";
  const dateLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date());

  return { pageLabel, ofLabel, updateLabel, dateLabel };
}

function addFooterToAllPages(mergedPdf: PDFDocument, language: "en" | "de", fontRegular: PDFFont) {
  const totalPages = mergedPdf.getPageCount();
  const labels = getFooterLabels(language);

  mergedPdf.getPages().forEach((page, index) => {
    const footerLine1 = `${labels.pageLabel} ${index + 1} ${labels.ofLabel} ${totalPages}`;
    const footerLine2 = `${labels.updateLabel}: ${labels.dateLabel}`;
    const line1Width = fontRegular.widthOfTextAtSize(footerLine1, FOOTER.size);
    const line2Width = fontRegular.widthOfTextAtSize(footerLine2, FOOTER.size);

    page.drawText(footerLine1, {
      x: (SIDEBAR_WIDTH - line1Width) / 2,
      y: FOOTER.line1Y,
      size: FOOTER.size,
      font: fontRegular,
      color: hexToRgb(CV_PDF_THEME.footer),
    });
    page.drawText(footerLine2, {
      x: (SIDEBAR_WIDTH - line2Width) / 2,
      y: FOOTER.line2Y,
      size: FOOTER.size,
      font: fontRegular,
      color: hexToRgb(CV_PDF_THEME.footer),
    });
  });
}

function drawStyledCertificatePage({
  page,
  embeddedCertificatePage,
  pageTitle,
  issuerText,
  baseWidth,
  baseHeight,
  fontBold,
  fontRegular,
}: EmbeddedCertificateContext) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: baseWidth,
    height: baseHeight,
    color: hexToRgb(CV_PDF_THEME.background),
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: SIDEBAR_WIDTH,
    height: baseHeight,
    color: hexToRgb(CV_PDF_THEME.sidebar),
  });

  const contentX = SIDEBAR_WIDTH + CERT_PAGE_LAYOUT.contentXOffset;
  page.drawText(issuerText, {
    x: contentX,
    y: baseHeight - CERT_PAGE_LAYOUT.headerY,
    size: 14,
    font: fontBold,
    color: hexToRgb(CV_PDF_THEME.accent),
  });
  page.drawText(pageTitle, {
    x: contentX,
    y: baseHeight - CERT_PAGE_LAYOUT.titleY,
    size: 11,
    font: fontRegular,
    color: hexToRgb(CV_PDF_THEME.foreground),
  });

  const frameX = SIDEBAR_WIDTH + CERT_PAGE_LAYOUT.frameInsetLeft;
  const frameY = CERT_PAGE_LAYOUT.frameY;
  const frameWidth = baseWidth - frameX - CERT_PAGE_LAYOUT.frameInsetRight;
  const frameHeight = baseHeight - CERT_PAGE_LAYOUT.frameBottomInset;
  const scale = Math.min(
    (frameWidth - CERT_PAGE_LAYOUT.frameInnerPadding) / embeddedCertificatePage.width,
    (frameHeight - CERT_PAGE_LAYOUT.frameInnerPadding) / embeddedCertificatePage.height,
  );
  const drawWidth = embeddedCertificatePage.width * scale;
  const drawHeight = embeddedCertificatePage.height * scale;
  const drawX = frameX + (frameWidth - drawWidth) / 2;
  const drawY = frameY + (frameHeight - drawHeight) / 2;

  page.drawRectangle({
    x: frameX,
    y: frameY,
    width: frameWidth,
    height: frameHeight,
    color: rgb(1, 1, 1),
    borderColor: hexToRgb(CV_PDF_THEME.border),
    borderWidth: CERT_PAGE_LAYOUT.frameBorderWidth,
  });
  page.drawPage(embeddedCertificatePage, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  });
}

async function readCertificatePdfOrThrow(certificatePath: string, certificateTitle: string) {
  try {
    return await readFile(certificatePath);
  } catch {
    throw new Error(
      `Certificate file not found: ${certificatePath} (${certificateTitle}). Ensure all certificate PDFs are present before generating CV.`,
    );
  }
}

async function appendCertificatesAsStyledPages(targetPdfPath: string, language: "en" | "de") {
  const mergedPdf = await PDFDocument.create();
  const targetPdfBytes = await readFile(targetPdfPath);
  const targetPdf = await PDFDocument.load(targetPdfBytes);
  const targetPages = await mergedPdf.copyPages(targetPdf, targetPdf.getPageIndices());
  const boldFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const baseSize = targetPdf.getPage(0)?.getSize() ?? A4_PAGE_SIZE;

  targetPages.forEach((page) => mergedPdf.addPage(page));

  for (const certificate of siteContent.certificates.documents) {
    const certificatePath = path.join(PUBLIC_DIR, certificate.filePath.replace(/^\//, ""));
    const certificateBytes = await readCertificatePdfOrThrow(certificatePath, certificate.title[language]);
    const certificatePdf = await PDFDocument.load(certificateBytes);
    const certificatePages = certificatePdf.getPages();

    for (const [certificatePageIndex, certificatePage] of certificatePages.entries()) {
      const page = mergedPdf.addPage([baseSize.width, baseSize.height]);
      const embeddedCertificatePage = await mergedPdf.embedPage(certificatePage);
      const pageTitle =
        certificatePages.length > 1
          ? `${certificate.title[language]} (${certificatePageIndex + 1}/${certificatePages.length})`
          : certificate.title[language];
      const headerLabel =
        language === "en" ? "Certificate Attachment" : "Zertifikatsbeilage";
      const issuerLabel = language === "en" ? "Issuer" : "Aussteller";
      drawStyledCertificatePage({
        page,
        embeddedCertificatePage,
        pageTitle,
        issuerText: `${headerLabel} | ${issuerLabel}: ${certificate.issuer[language]}`,
        baseWidth: baseSize.width,
        baseHeight: baseSize.height,
        fontBold: boldFont,
        fontRegular: regularFont,
      });
    }
  }

  addFooterToAllPages(mergedPdf, language, regularFont);

  const mergedBytes = await mergedPdf.save();
  await writeFile(targetPdfPath, mergedBytes);
}

async function generatePdf(language: "en" | "de", includeCertificates = false) {
  const suffix = includeCertificates ? "_with_certificates" : "";
  const pdfPath = path.join(CV_OUTPUT_DIR, `christian_erben_cv_${language}${suffix}.pdf`);

  await renderToFile(
    <CVDocument
      language={language}
      data={siteContent}
      profileImageSrc={PROFILE_IMAGE_PATH}
      includeCertificates={includeCertificates}
      showFooter={!includeCertificates}
    />,
    pdfPath,
  );

  if (includeCertificates) {
    await appendCertificatesAsStyledPages(pdfPath, language);
  }

  return pdfPath;
}

async function generateDocx(language: "en" | "de") {
  const docxPath = path.join(CV_OUTPUT_DIR, `christian_erben_cv_${language}.docx`);
  const profileImageBuffer = await readFile(PROFILE_IMAGE_PATH);

  const blob = await generateCvDocx({
    language,
    data: siteContent,
    profileImageData: new Uint8Array(profileImageBuffer.buffer, profileImageBuffer.byteOffset, profileImageBuffer.byteLength),
  });

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(docxPath, buffer);

  return docxPath;
}

async function main() {
  await ensureDirectory(CV_OUTPUT_DIR);

  const generatedFiles: string[] = [];

  for (const language of LANGUAGES) {
    const pdfPath = await generatePdf(language);
    const pdfWithCertificatesPath = await generatePdf(language, true);
    const docxPath = await generateDocx(language);
    generatedFiles.push(pdfPath, pdfWithCertificatesPath, docxPath);
  }

  console.log("Generated CV assets:\n" + generatedFiles.map((file) => ` - ${path.relative(ROOT_DIR, file)}`).join("\n"));
}

main().catch((error) => {
  console.error("Failed to generate CV assets:", error);
  process.exitCode = 1;
});
