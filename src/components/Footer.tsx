
import React from "react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useSettings();
  const { footer } = siteContent;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="mb-6 md:mb-0">
            <a
              href="#hero"
              className="text-xl font-display font-bold text-foreground mb-2 inline-block"
            >
              <span className="text-gradient">{siteContent.hero.name}</span>
            </a>
            <p className="text-sm text-muted-foreground">
              {t(footer.copyright).replace("year", year.toString())}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            {footer.links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
              >
                {t(link.label)}
              </Link>
            ))}
            <Link 
              to="/sitemap" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
            >
              {t(siteContent.sitemap.title)}
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          {footer.builtWith && (
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              {t(footer.builtWith)}
            </p>
          )}

          <p className="ml-auto text-xs text-muted-foreground">
            {t(footer.lastUpdated)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
