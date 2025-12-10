/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { siteContent } from '@/content/content';
import { useSettings } from '@/contexts/settings-hook';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ProjectsSection = () => {
  const { t } = useSettings();
  const { projects } = siteContent;

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-gradient">
            {t(siteContent.projectsSectionTitle)}
          </span>
        </h2>

        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-card rounded-xl overflow-hidden shadow-md border border-border hover-scale transition-all h-full">
                    {/* Project Image */}
                    <div className="aspect-video relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={`${t(project.imageAlt)}`}
                            className="object-contain max-h-48 max-w-64 h-auto mx-auto"
                          />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{t(project.title)}</h3>

                      <p className="text-muted-foreground mb-4">
                        {t(project.description)}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="font-normal">
                            {t(tag)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="flex" />
            <CarouselNext className="flex" />
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
