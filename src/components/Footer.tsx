import React from "react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import type { Route } from "next";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const { t } = useSettings();
  const { footer } = siteContent;
  const linkClass = "link-underline text-small text-ink-muted transition-colors duration-200 hover:text-ink-foreground";

  return (
    <footer className="bg-ink pb-10 pt-16 text-ink-foreground">
      <div className="shell">
        <div className="flex flex-col gap-8 border-b border-ink-line pb-10 md:flex-row md:items-end md:justify-between">
          <Link
            href="/"
            className="display text-[clamp(2.25rem,6vw,4.5rem)] leading-none tracking-[-0.05em]"
          >
            {siteContent.hero.name}
            <span aria-hidden="true" className="text-signal">.</span>
          </Link>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {footer.links.map((link, index) => (
              <Link key={index} href={link.href as Route} className={linkClass}>
                {t(link.label)}
              </Link>
            ))}
            {siteContent.sitemap && (
              <Link href="/sitemap" className={linkClass}>
                {t(siteContent.sitemap.title)}
              </Link>
            )}
            <Link href="/cv" className={linkClass}>
              CV
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-small text-ink-muted md:flex-row md:justify-between">
          <p>{t(footer.copyright).replace("year", currentYear.toString())}</p>
          <p>
            {footer.builtWith && <span>{t(footer.builtWith)} · </span>}
            {t(footer.lastUpdated)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
