import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { siteContent } from '@/content/content';
import { useSettings } from '@/contexts/settings-hook';
import { cn } from '@/lib/utils';

const ProjectsSection = () => {
  const { t } = useSettings();
  const { projects } = siteContent;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="projects" className="bg-card py-24 sm:py-32">
      <div className="shell">
        <h2 className="display reveal text-title">{t(siteContent.projectsSectionTitle)}</h2>

        <div className="mt-14 border-t border-foreground">
          {projects.map((project, index) => {
            const open = openIndex === index;
            const panelId = `project-panel-${index}`;
            const buttonId = `project-button-${index}`;
            return (
              <div key={index} className="border-b border-foreground/20">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left sm:py-9"
                  >
                    <span
                      className={cn(
                        'display text-title transition-[transform,color] duration-200 ease-[var(--ease-out-snap)] [font-stretch:100%]',
                        open ? 'text-foreground' : 'text-foreground/70 group-hover:translate-x-2 group-hover:text-foreground',
                      )}
                    >
                      {t(project.title)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-200 ease-[var(--ease-out-snap)]',
                        open ? 'rotate-45 bg-signal text-ink' : 'bg-background text-foreground group-hover:bg-signal group-hover:text-ink',
                      )}
                    >
                      <Plus className="size-5" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-snap)]',
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-12 md:gap-10">
                      <div className="md:col-span-7">
                        <p className="max-w-[60ch] text-body">{t(project.description)}</p>
                        <p className="mt-6 text-small text-muted-foreground">
                          {project.tags.map((tag, tagIndex) => (
                            <React.Fragment key={tagIndex}>
                              {tagIndex > 0 && <span aria-hidden="true"> · </span>}
                              <span>{t(tag)}</span>
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                      <div className="md:col-span-5">
                        <div className="flex aspect-[16/10] items-center justify-center rounded-[var(--radius)] bg-background">
                          {project.imageUrl && (
                            <Image
                              src={project.imageUrl}
                              alt={t(project.imageAlt)}
                              width={512}
                              height={512}
                              className="ink-art h-4/5 w-auto object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
