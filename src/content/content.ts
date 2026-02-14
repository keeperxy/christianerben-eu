import type { ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Bot,
  Bug,
  ClipboardCheck,
  Cloud,
  Cpu,
  Database,
  FileCheck,
  FileText,
  Flag,
  GitBranch,
  Globe,
  Handshake,
  Heart,
  ImagePlay,
  KeyRound,
  Landmark,
  Layers,
  LifeBuoy,
  ListChecks,
  Mail,
  MousePointer2,
  Network,
  RefreshCw,
  Router,
  Scale,
  ScrollText,
  SearchCode,
  Server,
  ServerCog,
  Shield,
  ShieldCheck,
  Terminal,
  Users,
  WandSparkles,
} from "lucide-react";
import {
  SiAnthropic,
  SiCaddy,
  SiDocker,
  SiFreebsd,
  SiGit,
  SiGooglegemini,
  SiOpenai,
  SiPaperlessngx,
  SiPuppet,
  SiPython,
  SiX,
} from "react-icons/si";

interface LocalizedString {
  en: string;
  de: string;
}

export interface NavItem {
  label: LocalizedString;
  href: string;
}

export interface HeroSection {
  name: string;
  imageAlt: LocalizedString;
  titleElements: LocalizedString[];
  description: LocalizedString;
  availability: {
    label: LocalizedString;
    status: LocalizedString;
    detail: LocalizedString;
    availableFrom: LocalizedString;
    bookedPercent: number;
    availablePercent: number;
  };
  ctaPrimary: LocalizedString;
  ctaSecondary: LocalizedString;
  decorativeElements: {
    position: number;
    distance: number;
    code: string;
  }[];
}

export interface AboutSection {
  title: LocalizedString;
  paragraphs: LocalizedString[];
  imageAlt: LocalizedString;
  labels: {
    experience: LocalizedString;
    projects: LocalizedString;
    technologies: LocalizedString;
  };
  stats: { key: string; value: LocalizedString }[];
}

export interface SecurityComplianceItem {
  title: LocalizedString;
  items: LocalizedString[];
  icon: ComponentType<{ className?: string }>;
}

export interface SecurityComplianceSection {
  title: LocalizedString;
  subtitle?: LocalizedString;
  items: SecurityComplianceItem[];
}

export interface ExperienceDescriptionItem {
  type: "text" | "achievement";
  text: LocalizedString;
}

export type ExperienceCategory = "key" | "additional";

export interface Experience {
  title: LocalizedString;
  company: string;
  period: LocalizedString;
  location: LocalizedString;
  experienceCategory?: ExperienceCategory;
  description: ExperienceDescriptionItem[];
  tags: LocalizedString[];
  logoUrl?: string;
  logoClassName?: string;
}

export interface Project {
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  imageAlt: LocalizedString;
  tags: LocalizedString[];
  demoUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  name: LocalizedString;
  icon: ComponentType<{ className?: string }>;
  category:
    | "languages"
    | "management"
    | "security"
    | "infrastructure"
    | "tools"
    | "ai"
    | "compliance";
  level: number;
}

export interface SkillsSection {
  title: LocalizedString;
  subtitle: LocalizedString;
  categories: {
    security: LocalizedString;
    infrastructure: LocalizedString;
    tools: LocalizedString;
    ai: LocalizedString;
    management: LocalizedString;
    languages: LocalizedString;
    compliance: LocalizedString;
  };
}

export interface ContactSection {
  title: LocalizedString;
  subtitle: LocalizedString;
  emailLabel: LocalizedString;
  email: string;
  cvemail: string;
  phoneLabel: LocalizedString;
  phone: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    xing?: string;
    x?: string;
    bluesky?: string;
    freelancermap?: string;
  };
  birthday?: string;
  homepage?: string;
  formLabels: {
    name: LocalizedString;
    email: LocalizedString;
    message: LocalizedString;
    send: LocalizedString;
  };
  formStatus: {
    sentTitle: LocalizedString;
    sentDescription: LocalizedString;
    errorTitle: LocalizedString;
    errorDescription: LocalizedString;
    sending: LocalizedString;
    validation: {
      name: {
        en: string;
        de: string;
      };
      email: {
        en: string;
        de: string;
      };
      message: {
        en: string;
        de: string;
      };
    };
  };
  formPlaceholders: {
    name: LocalizedString;
    email: LocalizedString;
    message: LocalizedString;
  };
  infoTitle: LocalizedString;
  findMeOn: LocalizedString;
  infoText: LocalizedString;
}

export interface CV {
  title: LocalizedString;
}

export interface Footer {
  copyright: LocalizedString;
  links: NavItem[];
  builtWith?: LocalizedString;
  lastUpdated: LocalizedString;
}

export interface ImprintSection {
  title: LocalizedString;
  contactTitle: LocalizedString;
  companyName: LocalizedString;
  representative?: LocalizedString;
  address: {
    street: LocalizedString;
    city: LocalizedString;
    country: LocalizedString;
  };
  contactInfoTitle: LocalizedString;
  emailLabel: LocalizedString;
  email: string;
  phoneLabel: LocalizedString;
  phone: string;
  legalTitle?: LocalizedString;
  vatId?: LocalizedString;
  registrationInfo?: LocalizedString;
  disclaimerTitle: LocalizedString;
  disclaimer: LocalizedString;
}

export interface PrivacySection {
  title: LocalizedString;
  subtitle: LocalizedString;
  sections: Array<{
    title: LocalizedString;
    paragraphs: LocalizedString[];
    list?: Array<
      | LocalizedString
      | {
          en: string;
          de: string;
          description?: LocalizedString;
        }
    >;
  }>;
}

export interface SitemapSection {
  title: LocalizedString;
  description: LocalizedString;
}

export interface LLMSSection {
  title: LocalizedString;
}

export interface ExperienceCategories {
  key: {
    title: LocalizedString;
    subtitle: LocalizedString;
  };
  additional: {
    title: LocalizedString;
    subtitle: LocalizedString;
  };
}

export interface SiteContent {
  siteMetadata: {
    title: string;
    description: LocalizedString;
    author: string;
  };
  projectsSectionTitle: LocalizedString;
  projectsSectionMore?: LocalizedString;
  navigation: NavItem[];
  hero: HeroSection;
  about: AboutSection;
  securityCompliance: SecurityComplianceSection;
  experiences: Experience[];
  experienceCategories?: ExperienceCategories;
  projects: Project[];
  skills: Skill[];
  skillsSection: SkillsSection;
  contact: ContactSection;
  cv: CV;
  footer: Footer;
  imprint: ImprintSection;
  privacy: PrivacySection;
  sitemap?: SitemapSection;
  llms?: LLMSSection;
  translations: {
    languageSwitch: {
      en: string;
      de: string;
    };
    themeSwitch: {
      light: LocalizedString;
      dark: LocalizedString;
    };
  };
  backToHome: LocalizedString;
  experienceSectionTitle: LocalizedString;
  experienceAchievementPrefix: LocalizedString;
  moreProjects: LocalizedString;
  downloadResume: LocalizedString;
}

export const siteContent: SiteContent = {
  siteMetadata: {
    title: "Christian Erben Portfolio",
    description: {
      en: "Portfolio of Christian Erben: Network Security & Linux Infrastructure Specialist",
      de: "Portfolio von Christian Erben: Netzwerk-Security- und Linux-Infrastruktur-Spezialist",
    },
    author: "Christian Erben",
  },
  projectsSectionTitle: {
    en: "Highlighted Projects",
    de: "Ausgewählte Projekte",
  },
  experienceCategories: {
    key: {
      title: { en: "Key Projects", de: "Schlüsselprojekte" },
      subtitle: {
        en: "Core technical and organizational engagements with high responsibility.",
        de: "Wesentliche technische und organisatorische Engagements mit hoher Verantwortung.",
      },
    },
    additional: {
      title: { en: "Additional Projects", de: "Zusatzprojekte" },
      subtitle: {
        en: "Complementary or specialized projects with flexible scope.",
        de: "Ergänzende oder spezialisierte Projekte mit flexiblem Umfang.",
      },
    },
  },
  navigation: [
    { label: { en: "Home", de: "Start" }, href: "#hero" },
    { label: { en: "About", de: "Über mich" }, href: "#about" },
    {
      label: { en: "Security & Compliance", de: "Security & Compliance" },
      href: "#security-compliance",
    },
    { label: { en: "Experience", de: "Erfahrung" }, href: "#experience" },
    { label: { en: "Projects", de: "Projekte" }, href: "#projects" },
    { label: { en: "Skills", de: "Fähigkeiten" }, href: "#skills" },
    { label: { en: "Contact", de: "Kontakt" }, href: "#contact" },
  ],
  hero: {
    name: "Christian Erben",
    imageAlt: {
      en: "Portrait of Christian Erben, network security specialist and Linux systems engineer.",
      de: "Portrait von Christian Erben, Netzwerk-Security-Spezialist und Linux-Systemingenieur.",
    },
    titleElements: [
      { en: "Network Security Specialist", de: "Netzwerk-Security-Spezialist" },
      { en: "Linux Systems Administrator", de: "Linux-Systemadministrator" },
      { en: "Infrastructure Architect", de: "Infrastruktur-Architekt" },
      { en: "Automation Advocate", de: "Automatisierungs-Enthusiast" },
    ],
    description: {
      en: "I have many years of experience in system and network administration, with a focus on designing and securing complex, redundant infrastructures. This includes professional firewall management, planning secure network architectures, as well as solid knowledge of classic and advanced protocols and platforms. Additionally, I bring extensive practice in Linux administration, security-oriented operational processes, and the establishment of structured security mechanisms such as IAM, ISMS, as well as incident and vulnerability management.",
      de: "Ich verfüge über langjährige Erfahrung in der System- und Netzwerkadministration, mit Schwerpunkt auf dem Design und der Absicherung komplexer, redundanter Infrastrukturen. Dazu zählen professionelles Firewall-Management, die Planung sicherer Netzwerkarchitekturen sowie fundierte Kenntnisse klassischer und anspruchsvoller Protokolle und Plattformen. Ergänzend bringe ich umfangreiche Praxis in der Linux-Administration, in sicherheitsorientierten Betriebsprozessen und im Aufbau strukturierter Security-Mechanismen wie IAM, ISMS sowie Incident- und Vulnerability-Management mit.",
    },
    availability: {
      label: { en: "Availability", de: "Verfügbarkeit" },
      status: { en: "20% available", de: "20% verfügbar" },
      detail: {
        en: "80% booked until April 30, 2026",
        de: "80% ausgelastet bis 30. April 2026",
      },
      availableFrom: {
        en: "Fully available from May 4, 2026",
        de: "Voll verfügbar ab 4. Mai 2026",
      },
      bookedPercent: 80,
      availablePercent: 20,
    },
    ctaPrimary: { en: "Explore my work", de: "Meine Arbeit entdecken" },
    ctaSecondary: { en: "Download CV", de: "Lebenslauf herunterladen" },
    decorativeElements: [
      { position: 118, distance: 90, code: "⚙️ automation" },
      { position: 97, distance: 110, code: "🔥 firewalls" },
      { position: 82, distance: 130, code: "🌐 networks" },
      { position: 38, distance: 105, code: "🧩 communication" },
      { position: 68, distance: 112, code: "☁️ cloud" },
    ],
  },
  about: {
    title: { en: "About Me", de: "Über Mich" },
    paragraphs: [
      {
        en: "As an experienced IT engineer with over 18 years of practice in enterprise environments, I combine deep technical expertise with a clear focus on information security and robust operational processes. My focus lies on designing, operating, and securing complex network and platform architectures. This includes in particular firewall management, planning secure and segmented networks, as well as extensive knowledge of both classic and exotic network protocols and various network products.",
        de: "Als erfahrener IT-Engineer mit über 18 Jahren Praxis in Enterprise-Umgebungen verbinde ich tiefes technisches Know-how mit einem klaren Fokus auf Informationssicherheit und robuste Betriebsprozesse. Mein Schwerpunkt liegt auf der Gestaltung, dem Betrieb und der Absicherung komplexer Netzwerk- und Plattformarchitekturen. Dazu gehören insbesondere Firewall-Management, die Planung sicherer und segmentierter Netzwerke sowie umfangreiche Kenntnisse zu klassischen und auch exotischen Netzwerkprotokollen und verschiedensten Netzwerkprodukten.",
      },
      {
        en: "In addition to my network experience, I have been working intensively with Linux systems for many years and manage both classic server environments and containerized platforms. I combine this technical foundation with structured approaches from information security management, the development of security policies, and the establishment of effective security processes.",
        de: "Neben meiner Netzwerkerfahrung arbeite ich seit vielen Jahren intensiv mit Linux-Systemen und betreue sowohl klassische Serverumgebungen als auch containerisierte Plattformen. Diese technische Grundlage kombiniere ich mit strukturierten Ansätzen aus dem Informationssicherheitsmanagement, der Entwicklung von Security-Policies und dem Aufbau wirksamer Sicherheitsprozesse.",
      },
      {
        en: "I am responsible for topics such as Identity & Access Management, risk analyses, as well as incident and vulnerability management, and ensure that secure processes, role models, and documentation are anchored in the company. In doing so, I place great emphasis on clear structures, traceable processes, and close collaboration across team and disciplinary boundaries – for a stable, secure, and future-proof IT operation.",
        de: "Ich verantworte Themen wie Identity & Access Management, Risikoanalysen sowie Incident- und Vulnerability-Management und sorge dafür, dass sichere Abläufe, Rollenmodelle und Dokumentationen im Unternehmen verankert sind. Dabei lege ich großen Wert auf klare Strukturen, nachvollziehbare Prozesse und eine enge Zusammenarbeit über Team- und Fachgrenzen hinweg – für einen stabilen, sicheren und zukunftsfähigen IT-Betrieb.",
      },
    ],
    imageAlt: {
      en: "Illustration of Christian designing a redundant network, reviewing firewall policies on a laptop, and collaborating with teams, connected by flowing cables to symbolise resilient infrastructure.",
      de: "Illustration von Christian, der ein redundantes Netzwerk entwirft, Firewall-Richtlinien auf einem Laptop prüft und mit Teams zusammenarbeitet; fließende Kabel symbolisieren resiliente Infrastruktur.",
    },
    labels: {
      experience: { en: "Years of Experience", de: "Jahre Erfahrung" },
      projects: { en: "Completed Projects", de: "Abgeschlossene Projekte" },
      technologies: { en: "Technologies", de: "Technologien" },
    },
    stats: [
      { key: "experience", value: { en: "15+", de: "15+" } },
      { key: "projects", value: { en: "40+", de: "40+" } },
      { key: "technologies", value: { en: "20+", de: "20+" } },
    ],
  },
  securityCompliance: {
    title: {
      en: "Security & Compliance / Governance",
      de: "Security & Compliance / Governance",
    },
    subtitle: {
      en: "Comprehensive expertise in information security management, security governance, and security frameworks",
      de: "Umfassende Expertise im Informationssicherheitsmanagement, Security Governance und Sicherheitsframeworks",
    },
    items: [
      {
        title: {
          en: "Information Security Management (ISMS)",
          de: "Informationssicherheitsmanagement (ISMS)",
        },
        icon: ShieldCheck,
        items: [
          {
            en: "Establishment and maintenance of security policies (Policies, SOPs, procedures)",
            de: "Aufbau und Pflege von Sicherheitsrichtlinien (Policies, SOPs, Verfahrensanweisungen)",
          },
          {
            en: "Derivation and implementation of organizational and technical security measures",
            de: "Ableitung und Umsetzung organisatorischer und technischer Sicherheitsmaßnahmen",
          },
          {
            en: "Continuous development of secure operational processes",
            de: "Kontinuierliche Weiterentwicklung sicherer Betriebsprozesse",
          },
        ],
      },
      {
        title: {
          en: "Security Governance",
          de: "Security Governance",
        },
        icon: Scale,
        items: [
          {
            en: "Definition and establishment of security standards for infrastructure and platform operations",
            de: "Definition und Etablierung von Sicherheitsstandards für Infrastruktur- und Plattformbetrieb",
          },
          {
            en: "Documentation, process design and ensuring uniform policy application",
            de: "Dokumentation, Prozessgestaltung und Sicherstellung einer einheitlichen Policy-Anwendung",
          },
          {
            en: "Creation and maintenance of security-relevant operating concepts",
            de: "Erstellung und Pflege sicherheitsrelevanter Betriebskonzepte",
          },
        ],
      },
      {
        title: {
          en: "BSI IT-Grundschutz",
          de: "BSI IT-Grundschutz",
        },
        icon: BookOpen,
        items: [
          {
            en: "Use of Grundschutz methodology to structure and evaluate security measures",
            de: "Nutzung der Grundschutz-Methodik zur Strukturierung und Bewertung von Sicherheitsmaßnahmen",
          },
          {
            en: "Support in establishing secure operational processes according to recognized standards",
            de: "Unterstützung beim Aufbau sicherer Betriebsprozesse nach anerkannten Standards",
          },
        ],
      },
      {
        title: {
          en: "Identity & Access Management (IAM)",
          de: "Identity & Access Management (IAM)",
        },
        icon: KeyRound,
        items: [
          {
            en: "Role and permission concepts (RBAC)",
            de: "Rollen- und Berechtigungskonzepte (RBAC)",
          },
          {
            en: "Rights review, recertification and separation of functions",
            de: "Rechteprüfung, Rezertifizierung und Funktionstrennung",
          },
          {
            en: "Privileged Access Management (PAM)",
            de: "Privileged Access Management (PAM)",
          },
        ],
      },
      {
        title: {
          en: "Incident & Vulnerability Management",
          de: "Incident & Vulnerability Management",
        },
        icon: AlertTriangle,
        items: [
          {
            en: "Establishment and maintenance of structured processes for incidents & security findings",
            de: "Aufbau und Pflege strukturierter Prozesse für Incidents & Security Findings",
          },
          {
            en: "Prioritization, processing and documentation of security-relevant incidents",
            de: "Priorisierung, Bearbeitung und Dokumentation sicherheitsrelevanter Vorfälle",
          },
          {
            en: "Operational vulnerability management (including patch planning and follow-up)",
            de: "Operatives Schwachstellenmanagement (inkl. Patch-Planung und Follow-up)",
          },
        ],
      },
    ],
  },
  experiences: [
    {
      title: {
        en: "Network Administrator (Palo Alto / Fortinet)",
        de: "Netzwerkadministrator (Palo Alto / Fortinet)",
      },
      company: "St. Dominikus Krankenhaus und Jugendhilfe gGmbH",
      logoUrl: "/logos/st-marienkrankenhaus.svg",
      logoClassName: "h-20 w-auto md:h-24",
      period: { en: "Feb 2026 - Present", de: "Feb 2026 - Heute" },
      location: { en: "Ludwigshafen, Germany", de: "Ludwigshafen, Deutschland" },
      experienceCategory: "key",
      description: [
        {
          type: "text",
          text: {
            en: "Responsible for high availability and secure operation of LAN, WLAN, and VPN services for medical and administrative environments.",
            de: "Verantwortlich für die Hochverfügbarkeit und den sicheren Betrieb von LAN-, WLAN- und VPN-Services in medizinischen und administrativen Umgebungen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Operate and maintain network infrastructure including switches, routers, firewalls, and VLAN segmentation for different hospital areas.",
            de: "Betrieb und Pflege der Netzwerkinfrastruktur inkl. Switches, Routern, Firewalls und VLAN-Segmentierung für unterschiedliche Krankenhausbereiche.",
          },
        },
        {
          type: "text",
          text: {
            en: "Implement security controls and policies aligned with ISO 27001, BSI baseline protection, GDPR, and sector-specific requirements.",
            de: "Umsetzung von Sicherheitskontrollen und Richtlinien gemäß ISO 27001, BSI-Grundschutz, DSGVO und sektorspezifischen Anforderungen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Monitor network performance and fault tolerance for critical systems and provide rapid troubleshooting in incident scenarios.",
            de: "Monitoring von Netzwerkperformance und Ausfallsicherheit kritischer Systeme sowie schnelle Störungsbehebung in Incident-Szenarien.",
          },
        },
        {
          type: "text",
          text: {
            en: "Integrate medical devices into hospital network environments and ensure secure interoperability with clinical information systems.",
            de: "Integration medizinischer Geräte in die Krankenhausnetzwerke und Sicherstellung einer sicheren Interoperabilität mit klinischen Informationssystemen.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Currently migrating IPSec VPN tunnels from Cisco to Palo Alto with phased cutover planning and no service disruption.",
            de: "Derzeitige Migration IPSec-VPN-Tunnel von Cisco auf Palo Alto mit stufenweiser Umschaltplanung und ohne Betriebsunterbrechung.",
          },
        },
      ],
      tags: [
        { en: "Palo Alto", de: "Palo Alto" },
        { en: "Fortinet", de: "Fortinet" },
        { en: "LAN/WLAN/VPN", de: "LAN/WLAN/VPN" },
        { en: "VLAN Segmentation", de: "VLAN-Segmentierung" },
        { en: "ISO 27001", de: "ISO 27001" },
        { en: "BSI Baseline Protection", de: "BSI-Grundschutz" },
        { en: "GDPR", de: "DSGVO" },
        { en: "IDS/IPS", de: "IDS/IPS" },
        { en: "Zero Trust", de: "Zero Trust" },
        { en: "Healthcare IT", de: "Krankenhaus-IT" },
      ],
    },
    {
      title: { en: "Member of the Board", de: "Vorstandsmitglied" },
      company: "DEGIT AG",
      logoUrl: "/logos/degit.png",
      period: { en: "Apr 2020 - Present", de: "Apr 2020 - Heute" },
      location: { en: "Hockenheim, Germany", de: "Hockenheim, Deutschland" },
      experienceCategory: "additional",
      description: [
        {
          type: "text",
          text: {
            en: "Board member focusing on data protection, information security, and network strategy for SME clients.",
            de: "Vorstandsmitglied mit Fokus auf Datenschutz, Informationssicherheit und Netzwerkstrategie für mittelständische Kund:innen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Connects clients with specialists from DEGIT's expert network and coordinates interdisciplinary consulting teams.",
            de: "Vernetzt Kund:innen mit Spezialist:innen aus dem DEGIT-Expertennetzwerk und koordiniert interdisziplinäre Beratungsteams.",
          },
        },
        {
          type: "text",
          text: {
            en: "Oversees the design of secure, redundant infrastructures including firewall concepts, VPN solutions (IPv6, Zero Trust, Zero-Config VPN, etc.) and backup strategies.",
            de: "Überwacht die Konzeption sicherer, redundanter Infrastrukturen einschließlich Firewall-Konzepten, VPN-Lösungen (IPv6, Zero Trust, Zero-Config VPN, etc.) und Backup-Strategien.",
          },
        },
        {
          type: "text",
          text: {
            en: "Introduction of a company-wide security governance framework including policy design and access governance",
            de: "Einführung eines unternehmensweiten Security-Governance-Frameworks inkl. Policy-Design und Access Governance",
          },
        },
        {
          type: "text",
          text: {
            en: "Conducting structured risk analyses and deriving technical security measures",
            de: "Durchführung strukturierter Risikoanalysen und Ableitung technischer Sicherheitsmaßnahmen",
          },
        },
        {
          type: "text",
          text: {
            en: "Development of secure operational processes (Least Privilege, Logging, Monitoring, Role Models)",
            de: "Entwicklung sicherer Betriebsprozesse (Least Privilege, Logging, Monitoring, Rollenmodelle)",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Established a governance framework aligning network security, privacy, and compliance requirements for new customer projects.",
            de: "Aufbau eines Governance-Rahmens, der Netzwerksicherheit, Datenschutz und Compliance für neue Kundenprojekte bündelt.",
          },
        },
      ],
      tags: [
        { en: "Compliance", de: "Compliance" },
        { en: "Security Strategy", de: "Sicherheitsstrategie" },
        { en: "Networking", de: "Netzwerke" },
        { en: "Consulting", de: "Beratung" },
        { en: "Compliance", de: "Compliance" },
        { en: "M365", de: "M365" },
        { en: "Cloudflare", de: "Cloudflare" },
        { en: "Supabase", de: "Supabase" },
        { en: "Azure", de: "Azure" },
        { en: "IPv6", de: "IPv6" },
      ],
    },
    {
      title: {
        en: "SchlauFabrik \u2013 Multi-tenant Compliance & AI Training Platform",
        de: "SchlauFabrik \u2013 Multi-Tenant Compliance- & KI-Trainingsplattform",
      },
      company: "xtensible UG (haftungsbeschränkt) & Co. KG",
      logoUrl: "/logos/schlaufabrik-de.png",
      logoClassName: "w-32 h-auto",
      period: { en: "December 2025 - Present", de: "Dezember 2025 - Heute" },
      location: { en: "Hockenheim, Germany", de: "Hockenheim, Deutschland" },
      experienceCategory: "additional",
      description: [
        {
          type: "text",
          text: {
            en: "Designed and built a modern, responsive training platform for compliance and AI topics (SME-focused) with tenant isolation and role-based access.",
            de: "Konzeption und Umsetzung einer modernen, responsiven Trainingsplattform f\u00fcr Compliance- und KI-Themen (KMU-Fokus) mit Mandantentrennung und RBAC.",
          },
        },
        {
          type: "text",
          text: {
            en: "Implemented security-by-design with Postgres Row-Level Security, audit logging, rate limiting, and hardened authentication flows (Passkey/Magic Link/2FA/SSO).",
            de: "Umsetzung von Security-by-Design mit Postgres Row-Level Security, Audit-Logs, Rate Limiting sowie geh\u00e4rteten Auth-Flows (Passkey/Magic Link/2FA/SSO).",
          },
        },
        {
          type: "text",
          text: {
            en: "Built course delivery with progress tracking, quizzes, enrollments, and admin dashboards for tenant/user management.",
            de: "Aufbau der Kursplattform inkl. Fortschritts-Tracking, Quiz, Zuweisungen sowie Admin-Dashboards f\u00fcr Tenant-/User-Management.",
          },
        },
        {
          type: "text",
          text: {
            en: "Delivered tamper-evident PDF certificates with QR verification and cryptographic hashing; enabled bulk export for audits.",
            de: "Implementierung manipulationssicherer PDF-Zertifikate mit QR-Verifikation und kryptografischem Hashing inkl. Bulk-Export f\u00fcr Audits.",
          },
        },
        {
          type: "text",
          text: {
            en: "Integrated Stripe billing (subscriptions, portal, webhooks) with license models and soft-lock mechanisms for tenant limits.",
            de: "Integration von Stripe-Abrechnung (Subscriptions, Portal, Webhooks) inkl. Lizenzmodellen und Soft-Lock-Mechanismen f\u00fcr Tenant-Limits.",
          },
        },
        {
          type: "text",
          text: {
            en: "Tech: Next.js (App Router), TypeScript, Bun, Tailwind, next-intl (DE/EN), Neon Postgres, Stripe, Resend, Vitest/Playwright.",
            de: "Tech: Next.js (App Router), TypeScript, Bun, Tailwind, next-intl (DE/EN), Neon Postgres, Stripe, Resend, Vitest/Playwright.",
          },
        },
      ],
      tags: [
        { en: "Multi-tenant", de: "Multi-Tenant" },
        { en: "Compliance", de: "Compliance" },
        { en: "AI Training", de: "KI-Training" },
        { en: "RBAC", de: "RBAC" },
        { en: "Postgres RLS", de: "Postgres RLS" },
        { en: "Stripe", de: "Stripe" },
        { en: "Next.js", de: "Next.js" },
        { en: "TypeScript", de: "TypeScript" },
        { en: "Tailwind", de: "Tailwind" },
        { en: "Neon Postgres", de: "Neon Postgres" },
        { en: "Vitest", de: "Vitest" },
        { en: "Playwright", de: "Playwright" },
      ],
    },
    {
      title: {
        en: "Network Security / Management",
        de: "Network Security / Management",
      },
      company: "Deutsche Vermögensberatung AG",
      logoUrl: "/logos/dvag.svg",
      period: { en: "Oct 2019 - Present", de: "Okt 2019 - Heute" },
      location: { en: "Frankfurt am Main, Germany", de: "Frankfurt am Main, Deutschland" },
      experienceCategory: "key",
      description: [
        {
          type: "text",
          text: {
            en: "Manage and review network permissions to maintain accurate, secure access controls across the enterprise.",
            de: "Verwaltung und Prüfung von Netzwerkberechtigungen zur Gewährleistung korrekter und sicherer Zugriffskontrollen im Unternehmensnetz.",
          },
        },
        {
          type: "text",
          text: {
            en: "Continuously clean up legacy rules to reduce complexity and ensure compliance with internal policies.",
            de: "Kontinuierliche Bereinigung veralteter Regeln zur Reduktion der Komplexität und zur Einhaltung interner Richtlinien.",
          },
        },
        {
          type: "text",
          text: {
            en: "Support IT projects with network expertise, ensuring architectures align with current topologies and security standards.",
            de: "Unterstützung von IT-Projekten mit Netzwerkwissen, damit Architekturen zu aktuellen Topologien und Sicherheitsstandards passen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Maintain detailed network documentation covering topology, policies, and security protocols.",
            de: "Pflege detaillierter Netzwerkdokumentationen zu Topologie, Richtlinien und Sicherheitsprotokollen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Coordinate change planning and implementation with infrastructure, security, and application teams.",
            de: "Koordination von Planung und Umsetzung von Changes mit Infrastruktur-, Sicherheits- und Applikationsteams.",
          },
        },
        {
          type: "text",
          text: {
            en: "Operate proxy infrastructures and monitor network paths including IPSec tunnels and SD-WAN links.",
            de: "Betrieb von Proxy-Infrastrukturen und Monitoring von Netzwerkpfaden inklusive IPSec-Tunneln und SD-WAN-Verbindungen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Support the introduction of cloud-based security services such as Prisma SSE.",
            de: "Unterstützung bei der Einführung cloudbasierter Sicherheitsdienste wie Prisma SSE.",
          },
        },
        {
          type: "text",
          text: {
            en: "Responsible for Identity & Access Management (IAM) and rights review in enterprise environments",
            de: "Verantwortlich für Identity & Access Management (IAM) und Rechteprüfung im Enterprise-Umfeld",
          },
        },
        {
          type: "text",
          text: {
            en: "Creation and maintenance of security-relevant processes and documentation",
            de: "Erstellung und Pflege sicherheitsrelevanter Prozesse und Dokumentationen",
          },
        },
        {
          type: "text",
          text: {
            en: "Ensuring consistent policy application in complex network and infrastructure environments",
            de: "Sicherstellung konsistenter Policy-Anwendung in komplexen Netzwerk- und Infrastrukturumgebungen",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Reduced firewall rule complexity from 5,000 to fewer than 1,000 entries for greater transparency and performance.",
            de: "Reduktion der Firewall-Regelkomplexität von 5.000 auf unter 1.000 Einträge für mehr Transparenz und Performance.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "migration from Palo Alto to Fortinet, translating complex security policies without service interruption.",
            de: "Migration von Palo Alto zu Fortinet und Übernahme komplexer Sicherheitsrichtlinien ohne Betriebsunterbrechung.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Implementation of IPv6 across the organization, future-proofing the network.",
            de: "Implementierung von IPv6 im gesamten Unternehmen, Zukunftssicherung des Netzwerks.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Rolled out secure SD-WAN connectivity for branch offices, improving stability and visibility of network communication.",
            de: "Ausrollen sicherer SD-WAN-Anbindungen für Außenstandorte zur Verbesserung von Stabilität und Transparenz der Netzwerkkommunikation.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Introduced Microsoft Azure services into the infrastructure while ensuring compliant hybrid connectivity.",
            de: "Einführung von Microsoft-Azure-Diensten in die Infrastruktur bei gleichzeitiger Sicherstellung compliantem hybriden Betrieb.",
          },
        },
      ],
      tags: [
        { en: "Firewall Management", de: "Firewall-Management" },
        { en: "SD-WAN", de: "SD-WAN" },
        { en: "IPSec", de: "IPSec" },
        { en: "Proxy", de: "Proxy" },
        { en: "Azure", de: "Azure" },
        { en: "IPv6", de: "IPv6" },
        { en: "Change Management", de: "Change Management" },
        { en: "Documentation", de: "Dokumentation" },
        { en: "Cloud Security", de: "Cloud Security" },
      ],
    },
    {
      title: {
        en: "AI Training Platform & AI Tools Evaluation",
        de: "KI-Trainingsplattform & Evaluierung von KI-Werkzeugen",
      },
      company: "DEGIT AG",
      logoUrl: "/logos/degit.png",
      period: { en: "Aug 2025 - Oct 2025", de: "Aug 2025 - Okt 2025" },
      location: { en: "Hockenheim, Germany", de: "Hockenheim, Deutschland" },
      experienceCategory: "additional",
      description: [
        {
          type: "text",
          text: {
            en: "Design and implementation of an internal AI training platform for corporate use, focusing on compliance with the EU AI Act and practical enablement of teams.",
            de: "Konzeption und Aufbau einer internen KI-Trainingsplattform für den Unternehmenseinsatz mit Fokus auf EU-AI-Act-Compliance und praxisnahe Befähigung der Teams.",
          },
        },
        {
          type: "text",
          text: {
            en: "Evaluation and decision paper comparing leading AI and automation platforms with regard to data protection, reliability, API integration, and governance readiness.",
            de: "Bewertung und Entscheidungsvorlage zum Vergleich führender KI- und Automatisierungsplattformen hinsichtlich Datenschutz, Zuverlässigkeit, API-Integration und Governance-Tauglichkeit.",
          },
        },
        {
          type: "text",
          text: {
            en: "Assessment of emerging agentic AI workflows for multi-step task orchestration and their integration into enterprise automation environments.",
            de: "Evaluierung aufkommender agentischer KI-Workflows zur mehrstufigen Aufgabenorchestrierung und deren Integration in Unternehmensautomatisierungsumgebungen.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Analyzed and benchmarked: OpenAI ChatGPT, OpenAI Open-Weight GPT-OSS, Microsoft Copilot, Perplexity, Anthropic Claude, Apple Foundation, z.AI GLM, n8n, make.com, Zapier.",
            de: "Analysiert und bewertet: OpenAI ChatGPT, OpenAI Open-Weight GPT-OSS, Microsoft Copilot, Perplexity, Anthropic Claude, Apple Foundation, z.AI GLM, n8n, make.com und Zapier.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Developed a modular learning platform prototype with Supabase and Cloudflare integration, role-based content, and progress tracking.",
            de: "Entwicklung eines modularen Lernplattform-Prototyps mit Supabase- und Cloudflare-Integration, rollenbasierten Inhalten und Fortschrittsverfolgung.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Produced a comparative decision framework supporting the company's AI adoption strategy.",
            de: "Erstellung eines vergleichenden Entscheidungsrahmens zur Unterstützung der KI-Einführungsstrategie des Unternehmens.",
          },
        },
      ],
      tags: [
        { en: "AI Evaluation", de: "KI-Evaluierung" },
        { en: "AI Training", de: "KI-Training" },
        { en: "EU AI Act", de: "EU AI Act" },
        { en: "Supabase", de: "Supabase" },
        { en: "Cloudflare", de: "Cloudflare" },
        { en: "Automation", de: "Automatisierung" },
        { en: "n8n", de: "n8n" },
        { en: "make.com", de: "make.com" },
        { en: "Zapier", de: "Zapier" },
        { en: "OpenAI", de: "OpenAI" },
        { en: "Apple Foundation", de: "Apple Foundation" },
        { en: "Anthropic Claude", de: "Anthropic Claude" },
        { en: "Microsoft Copilot", de: "Microsoft Copilot" },
        { en: "Perplexity", de: "Perplexity" },
        { en: "z.AI GLM", de: "z.AI GLM" },
        { en: "Agentic AI", de: "Agentische KI" },
        { en: "Enterprise Automation", de: "Unternehmensautomatisierung" },
        { en: "Cursor", de: "Cursor" },
        { en: "Claude Code", de: "Claude Code" },
        { en: "OpenAI Codex", de: "OpenAI Codex" },
      ],
    },
    {
      title: {
        en: "Linux Systems Administrator / Nagios Administrator",
        de: "Linux-Systemadministrator / Nagios-Administrator",
      },
      company: "Schwarz IT GmbH & Co. KG",
      logoUrl: "/logos/schwarz.svg",
      period: { en: "Apr 2018 - Dec 2018", de: "Apr 2018 - Dez 2018" },
      location: { en: "Weinsberg, Germany", de: "Weinsberg, Deutschland" },
      experienceCategory: "key",
      description: [
        {
          type: "text",
          text: {
            en: "Operated large-scale environments with 15,000 physical servers and 50,000 virtual machines.",
            de: "Betrieb großskaliger Umgebungen mit 15.000 physischen Servern und 50.000 virtuellen Maschinen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Automated provisioning of servers, applications, and configurations via Puppet and Ansible.",
            de: "Automatisierte Bereitstellung von Servern, Applikationen und Konfigurationen über Puppet und Ansible.",
          },
        },
        {
          type: "text",
          text: {
            en: "Ensured high availability through structured patch management and monitoring.",
            de: "Sicherstellung der Hochverfügbarkeit durch strukturiertes Patchmanagement und Monitoring.",
          },
        },
        {
          type: "text",
          text: {
            en: "Advised projects on secure infrastructure design and integration into existing monitoring processes.",
            de: "Beratung von Projekten zur sicheren Infrastrukturkonzeption und Integration in bestehende Monitoring-Prozesse.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Accelerated server rollout cycles by automating golden-image provisioning and compliance checks.",
            de: "Beschleunigung der Server-Rollouts durch Automatisierung von Golden Images und Compliance-Checks.",
          },
        },
      ],
      tags: [
        { en: "Linux", de: "Linux" },
        { en: "Automation", de: "Automatisierung" },
        { en: "Monitoring", de: "Monitoring" },
        { en: "High Availability", de: "Hochverfügbarkeit" },
        { en: "Puppet", de: "Puppet" },
        { en: "Ansible", de: "Ansible" },
        { en: "IPv6", de: "IPv6" },
      ],
    },
    {
      title: {
        en: "Linux Systems Administrator",
        de: "Linux-Systemadministrator",
      },
      company: "Deutsche Vermögensberatung AG",
      logoUrl: "/logos/dvag.svg",
      period: { en: "Feb 2011 - Dec 2017", de: "Feb 2011 - Dez 2017" },
      location: { en: "Frankfurt am Main, Germany", de: "Frankfurt am Main, Deutschland" },
      experienceCategory: "key",
      description: [
        {
          type: "text",
          text: {
            en: "Administered 1,000 physical servers and 2,000 virtual machines in a highly regulated environment.",
            de: "Administration von 1.000 physischen Servern und 2.000 virtuellen Maschinen in einem stark regulierten Umfeld.",
          },
        },
        {
          type: "text",
          text: {
            en: "Automated server installation and configuration workflows using Puppet and Ansible.",
            de: "Automatisierte Serverinstallationen und Konfigurationsworkflows mit Puppet und Ansible.",
          },
        },
        {
          type: "text",
          text: {
            en: "Operated enterprise email platforms with Dovecot and Postfix including archiving solutions.",
            de: "Betrieb von Enterprise-E-Mail-Plattformen mit Dovecot und Postfix inklusive Archivierungslösungen.",
          },
        },
        {
          type: "text",
          text: {
            en: "Implemented storage solutions such as Ceph and cloud storage for scalable data services.",
            de: "Implementierung von Storage-Lösungen wie Ceph und Cloud Storage für skalierbare Datendienste.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Delivered a mail archiving platform that ensured long-term compliance and simplified eDiscovery.",
            de: "Aufbau einer Mail-Archivierungsplattform, die Langzeit-Compliance sicherstellte und eDiscovery vereinfachte.",
          },
        },
        {
          type: "achievement",
          text: {
            en: "Design and implementation of IPv6 at the network perimeter to ensure external accessibility.",
            de: "Konzeption und Implementierung von IPv6 im Netzwerk-Perimeter zur Sicherstellung der externen Erreichbarkeit.",
          },
        },
      ],
      tags: [
        { en: "Linux", de: "Linux" },
        { en: "Email", de: "E-Mail" },
        { en: "Automation", de: "Automatisierung" },
        { en: "Storage", de: "Storage" },
        { en: "Puppet", de: "Puppet" },
        { en: "Ceph", de: "Ceph" },
        { en: "IPv6", de: "IPv6" },
      ],
    },
  ],
  projects: [
    {
      title: {
        en: "Firewall Rulebase Optimisation",
        de: "Optimierung der Firewall-Regelwerke",
      },
      description: {
        en: "Streamlined enterprise firewall rulebases by analysing 5,000+ objects, consolidating duplicates, and establishing a lifecycle for dormant rules. The result improved performance, readability, and audit readiness.",
        de: "Verschlankung der unternehmensweiten Firewall-Regelwerke durch Analyse von über 5.000 Objekten, Konsolidierung von Dubletten und Einführung eines Lebenszyklus für inaktive Regeln. Das Ergebnis: bessere Performance, Lesbarkeit und Auditfähigkeit.",
      },
      imageUrl: "/projects/firewall.webp",
      imageAlt: {
        en: "Illustration of a firewall dashboard with consolidated rules and compliance checkmarks.",
        de: "Illustration eines Firewall-Dashboards mit konsolidierten Regeln und Compliance-Häkchen.",
      },
      tags: [
        { en: "Firewall", de: "Firewall" },
        { en: "Governance", de: "Governance" },
        { en: "Automation", de: "Automatisierung" },
      ],
    },
    {
      title: {
        en: "Palo Alto to Fortinet Migration",
        de: "Migration von Palo Alto zu Fortinet",
      },
      description: {
        en: "Planned and executed a platform migration, translating complex objects and policies into Fortinet while keeping services online. Introduced new templates for ongoing policy hygiene.",
        de: "Planung und Umsetzung einer Plattformmigration mit Überführung komplexer Objekte und Richtlinien nach Fortinet bei laufendem Betrieb. Einführung neuer Templates für nachhaltige Richtlinienhygiene.",
      },
      imageUrl: "/projects/migration_palo_forti.webp",
      imageAlt: {
        en: "Diagram showing firewall migration steps between vendor platforms with continuous service lines.",
        de: "Diagramm mit Migrationsschritten zwischen Firewall-Plattformen und durchgehenden Service-Linien.",
      },
      tags: [
        { en: "Migration", de: "Migration" },
        { en: "Fortinet", de: "Fortinet" },
        { en: "Change Management", de: "Change Management" },
      ],
    },
    {
      title: {
        en: "SD-WAN Branch Rollout",
        de: "SD-WAN Rollout für Außenstandorte",
      },
      description: {
        en: "Connected branch offices via SD-WAN, defined redundancy concepts, and aligned monitoring to ensure transparent operations across all paths.",
        de: "Anbindung von Außenstandorten per SD-WAN, Definition von Redundanzkonzepten und Abstimmung des Monitorings für transparente Betriebsabläufe über alle Pfade.",
      },
      imageUrl: "/projects/sdwan_rollout.webp",
      imageAlt: {
        en: "Illustration of multiple branch sites linked via SD-WAN connections with redundancy indicators.",
        de: "Illustration mehrerer Außenstandorte, die über SD-WAN-Verbindungen mit Redundanzindikatoren vernetzt sind.",
      },
      tags: [
        { en: "SD-WAN", de: "SD-WAN" },
        { en: "Networking", de: "Netzwerke" },
        { en: "Monitoring", de: "Monitoring" },
      ],
    },
    {
      title: {
        en: "Azure Integration for Hybrid Infrastructure",
        de: "Azure-Integration für hybride Infrastruktur",
      },
      description: {
        en: "Introduced Microsoft Azure services into an on-prem environment, coordinating network connectivity, identity integration, and security baselines.",
        de: "Einführung von Microsoft-Azure-Diensten in eine On-Prem-Umgebung inkl. Koordination von Netzwerkanbindung, Identity-Integration und Sicherheits-Baselines.",
      },
      imageUrl: "/projects/azure_integration.webp",
      imageAlt: {
        en: "Illustration of hybrid cloud connectivity between on-prem infrastructure and Azure services.",
        de: "Illustration einer hybriden Cloud-Anbindung zwischen On-Prem-Infrastruktur und Azure-Diensten.",
      },
      tags: [
        { en: "Azure", de: "Azure" },
        { en: "Hybrid Cloud", de: "Hybride Cloud" },
        { en: "Security", de: "Security" },
      ],
    },
  ],
  skills: [
    // Security
    {
      name: {
        en: "Firewall Engineering (Fortinet, Palo Alto)",
        de: "Firewall Engineering (Fortinet, Palo Alto)",
      },
      icon: ShieldCheck,
      category: "security",
      level: 5,
    },
    {
      name: {
        en: "Proxy Management",
        de: "Proxy-Management",
      },
      icon: Network,
      category: "security",
      level: 4,
    },
    {
      name: {
        en: "Secure Web Gateways",
        de: "Secure Web Gateways",
      },
      icon: Shield,
      category: "security",
      level: 4,
    },
    {
      name: {
        en: "Access Governance",
        de: "Access-Governance",
      },
      icon: KeyRound,
      category: "security",
      level: 4,
    },
    {
      name: {
        en: "Change Governance",
        de: "Change-Governance",
      },
      icon: ClipboardCheck,
      category: "security",
      level: 4,
    },
    {
      name: {
        en: "Incident Management",
        de: "Incident-Management",
      },
      icon: AlertTriangle,
      category: "security",
      level: 4,
    },
    {
      name: {
        en: "Problem Management",
        de: "Problem-Management",
      },
      icon: LifeBuoy,
      category: "security",
      level: 4,
    },

    // Infrastructure
    {
      name: {
        en: "Linux Administration",
        de: "Linux-Administration",
      },
      icon: Terminal,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "Linux Distributions (Debian, Ubuntu, RHEL)",
        de: "Linux-Distributionen (Debian, Ubuntu, RHEL)",
      },
      icon: Server,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "FreeBSD Systems",
        de: "FreeBSD-Systeme",
      },
      icon: SiFreebsd,
      category: "infrastructure",
      level: 3,
    },
    {
      name: {
        en: "Network Appliances",
        de: "Netzwerk-Appliances",
      },
      icon: Router,
      category: "infrastructure",
      level: 3,
    },
    {
      name: {
        en: "High Availability",
        de: "Hochverfügbarkeit",
      },
      icon: ServerCog,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "Redundancy & Failover",
        de: "Redundanz & Failover",
      },
      icon: RefreshCw,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "IPv6 & Routing",
        de: "IPv6 & Routing",
      },
      icon: Network,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "VPN & Secure Connectivity",
        de: "VPN & Sichere Konnektivität",
      },
      icon: Shield,
      category: "infrastructure",
      level: 5,
    },
    {
      name: {
        en: "Monitoring",
        de: "Monitoring",
      },
      icon: Activity,
      category: "infrastructure",
      level: 4,
    },
    {
      name: {
        en: "Troubleshooting",
        de: "Troubleshooting",
      },
      icon: Bug,
      category: "infrastructure",
      level: 4,
    },
    {
      name: {
        en: "Storage Platforms (Ceph)",
        de: "Storage-Plattformen (Ceph)",
      },
      icon: Database,
      category: "infrastructure",
      level: 3,
    },
    {
      name: {
        en: "Cloud Storage & Backup",
        de: "Cloud Storage & Backup",
      },
      icon: Cloud,
      category: "infrastructure",
      level: 3,
    },

    // Tools & Automation
    {
      name: {
        en: "Bash / Shell Scripting",
        de: "Bash / Shell Skripte",
      },
      icon: Terminal,
      category: "tools",
      level: 5,
    },
    {
      name: {
        en: "paperless-ngx",
        de: "paperless-ngx",
      },
      icon: SiPaperlessngx,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Git",
        de: "Git",
      },
      icon: SiGit,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Cursor",
        de: "Cursor",
      },
      icon: MousePointer2,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Python",
        de: "Python",
      },
      icon: SiPython,
      category: "tools",
      level: 3,
    },
    {
      name: {
        en: "Postfix / Dovecot",
        de: "Postfix / Dovecot",
      },
      icon: Mail,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Bind / Unbound",
        de: "Bind / Unbound",
      },
      icon: Globe,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Squid Proxy",
        de: "Squid Proxy",
      },
      icon: Network,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "HAProxy",
        de: "HAProxy",
      },
      icon: Server,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Puppet",
        de: "Puppet",
      },
      icon: SiPuppet,
      category: "tools",
      level: 3,
    },
    {
      name: {
        en: "Docker",
        de: "Docker",
      },
      icon: SiDocker,
      category: "tools",
      level: 4,
    },
    {
      name: {
        en: "Caddy",
        de: "Caddy",
      },
      icon: SiCaddy,
      category: "tools",
      level: 4,
    },

    // Management & Collaboration
    {
      name: {
        en: "Change Management",
        de: "Change Management",
      },
      icon: ListChecks,
      category: "management",
      level: 4,
    },
    {
      name: {
        en: "Cross-team Coordination",
        de: "Teamübergreifende Koordination",
      },
      icon: Users,
      category: "management",
      level: 5,
    },
    {
      name: {
        en: "Stakeholder Communication",
        de: "Stakeholder-Kommunikation",
      },
      icon: Handshake,
      category: "management",
      level: 5,
    },
    {
      name: {
        en: "Technical Documentation",
        de: "Technische Dokumentation",
      },
      icon: FileText,
      category: "management",
      level: 4,
    },

    // AI
    {
      name: {
        en: "AI-assisted Troubleshooting",
        de: "KI-gestütztes Troubleshooting",
      },
      icon: WandSparkles,
      category: "ai",
      level: 5,
    },
    {
      name: {
        en: "Agentic AI",
        de: "Agentische KI",
      },
      icon: Bot,
      category: "ai",
      level: 4,
    },
    {
      name: {
        en: "Multimodal AI",
        de: "Multimodale KI",
      },
      icon: Layers,
      category: "ai",
      level: 5,
    },
    {
      name: {
        en: "Causal AI",
        de: "Kausale KI",
      },
      icon: GitBranch,
      category: "ai",
      level: 4,
    },
    {
      name: {
        en: "Lovable",
        de: "Lovable",
      },
      icon: Heart,
      category: "ai",
      level: 5,
    },
    {
      name: {
        en: "OpenAI / ChatGPT",
        de: "OpenAI / ChatGPT",
      },
      icon: SiOpenai,
      category: "ai",
      level: 5,
    },
    {
      name: {
        en: "Anthropic / Claude",
        de: "Anthropic / Claude",
      },
      icon: SiAnthropic,
      category: "ai",
      level: 4,
    },
    {
      name: {
        en: "Google / Gemini",
        de: "Google / Gemini",
      },
      icon: SiGooglegemini,
      category: "ai",
      level: 4,
    },
    {
      name: {
        en: "xAI / Grok",
        de: "xAI / Grok",
      },
      icon: SiX,
      category: "ai",
      level: 3,
    },
    {
      name: {
        en: "Generative Engine Optimization (GEO)",
        de: "Generative Engine Optimization (GEO)",
      },
      icon: SearchCode,
      category: "ai",
      level: 2,
    },
    {
      name: {
        en: "AI Multimedia Generation",
        de: "KI-Multimediaerzeugung",
      },
      icon: ImagePlay,
      category: "ai",
      level: 3,
    },
    {
      name: {
        en: "AI Ethics & Governance",
        de: "KI-Ethik & Governance",
      },
      icon: Scale,
      category: "ai",
      level: 5,
    },

    // Languages
    {
      name: {
        en: "German (Native)",
        de: "Deutsch (Muttersprache)",
      },
      icon: Flag,
      category: "languages",
      level: 5,
    },
    {
      name: {
        en: "English (B2)",
        de: "Englisch (B2)",
      },
      icon: Flag,
      category: "languages",
      level: 4,
    },
    // Compliance
    {
      name: {
        en: "Regulatory IT Compliance",
        de: "Regulatory Compliance (IT-Compliance)",
      },
      icon: ScrollText,
      category: "compliance",
      level: 4,
    },
    {
      name: {
        en: "Audit-Readiness & Policy Enforcement",
        de: "Audit-Readiness & Policy-Enforcement",
      },
      icon: ShieldCheck,
      category: "compliance",
      level: 4,
    },
    {
      name: {
        en: "Financial Sector Control Environments",
        de: "Kontrollumgebungen im Finanzsektor",
      },
      icon: Landmark,
      category: "compliance",
      level: 4,
    },
  ],
  skillsSection: {
    title: {
      en: "Skills & Technologies",
      de: "Fähigkeiten & Technologien",
    },
    subtitle: {
      en: "The stack I rely on for resilient, compliant infrastructures",
      de: "Der Stack, auf den ich für resiliente und compliance-konforme Infrastrukturen setze",
    },
    categories: {
      security: { en: "Security", de: "Sicherheit" },
      infrastructure: { en: "Infrastructure", de: "Infrastruktur" },
      tools: { en: "Tools & DevOps", de: "Tools & DevOps" },
      ai: { en: "AI", de: "KI" },
      management: { en: "Management", de: "Management" },
      languages: { en: "Languages", de: "Sprachen" },
      compliance: { en: "Compliance", de: "Compliance" },
    },
  },
  contact: {
    title: {
      en: "Get In Touch",
      de: "Kontakt aufnehmen",
    },
    subtitle: {
      en: "Happy to discuss network security, infrastructure, or new collaborations.",
      de: "Gerne im Austausch zu Netzwerksicherheit, Infrastruktur oder neuen Projekten.",
    },
    emailLabel: {
      en: "Email me at",
      de: "E-Mail an",
    },
    email: "christian.erben@degit.de",
    cvemail: "christian.erben@degit.de",
    phoneLabel: {
      en: "Phone",
      de: "Telefon",
    },
    phone: "+49 151 65172525",
    birthday: "06.07.1983",
    homepage: "https://christianerben.eu",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/christian-erben-828a08330/",
      xing: "https://www.xing.com/profile/Christian_Erben",
      freelancermap: "https://www.freelancermap.de/profil/christian-erben",
    },
    formLabels: {
      name: { en: "Name", de: "Name" },
      email: { en: "Email", de: "E-Mail" },
      message: { en: "Message", de: "Nachricht" },
      send: { en: "Send Message", de: "Nachricht senden" },
    },
    formStatus: {
      sentTitle: { en: "Message sent!", de: "Nachricht gesendet!" },
      sentDescription: {
        en: "Thanks for reaching out. I'll get back to you soon.",
        de: "Danke für deine Nachricht. Ich werde mich bald bei dir melden.",
      },
      errorTitle: { en: "Error", de: "Fehler" },
      errorDescription: {
        en: "Failed to send message. Please try again later.",
        de: "Nachricht konnte nicht gesendet werden. Bitte versuche es später noch einmal.",
      },
      sending: { en: "Sending...", de: "Senden..." },
      validation: {
        name: {
          en: "Name must be at least 2 characters long.",
          de: "Name muss mindestens 2 Zeichen lang sein.",
        },
        email: {
          en: "Please enter a valid email address.",
          de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        },
        message: {
          en: "Message must be at least 10 characters long.",
          de: "Nachricht muss mindestens 10 Zeichen lang sein.",
        },
      },
    },
    formPlaceholders: {
      name: { en: "Your name", de: "Dein Name" },
      email: { en: "Your email", de: "Deine E-Mail" },
      message: { en: "Your message", de: "Deine Nachricht" },
    },
    infoTitle: { en: "Direct Contact", de: "Direkter Kontakt" },
    findMeOn: { en: "Find me on", de: "Finde mich auf" },
    infoText: {
      en: "Reach out if you want to discuss firewall governance, network hardening, or infrastructure automation.",
      de: "Melde dich gerne, wenn du Firewall-Governance, Netzwerksicherheit oder Infrastruktur-Automatisierung besprechen möchtest.",
    },
  },
  cv: {
    title: { en: "Resume / CV", de: "Lebenslauf / CV" },
  },
  footer: {
    copyright: {
      en: "© year Christian Erben. All rights reserved.",
      de: "© year Christian Erben. Alle Rechte vorbehalten.",
    },
    links: [
      { label: { en: "Privacy Policy", de: "Datenschutz" }, href: "/privacy" },
      { label: { en: "Imprint", de: "Impressum" }, href: "/imprint" },
    ],
    lastUpdated: {
      en: "Last updated: February 2026",
      de: "Letzte Aktualisierung: Februar 2026",
    },
  },
  imprint: {
    title: {
      en: "Imprint",
      de: "Impressum",
    },
    contactTitle: {
      en: "Contact Information",
      de: "Kontaktinformationen",
    },
    companyName: {
      en: "Christian Erben",
      de: "Christian Erben",
    },
    address: {
      street: {
        en: "Traminerweg 9",
        de: "Traminerweg 9",
      },
      city: {
        en: "68309 Mannheim",
        de: "68309 Mannheim",
      },
      country: {
        en: "Germany",
        de: "Deutschland",
      },
    },
    contactInfoTitle: {
      en: "Contact",
      de: "Kontakt",
    },
    emailLabel: {
      en: "Email",
      de: "E-Mail",
    },
    email: "christian.erben@degit.de",
    phoneLabel: {
      en: "Phone",
      de: "Telefon",
    },
    phone: "+49 151 65172525",
    disclaimerTitle: {
      en: "Disclaimer",
      de: "Haftungsausschluss",
    },
    disclaimer: {
      en: "The operators of linked websites are solely responsible for their content.",
      de: "Für externe Links sind ausschließlich deren Betreiber verantwortlich.",
    },
  },
  privacy: {
    title: {
      en: "Privacy Policy",
      de: "Datenschutzerklärung",
    },
    subtitle: {
      en: "Last updated: May 10, 2025",
      de: "Letzte Aktualisierung: 10. Mai 2025",
    },
    sections: [
      {
        title: {
          en: "Controller",
          de: "Verantwortliche Stelle",
        },
        paragraphs: [
          {
            en: "Responsible for the processing of personal data:",
            de: "Verantwortlich für die Verarbeitung personenbezogener Daten:",
          },
        ],
        list: [
          {
            en: "Christian Erben",
            de: "Christian Erben",
          },
          {
            en: "Traminerweg 9",
            de: "Traminerweg 9",
          },
          {
            en: "68309 Mannheim",
            de: "68309 Mannheim",
          },
          {
            en: "Germany",
            de: "Deutschland",
          },
          {
            en: "Email: christian.erben@degit.de",
            de: "E-Mail: christian.erben@degit.de",
          },
          {
            en: "Phone: +49 151 65172525",
            de: "Telefon: +49 151 65172525",
          },
        ],
      },
      {
        title: {
          en: "Data Protection Officer",
          de: "Datenschutzbeauftragter",
        },
        paragraphs: [
          {
            en: "No Data Protection Officer has been appointed, as this is not required under Art. 37 GDPR.",
            de: "Ein Datenschutzbeauftragter wurde nicht benannt, da dies gemäß Art. 37 DSGVO nicht erforderlich ist.",
          },
        ],
      },
      {
        title: {
          en: "Contact Form",
          de: "Kontaktformular",
        },
        paragraphs: [
          {
            en: "This form processes data (name, e-mail, message) solely to reply to your request. Basis: consent / contract performance (Art. 6 GDPR lit. a & b).",
            de: "Die hier eingegebenen Daten (Name, E-Mail, Nachricht) verwenden wir ausschließlich zur Beantwortung deiner Anfrage. Rechtsgrundlage: Einwilligung und Vertragserfüllung (Art. 6 Abs. 1 lit. a & b DSGVO).",
          },
        ],
      },
      {
        title: {
          en: "Use of Third-Party Services",
          de: "Einsatz von Drittanbieter-Diensten",
        },
        paragraphs: [
          {
            en: "This site is hosted by Cloudflare; I do not have direct access to server logs or your IP address there. For the contact form, I use Resend to send emails. Only the data you enter into the form is forwarded – no other personal data is stored.",
            de: "Diese Seite wird bei Cloudflare gehostet; ich habe dort keinen direkten Zugriff auf Server-Logs oder Deine IP-Adresse. Für das Kontaktformular nutze ich Resend, um E-Mails zu versenden. Es werden nur die von Dir im Formular eingegebenen Daten weitergeleitet – weitere personenbezogene Daten werden nicht gespeichert.",
          },
          {
            en: "Log retention: max. 30 days",
            de: "Log-Aufbewahrung: max. 30 Tage",
          },
        ],
        list: [
          {
            en: "Cloudflare: 101 Townsend St, San Francisco, CA 94107, USA<br />Cloudflare Germany GmbH: Rosental 7, c/o Mindspace, 80331 München, Germany",
            de: "Cloudflare: 101 Townsend St, San Francisco, CA 94107, USA<br />Cloudflare Germany GmbH: Rosental 7, c/o Mindspace, 80331 München, Germany",
            description: {
              en: "Legal basis: legitimate interests (Art. 6(1)(f) GDPR) to ensure website performance and security.<br />Cloudflare is certified under the EU-U.S. Data Privacy Framework and processes data under its principles. See: https://www.cloudflare.com/privacypolicy/.",
              de: "Rechtsgrundlage: berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO) zur Gewährleistung der Performance und Sicherheit der Website.<br />Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert und verarbeitet Daten gemäß dessen Grundsätzen. Details: https://www.cloudflare.com/privacypolicy/.",
            },
          },
          {
            en: "Resend: 2261 Market Street #5039, San Francisco, CA 94114, USA",
            de: "Resend: 2261 Market Street #5039, San Francisco, CA 94114, USA",
            description: {
              en: "Legal basis: performance of a contract (Art. 6(1)(b) GDPR), as Resend sends emails on your behalf.<br />Resend’s DPA includes Standard Contractual Clauses (SCC) for transfers to the US. See: https://resend.com/legal/dpa.",
              de: "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), da Resend E-Mails in deinem Auftrag versendet.<br />Resend nutzt Standardvertragsklauseln (SCC) in ihrem DPA, um den Datentransfer in die USA zu legitimieren. DPA: https://resend.com/legal/dpa.",
            },
          },
        ],
      },
      {
        title: {
          en: "Legal Basis & International Transfers",
          de: "Rechtsgrundlagen & Drittlandsübermittlung",
        },
        paragraphs: [
          {
            en: "Cloudflare processes data under legitimate interests (Art. 6(1)(f) GDPR) and is certified under the EU-US Data Privacy Framework (see https://www.cloudflare.com/privacypolicy).",
            de: "Cloudflare verarbeitet Daten auf Basis berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) und ist nach dem EU-US Data Privacy Framework zertifiziert (siehe https://www.cloudflare.com/privacypolicy).",
          },
          {
            en: "Resend acts on contract performance (Art. 6(1)(b) GDPR) and uses Standard Contractual Clauses for US transfers (see https://resend.com/legal/dpa).",
            de: "Resend handelt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) und nutzt Standardvertragsklauseln für Datenübermittlungen in die USA (siehe https://resend.com/legal/dpa).",
          },
        ],
      },
      {
        title: {
          en: "Cookies and Local Storage",
          de: "Cookies und Local Storage",
        },
        paragraphs: [
          {
            en: "I do not use cookies. Only your language choice and theme preference are stored locally in your browser’s localStorage. The storage of theme preferences and language selection in localStorage is based on legitimate interests (Art. 6(1)(f) GDPR) to enhance user experience. You can clear this at any time in your browser settings.",
            de: "Ich verwende keine Cookies. Lediglich Deine Sprachwahl und Theme-Einstellung werden lokal im localStorage Deines Browsers gespeichert. Die Speicherung von Theme-Einstellungen und Sprachwahl im localStorage beruht auf berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO) zur Verbesserung der Benutzererfahrung. Du kannst diese Daten jederzeit über deine Browser-Einstellungen löschen.",
          },
        ],
      },
      {
        title: {
          en: "External Links",
          de: "Externe Links",
        },
        paragraphs: [
          {
            en: "The site contains links to LinkedIn and Xing. Since I embed no external content, clicking these links may transfer you to the respective platforms, whose privacy policies then apply.",
            de: "Die Seite enthält Links zu LinkedIn und Xing. Da keine externen Inhalte eingebunden sind, wirst du beim Anklicken dieser Links auf die jeweiligen Plattformen weitergeleitet, deren Datenschutzerklärungen dann gelten.",
          },
        ],
      },
      {
        title: {
          en: "Data Security",
          de: "Datensicherheit",
        },
        paragraphs: [
          {
            en: "I take reasonable technical and organizational measures to protect your data against unauthorized access and loss. However, internet-based data transmission can never be 100% secure.",
            de: "Ich ergreife angemessene technische und organisatorische Maßnahmen, um Deine Daten vor unbefugtem Zugriff und Verlust zu schützen. Eine 100%ige Sicherheit bei der Datenübertragung im Internet kann ich jedoch nicht garantieren.",
          },
          {
            en: "Technical and Organisational Measures: this site uses TLS 1.3 (if supported by your browser), access controls with MFA, pseudonymisation/encryption at rest, and regular security audits.",
            de: "Technisch-organisatorische Maßnahmen: diese Seite nutzt TLS 1.3 (falls vom Browser unterstützt), Zugangskontrollen mit MFA, Pseudonymisierung/Verschlüsselung ruhender Daten und regelmäßige Sicherheitsaudits.",
          },
        ],
      },
      {
        title: {
          en: "Data Subject Rights",
          de: "Betroffenenrechte",
        },
        paragraphs: [
          {
            en: "Data subjects have the right to access (Art. 15), rectify (Art. 16), erase (Art. 17), restrict processing (Art. 18), data portability (Art. 20), object (Art. 21), and withdraw consent at any time (Art. 7(3)). These rights can be exercised by contacting christian.erben@degit.de.",
            de: "Betroffene Personen haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21) sowie Widerruf erteilter Einwilligungen (Art. 7 Abs. 3). Diese Rechte können unter christian.erben@degit.de geltend gemacht werden.",
          },
        ],
      },
      {
        title: {
          en: "Supervisory Authority",
          de: "Aufsichtsbehörde",
        },
        paragraphs: [
          {
            en: "You have the right to lodge a complaint with a supervisory authority, e.g.: State Commissioner for Data Protection and Freedom of Information Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart, Germany; Tel. +49 711 615541-0; poststelle@lfdi.bwl.de.",
            de: "Du kannst dich bei einer Aufsichtsbehörde beschweren, z. B.: Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart; Tel. +49 711 615541-0; poststelle@lfdi.bwl.de.",
          },
        ],
      },
      {
        title: {
          en: "Automated Decision-making",
          de: "Automatisierte Entscheidungsfindung",
        },
        paragraphs: [
          {
            en: "No automated decision-making or profiling takes place in these processing operations (Art. 22 GDPR).",
            de: "Es findet keine automatisierte Entscheidungsfindung oder Profiling statt (Art. 22 DSGVO).",
          },
        ],
      },
      {
        title: {
          en: "Changes to This Privacy Policy",
          de: "Änderungen dieser Datenschutzerklärung",
        },
        paragraphs: [
          {
            en: "I may update this Privacy Policy at any time. The current version is published here with the date of last revision.",
            de: "Ich kann diese Datenschutzerklärung jederzeit aktualisieren. Die jeweils aktuelle Version wird hier mit Datum der letzten Änderung veröffentlicht.",
          },
        ],
      },
    ],
  },
  sitemap: {
    title: {
      en: "Sitemap",
      de: "Seitenübersicht",
    },
    description: {
      en: "Here are all the pages on this website:",
      de: "Hier sind alle Seiten dieser Website:",
    },
  },
  llms: {
    title: {
      en: "Overview for AI Agents",
      de: "Übersicht für AI Agents",
    },
  },
  translations: {
    languageSwitch: {
      en: "Switch to English",
      de: "Zu Deutsch wechseln",
    },
    themeSwitch: {
      light: {
        en: "Switch to light theme",
        de: "Zum hellen Design wechseln",
      },
      dark: {
        en: "Switch to dark theme",
        de: "Zum dunklen Design wechseln",
      },
    },
  },
  backToHome: { en: "Back to Home", de: "Zurück zur Startseite" },
  experienceSectionTitle: { en: "Experience", de: "Berufserfahrung" },
  experienceAchievementPrefix: { en: "Achievement:", de: "Erfolg:" },
  moreProjects: {
    en: "Previous projects or references are available upon request.",
    de: "Frühere Projekte oder Referenzen sind auf Anfrage verfügbar.",
  },
  downloadResume: { en: "Download CV", de: "Lebenslauf herunterladen" },
};
