import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Sitemap = () => {
  const { t } = useSettings();

  const navigationLinks = siteContent.navigation?.map((item) => t(item.label)).join(' / ');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft size={16} className="mr-2" />
                {t(siteContent.backToHome)}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-8">{siteContent.sitemap ? t(siteContent.sitemap.title) : ""}</h1>
            <div className="mb-8">
              <p className="mb-4">{siteContent.sitemap ? t(siteContent.sitemap.description) : ""}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-primary">{navigationLinks}</li>
                <li>
                  <Link href="/cv" className="text-primary hover:underline">
                    {t(siteContent.cv.title)}
                  </Link>
                </li>
                <li>
                  <Link href="/imprint" className="text-primary hover:underline">
                    {t(siteContent.imprint.title)}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-primary hover:underline">
                    {t(siteContent.privacy.title)}
                  </Link>
                </li>
                <li>
                  <a href="/sitemap.xml" className="text-primary hover:underline">
                    {siteContent.sitemap ? t(siteContent.sitemap.title) : ""} (XML)
                  </a>
                </li>
                <li>
                  <a href="/llms.txt" className="text-primary hover:underline">
                    {siteContent.llms ? t(siteContent.llms.title) : ""} (Markdown)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;
