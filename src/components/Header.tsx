import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSettings } from "@/contexts/settings-hook";
import { siteContent } from "@/content/content";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Toggle for handling theme changes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Toggle for handling language changes
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
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
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
        <Link
          href="/"
          className="text-2xl font-display font-bold text-foreground"
        >
          <span className="text-gradient text-4xl">{siteContent.hero.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
                href={`/${item.href}`}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors link-underline"
              >
                {t(item.label)}
              </Link>
            )
          ))}
        </nav>

        {/* Control Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
          >
            {language === "en" ? "DE" : "EN"}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t(
              theme === "light"
                ? siteContent.translations.themeSwitch.light
                : siteContent.translations.themeSwitch.dark
            )}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full bg-background dark:bg-gray-900 p-0"
            >
              <div className="flex flex-col h-full">
                <div className="border-b border-gray-200 dark:border-gray-800 py-4 px-6">
                  <Link href="/" className="text-2xl font-display font-bold">
                    <span className="text-gradient">{siteContent.hero.name}</span>
                  </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-8">
                  {siteContent.navigation.map((item) => (
                    isHomePage ? (
                      <a
                        key={item.href}
                        href={item.href}
                        className={`text-xl font-medium text-foreground hover:text-primary transition-colors${activeSection === item.href.replace('#', '') ? ' link-underline link-underline-active' : ''}`}
                      >
                        {t(item.label)}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={`/${item.href}`}
                        className="text-xl font-medium text-foreground hover:text-primary transition-colors"
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
        )}
      </div>
    </header>
  );
};

export default Header;
