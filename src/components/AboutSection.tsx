import React from 'react';
import { useSettings } from '@/contexts/settings-hook';
import { siteContent } from '@/content/content';
import { Users, FolderArchive, Code, LucideIcon } from 'lucide-react';

type AboutLabelKey = keyof typeof siteContent.about.labels;

const iconMap: Record<AboutLabelKey, LucideIcon> = {
  experience: Users,
  projects: FolderArchive,
  technologies: Code,
};

const AboutSection = () => {
  const { t } = useSettings();
  const { about } = siteContent;

  // Stats display (now fully from content)
  const stats = about.stats.map(stat => ({
    ...stat,
    key: stat.key as AboutLabelKey,
    icon: iconMap[stat.key as AboutLabelKey] || Users,
  }));

  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-gradient">{t(about.title)}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image Column */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-lg overflow-hidden shadow-xl hover-scale border-4 border-white dark:border-gray-800">
                <div className="bg-gradient-to-br from-primary/40 to-accent/40 aspect-[4/5] flex items-center justify-center">
                  <img src="/about-me.webp"
                    alt={t(about.imageAlt)}
                    className="size-4/5 object-cover aspect-[4/5]" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary rounded-lg transform rotate-6 -z-10"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-lg transform -rotate-6 -z-10"></div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-3">
            {/* About paragraphs */}
            {about.paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-base md:text-lg leading-relaxed ${index !== about.paragraphs.length - 1 ? 'mb-6' : ''}`}
              >
                {t(paragraph)}
              </p>
            ))}
            
            {/* Stats */}
            <div className={`grid grid-cols-1 sm:grid-cols-${stats.length} gap-8 mt-10`}>
              {stats.map((stat, index) => (
                <div 
                  key={stat.key} 
                  className="p-4 bg-card rounded-lg shadow-sm border border-border hover-scale transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
                      <stat.icon size={24} />
                    </div>
                    <span className="text-3xl font-bold mb-1">{t(stat.value)}</span>
                    <span className="text-sm text-muted-foreground">{t(about.labels[stat.key])}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
