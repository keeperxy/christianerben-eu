import React from 'react';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';

const SecurityComplianceSection = () => {
  const { t } = useSettings();
  const { securityCompliance } = siteContent;

  return (
    <section id="security-compliance" className="section-padding bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">{t(securityCompliance.title)}</span>
        </h2>

        {securityCompliance.subtitle && (
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            {t(securityCompliance.subtitle)}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {securityCompliance.items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-border bg-card hover-scale transition-all h-full flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mt-1">
                    {t(item.title)}
                  </h3>
                </div>

                <ul className="space-y-3 flex-grow">
                  {item.items.map((listItem, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="text-primary flex-shrink-0">•</span>
                      <span>{t(listItem)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecurityComplianceSection;

