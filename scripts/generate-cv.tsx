import React from "react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderToFile } from "@react-pdf/renderer";

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

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function generatePdf(language: "en" | "de") {
  const pdfPath = path.join(CV_OUTPUT_DIR, `christian_erben_cv_${language}.pdf`);

  await renderToFile(
    <CVDocument language={language} data={siteContent} profileImageSrc={PROFILE_IMAGE_PATH} />,
    pdfPath,
  );

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
    const docxPath = await generateDocx(language);
    generatedFiles.push(pdfPath, docxPath);
  }

  console.log("Generated CV assets:\n" + generatedFiles.map((file) => ` - ${path.relative(ROOT_DIR, file)}`).join("\n"));
}

main().catch((error) => {
  console.error("Failed to generate CV assets:", error);
  process.exitCode = 1;
});

