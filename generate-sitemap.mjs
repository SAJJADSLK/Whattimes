import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://chronosclock-jbvr5r7i.manus.space';
const PUBLIC_DIR = './client/public';

// Main pages
const mainPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/world-clock', priority: '0.9', changefreq: 'daily' },
  { url: '/converter', priority: '0.9', changefreq: 'daily' },
  { url: '/meeting-invite', priority: '0.8', changefreq: 'weekly' },
  { url: '/countdown', priority: '0.8', changefreq: 'weekly' },
  { url: '/dst-tracker', priority: '0.8', changefreq: 'weekly' },
  { url: '/team-dashboard', priority: '0.7', changefreq: 'weekly' },
  { url: '/widget', priority: '0.7', changefreq: 'monthly' },
  { url: '/dashboard', priority: '0.6', changefreq: 'weekly' },
];

// Major cities for city detail pages
const majorCities = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Tokyo',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
  'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney', 'Australia/Melbourne',
  'Pacific/Auckland', 'America/Toronto', 'America/Mexico_City', 'America/Sao_Paulo',
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
];

function generateSitemap(pages) {
  const urls = pages
    .map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urls}
</urlset>`;
}

function generateCitiesSitemap(cities) {
  const urls = cities
    .map(city => `  <url>
    <loc>${BASE_URL}/city/${encodeURIComponent(city)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate main sitemap
const mainSitemap = generateSitemap(mainPages);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), mainSitemap);
console.log('✓ Generated sitemap.xml');

// Generate cities sitemap
const citiesSitemap = generateCitiesSitemap(majorCities);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-cities.xml'), citiesSitemap);
console.log('✓ Generated sitemap-cities.xml');

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-cities.xml</loc>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapIndex);
console.log('✓ Generated sitemap-index.xml');

console.log('\n✅ All sitemaps generated successfully!');
