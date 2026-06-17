const fs = require('fs');
const path = require('path');

const baseUrl = 'https://christianerben.eu'; // Change to your domain

const urls = [
  {
    url: '/',
    files: ['src/pages/index.tsx', 'src/components/Header.tsx', 'src/components/HeroSection.tsx', 'src/components/AboutSection.tsx', 'src/components/ExperienceSection.tsx', 'src/components/ProjectsSection.tsx', 'src/components/SkillsSection.tsx', 'src/components/ContactSection.tsx', 'src/components/Footer.tsx'],
    priority: 1.0
  },
  {
    url: '/cv',
    files: ['src/pages/cv.tsx', 'src/components/cv/CVDocument.tsx', 'src/components/cv/CVDocumentDocx.tsx'],
    priority: 0.8
  },
  {
    url: '/imprint',
    files: ['src/pages/imprint.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.5
  },
  {
    url: '/privacy',
    files: ['src/pages/privacy.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.5
  },
  {
    url: '/sitemap.xml',
    files: ['src/pages/sitemap.tsx', 'src/pages/index.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.3
  },
  {
    url: '/llms.txt',
    files: ['public/llms.txt', 'scripts/generate-llms.ts', 'src/content/content.ts', 'src/pages/index.tsx', 'src/components/Header.tsx', 'src/components/Footer.tsx'],
    priority: 0.3
  }
];

function pathExistsWithExactCase(file) {
  const segments = file.split('/');
  let current = path.join(__dirname, '..');

  for (const segment of segments) {
    if (!fs.existsSync(current)) {
      return false;
    }

    const entries = fs.readdirSync(current);
    if (!entries.includes(segment)) {
      return false;
    }

    current = path.join(current, segment);
  }

  return fs.existsSync(current);
}

function validateSitemapSources() {
  const missing = urls.flatMap(({ url, files }) =>
    files
      .filter((file) => !pathExistsWithExactCase(file))
      .map((file) => `${url}: ${file}`)
  );

  if (missing.length > 0) {
    throw new Error(`Sitemap source mappings are missing or wrong-case:\n${missing.join('\n')}`);
  }
}

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

function generateSitemapXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, files, priority }) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${getLatestMtime(files)}</lastmod>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`;
}

function writeSitemap() {
  validateSitemapSources();
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), generateSitemapXml());
  console.log('sitemap.xml generated!');
}

if (require.main === module) {
  writeSitemap();
}

module.exports = {
  generateSitemapXml,
  getLatestMtime,
  urls,
  validateSitemapSources,
  writeSitemap,
};
