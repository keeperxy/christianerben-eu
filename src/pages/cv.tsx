import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSettings } from "@/contexts/settings-hook";
import { siteContent, SiteContent } from "@/content/content";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Download, Globe, ArrowLeft, Edit, Moon, Sun } from "lucide-react";
import { compressToUint8Array, decompressFromUint8Array } from "lz-string";

// Lazy load heavy dependencies only when needed (custom data or edit mode)
const CvDownloadButtonsCustom = React.lazy(() => import("@/components/cv/CvDownloadButtonsCustom"));
const CVEditor = React.lazy(() => import("@/components/cv/CVEditor"));


// Reusable Buttons für PDF und DOCX Download
const CvDownloadButtons: React.FC<{ language: 'en' | 'de'; cvData: SiteContent }> = ({ language, cvData }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [staticLoading, setStaticLoading] = useState({ pdf: false, docx: false });

  const isDefaultData = cvData === siteContent;
  const downloadDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const staticPdfHref = `/cv/christian_erben_cv_${language}.pdf`;
  const staticDocxHref = `/cv/christian_erben_cv_${language}.docx`;

  const buildStaticFilename = (ext: 'pdf' | 'docx') => `christian_erben_cv_${language}_${downloadDate}.${ext}`;

  const handleStaticDownload = async (ext: 'pdf' | 'docx') => {
    setStaticLoading(prev => ({ ...prev, [ext]: true }));
    try {
      const href = ext === 'pdf' ? staticPdfHref : staticDocxHref;
      const response = await fetch(href);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${href}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = buildStaticFilename(ext);
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Static ${ext} download failed`, error);
    } finally {
      setStaticLoading(prev => ({ ...prev, [ext]: false }));
    }
  };

  // For default data, use static files (no heavy dependencies needed)
  if (isDefaultData) {
    return (
      <>
        <div className="hidden md:flex space-x-4">
          <Button
            onClick={() => handleStaticDownload('pdf')}
            disabled={staticLoading.pdf}
            className="rounded-full shadow-lg hover-scale"
            variant="secondary"
          >
            <Download className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Download PDF' : 'PDF herunterladen'}
          </Button>
          <Button
            onClick={() => handleStaticDownload('docx')}
            disabled={staticLoading.docx}
            className="rounded-full shadow-lg hover-scale"
            variant="secondary"
          >
            <Download className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Download DOCX' : 'DOCX herunterladen'}
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
              <button
                type="button"
                onClick={() => { setOpenMenu(false); handleStaticDownload('pdf'); }}
                disabled={staticLoading.pdf}
                className="no-underline block w-full text-left px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Download PDF' : 'PDF herunterladen'}
              </button>
              <button
                type="button"
                onClick={() => { setOpenMenu(false); handleStaticDownload('docx'); }}
                disabled={staticLoading.docx}
                className="no-underline block w-full text-left px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Download DOCX' : 'DOCX herunterladen'}
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  // For custom data, lazy load the heavy react-pdf dependencies
  return (
    <Suspense fallback={
      <Button disabled className="rounded-full shadow-lg" variant="secondary">
        <Download className="mr-2 h-4 w-4" />
        {language === 'en' ? 'Loading …' : 'Wird geladen …'}
      </Button>
    }>
      <CvDownloadButtonsCustom language={language} cvData={cvData} />
    </Suspense>
  );
};

const CV = () => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  // Unicode-safe LZ compression + Base64 encoding/decoding using TextEncoder/TextDecoder
  const encodeData = (str: string): string => {
    const compressed = compressToUint8Array(str);
    let binary = '';
    for (let i = 0; i < compressed.length; i++) {
      binary += String.fromCharCode(compressed[i]);
    }
    return window.btoa(binary);
  };
  const decodeData = (b64: string): string => {
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return decompressFromUint8Array(bytes) || '';
  };

  const getInitialCvData = (): SiteContent => {
    if (typeof window === 'undefined') {
      return siteContent;
    }

    const hash = window.location.hash;
    const savedData = hash.startsWith('#data=') ? hash.slice(6) : null;

    if (!savedData) {
      return siteContent;
    }

    try {
      const decodedJson = decodeData(savedData);
      const decodedData = JSON.parse(decodedJson);
      return decodedData;
    } catch (e) {
      console.error('Failed to parse saved data', e);
      return siteContent;
    }
  };

  const [clickCount, setClickCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [cvData, setCvData] = useState<SiteContent>(() => getInitialCvData());
  useScrollToTop();

  const handleTitleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        setEditMode(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleDataChange = (newData: SiteContent) => {
    setCvData(newData);
    // Save to URL hash (Unicode-safe Base64)
    const json = JSON.stringify(newData);
    const encodedData = encodeData(json);
    // Update URL hash without reloading
    window.location.hash = `data=${encodedData}`;
  };

  const handleExitEditMode = () => {
    setEditMode(false);
    setClickCount(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center text-muted-foreground dark:text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>{t(siteContent.backToHome)}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {editMode && (
              <Button
                onClick={handleExitEditMode}
                variant="destructive"
                size="sm"
                className="rounded-full shadow-lg hover-scale"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t({
                  en: 'Exit Edit Mode',
                  de: 'Bearbeitungsmodus verlassen'
                })}
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full shadow-lg hover-scale"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
              className="rounded-full shadow-lg hover-scale"
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Deutsch' : 'English'}
            </Button>

            {/* Download-Buttons */}
            <CvDownloadButtons language={language} cvData={cvData} />
          </div>
        </div>
      </div>

      {/* CV */}
      <div className="bg-muted/80 px-8 py-4 flex-grow flex flex-col">
        {/* Title */}
        <div className="mb-6">
          <h1 
            className="text-4xl font-display font-bold mb-2"
            onClick={handleTitleClick}
          >
            {t({
              en: 'Curriculum Vitae',
              de: 'Lebenslauf'
            })}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 flex-grow">
          {editMode ? (
            <div className="lg:col-span-6 lg:col-start-2">
              <Suspense fallback={<div className="text-center py-8">{language === 'en' ? 'Loading editor…' : 'Editor wird geladen…'}</div>}>
                <CVEditor 
                  data={cvData} 
                  onChange={handleDataChange}
                  language={language}
                />
              </Suspense>
            </div>
          ) : (
            <div className="lg:col-span-6 lg:col-start-2 flex-grow flex flex-col relative z-0 transform -translate-y-2 min-h-[500px]">
              <div className="rounded-lg shadow-xl border-4 border-white dark:border-gray-800 flex-grow flex flex-col">
                <div className="bg-gradient-to-br from-primary/40 to-accent/40 justify-center flex-grow flex flex-col">
                  <div className="m-6 flex flex-grow justify-center">
                    <iframe
                      src={`/cv/christian_erben_cv_${language}.pdf#toolbar=0&navpanes=0`}
                      className="max-w-[796px] w-full h-full min-h-[600px] border-0 rounded"
                      title={language === 'en' ? 'Curriculum Vitae' : 'Lebenslauf'}
                      data-testid="cv-preview"
                    />
                  </div>
                </div>
              </div>
            
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary rounded-lg transform rotate-6 -z-10"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-lg transform -rotate-6 -z-10"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CV;
