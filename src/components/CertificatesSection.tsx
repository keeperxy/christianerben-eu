import React from "react";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { cn } from "@/lib/utils";

interface CertificatesSectionProps extends React.HTMLAttributes<HTMLElement> {}

const CertificatesSection = React.forwardRef<HTMLElement, CertificatesSectionProps>(
  ({ className, ...props }, ref) => {
    const { t } = useSettings();
    const { certificates } = siteContent;

    return (
      <section
        ref={ref}
        id="certificates"
        className={cn("bg-card py-24 sm:py-32", className)}
        {...props}
      >
        <div className="shell">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <h2 className="display reveal text-title lg:col-span-7">{t(certificates.title)}</h2>
            <p className="max-w-[46ch] text-body text-muted-foreground lg:col-span-5 lg:justify-self-end">
              {t(certificates.subtitle)}
            </p>
          </div>

          <h3 className="wide mt-16 border-b border-foreground pb-5 text-body font-bold">{t(certificates.badgeIntro)}</h3>
          <ul className="grid grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {certificates.badges.map((badge) => (
              <li key={badge.shareBadgeId} className="border-b border-r border-foreground/15 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0">
                <a
                  href={badge.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col items-center gap-4 px-3 py-8 text-center transition-colors duration-200 hover:bg-background"
                >
                  <Image
                    src={badge.imageUrl}
                    alt={badge.title}
                    width={320}
                    height={320}
                    data-testid="credly-badge-image"
                    loading="lazy"
                    className="h-32 w-auto max-w-full object-contain transition-transform duration-200 ease-[var(--ease-out-snap)] group-hover:-translate-y-1"
                  />
                  <span className="text-small font-medium leading-snug">{badge.title}</span>
                  <span className="mt-auto inline-flex items-center gap-1 text-small text-muted-foreground group-hover:text-foreground">
                    Credly <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-20 grid grid-cols-1 gap-2 border-b border-foreground pb-5 md:grid-cols-12 md:gap-8">
            <h3 className="wide text-body font-bold md:col-span-5">{t(certificates.documentsTitle)}</h3>
            <p className="text-body text-muted-foreground md:col-span-7">{t(certificates.documentsSubtitle)}</p>
          </div>
          <ul>
            {certificates.documents.map((certificate) => (
              <li
                key={certificate.filePath}
                className="grid grid-cols-1 gap-4 border-b border-foreground/15 py-6 md:grid-cols-12 md:items-center md:gap-8"
              >
                <div className="md:col-span-8">
                  <h4 className="text-body font-semibold leading-snug">{t(certificate.title)}</h4>
                  <p className="text-small text-muted-foreground">{t(certificate.issuer)}</p>
                </div>
                <div className="flex gap-6 md:col-span-4 md:justify-end">
                  <a
                    href={certificate.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="signal-link inline-flex items-center gap-1.5 text-small font-semibold"
                  >
                    {t(certificates.viewLabel)}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                  <a
                    href={certificate.filePath}
                    download
                    className="signal-link inline-flex items-center gap-1.5 text-small font-semibold"
                  >
                    {t(certificates.downloadLabel)}
                    <Download className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  },
);

CertificatesSection.displayName = "CertificatesSection";

export default CertificatesSection;
