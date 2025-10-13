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

export interface ExperienceDescriptionItem {
  type: "text" | "achievement";
  text: LocalizedString;
}

export interface Experience {
  title: LocalizedString;
  company: string;
  period: LocalizedString;
  location: string;
  description: ExperienceDescriptionItem[];
  tags: LocalizedString[];
  logoUrl?: string;
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
  icon: string;
  category:
    | "languages"
    | "management"
    | "security"
    | "infrastructure"
    | "tools"
    | "ai";
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
      LocalizedString | {
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
  experiences: Experience[];
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
  projectsSectionTitle: { en: "Highlighted Projects", de: "Ausgewählte Projekte" },
  navigation: [
    { label: { en: "Home", de: "Start" }, href: "#hero" },
    { label: { en: "About", de: "Über mich" }, href: "#about" },
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
      en: "I bring many years of experience in system administration, particularly in network architecture, design, and the security of redundant network infrastructures. My expertise includes firewall management, the design of secure networks, and in-depth knowledge of exotic protocols and various network products.",
      de: "Ich bringe langjährige Erfahrung im Bereich der Systemadministration mit, insbesondere in der Netzwerk-Architektur und dem Design sowie der Absicherung redundanter Netzwerk-Infrastrukturen. Meine Expertise umfasst das FirewallManagement, die Planung sicherer Netzwerke und tiefgehende Kenntnisse exotischer Protokolle und verschiedener Netzwerkprodukte.",
    },
    ctaPrimary: { en: "Explore my work", de: "Meine Arbeit entdecken" },
    ctaSecondary: { en: "Download CV", de: "Lebenslauf herunterladen" },
    decorativeElements: [
      { position: 107, distance: 90, code: "⚙️ automation" },
      { position: 97, distance: 120, code: "🔥 firewalls" },
      { position: 85, distance: 130, code: "🌐 networks" },
      { position: 55, distance: 95, code: "🧩 communication" },
      { position: 68, distance: 132, code: "☁️ cloud" },
    ],
  },
  about: {
    title: { en: "About Me", de: "Über Mich" },
    paragraphs: [
      {
        en: "I bring nearly two decades of hands-on experience in enterprise IT infrastructure, specialising in the design and safeguarding of complex network environments for financial and retail organisations.",
        de: "Ich bringe fast zwei Jahrzehnte praktische Erfahrung in der Enterprise-IT mit und spezialisiere mich auf die Konzeption und Absicherung komplexer Netzwerkumgebungen für Finanz- und Handelsunternehmen.",
      },
      {
        en: "My day-to-day work revolves around managing firewall landscapes, streamlining change processes, maintaining detailed documentation, and coordinating stakeholders across security, infrastructure, and application teams.",
        de: "Mein Arbeitsalltag dreht sich um die Steuerung komplexer Firewall-Landschaften, die Optimierung von Change-Prozessen, die Pflege detaillierter Dokumentationen und die Koordination von Stakeholdern aus Security-, Infrastruktur- und Applikationsteams.",
      },
      {
        en: "I enjoy automating recurring tasks using tools such as Puppet, Ansible, and shell scripts, and increasingly integrate AI-driven approaches into my daily work - for example, to enhance knowledge management, troubleshoot issues, and optimize processes. I maintain an open mindset toward new technologies and actively evaluate their practical value within enterprise environments, always ensuring that security and compliance requirements are met.",
        de: "Wiederkehrende Aufgaben automatisiere ich mit Tools wie Puppet, Ansible und Shell-Skripten und integriere zunehmend KI-gestützte Ansätze in meinen Arbeitsalltag – etwa zur Wissensaufbereitung, Fehleranalyse und Prozessoptimierung. Neue Technologien betrachte ich grundsätzlich offen und prüfe aktiv deren praktischen Nutzen im Unternehmenskontext, ohne dabei Sicherheits- oder Compliance-Aspekte aus dem Blick zu verlieren.",
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
  experiences: [
    {
      title: { en: "Member of the Board", de: "Vorstandsmitglied" },
      company: "DEGIT AG",
      period: { en: "Apr 2020 - Present", de: "Apr 2020 - Heute" },
      location: "Hockenheim, Germany",
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
            en: "Oversees the design of secure, redundant infrastructures including firewall concepts, VPN solutions, and backup strategies.",
            de: "Überwacht die Konzeption sicherer, redundanter Infrastrukturen einschließlich Firewall-Konzepten, VPN-Lösungen und Backup-Strategien.",
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
      ],
    },
    {
      title: { en: "Network Security / Management", de: "Network Security / Management" },
      company: "Deutsche Vermögensberatung AG",
      period: { en: "Oct 2019 - Present", de: "Okt 2019 - Heute" },
      location: "Frankfurt am Main, Germany",
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
        { en: "Change Management", de: "Change Management" },
        { en: "Documentation", de: "Dokumentation" },
        { en: "Cloud Security", de: "Cloud Security" },
      ],
    },
    {
      title: { en: "Linux Systems Administrator / Nagios Administrator", de: "Linux-Systemadministrator / Nagios-Administrator" },
      company: "Schwarz IT GmbH & Co. KG",
      period: { en: "Apr 2018 - Dec 2018", de: "Apr 2018 - Dez 2018" },
      location: "Weinsberg, Germany",
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
      ],
    },
    {
      title: { en: "Linux Systems Administrator", de: "Linux-Systemadministrator" },
      company: "Deutsche Vermögensberatung AG",
      period: { en: "Feb 2011 - Dec 2017", de: "Feb 2011 - Dez 2017" },
      location: "Frankfurt am Main, Germany",
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
      ],
      tags: [
        { en: "Linux", de: "Linux" },
        { en: "Email", de: "E-Mail" },
        { en: "Automation", de: "Automatisierung" },
        { en: "Storage", de: "Storage" },
        { en: "Puppet", de: "Puppet" },
        { en: "Ceph", de: "Ceph" },
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
      imageUrl: "/projects/firewall.png",
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
      imageUrl: "/projects/migration_palo_forti.png",
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
      imageUrl: "/projects/sdwan_rollout.png",
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
      imageUrl: "/projects/azure_integration.png",
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
      icon: "shield-check",
      category: "security",
      level: 5,
    },
    {
      "name": {
        "en": "Proxy Management",
        "de": "Proxy-Management"
      },
      "icon": "network",
      "category": "security",
      "level": 4
    },
    {
      "name": {
        "en": "Secure Web Gateways",
        "de": "Secure Web Gateways"
      },
      "icon": "shield",
      "category": "security",
      "level": 4
    },
    {
      "name": {
        "en": "Access Governance",
        "de": "Access-Governance"
      },
      "icon": "key-round",
      "category": "security",
      "level": 4
    },
    {
      "name": {
        "en": "Change Governance",
        "de": "Change-Governance"
      },
      "icon": "clipboard-check",
      "category": "security",
      "level": 4
    },
    {
      "name": {
        "en": "Incident Management",
        "de": "Incident-Management"
      },
      "icon": "alert-triangle",
      "category": "security",
      "level": 4
    },
    {
      "name": {
        "en": "Problem Management",
        "de": "Problem-Management"
      },
      "icon": "life-buoy",
      "category": "security",
      "level": 4
    },

    // Infrastructure
    {
      "name": {
        "en": "Linux Administration",
        "de": "Linux-Administration"
      },
      "icon": "terminal",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "Linux Distributions (Debian, Ubuntu, RHEL)",
        "de": "Linux-Distributionen (Debian, Ubuntu, RHEL)"
      },
      "icon": "server",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "FreeBSD Systems",
        "de": "FreeBSD-Systeme"
      },
      "icon": "cpu",
      "category": "infrastructure",
      "level": 3
    },
    {
      "name": {
        "en": "Network Appliances",
        "de": "Netzwerk-Appliances"
      },
      "icon": "router",
      "category": "infrastructure",
      "level": 3
    },
    {
      "name": {
        "en": "High Availability",
        "de": "Hochverfügbarkeit"
      },
      "icon": "server-cog",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "Redundancy & Failover",
        "de": "Redundanz & Failover"
      },
      "icon": "refresh-cw",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "IPv6 & Routing",
        "de": "IPv6 & Routing"
      },
      "icon": "network",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "VPN & Secure Connectivity",
        "de": "VPN & Sichere Konnektivität"
      },
      "icon": "shield",
      "category": "infrastructure",
      "level": 5
    },
    {
      "name": {
        "en": "Monitoring",
        "de": "Monitoring"
      },
      "icon": "activity",
      "category": "infrastructure",
      "level": 4
    },
    {
      "name": {
        "en": "Troubleshooting",
        "de": "Troubleshooting"
      },
      "icon": "bug",
      "category": "infrastructure",
      "level": 4
    },
    {
      "name": {
        "en": "Storage Platforms (Ceph)",
        "de": "Storage-Plattformen (Ceph)"
      },
      "icon": "database",
      "category": "infrastructure",
      "level": 3
    },
    {
      "name": {
        "en": "Cloud Storage & Backup",
        "de": "Cloud Storage & Backup"
      },
      "icon": "cloud",
      "category": "infrastructure",
      "level": 3
    },

    // Tools & Automation
    {
      "name": {
        "en": "Bash / Shell Scripting",
        "de": "Bash / Shell Skripte"
      },
      "icon": "terminal",
      "category": "tools",
      "level": 5
    },
    {
      "name": {
        "en": "paperless-ngx",
        "de": "paperless-ngx"
      },
      "icon": "book-open",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Git",
        "de": "Git"
      },
      "icon": "git-branch",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Cursor",
        "de": "Cursor"
      },
      "icon": "mouse-pointer-2",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Python",
        "de": "Python"
      },
      "icon": "file-code-2",
      "category": "tools",
      "level": 3
    },
    {
      "name": {
        "en": "Postfix / Dovecot",
        "de": "Postfix / Dovecot"
      },
      "icon": "mail",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Bind / Unbound",
        "de": "Bind / Unbound"
      },
      "icon": "globe",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Squid Proxy",
        "de": "Squid Proxy"
      },
      "icon": "network",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "HAProxy",
        "de": "HAProxy"
      },
      "icon": "server",
      "category": "tools",
      "level": 4
    },
    {
      "name": {
        "en": "Puppet",
        "de": "Puppet"
      },
      "icon": "settings",
      "category": "tools",
      "level": 3
    },
    {
      "name": {
        "en": "Docker",
        "de": "Docker"
      },
      "icon": "package",
      "category": "tools",
      "level": 4
    },

    // Management & Collaboration
    {
      name: {
        en: "Change Management",
        de: "Change Management",
      },
      icon: "list-checks",
      category: "management",
      level: 4,
    },
    {
      name: {
        en: "Cross-team Coordination",
        de: "Teamübergreifende Koordination",
      },
      icon: "users",
      category: "management",
      level: 5,
    },
    {
      name: {
        en: "Steakholder-Communication",
        de: "Steakholder-Communication",
      },
      icon: "handshake",
      category: "management",
      level: 5,
    },
    {
      name: {
        en: "Technical Documentation",
        de: "Technische Dokumentation",
      },
      icon: "file-text",
      category: "management",
      level: 4,
    },

    // AI
    {
      name: {
        en: "AI-assisted Troubleshooting",
        de: "KI-gestütztes Troubleshooting",
      },
      icon: "wand-2",
      category: "ai",
      level: 5,
    },
    {
      "name": {
        "en": "Agentic AI",
        "de": "Agentische KI"
      },
      "icon": "bot",
      "category": "ai",
      "level": 4
    },
    {
      "name": {
        "en": "Multimodal AI",
        "de": "Multimodale KI"
      },
      "icon": "layers",
      "category": "ai",
      "level": 5
    },
    {
      "name": {
        "en": "Causal AI",
        "de": "Kausale KI"
      },
      "icon": "git-branch",
      "category": "ai",
      "level": 4
    },
    {
      "name": {
        "en": "Lovable",
        "de": "Lovable"
      },
      "icon": "heart",
      "category": "ai",
      "level": 5
    },
    {
      "name": {
        "en": "OpenAI / ChatGPT",
        "de": "OpenAI / ChatGPT"
      },
      "icon": "bot-message-square",
      "category": "ai",
      "level": 5
    },
    {
      "name": {
        "en": "Anthropic / Claude",
        "de": "Anthropic / Claude"
      },
      "icon": "sparkles",
      "category": "ai",
      "level": 4
    },
    {
      "name": {
        "en": "Google / Gemini",
        "de": "Google / Gemini"
      },
      "icon": "orbit",
      "category": "ai",
      "level": 4
    },
    {
      "name": {
        "en": "xAI / Grok",
        "de": "xAI / Grok"
      },
      "icon": "satellite",
      "category": "ai",
      "level": 3
    },
    {
      "name": {
        "en": "Generative Engine Optimization (GEO)",
        "de": "Generative Engine Optimization (GEO)"
      },
      "icon": "cpu",
      "category": "ai",
      "level": 2
    },
    {
      "name": {
        "en": "AI Multimedia Generation",
        "de": "KI-Multimediaerzeugung"
      },
      "icon": "image-play",
      "category": "ai",
      "level": 3
    },
    {
      "name": {
        "en": "AI Ethics & Governance",
        "de": "KI-Ethik & Governance"
      },
      "icon": "scale",
      "category": "ai",
      "level": 5
    },

    // Languages
    {
      name: {
        en: "German (Native)",
        de: "Deutsch (Muttersprache)",
      },
      icon: "flag",
      category: "languages",
      level: 5,
    },
    {
      name: {
        en: "English (B2)",
        de: "Englisch (B2)",
      },
      icon: "flag",
      category: "languages",
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
    birthday: "29.10.1979",
    homepage: "https://christian-erben.eu",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/christian-erben-828a08330/",
      xing: "https://www.xing.com/profile/Christian_Erben",
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
      en: "Last updated: May 2025",
      de: "Letzte Aktualisierung: Mai 2025",
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
