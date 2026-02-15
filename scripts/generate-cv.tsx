import React from "react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderToFile } from "@react-pdf/renderer";
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
const SIDEBAR_WIDTH = 160;

function hexToRgb(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return rgb(red, green, blue);
}

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function appendCertificatesAsStyledPages(targetPdfPath: string, language: "en" | "de") {
  const mergedPdf = await PDFDocument.create();
  const targetPdfBytes = await readFile(targetPdfPath);
  const targetPdf = await PDFDocument.load(targetPdfBytes);
  const targetPages = await mergedPdf.copyPages(targetPdf, targetPdf.getPageIndices());
  const boldFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const baseSize = targetPdf.getPage(0)?.getSize() ?? { width: 595.28, height: 841.89 };

  targetPages.forEach((page) => mergedPdf.addPage(page));

  for (const certificate of siteContent.certificates.documents) {
    const certificatePath = path.join(PUBLIC_DIR, certificate.filePath.replace(/^\//, ""));
    const certificateBytes = await readFile(certificatePath);
    const certificatePdf = await PDFDocument.load(certificateBytes);
    const certificatePages = certificatePdf.getPages();

    for (const [certificatePageIndex, certificatePage] of certificatePages.entries()) {
      const page = mergedPdf.addPage([baseSize.width, baseSize.height]);
      const embeddedCertificatePage = await mergedPdf.embedPage(certificatePage);
      const pageTitle =
        certificatePages.length > 1
          ? `${certificate.title[language]} (${certificatePageIndex + 1}/${certificatePages.length})`
          : certificate.title[language];

      page.drawRectangle({
        x: 0,
        y: 0,
        width: baseSize.width,
        height: baseSize.height,
        color: hexToRgb("#E6E9F3"),
      });
      page.drawRectangle({
        x: 0,
        y: 0,
        width: SIDEBAR_WIDTH,
        height: baseSize.height,
        color: hexToRgb("#1B6E5A"),
      });

      const pageHeader = language === "en" ? "Certificate Attachment" : "Zertifikatsbeilage";
      const issuerLabel = language === "en" ? "Issuer" : "Aussteller";
      const contentX = SIDEBAR_WIDTH + 30;

      page.drawText(pageHeader, {
        x: contentX,
        y: baseSize.height - 56,
        size: 14,
        font: boldFont,
        color: hexToRgb("#3A2366"),
      });
      page.drawText(pageTitle, {
        x: contentX,
        y: baseSize.height - 78,
        size: 11,
        font: regularFont,
        color: hexToRgb("#07090B"),
      });
      page.drawText(`${issuerLabel}: ${certificate.issuer[language]}`, {
        x: contentX,
        y: baseSize.height - 95,
        size: 10,
        font: regularFont,
        color: hexToRgb("#1B6E5A"),
      });

      const frameX = SIDEBAR_WIDTH + 24;
      const frameY = 52;
      const frameWidth = baseSize.width - frameX - 24;
      const frameHeight = baseSize.height - 170;
      const scale = Math.min(
        (frameWidth - 24) / embeddedCertificatePage.width,
        (frameHeight - 24) / embeddedCertificatePage.height,
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
        borderColor: hexToRgb("#DBE3EF"),
        borderWidth: 1.5,
      });

      page.drawPage(embeddedCertificatePage, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  const totalPages = mergedPdf.getPageCount();
  const pageLabel = language === "en" ? "Page" : "Seite";
  const ofLabel = language === "en" ? "of" : "von";
  const updateLabel = language === "en" ? "Last updated" : "Letztes Update";
  const locale = language === "en" ? "en-US" : "de-DE";
  const dateLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date());

  mergedPdf.getPages().forEach((page, index) => {
    const footerLine1 = `${pageLabel} ${index + 1} ${ofLabel} ${totalPages}`;
    const footerLine2 = `${updateLabel}: ${dateLabel}`;
    const footerSize = 8;
    const footerColor = hexToRgb("#AAAAAA");
    const line1Width = regularFont.widthOfTextAtSize(footerLine1, footerSize);
    const line2Width = regularFont.widthOfTextAtSize(footerLine2, footerSize);
    const line1X = (SIDEBAR_WIDTH - line1Width) / 2;
    const line2X = (SIDEBAR_WIDTH - line2Width) / 2;

    page.drawText(footerLine1, {
      x: line1X,
      y: 34,
      size: footerSize,
      font: regularFont,
      color: footerColor,
    });
    page.drawText(footerLine2, {
      x: line2X,
      y: 22,
      size: footerSize,
      font: regularFont,
      color: footerColor,
    });
  });

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
