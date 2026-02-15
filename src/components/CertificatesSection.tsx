import React from "react";
import { BadgeCheck, Download, ExternalLink, FileText } from "lucide-react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { Button } from "@/components/ui/button";
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
      className={cn("section-padding relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -bottom-24 right-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

      <div className="container mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">{t(certificates.title)}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
          {t(certificates.subtitle)}
        </p>

        <div className="bg-card/70 border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-10 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t(certificates.badgeIntro)}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.badges.map((badge) => (
              <a
                key={badge.shareBadgeId}
                href={badge.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-border bg-background/80 p-4 flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="w-full rounded-lg bg-card/90 border border-border/70 p-3 min-h-[210px] flex items-center justify-center">
                  <img
                    src={badge.imageUrl}
                    alt={badge.title}
                    data-testid="credly-badge-image"
                    loading="lazy"
                    className="h-44 w-auto max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <h4 className="font-medium text-sm leading-snug">{badge.title}</h4>
                <span className="inline-flex items-center text-sm text-primary group-hover:text-primary/80 link-underline">
                  Credly <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t(certificates.documentsTitle)}</h3>
            <p className="text-muted-foreground">{t(certificates.documentsSubtitle)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certificates.documents.map((certificate) => (
              <article
                key={certificate.filePath}
                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold leading-snug">{t(certificate.title)}</h4>
                    <p className="text-sm text-muted-foreground">{t(certificate.issuer)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="secondary" size="sm">
                    <a href={certificate.filePath} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t(certificates.viewLabel)}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={certificate.filePath} download>
                      <Download className="mr-2 h-4 w-4" />
                      {t(certificates.downloadLabel)}
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

CertificatesSection.displayName = "CertificatesSection";

export default CertificatesSection;
