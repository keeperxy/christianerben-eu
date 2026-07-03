import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSettings } from "@/contexts/settings-hook";
import { siteContent } from "@/content/content";
import { Button } from "@/components/ui/button";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle for handling theme changes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Toggle for handling language changes
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  useEffect(() => {
    let frame: number | null = null;

    const updateHeaderState = () => {
      frame = null;
      setIsScrolled(window.scrollY > 10);

      if (isHomePage) {
        const sectionIds = siteContent.navigation.map(item => item.href.replace('#', ''));
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom > 80) {
              current = id;
              break;
            }
          }
        }
        setActiveSection(current);
      }
    };

    const handleScroll = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(updateHeaderState);
    };

    window.addEventListener("scroll", handleScroll);
    updateHeaderState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHomePage]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-foreground">
          <span className="text-gradient text-3xl sm:text-4xl">{siteContent.hero.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6">
          {siteContent.navigation.map((item) => (
            isHomePage ? (
              <a
                key={item.href}
                href={item.href}
                className={`text-lg font-medium text-foreground hover:text-primary transition-colors link-underline${activeSection === item.href.replace('#', '') ? ' link-underline-active' : ''}`}
              >
                {t(item.label)}
              </a>
            ) : (
                    <Link
                      key={item.href}
                      href={`/${item.href}` as Route}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors link-underline"
                    >
                {t(item.label)}
              </Link>
            )
          ))}
        </nav>

        {/* Control Buttons */}
        <div className="hidden xl:flex items-center space-x-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
          >
            {language === "en" ? "DE" : "EN"}
          </Button>

          {/* Theme Toggle - suppressHydrationWarning to prevent mismatch between server and client */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t(
              theme === "light"
                ? siteContent.translations.themeSwitch.light
                : siteContent.translations.themeSwitch.dark
            )}
            suppressHydrationWarning
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full bg-background dark:bg-gray-900 p-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="border-b border-gray-200 dark:border-gray-800 py-4 px-6">
                <Link href="/" className="text-2xl font-display font-bold" onClick={() => setIsMenuOpen(false)}>
                  <span className="text-gradient">{siteContent.hero.name}</span>
                </Link>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center space-y-4 sm:space-y-6 py-8">
                {siteContent.navigation.map((item) => (
                  isHomePage ? (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors${activeSection === item.href.replace('#', '') ? ' link-underline link-underline-active' : ''}`}
                    >
                      {t(item.label)}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={`/${item.href}` as Route}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {t(item.label)}
                    </Link>
                  )
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 p-6 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={toggleLanguage}
                >
                  {language === "en" ? "Deutsch" : "English"}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={toggleTheme}
                  suppressHydrationWarning
                >
                  {theme === "light" ? (
                    <>
                      <Moon size={16} className="mr-2" /> Dark
                    </>
                  ) : (
                    <>
                      <Sun size={16} className="mr-2" /> Light
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
