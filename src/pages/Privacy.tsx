import React from 'react';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';


const Privacy = () => {
  const { t } = useSettings();
  const { privacy } = siteContent;
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
            
            <h1 className="text-3xl font-bold mb-2">{t(privacy.title)}</h1>
            <p className="text-sm mb-8">{t(privacy.subtitle)}</p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {privacy.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{t(section.title)}</h2>
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4">{t(paragraph)}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc pl-5 mb-4">
                      {section.list.map((item, i) => {
                        if (typeof item === 'string') {
                          return (
                            <li key={i}>
                              <span>{item}</span>
                            </li>
                          );
                        }
                        
                        const localizedItem = item as { en: string; de: string; description?: { en: string; de: string } };
                        const text = t(localizedItem);
                        const descriptionText = localizedItem.description ? t(localizedItem.description) : null;

                        return (
                          <li key={i} className="flex flex-col">
                            <span dangerouslySetInnerHTML={{ __html: text }} />
                            {descriptionText && (
                              <span className="text-sm text-muted-foreground ml-4 mt-1">
                                <span dangerouslySetInnerHTML={{ __html: descriptionText }} />
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
