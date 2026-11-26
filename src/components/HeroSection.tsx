import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSettings } from "@/contexts/settings-hook";
import { siteContent } from "@/content/content";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HeroSection = () => {
  const { t } = useSettings();
  const { hero } = siteContent;
  const [titleIndex, setTitleIndex] = useState(0);
  const [firstName, ...rest] = hero.name.split(" ");
  const lastName = rest.join(" ");

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const interval = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % hero.titleElements.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [hero.titleElements.length]);

  const currentTitle = t(hero.titleElements[titleIndex]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-[#040a0e] text-white"
    >
      {/* Portrait sits right on wide screens and top on phones, leaving clean dark space for type. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[74%] md:inset-y-0 md:left-auto md:h-full md:w-[66%]">
        <Image
          src="/profile.webp"
          alt={t(hero.imageAlt)}
          fill
          priority
          sizes="(min-width: 768px) 66vw, 100vw"
          className="photo-settle object-cover object-[50%_12%] md:object-[42%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,14,0.5)_0%,rgba(4,10,14,0)_20%,rgba(4,10,14,0)_55%,rgba(4,10,14,1)_100%)] md:bg-[linear-gradient(90deg,rgba(4,10,14,1)_0%,rgba(4,10,14,0.55)_28%,rgba(4,10,14,0)_55%),linear-gradient(180deg,rgba(4,10,14,0.45)_0%,rgba(4,10,14,0)_18%,rgba(4,10,14,0)_60%,rgba(4,10,14,0.9)_100%)]"
        />
      </div>

      <div className="shell pb-10 pt-32 sm:pb-14">
        <h1 className="display text-[clamp(3.5rem,11.6vw,12rem)] font-[800] leading-[0.84] tracking-[-0.055em] [font-stretch:108%]">
          <span className="sr-only">
            {hero.name}, {t(hero.titleElements[0])}
          </span>
          <span aria-hidden="true" className="rise-line block overflow-hidden pb-[0.04em]">
            <span>{firstName}</span>
          </span>
          <span aria-hidden="true" className="rise-line block overflow-hidden pb-[0.06em]">
            <span>
              {lastName}
              <span className="text-signal">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="max-w-[44rem]">
            <p
              aria-hidden="true"
              className="fade-up flex h-[1.3em] items-center overflow-hidden text-[clamp(1.375rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em] text-signal [--delay:350ms] [font-stretch:112%]"
            >
              <span key={titleIndex} className="role-in block truncate">
                {currentTitle}
              </span>
            </p>
            <p className="fade-up mt-4 max-w-[38rem] text-body text-white/85 [--delay:450ms]">
              {t(hero.tagline)}
            </p>
          </div>

          <div className="fade-up flex flex-col items-start gap-4 [--delay:550ms] md:items-end">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-signal py-3.5 pl-6 pr-5 text-body font-semibold text-ink transition-[transform,background-color] duration-200 ease-[var(--ease-out-snap)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {t(hero.ctaContact)}
              <ArrowRight
                className="size-5 transition-transform duration-200 ease-[var(--ease-out-snap)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <div className="flex items-center gap-3 text-small text-white/80">
              <span
                className="relative block h-1.5 w-20 overflow-hidden rounded-full bg-white/20"
                role="img"
                aria-label={`${t(hero.availability.label)}: ${t(hero.availability.status)}`}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-white/70"
                  style={{ width: `${hero.availability.bookedPercent}%` }}
                />
              </span>
              <span>
                <strong className="font-semibold text-white">{t(hero.availability.status)}</strong>
                <span className="text-white/70"> · {t(hero.availability.detail)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
