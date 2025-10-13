const fs = require('fs');
const path = require('path');

const baseUrl = 'https://christianerben.eu'; // Change to your domain

const urls = [
  {
    url: '/',
    files: ['src/pages/Index.tsx', 'src/components/Header.tsx', 'src/components/HeroSection.tsx', 'src/components/AboutSection.tsx', 'src/components/ExperienceSection.tsx', 'src/components/ProjectsSection.tsx', 'src/components/SkillsSection.tsx', 'src/components/ContactSection.tsx', 'src/components/Footer.tsx'],
    priority: 1.0
  },
  {
    url: '/cv',
    files: ['src/pages/CV.tsx', 'src/components/cv/CVDocument.tsx', 'src/components/cv/CVDocumentDocx.tsx'],
    priority: 0.8
  },
  {
    url: '/imprint',
    files: ['src/pages/Imprint.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.5
  },
  {
    url: '/privacy',
    files: ['src/pages/Privacy.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.5
  },
  {
    url: '/sitemap.xml',
    files: ['src/pages/Sitemap.tsx', 'src/pages/Index.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.3
  },
  {
    url: '/llms.txt',
    files: ['src/pages/LLMs.tsx', 'src/pages/Index.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.3
  }
];

function getLatestMtime(files) {
  let latest = 0;
  for (const file of files) {
    try {
      const stats = fs.statSync(path.join(__dirname, '..', file));
      if (stats.mtimeMs > latest) {
        latest = stats.mtimeMs;
      }
    } catch (e) {
      // File might not exist yet, skip
    }
  }
  return latest ? new Date(latest).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, files, priority }) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${getLatestMtime(files)}</lastmod>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
console.log('sitemap.xml generated!');
