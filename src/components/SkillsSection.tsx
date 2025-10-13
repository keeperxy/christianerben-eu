import React, { useState } from "react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import {
  Activity,
  AlertTriangle,
  BookCheck,
  BookOpen,
  Bot,
  BotMessageSquare,
  Box,
  Brain,
  Briefcase,
  Bug,
  ClipboardCheck,
  Cloud,
  Cpu,
  Database,
  FileCode2,
  FileCheck2,
  FileText,
  Flag,
  FlaskConical,
  GitBranch,
  GitCompareArrows,
  Globe,
  Handshake,
  Heart,
  Image,
  ImagePlay,
  KeyRound,
  Landmark,
  Laptop,
  Layers,
  LifeBuoy,
  ListChecks,
  Mail,
  MessageCircle,
  MousePointer2,
  Network,
  Orbit,
  Package,
  RefreshCw,
  Route,
  Router,
  Satellite,
  Scale,
  ScanSearch,
  SearchCode,
  Server,
  ServerCog,
  Settings,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  Swords,
  Terminal,
  Users,
  Video,
  WandSparkles,
  Wrench
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Get the icon component based on skill name
const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case "activity":
      return <Activity className="w-5 h-5" />;
    case "alert-triangle":
      return <AlertTriangle className="w-5 h-5" />;
    case "book-check":
      return <BookCheck className="w-5 h-5" />;
    case "book-open":
      return <BookOpen className="w-5 h-5" />;
    case "bug":
      return <Bug className="w-5 h-5" />;
    case "brain":
      return <Brain className="w-5 h-5" />;
    case "briefcase":
      return <Briefcase className="w-5 h-5" />;
    case "bot":
      return <Bot className="w-5 h-5" />;
    case "bot-message-square":
      return <BotMessageSquare className="w-5 h-5" />;
    case "box":
      return <Box className="w-5 h-5" />;
    case "cloud":
      return <Cloud className="w-5 h-5" />;
    case "cpu":
      return <Cpu className="w-5 h-5" />;
    case "database":
      return <Database className="w-5 h-5" />;
    case "file-code-2":
      return <FileCode2 className="w-5 h-5" />;
    case "file-check-2":
      return <FileCheck2 className="w-5 h-5" />;
    case "file-text":
      return <FileText className="w-5 h-5" />;
    case "clipboard-check":
      return <ClipboardCheck className="w-5 h-5" />;
    case "flag":
      return <Flag className="w-5 h-5" />;
    case "flask-conical":
      return <FlaskConical className="w-5 h-5" />;
    case "git-branch":
      return <GitBranch className="w-5 h-5" />;
    case "git-compare-arrows":
      return <GitCompareArrows className="w-5 h-5" />;
    case "globe":
      return <Globe className="w-5 h-5" />;
    case "handshake":
      return <Handshake className="w-5 h-5" />;
    case "heart":
      return <Heart className="w-5 h-5" />;
    case "image":
      return <Image className="w-5 h-5" />;
    case "image-play":
      return <ImagePlay className="w-5 h-5" />;
    case "key-round":
      return <KeyRound className="w-5 h-5" />;
    case "landmark":
      return <Landmark className="w-5 h-5" />;
    case "life-buoy":
      return <LifeBuoy className="w-5 h-5" />;
    case "list-checks":
      return <ListChecks className="w-5 h-5" />;
    case "laptop":
      return <Laptop className="w-5 h-5" />;
    case "layers":
      return <Layers className="w-5 h-5" />;
    case "mail": 
      return <Mail className="w-5 h-5" />;
    case "message-circle":
      return <MessageCircle className="w-5 h-5" />;
    case "mouse-pointer-2":
      return <MousePointer2 className="w-5 h-5" />;
    case "network":
      return <Network className="w-5 h-5" />;
    case "orbit":
      return <Orbit className="w-5 h-5" />;
    case "package":
      return <Package className="w-5 h-5" />;
    case "refresh-cw":
      return <RefreshCw className="w-5 h-5" />;
    case "route":
      return <Route className="w-5 h-5" />;
    case "router":
      return <Router className="w-5 h-5" />;
    case "satellite":
      return <Satellite className="w-5 h-5" />;
    case "scale":
      return <Scale className="w-5 h-5" />;
    case "scan-search":
      return <ScanSearch className="w-5 h-5" />;
    case "search-code":
      return <SearchCode className="w-5 h-5" />;
    case "settings":
      return <Settings className="w-5 h-5" />;
    case "server":
      return <Server className="w-5 h-5" />;
    case "server-cog":
      return <ServerCog className="w-5 h-5" />;
    case "shield":
      return <Shield className="w-5 h-5" />;
    case "shield-check":
      return <ShieldCheck className="w-5 h-5" />;
    case "siren":
      return <Siren className="w-5 h-5" />;
    case "sparkles":
      return <Sparkles className="w-5 h-5" />;
    case "swords":
      return <Swords className="w-5 h-5" />;
    case "terminal":
      return <Terminal className="w-5 h-5" />;
    case "users":
      return <Users className="w-5 h-5" />;
    case "video":
      return <Video className="w-5 h-5" />;
    case "wand-2":
      return <WandSparkles className="w-5 h-5" />;
    case "wrench":
      return <Wrench className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

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
  skills: typeof siteContent.skills;
}

const SkillsGrid = ({ skills }: SkillsGridProps) => {
  const { t } = useSettings();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-border bg-card flex flex-col items-center hover-scale transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
            {getSkillIcon(skill.icon)}
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
      ))}
    </div>
  );
};

export default SkillsSection;
