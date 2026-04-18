import { siteContent } from "@/content/content";

const normalizeMarkdown = (content: string) => `${content.trim()}\n`;

const countMarkdownTokens = (content: string) => {
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    return 0;
  }

  return normalizedContent.split(/\s+/u).length;
};

export const renderHomepageMarkdown = () => {
  const heroTitle = siteContent.hero.titleElements.map((item) => item.en).join(" | ");
  const aboutParagraphs = siteContent.about.paragraphs.map((paragraph) => paragraph.en).join("\n\n");
  const securityItems = siteContent.securityCompliance.items
    .map(
      (item) =>
        `### ${item.title.en}\n${item.items.map((entry) => `- ${entry.en}`).join("\n")}`,
    )
    .join("\n\n");
  const highlightedProjects = siteContent.projects
    .slice(0, 5)
    .map((project) => `- **${project.title.en}**: ${project.description.en}`)
    .join("\n");
  const coreSkills = siteContent.skills.slice(0, 12).map((skill) => `- ${skill.name.en}`).join("\n");
  const markdown = normalizeMarkdown(`
---
title: ${siteContent.siteMetadata.title}
description: ${siteContent.siteMetadata.description.en}
---

# ${siteContent.hero.name}

${heroTitle}

${siteContent.hero.description.en}

## About Me

${aboutParagraphs}

## Security & Compliance / Governance

${securityItems}

## Experience

${siteContent.experienceSectionTitle.en}

## Highlighted Projects

${highlightedProjects}

## Skills

${coreSkills}

## Contact

- Email: ${siteContent.contact.email}
- Homepage: ${siteContent.contact.homepage ?? "https://christianerben.eu"}
- CV: /cv
- Sitemap: /sitemap
- LLMs: /llms.txt
  `);

  return {
    markdown,
    tokenCount: countMarkdownTokens(markdown),
  };
};
