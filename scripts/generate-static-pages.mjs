import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const BASE_URL = process.env.SITE_URL || 'https://whattime.info';
const OUTPUT_DIR = './client/public/pages';
const ADSENSE_ID = 'ca-pub-3811332485680799';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Connect to database
const sql = postgres(process.env.DATABASE_URL);

/**
 * Generate CSS styling matching the website theme
 */
function generatePageCSS() {
  return `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #1e293b;
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  nav {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
  }

  .logo {
    font-size: 24px;
    font-weight: 700;
    color: #3b82f6;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    list-style: none;
  }

  .nav-links a {
    color: #64748b;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: #3b82f6;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #64748b;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
  }

  .back-btn:hover {
    background: #e2e8f0;
    color: #3b82f6;
  }

  main {
    padding: 48px 20px;
  }

  .hero {
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    color: white;
    border-radius: 16px;
    padding: 48px;
    margin-bottom: 48px;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
  }

  .hero h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .hero p {
    font-size: 18px;
    opacity: 0.95;
    margin-bottom: 8px;
  }

  .clock-display {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 32px;
    margin-top: 32px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .clock-time {
    font-size: 56px;
    font-weight: 700;
    font-family: 'Monaco', monospace;
    margin-bottom: 16px;
  }

  .clock-date {
    font-size: 18px;
    opacity: 0.9;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s;
  }

  .card:hover {
    border-color: #3b82f6;
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
  }

  .card h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
  }

  .card-icon {
    width: 20px;
    height: 20px;
    color: #3b82f6;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    color: #64748b;
    font-weight: 500;
  }

  .info-value {
    color: #1e293b;
    font-weight: 600;
  }

  .cities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .city-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;
  }

  .city-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  .city-card h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .city-card p {
    font-size: 14px;
    color: #64748b;
  }

  .badge {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 8px;
  }

  footer {
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 32px 20px;
    text-align: center;
    color: #64748b;
    margin-top: 48px;
  }

  footer a {
    color: #3b82f6;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 32px;
    }

    .clock-time {
      font-size: 36px;
    }

    .nav-links {
      gap: 12px;
      font-size: 14px;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
`;
}

/**
 * Safe number conversion
 */
function toNumber(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return 0;
}

/**
 * Generate city page HTML
 */
function generateCityPage(city, allCities) {
  const pageUrl = `${BASE_URL}/pages/city-${city.id}.html`;
  const description = `Current time in ${city.name}, ${city.country}. Real-time clock, timezone (${city.timezone}), UTC offset, sunrise/sunset times, and time differences with major cities worldwide.`;
  const keywords = [
    `${city.name} time`,
    `${city.country} time`,
    `${city.timezone}`,
    'world clock',
    'timezone converter',
    'current time',
    'UTC offset',
  ].join(', ');

  // Get nearby cities for comparison
  const nearbyCities = allCities
    .filter(c => c.country === city.country && c.id !== city.id)
    .slice(0, 5);

  const citiesHtml = nearbyCities
    .map(
      c => `
    <a href="city-${c.id}.html" class="city-card">
      <h4>${c.name}</h4>
      <p>${c.country}</p>
      <span class="badge">${c.timezone}</span>
    </a>
  `
    )
    .join('');

  const lat = toNumber(city.latitude).toFixed(4);
  const lon = toNumber(city.longitude).toFixed(4);
  const pop = city.population ? parseInt(city.population).toLocaleString() : 'N/A';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="Chronos">
  <meta name="google-adsense-account" content="${ADSENSE_ID}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="Current Time in ${city.name}, ${city.country} | Chronos">
  <meta property="og:description" content="${description}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Current Time in ${city.name}, ${city.country}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Canonical -->
  <link rel="canonical" href="${pageUrl}">
  
  <title>Current Time in ${city.name}, ${city.country} | Chronos World Clock</title>
  ${generatePageCSS()}
</head>
<body>
  <nav>
    <div class="container">
      <a href="/" class="logo">⏰ Chronos</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/?page=world-clock">World Clock</a></li>
        <li><a href="/?page=countries">Countries</a></li>
      </ul>
    </div>
  </nav>

  <main>
    <a href="/" class="back-btn">← Back to Home</a>
    
    <div class="hero">
      <h1>${city.name}</h1>
      <p>${city.country}</p>
      <p style="font-size: 14px; opacity: 0.8;">Timezone: ${city.timezone}</p>
      <div class="clock-display">
        <div class="clock-time" id="clock">--:--:--</div>
        <div class="clock-date" id="date">Loading...</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>📍 Location</h3>
        <div class="info-row">
          <span class="info-label">City</span>
          <span class="info-value">${city.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Country</span>
          <span class="info-value">${city.country}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Region</span>
          <span class="info-value">${city.region}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Population</span>
          <span class="info-value">${pop}</span>
        </div>
      </div>

      <div class="card">
        <h3>🕐 Timezone</h3>
        <div class="info-row">
          <span class="info-label">Timezone</span>
          <span class="info-value">${city.timezone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Latitude</span>
          <span class="info-value">${lat}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Longitude</span>
          <span class="info-value">${lon}</span>
        </div>
      </div>
    </div>

    ${nearbyCities.length > 0 ? `
    <div>
      <h2 style="margin-bottom: 24px; color: #1e293b;">Other Cities in ${city.country}</h2>
      <div class="cities-grid">
        ${citiesHtml}
      </div>
    </div>
    ` : ''}
  </main>

  <footer>
    <p>&copy; 2024 Chronos World Clock. All rights reserved.</p>
    <p><a href="/">Home</a> | <a href="/?page=world-clock">World Clock</a> | <a href="/?page=countries">Countries</a></p>
  </footer>

  <script>
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      document.getElementById('clock').textContent = hours + ':' + minutes + ':' + seconds;
      document.getElementById('date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    updateClock();
    setInterval(updateClock, 1000);
  </script>
</body>
</html>`;
}

/**
 * Generate country page HTML
 */
function generateCountryPage(country, cities) {
  const pageUrl = `${BASE_URL}/pages/country-${country.replace(/\s+/g, '-').toLowerCase()}.html`;
  const description = `Current time in ${country}. View all cities, timezones, and real-time clocks for ${country}. World clock and timezone converter.`;
  const keywords = [
    `${country} time`,
    'world clock',
    'timezone converter',
    'current time',
    country,
  ].join(', ');

  const citiesHtml = cities
    .slice(0, 12)
    .map(
      c => `
    <a href="city-${c.id}.html" class="city-card">
      <h4>${c.name}</h4>
      <p>${c.timezone}</p>
      <span class="badge">${c.region}</span>
    </a>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="Chronos">
  <meta name="google-adsense-account" content="${ADSENSE_ID}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="Current Time in ${country} | Chronos">
  <meta property="og:description" content="${description}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Current Time in ${country}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Canonical -->
  <link rel="canonical" href="${pageUrl}">
  
  <title>Current Time in ${country} | Chronos World Clock</title>
  ${generatePageCSS()}
</head>
<body>
  <nav>
    <div class="container">
      <a href="/" class="logo">⏰ Chronos</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/?page=world-clock">World Clock</a></li>
        <li><a href="/?page=countries">Countries</a></li>
      </ul>
    </div>
  </nav>

  <main>
    <a href="/?page=countries" class="back-btn">← Back to Countries</a>
    
    <div class="hero">
      <h1>${country}</h1>
      <p style="font-size: 18px; opacity: 0.95;">Explore current time and timezones in ${country}</p>
      <div style="margin-top: 24px; padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">
        <p style="font-size: 16px;"><strong>Total Cities:</strong> ${cities.length}</p>
        <p style="font-size: 16px;"><strong>Timezones:</strong> ${new Set(cities.map(c => c.timezone)).size}</p>
      </div>
    </div>

    <div>
      <h2 style="margin-bottom: 24px; color: #1e293b;">Cities in ${country}</h2>
      <div class="cities-grid">
        ${citiesHtml}
      </div>
      ${cities.length > 12 ? `<p style="margin-top: 24px; text-align: center; color: #64748b;">+ ${cities.length - 12} more cities</p>` : ''}
    </div>
  </main>

  <footer>
    <p>&copy; 2024 Chronos World Clock. All rights reserved.</p>
    <p><a href="/">Home</a> | <a href="/?page=world-clock">World Clock</a> | <a href="/?page=countries">Countries</a></p>
  </footer>
</body>
</html>`;
}

async function generateAllPages() {
  try {
    console.log('🔄 Fetching data from database...');

    // Fetch all cities
    const allCities = await sql`SELECT * FROM cities ORDER BY name`;
    console.log(`✓ Found ${allCities.length} cities`);

    // Fetch all countries
    const countriesResult = await sql`SELECT DISTINCT country FROM cities ORDER BY country`;
    const allCountries = countriesResult.map(r => r.country);
    console.log(`✓ Found ${allCountries.length} countries`);

    // Generate city pages
    console.log('📝 Generating city pages...');
    let cityCount = 0;
    for (const city of allCities) {
      const html = generateCityPage(city, allCities);
      const filename = path.join(OUTPUT_DIR, `city-${city.id}.html`);
      fs.writeFileSync(filename, html);
      cityCount++;
      if (cityCount % 10 === 0) {
        console.log(`  ✓ Generated ${cityCount}/${allCities.length} city pages`);
      }
    }
    console.log(`✓ Generated all ${cityCount} city pages`);

    // Generate country pages
    console.log('📝 Generating country pages...');
    let countryCount = 0;
    for (const country of allCountries) {
      const countryCities = allCities.filter(c => c.country === country);
      const html = generateCountryPage(country, countryCities);
      const filename = path.join(OUTPUT_DIR, `country-${country.replace(/\s+/g, '-').toLowerCase()}.html`);
      fs.writeFileSync(filename, html);
      countryCount++;
      console.log(`  ✓ Generated ${country} (${countryCities.length} cities)`);
    }
    console.log(`✓ Generated all ${countryCount} country pages`);

    console.log('\n✅ Static page generation complete!');
    console.log(`📊 Summary:`);
    console.log(`   - City pages: ${cityCount}`);
    console.log(`   - Country pages: ${countryCount}`);
    console.log(`   - Total pages: ${cityCount + countryCount}`);
    console.log(`   - Output directory: ${OUTPUT_DIR}`);
    console.log(`   - AdSense ID: ${ADSENSE_ID}`);
  } catch (error) {
    console.error('❌ Error generating pages:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run generation
generateAllPages();
