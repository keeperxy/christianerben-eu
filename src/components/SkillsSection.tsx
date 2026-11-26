import React, { useState } from "react";
import { Briefcase, ShieldCheck, Bot, Network, Wrench, Flag, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteContent } from "@/content/content";
import type { Skill } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type TabValue = "management" | "languages" | "security" | "ai" | "infrastructure" | "tools" | "compliance";

const tabs: { value: TabValue; icon: LucideIcon }[] = [
  { value: "management", icon: Briefcase },
  { value: "languages", icon: Flag },
  { value: "security", icon: ShieldCheck },
  { value: "ai", icon: Bot },
  { value: "infrastructure", icon: Network },
  { value: "tools", icon: Wrench },
  { value: "compliance", icon: Scale },
];

const SkillsSection = () => {
  const { t } = useSettings();
  const { skills, skillsSection } = siteContent;
  const [activeTab, setActiveTab] = useState<TabValue>("management");
  const tabTriggerClass =
    "min-h-12 w-full min-w-0 gap-2 justify-start whitespace-normal rounded-full px-4 py-2 text-small font-semibold text-muted-foreground transition-[background-color,color] duration-200 hover:text-foreground data-[state=active]:bg-signal data-[state=active]:text-ink data-[state=active]:shadow-none [&>svg]:shrink-0";
  const tabLabelClass = "min-w-0 whitespace-normal break-words leading-tight text-left";

  const filteredSkills = skills.filter((skill) => skill.category === activeTab);

  return (
    <section id="skills" className="bg-background py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="display reveal text-title lg:col-span-7">{t(skillsSection.title)}</h2>
          <p className="max-w-[46ch] text-body text-muted-foreground lg:col-span-5 lg:justify-self-end">
            {t(skillsSection.subtitle)}
          </p>
        </div>

        <Tabs
          defaultValue="management"
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="mt-14 w-full"
        >
          <TabsList className="!grid w-full !h-auto grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-1 rounded-[1.75rem] border border-border bg-card p-1.5">
            {tabs.map(({ value, icon: Icon }) => {
              const label = t(skillsSection.categories[value]);
              return (
                <TabsTrigger key={value} value={value} className={tabTriggerClass} name={label} aria-label={label}>
                  <Icon className="size-4" aria-hidden="true" />
                  <span className={tabLabelClass}>{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-10">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

interface SkillsGridProps {
  skills: Skill[];
}

const SkillsGrid = ({ skills }: SkillsGridProps) => {
  const { t } = useSettings();
  return (
    <ul className="grid grid-cols-1 gap-x-12 border-t border-foreground sm:grid-cols-2 xl:grid-cols-3">
      {skills.map((skill, index) => {
        const IconComponent = skill.icon;
        return (
          <li key={index} className="flex items-center gap-4 border-b border-border py-4">
            <IconComponent className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <h3 className="min-w-0 flex-1 text-body font-medium leading-snug">{t(skill.name)}</h3>
            <div
              className="flex shrink-0 gap-1"
              role="meter"
              aria-label={`${t(skill.name)} level ${skill.level} of 5`}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={skill.level}
            >
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={cn("h-3 w-1.5 rounded-[1px]", i < skill.level ? "bg-foreground" : "bg-border")}
                />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SkillsSection;
