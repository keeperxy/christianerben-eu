import fs from 'fs/promises';
import path from 'path';
import { siteContent } from '../src/content/content';

type LocalizedValue = { en?: string; de?: string } | string | null | undefined;

// Helper function to format bilingual content
const formatBilingual = (item: LocalizedValue, indent = '') => {
  if (!item) return '';
  if (typeof item === 'string') return `${indent}${item}\n`;
  if (item.en && item.de) {
    return `${indent}[en] ${item.en}\n${indent}[de] ${item.de}\n`;
  }
  return '';
};

async function generateLlmsTxt() {
  try {
    const content = siteContent;
    const today = new Date().toISOString().split('T')[0];
    const domain = 'christianerben.eu'; // Replace if needed

    let llmsTxtContent = `\n# llms.txt for ${domain}\n# This file provides structured information for AI language models.\n# For more information, see https://llmstxt.org/\n# Version 1.0, Generated on ${today}\n\n# --- PERMISSIONS ---\nUser-Agent: *\nAllow: /\n\n# --- METADATA ---\nSitemap: https://${domain}/sitemap.xml\n\n# --- FIELDS ---\n\n[Type]:\n[en] Personal Portfolio & CV\n[de] Persönliches Portfolio & Lebenslauf\n\n[Owner]:\n[en] ${content.siteMetadata.author}\n[de] ${content.siteMetadata.author}\n\n[Published]:\n[en] ${today}\n[de] ${today.split('-').reverse().join('.')}\n\n[Languages]:\n[en] English, German\n[de] Englisch, Deutsch\n\n[Summary]:\n${formatBilingual(content.siteMetadata.description)}\n[Hero-Description]:\n${formatBilingual(content.hero.description)}\n[About-Me]:\n${content.about.paragraphs.map(p => formatBilingual(p)).join('')}\n[Main-Topics]:\n${content.navigation.map(item => `- ${item.label.en} / ${item.label.de}`).join('\n')}\n\n[Keywords]:\n[en] ${[content.siteMetadata.author, ...content.hero.titleElements.map(t => t.en), ...content.skills.slice(0, 10).map(s => s.name.en)].join(', ')}\n[de] ${[content.siteMetadata.author, ...content.hero.titleElements.map(t => t.de), ...content.skills.slice(0, 10).map(s => s.name.de)].join(', ')}\n\n[Site-Structure]:\n[en]\n- /: Homepage with main sections (Hero, About, Security & Compliance, Experience, Projects, Skills, Contact).\n- /cv: Interactive page for viewing and downloading the CV.\n- /imprint: Legal notice.\n- /privacy: Privacy policy.\n- /sitemap: Human-readable sitemap.\n[de]\n- /: Startseite mit den Hauptbereichen (Hero, Über Mich, Security & Compliance, Erfahrung, Projekte, Fähigkeiten, Kontakt).\n- /cv: Interaktive Seite zum Ansehen und Herunterladen des Lebenslaufs.\n- /imprint: Impressum.\n- /privacy: Datenschutzerklärung.\n- /sitemap: Für Menschen lesbare Sitemap.\n\n[Contact]:\n[en] Contact information is available via the contact form on the main page or via email to ${content.contact.email}.\n[de] Kontaktinformationen sind über das Kontaktformular auf der Startseite oder per E-Mail an ${content.contact.email} verfügbar.\n`;

    // Add Security & Compliance / Governance
    llmsTxtContent += '\n# --- SECURITY & COMPLIANCE / GOVERNANCE ---\n';
    llmsTxtContent += `\n[Security-Compliance-Governance]:\n`;
    llmsTxtContent += formatBilingual(content.securityCompliance.title);
    if (content.securityCompliance.subtitle) {
      llmsTxtContent += formatBilingual(content.securityCompliance.subtitle);
    }
    content.securityCompliance.items.forEach(item => {
      llmsTxtContent += `\n[Security-Compliance-Item]:\n`;
      llmsTxtContent += formatBilingual(item.title, '  ');
      item.items.forEach(listItem => {
        llmsTxtContent += formatBilingual(listItem, '  - ');
      });
    });

    // Add Experiences
    llmsTxtContent += '\n# --- EXPERIENCE ---\n';
    content.experiences.forEach(exp => {
        llmsTxtContent += `\n[Experience]:\n`;
        llmsTxtContent += formatBilingual(exp.title, '  ');
        llmsTxtContent += `  [en] Company: ${exp.company}\n  [de] Firma: ${exp.company}\n`;
        llmsTxtContent += formatBilingual(exp.period, '  ');
        exp.description.forEach(desc => {
            llmsTxtContent += formatBilingual(desc.text, `  - `);
        });
    });

    // Add Projects
    llmsTxtContent += '\n# --- PROJECTS ---\n';
    content.projects.forEach(proj => {
        llmsTxtContent += `\n[Project]:\n`;
        llmsTxtContent += formatBilingual(proj.title, '  ');
        llmsTxtContent += formatBilingual(proj.description, '  ');
    });
    
    // Add Skills
    llmsTxtContent += '\n# --- SKILLS ---\n';
    const skillCategories = content.skillsSection
      .categories as Record<string, { en: string; de: string }>;
    for (const [categoryKey, categoryName] of Object.entries(skillCategories)) {
      llmsTxtContent += `\n[Skill-Category: ${categoryName.en} / ${categoryName.de}]:\n`;
      content.skills
        .filter(skill => skill.category === categoryKey)
        .forEach(skill => {
          llmsTxtContent += `  - ${skill.name.en} / ${skill.name.de}\n`;
        });
    }

    const outputPath = path.resolve(process.cwd(), 'public', 'llms.txt');
    await fs.writeFile(outputPath, llmsTxtContent.trim());
    console.log('Successfully generated llms.txt to public/llms.txt');

  } catch (error) {
    console.error('Error generating llms.txt:', error);
    process.exit(1);
  }
}

generateLlmsTxt();
