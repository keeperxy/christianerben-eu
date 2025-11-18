import React, { useEffect, useMemo, useState } from "react";
// Buffer shim for react-pdf (only loaded when this component is used)
import { Buffer } from 'buffer';
// @ts-expect-error Buffer is a polyfill for react-pdf
(globalThis as typeof globalThis & { Buffer?: unknown }).Buffer = Buffer;
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import CVDocument from "@/components/cv/CVDocument";
import { generateCvDocx } from "@/components/cv/CVDocumentDocx";
import type { SiteContent } from "@/content/content";

interface CvDownloadButtonsCustomProps {
  language: 'en' | 'de';
  cvData: SiteContent;
}

const CvDownloadButtonsCustom: React.FC<CvDownloadButtonsCustomProps> = ({ language, cvData }) => {
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const downloadDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const createDocx = async () => {
    setLoadingDocx(true);
    try {
      const blob = await generateCvDocx({ language, data: cvData });
      if (docxUrl) URL.revokeObjectURL(docxUrl);
      const url = URL.createObjectURL(blob);
      setDocxUrl(url);
    } finally {
      setLoadingDocx(false);
    }
  };

  // Trigger Download-Link wenn URL bereit
  useEffect(() => {
    if (!docxUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = docxUrl;
    link.download = `christian_erben_cv_${language}_${downloadDate}.docx`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(docxUrl);
      setDocxUrl(null);
    }, 1000);
  }, [docxUrl, language, downloadDate]);

  return (
    <>
      <div className="hidden md:flex space-x-4">
        <PDFDownloadLink
          document={<CVDocument language={language} data={cvData} />}
          fileName={`christian_erben_cv_${language}_${downloadDate}.pdf`}
          className="no-underline"
        >
          {({ loading }: { loading: boolean }) => (
            <Button disabled={loading} className="rounded-full shadow-lg hover-scale" variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              {loading
                ? language === 'en' ? 'Loading …' : 'Wird geladen …'
                : language === 'en' ? 'Download PDF' : 'PDF herunterladen'}
            </Button>
          )}
        </PDFDownloadLink>
        <Button
          onClick={createDocx}
          disabled={loadingDocx}
          className="rounded-full shadow-lg hover-scale"
          variant="secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          {loadingDocx
            ? language === 'en' ? 'Loading …' : 'Wird geladen …'
            : language === 'en' ? 'Download DOCX' : 'DOCX herunterladen'}
        </Button>
      </div>
      <div className="md:hidden relative">
        <Button
          onClick={() => setOpenMenu(!openMenu)}
          className="rounded-full shadow-lg hover-scale"
          variant="secondary"
        >
          <Download className="h-4 w-4" />
        </Button>
        {openMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
            <PDFDownloadLink
              document={<CVDocument language={language} data={cvData} />}
              fileName={`christian_erben_cv_${language}_${downloadDate}.pdf`}
              className="no-underline block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {({ loading }: { loading: boolean }) => (
                <span className="flex items-center text-gray-900 dark:text-gray-100">
                  <Download className="mr-2 h-4 w-4" />
                  {loading
                    ? language === 'en' ? 'Loading …' : 'Wird geladen …'
                    : language === 'en' ? 'Download PDF' : 'PDF herunterladen'}
                </span>
              )}
            </PDFDownloadLink>
            <button
              onClick={() => { setOpenMenu(false); createDocx(); }}
              disabled={loadingDocx}
              className="w-full text-left px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              {loadingDocx
                ? language === 'en' ? 'Loading …' : 'Wird geladen …'
                : language === 'en' ? 'Download DOCX' : 'DOCX herunterladen'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CvDownloadButtonsCustom;

