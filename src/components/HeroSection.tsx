import React, { useState, useEffect } from "react";
import { ArrowDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/settings-hook";
import { siteContent } from "@/content/content";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useFitText } from "@/hooks/use-fit-text";

const HeroSection = () => {
  const { t } = useSettings();
  const { hero } = siteContent;

  // State for the rotating title
  const [titleIndex, setTitleIndex] = useState(0);

  // Set up title rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % hero.titleElements.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [hero.titleElements.length]);

  // FitText Hook for dynamic title
  const currentTitle = t(hero.titleElements[titleIndex]);
  const { ref: fitTextRef, fontSize } = useFitText({
    minFontSize: 18,
    maxFontSize: 48,
    depKey: currentTitle,
  });

  // Function to calculate position for decorative elements
  const calculatePosition = (position: number, distance: number) => {
    const angle = (position / 100) * 2 * Math.PI; // Convert percentage to radians
    const radius = (distance / 100) * 50; // Scale distance percentage to fit container

    // Calculate position around the circle
    const x = 50 + radius * Math.sin(angle);
    const y = 50 - radius * Math.cos(angle);

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 bg-grid relative overflow-hidden"
    >
      {/* Background Elements */}
      <div
        className="absolute w-64 h-64 bg-primary/50 rounded-full filter blur-3xl animate-[move-bg-1_25s_ease-in-out_infinite]"
      ></div>
      <div
        className="absolute w-72 h-72 bg-accent/50 rounded-full filter blur-3xl animate-[move-bg-2_30s_ease-in-out_infinite]"
      ></div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              {hero.name}
              <br />
              <span
                ref={fitTextRef}
                className="block text-gradient mt-2 h-[1.2em]"
                key={titleIndex}
                style={{ fontSize, lineHeight: 1.2, display: "inline-block", width: "100%", whiteSpace: "nowrap" }}
              >
                {currentTitle}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8">
              {t(hero.description)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-lg hover-scale"
              >
                <a href="#experience">{t(hero.ctaPrimary)}</a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full shadow-sm hover-scale"
              >
                <a href="/cv">
                  <FileText className="w-4 h-4 mr-2" />
                  {t(hero.ctaSecondary)}
                </a>
              </Button>
            </div>
          </div>

          {/* Hero Image/Profile Picture */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Background glow effect */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent/70 shadow-xl filter blur-sm absolute"></div>

              {/* Profile picture container */}
              <div className="w-[95%] h-[95%] rounded-full bg-background absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden">
                <div className="w-[75%] h-[75%] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {/* Profile image */}
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src="/profile.webp"
                        alt={t(hero.imageAlt)}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback className="text-4xl md:text-5xl font-bold">
                        CE
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              {/* Dynamically positioned decorative elements - now without animation-delay for immediate positioning */}
              {hero.decorativeElements.map((element, index) => {
                const posStyle = calculatePosition(
                  element.position,
                  element.distance
                );
                return (
                  <div
                    key={index}
                    className="absolute p-4 card-glass rounded-lg shadow-lg transform rotate-3 animate-float"
                    style={{
                      ...posStyle,
                      transform: `${posStyle.transform} rotate(${
                        index * 9 - 6
                      }deg)`,
                    }}
                  >
                    <code
                      className="text-xs sm:text-sm text-gradient"
                      dangerouslySetInnerHTML={{ __html: element.code }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-muted-foreground mb-2">Scroll</span>
          <ArrowDown className="w-5 h-5 text-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
