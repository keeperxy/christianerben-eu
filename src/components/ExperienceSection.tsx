import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteContent, type Experience } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { cn } from "@/lib/utils";
import { getExperienceCompany, groupAndSortExperiences } from "@/lib/experience-utils";

const VISIBLE_ITEMS = 4;

const labels = {
  showMore: { en: "Show {n} more", de: "{n} weitere anzeigen" },
  showLess: { en: "Show less", de: "Weniger anzeigen" },
};

interface ExperienceEntryProps extends React.HTMLAttributes<HTMLElement> {
  experience: Experience;
  entryId: string;
}

const ExperienceEntry = React.forwardRef<HTMLElement, ExperienceEntryProps>(
  ({ experience: exp, entryId, className, ...props }, ref) => {
    const { t, language } = useSettings();
    const [expanded, setExpanded] = useState(false);
    const company = getExperienceCompany(exp.company, language);
    const hiddenCount = Math.max(0, exp.description.length - VISIBLE_ITEMS);
    const items = expanded ? exp.description : exp.description.slice(0, VISIBLE_ITEMS);
    const listId = `${entryId}-items`;

    return (
      <article
        ref={ref}
        className={cn("grid gap-6 border-b border-border py-10 md:grid-cols-12 md:gap-8 md:py-12", className)}
        {...props}
      >
        <div className="md:sticky md:top-24 md:col-span-4 md:self-start lg:col-span-3">
          <p className="text-body font-semibold">{t(exp.period)}</p>
          <p className="mt-1 text-small text-muted-foreground">{t(exp.location)}</p>
          {exp.logoUrl && (
            <div className="mt-5 inline-flex h-16 items-center rounded-[var(--radius)] bg-white px-4 ring-1 ring-black/5">
              <Image
                src={exp.logoUrl}
                alt={`${company} logo`}
                width={200}
                height={48}
                className={cn("w-auto max-w-[10rem] object-contain", exp.logoClassName ? "h-12" : "h-9")}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <h4 className="wide text-body font-bold leading-snug tracking-[-0.01em]">{t(exp.title)}</h4>
          <p className="mt-1 text-body text-muted-foreground">{company}</p>

          <ul id={listId} className="mt-6 max-w-[72ch] space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-body">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-[0.6em] size-2 shrink-0",
                    item.type === "achievement" ? "bg-signal" : "rounded-full bg-muted-foreground/50",
                  )}
                />
                <span className={item.type === "achievement" ? "text-foreground" : "text-muted-foreground"}>
                  {item.type === "achievement" && (
                    <strong className="font-semibold text-foreground">
                      {t(siteContent.experienceAchievementPrefix)}{" "}
                    </strong>
                  )}
                  {t(item.text)}
                </span>
              </li>
            ))}
          </ul>

          {hiddenCount > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setExpanded((value) => !value)}
              className="signal-link mt-5 text-small font-semibold text-foreground"
            >
              {expanded ? t(labels.showLess) : t(labels.showMore).replace("{n}", String(hiddenCount))}
            </button>
          )}

          <p className="mt-6 max-w-[72ch] text-small text-muted-foreground">
            {exp.tags.map((tag) => t(tag)).join(" · ")}
          </p>
        </div>
      </article>
    );
  },
);
ExperienceEntry.displayName = "ExperienceEntry";

const ExperienceSection = () => {
  const { t, language } = useSettings();
  const { experiences, experienceCategories } = siteContent;
  const groupedExperiences = groupAndSortExperiences(experiences);

  const groups = [
    { key: "key" as const, items: groupedExperiences.key, meta: experienceCategories?.key },
    { key: "additional" as const, items: groupedExperiences.additional, meta: experienceCategories?.additional },
  ];

  return (
    <section id="experience" className="bg-background py-24 sm:py-32">
      <div className="shell">
        <h2 className="display reveal max-w-[16ch] text-title">{t(siteContent.experienceSectionTitle)}</h2>

        {groups.map((group) => (
          <div key={group.key} className="mt-16 sm:mt-20">
            {group.meta && (
              <div className="grid grid-cols-1 gap-2 border-b border-foreground pb-5 md:grid-cols-12 md:gap-8">
                <h3 className="wide text-body font-bold md:col-span-4 lg:col-span-3">{t(group.meta.title)}</h3>
                <p className="text-body text-muted-foreground md:col-span-8 lg:col-span-9">{t(group.meta.subtitle)}</p>
              </div>
            )}
            {group.items.map((exp, index) => (
              <ExperienceEntry
                key={`${group.key}-${getExperienceCompany(exp.company, language)}-${exp.title.en}-${index}`}
                entryId={`exp-${group.key}-${index}`}
                experience={exp}
              />
            ))}
          </div>
        ))}

        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[60ch] text-body text-muted-foreground">{t(siteContent.moreProjects)}</p>
          <Link
            href="/cv"
            className="group inline-flex shrink-0 items-center gap-2 text-body font-semibold text-foreground signal-link"
          >
            {t(siteContent.downloadResume)}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-200 ease-[var(--ease-out-snap)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
