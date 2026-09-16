type CvLanguage = "en" | "de";
type CvFormat = "pdf" | "docx";

export function getCvDownloadFilename(
  language: CvLanguage,
  format: CvFormat,
  includeCertificates = false,
): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const suffix = format === "pdf" && includeCertificates ? "_with_certificates" : "";
  return `Christian_Erben_${date}_${language}${suffix}.${format}`;
}

export async function downloadCvFile(
  source: string,
  language: CvLanguage,
  format: CvFormat,
  includeCertificates = false,
): Promise<void> {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`CV download failed: HTTP ${response.status}`);
  }

  // A blob URL prevents the server's Content-Disposition filename from overriding ours.
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = getCvDownloadFilename(language, format, includeCertificates);
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
