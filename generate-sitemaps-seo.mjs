import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

// Configuration
const BASE_URL = process.env.SITE_URL || 'https://whattime.info';
const PUBLIC_DIR = './client/public';
const MAX_URLS_PER_SITEMAP = 50000; // Google sitemap limit

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Connect to database
const sql = postgres(process.env.DATABASE_URL);

/**
 * Generate XML sitemap from URLs array
 */
function generateSitemap(urls) {
  const urlsXml = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.7'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urlsXml}
</urlset>`;
}

/**
 * Generate sitemap index from multiple sitemap files
 */
function generateSitemapIndex(sitemapUrls) {
  const sitemapsXml = sitemapUrls
    .map(
      (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}

/**
 * Split array into chunks
 */
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function generateAllSitemaps() {
  try {
    console.log('🔄 Fetching data from database...');

    // Fetch all cities
    const allCities = await sql`SELECT id, name, country FROM cities ORDER BY name`;
    console.log(`✓ Found ${allCities.length} cities`);

    // Fetch all countries
    const countriesResult = await sql`SELECT DISTINCT country FROM cities ORDER BY country`;
    const allCountries = countriesResult.map((r) => r.country);
    console.log(`✓ Found ${allCountries.length} countries`);

    const sitemapFiles = [];
    const today = new Date().toISOString().split('T')[0];

    // Main pages
    console.log('📝 Generating main sitemap...');
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
      { url: '/countries', priority: '0.9', changefreq: 'daily' },
    ];

    const mainSitemapUrls = mainPages.map((page) => ({
      loc: `${BASE_URL}${page.url}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    }));

    const mainSitemap = generateSitemap(mainSitemapUrls);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-main.xml'), mainSitemap);
    sitemapFiles.push(`${BASE_URL}/sitemap-main.xml`);
    console.log('✓ Generated sitemap-main.xml');

    // Cities sitemaps (split into chunks if needed)
    console.log('📝 Generating city sitemaps...');
    const citiesUrls = allCities.map((city) => ({
      loc: `${BASE_URL}/city-detail/${encodeURIComponent(city.name.replace(/\s+/g, '_'))}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    }));

    const citiesChunks = chunkArray(citiesUrls, MAX_URLS_PER_SITEMAP);
    citiesChunks.forEach((chunk, index) => {
      const filename =
        citiesChunks.length === 1
          ? 'sitemap-cities.xml'
          : `sitemap-cities-${index + 1}.xml`;
      const sitemap = generateSitemap(chunk);
      fs.writeFileSync(path.join(PUBLIC_DIR, filename), sitemap);
      sitemapFiles.push(`${BASE_URL}/${filename}`);
      console.log(`✓ Generated ${filename} (${chunk.length} cities)`);
    });

    // Countries sitemaps
    console.log('📝 Generating country sitemaps...');
    const countriesUrls = allCountries.map((country) => ({
      loc: `${BASE_URL}/country/${encodeURIComponent(country)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    }));

    const countriesSitemap = generateSitemap(countriesUrls);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-countries.xml'), countriesSitemap);
    sitemapFiles.push(`${BASE_URL}/sitemap-countries.xml`);
    console.log(`✓ Generated sitemap-countries.xml (${allCountries.length} countries)`);

    // Sitemap index
    console.log('📝 Generating sitemap index...');
    const sitemapIndex = generateSitemapIndex(sitemapFiles);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('✓ Generated sitemap.xml (index)');

    // Summary
    console.log('\n✅ SEO Sitemap generation complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Main pages: ${mainPages.length}`);
    console.log(`   - Cities: ${allCities.length}`);
    console.log(`   - Countries: ${allCountries.length}`);
    console.log(`   - Sitemap files: ${sitemapFiles.length}`);
    console.log(`   - Total URLs: ${mainPages.length + allCities.length + allCountries.length}`);
    console.log(`\n🌐 Access sitemaps at:`);
    console.log(`   - Main: ${BASE_URL}/sitemap.xml`);
    console.log(`   - Cities: ${BASE_URL}/sitemap-cities.xml`);
    console.log(`   - Countries: ${BASE_URL}/sitemap-countries.xml`);
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run generation
generateAllSitemaps();
