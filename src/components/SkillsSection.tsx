import React, { useState } from "react";
import { Briefcase, ShieldCheck, Bot, Network, Wrench, Flag } from "lucide-react";
import { siteContent } from "@/content/content";
import type { Skill } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const SkillsSection = () => {
  const { t } = useSettings();
  const { skills, skillsSection } = siteContent;
  type TabValue = "management" | "languages" | "security" | "ai" | "infrastructure" | "tools";
  const [activeTab, setActiveTab] = useState<TabValue>("management");

  // Filter skills by category
  const filteredSkills = skills.filter((skill) => skill.category === activeTab);

  return (
    <section id="skills" className="section-padding">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">{t(skillsSection.title)}</span>
        </h2>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
          {t(skillsSection.subtitle)}
        </p>

        <div className="max-w-4xl mx-auto">
          <Tabs
            defaultValue="management"
            onValueChange={(value) => setActiveTab(value as TabValue)}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="flex-nowrap h-12">
                <TabsTrigger value="management" className="gap-2 text-lg" name={t(skillsSection.categories.management)} aria-label={t(skillsSection.categories.management)}>
                  <Briefcase className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.management)}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="languages" className="gap-2 text-lg" name={t(skillsSection.categories.languages)} aria-label={t(skillsSection.categories.languages)}>
                  <Flag className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.languages)}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2 text-lg" name={t(skillsSection.categories.security)} aria-label={t(skillsSection.categories.security)}>
                  <ShieldCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.security)}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2 text-lg" name={t(skillsSection.categories.ai)} aria-label={t(skillsSection.categories.ai)}>
                  <Bot className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.ai)}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="gap-2 text-lg" name={t(skillsSection.categories.infrastructure)} aria-label={t(skillsSection.categories.infrastructure)}>
                  <Network className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.infrastructure)}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="gap-2 text-lg" name={t(skillsSection.categories.tools)} aria-label={t(skillsSection.categories.tools)}>
                  <Wrench className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {t(skillsSection.categories.tools)}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Skill content panels */}
            <TabsContent value="security" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
            <TabsContent value="infrastructure" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
            <TabsContent value="tools" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
            <TabsContent value="ai" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
            <TabsContent value="management" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
            <TabsContent value="languages" className="mt-0">
              <SkillsGrid skills={filteredSkills} />
            </TabsContent>
          </Tabs>
        </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
      {skills.map((skill, index) => {
        const IconComponent = skill.icon;
        return (
          <div
            key={index}
            className="p-4 rounded-lg border border-border bg-card flex flex-col items-center hover-scale transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              <IconComponent className="w-5 h-5" />
            </div>

            <h3 className="text-base font-medium mb-2 text-center">{t(skill.name)}</h3>

            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < skill.level ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsSection;
