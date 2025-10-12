
import React from 'react';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

const Imprint = () => {
  const { t } = useSettings();
  const { imprint } = siteContent;
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft size={16} className="mr-2" />
                {t(siteContent.backToHome)}
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold mb-8">{t(imprint.title)}</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t(imprint.contactTitle)}</h2>
                <p>{t(imprint.companyName)}</p>
                {imprint.representative && <p>{t(imprint.representative)}</p>}
                <p>{t(imprint.address.street)}</p>
                <p>{t(imprint.address.city)}</p>
                <p>{t(imprint.address.country)}</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t(imprint.contactInfoTitle)}</h2>
                <p>
                  {t(imprint.emailLabel)}: <a href={`mailto:${imprint.email}`} className="text-primary">{imprint.email}</a>
                </p>
                <p>
                  {t(imprint.phoneLabel)}: <span><a href={`tel:${imprint.phone}`} className="text-primary">{imprint.phone}</a></span>
                </p>
              </section>
              
              {imprint.legalTitle && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{t(imprint.legalTitle)}</h2>
                  <p>{t(imprint.vatId)}</p>
                  {imprint.registrationInfo && <p>{t(imprint.registrationInfo)}</p>}
                </section>
              )}

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t(imprint.disclaimerTitle)}</h2>
                <p>{t(imprint.disclaimer)}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Imprint;
