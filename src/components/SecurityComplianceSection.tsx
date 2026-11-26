import React from 'react';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';

const SecurityComplianceSection = () => {
  const { t } = useSettings();
  const { securityCompliance } = siteContent;

  return (
    <section id="security-compliance" className="bg-ink py-24 text-ink-foreground sm:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="display reveal text-title lg:col-span-7">{t(securityCompliance.title)}</h2>
          {securityCompliance.subtitle && (
            <p className="max-w-[46ch] text-body text-ink-muted lg:col-span-5 lg:justify-self-end">
              {t(securityCompliance.subtitle)}
            </p>
          )}
        </div>

        <div className="mt-16 border-t border-ink-foreground/80">
          {securityCompliance.items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <article
                key={index}
                className="group grid grid-cols-1 gap-5 border-b border-ink-line py-8 transition-colors duration-200 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <div className="flex items-start gap-4 md:col-span-5">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-200 ease-[var(--ease-out-snap)] group-hover:-rotate-6">
                    <IconComponent className="size-5" />
                  </span>
                  <h3 className="wide min-w-0 pt-1.5 text-body font-semibold leading-snug tracking-[-0.01em]">
                    {t(item.title)}
                  </h3>
                </div>

                <ul className="space-y-3 md:col-span-7 md:pt-1.5">
                  {item.items.map((listItem, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3 text-body text-ink-muted">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" />
                      <span>{t(listItem)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecurityComplianceSection;
