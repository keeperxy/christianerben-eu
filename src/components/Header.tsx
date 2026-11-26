import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSettings } from "@/contexts/settings-hook";
import type { Language } from "@/contexts/settings-hook";
import { siteContent } from "@/content/content";
import { cn } from "@/lib/utils";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const languages: Language[] = ["en", "de"];

interface LanguageSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  onDark: boolean;
}

const LanguageSwitch = React.forwardRef<HTMLDivElement, LanguageSwitchProps>(
  ({ onDark, className, ...props }, ref) => {
    const { language, setLanguage } = useSettings();

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Language"
        className={cn(
          "inline-flex rounded-full border p-0.5 text-small font-semibold",
          onDark ? "border-white/25" : "border-border",
          className,
        )}
        {...props}
      >
        {languages.map((code) => {
          const active = language === code;
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setLanguage(code)}
              className={cn(
                "min-w-10 rounded-full px-2.5 py-1 uppercase transition-[background-color,color] duration-200 ease-[var(--ease-out-snap)]",
                active
                  ? "bg-signal text-ink"
                  : onDark
                    ? "text-white/75 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {code}
            </button>
          );
        })}
      </div>
    );
  },
);
LanguageSwitch.displayName = "LanguageSwitch";

const Header = () => {
  const { theme, setTheme, t } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = siteContent.navigation.filter((item) => item.href !== "#hero");
  const homeItem = siteContent.navigation.find((item) => item.href === "#hero");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    let frame: number | null = null;

    const updateHeaderState = () => {
      frame = null;
      setIsScrolled(window.scrollY > 24);

      if (isHomePage) {
        const sectionIds = siteContent.navigation.map((item) => item.href.replace("#", ""));
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 96 && rect.bottom > 96) {
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHeaderState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHomePage]);

  // Over the photographic hero the bar is transparent with light type.
  const onDark = isHomePage && !isScrolled;

  const linkClass = (active: boolean) =>
    cn(
      "link-underline whitespace-nowrap text-small font-medium transition-colors duration-200",
      onDark ? "text-white/85 hover:text-white" : "text-muted-foreground hover:text-foreground",
      active && (onDark ? "text-white link-underline-active" : "text-foreground link-underline-active"),
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200",
        onDark
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${siteContent.hero.name}, ${homeItem ? t(homeItem.label) : "Home"}`}
          className={cn(
            "display shrink-0 text-[1.375rem] leading-none tracking-[-0.04em] sm:text-2xl",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          {siteContent.hero.name}
          <span aria-hidden="true" className="text-signal">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            return isHomePage ? (
              <a key={item.href} href={item.href} className={linkClass(activeSection === id)}>
                {t(item.label)}
              </a>
            ) : (
              <Link key={item.href} href={`/${item.href}` as Route} className={linkClass(false)}>
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/cv" className={linkClass(router.pathname === "/cv")}>
            CV
          </Link>
          <LanguageSwitch onDark={onDark} />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t(
              theme === "light"
                ? siteContent.translations.themeSwitch.light
                : siteContent.translations.themeSwitch.dark,
            )}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full transition-colors duration-200",
              onDark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-accent",
            )}
            suppressHydrationWarning
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full xl:hidden",
                onDark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-accent",
              )}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-none bg-ink p-0 text-ink-foreground sm:max-w-md">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center px-6">
                <Link
                  href="/"
                  className="display text-2xl tracking-[-0.04em]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {siteContent.hero.name}
                  <span aria-hidden="true" className="text-signal">.</span>
                </Link>
              </div>

              <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-6">
                {navItems.map((item) => {
                  const id = item.href.replace("#", "");
                  const active = isHomePage && activeSection === id;
                  const className = cn(
                    "display flex items-center justify-between border-b border-ink-line py-3 text-[clamp(1.5rem,6vw,2rem)] tracking-[-0.03em] transition-colors duration-200",
                    active ? "text-signal" : "text-ink-foreground hover:text-signal",
                  );
                  return isHomePage ? (
                    <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className={className}>
                      {t(item.label)}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={`/${item.href}` as Route}
                      onClick={() => setIsMenuOpen(false)}
                      className={className}
                    >
                      {t(item.label)}
                    </Link>
                  );
                })}
                <Link
                  href="/cv"
                  onClick={() => setIsMenuOpen(false)}
                  className="display flex items-center justify-between border-b border-ink-line py-3 text-[clamp(1.5rem,6vw,2rem)] tracking-[-0.03em] text-ink-foreground transition-colors duration-200 hover:text-signal"
                >
                  CV
                </Link>
              </nav>

              <div className="flex items-center justify-between gap-4 px-6 py-6">
                <LanguageSwitch onDark />
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-small font-semibold text-ink-foreground transition-colors duration-200 hover:border-white/60"
                  suppressHydrationWarning
                >
                  {theme === "light" ? (
                    <>
                      <Moon size={16} /> Dark
                    </>
                  ) : (
                    <>
                      <Sun size={16} /> Light
                    </>
                  )}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
