import React from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';

type AboutLabelKey = keyof typeof siteContent.about.labels;

const AboutSection = () => {
  const { t } = useSettings();
  const { about } = siteContent;

  const stats = about.stats.map((stat) => ({
    ...stat,
    key: stat.key as AboutLabelKey,
  }));

  return (
    <section id="about" className="bg-background py-24 sm:py-32">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="display reveal text-title">{t(about.title)}</h2>

          <figure className="relative mt-10 hidden overflow-hidden rounded-[var(--radius)] bg-ink lg:block">
            <Image
              src="/about-me.webp"
              alt={t(about.imageAlt)}
              width={1024}
              height={1536}
              sizes="(min-width: 1024px) 34vw, 0px"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </figure>
        </div>

        <div className="lg:col-span-7 lg:pt-3">
          <div className="max-w-[65ch] space-y-6 text-body">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'text-foreground' : 'text-muted-foreground'}>
                {t(paragraph)}
              </p>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-1 border-t border-foreground sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex items-baseline justify-between gap-4 border-b border-border py-5 sm:flex-col-reverse sm:items-start sm:justify-end sm:gap-3 sm:border-b-0 sm:border-l sm:py-6 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="text-small text-muted-foreground">{t(about.labels[stat.key])}</dt>
                <dd className="display text-title leading-none">{t(stat.value)}</dd>
              </div>
            ))}
          </dl>

          <figure className="mt-12 overflow-hidden rounded-[var(--radius)] bg-ink lg:hidden">
            <Image
              src="/about-me.webp"
              alt=""
              width={1024}
              height={1536}
              sizes="(max-width: 1023px) 100vw, 0px"
              className="aspect-[4/3] w-full object-cover object-top"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
