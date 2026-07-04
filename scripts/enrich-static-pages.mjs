import fs from 'fs';
import path from 'path';

const PAGES_DIR = './client/public/pages';

// Reference hub cities used for "meeting time overlap" content.
// These are genuinely useful comparison points for a global audience.
const HUBS = [
  { label: 'New York (ET)', tz: 'America/New_York' },
  { label: 'London (GMT/BST)', tz: 'Europe/London' },
  { label: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Singapore (SGT)', tz: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { label: 'Sydney (AEST/AEDT)', tz: 'Australia/Sydney' },
];

function getOffsetMinutes(timeZone, date) {
  // Uses Intl to compute the true UTC offset (in minutes) for a timezone at a given instant.
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(date).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUTC = Date.UTC(
    parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day),
    parseInt(parts.hour === '24' ? '0' : parts.hour), parseInt(parts.minute), parseInt(parts.second)
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

function formatOffset(mins) {
  const sign = mins >= 0 ? '+' : '-';
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

function getTimeZoneAbbrev(timeZone, date) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
    const part = dtf.formatToParts(date).find(p => p.type === 'timeZoneName');
    return part ? part.value : '';
  } catch {
    return '';
  }
}

function observesDST(timeZone) {
  const now = new Date();
  const jan = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const jul = new Date(Date.UTC(now.getUTCFullYear(), 6, 1));
  const janOffset = getOffsetMinutes(timeZone, jan);
  const julOffset = getOffsetMinutes(timeZone, jul);
  return janOffset !== julOffset;
}

function buildOverlapRow(cityTz, hub) {
  const now = new Date();
  const cityOffset = getOffsetMinutes(cityTz, now);
  const hubOffset = getOffsetMinutes(hub.tz, now);
  const diffHours = (cityOffset - hubOffset) / 60;

  // Standard workday reference: 9:00-17:00 local time at the city.
  // Compute what that window looks like in the hub's local time.
  const startInHub = (9 - diffHours + 24) % 24;
  const endInHub = (17 - diffHours + 24) % 24;

  const fmt = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    const period = hh >= 12 ? 'PM' : 'AM';
    let hour12 = hh % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${String(mm).padStart(2, '0')} ${period}`;
  };

  let overlapHours;
  if (startInHub < endInHub) {
    overlapHours = Math.max(0, Math.min(endInHub, 17) - Math.max(startInHub, 9));
  } else {
    // window wraps past midnight in hub time
    overlapHours = Math.max(0, 17 - Math.max(startInHub, 9)) + Math.max(0, Math.min(endInHub, 17) - 0);
  }

  let quality;
  if (overlapHours >= 4) quality = 'Good overlap';
  else if (overlapHours >= 1) quality = 'Limited overlap';
  else quality = 'Little to no overlap';

  const diffLabel = diffHours === 0
    ? 'same time'
    : `${diffHours > 0 ? diffHours : -diffHours} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'ahead of' : 'behind'}`;

  return { label: hub.label, diffLabel, startInHub: fmt(startInHub), endInHub: fmt(endInHub), quality };
}

function buildCityContent(city) {
  const { name, country, region, timezone, population } = city;
  const now = new Date();
  const offsetMins = getOffsetMinutes(timezone, now);
  const offsetStr = formatOffset(offsetMins);
  const abbrev = getTimeZoneAbbrev(timezone, now);
  const dst = observesDST(timezone);

  const overlaps = HUBS.filter(h => h.tz !== timezone).slice(0, 5).map(h => buildOverlapRow(timezone, h));

  const overlapRows = overlaps.map(o => `
        <tr>
          <td>${o.label}</td>
          <td>${o.diffLabel}</td>
          <td>${o.startInHub} – ${o.endInHub}</td>
          <td><span class="overlap-tag">${o.quality}</span></td>
        </tr>`).join('');

  const dstSentence = dst
    ? `${name} observes Daylight Saving Time, so its UTC offset shifts by an hour for part of the year. The offset shown above (${offsetStr}) reflects the current date; double-check the season when planning calls months in advance.`
    : `${name} does not observe Daylight Saving Time. Its UTC offset of ${offsetStr} stays fixed year-round, which makes it a stable reference point when coordinating with regions that do shift their clocks.`;

  const popSentence = population && population !== 'N/A'
    ? `With a population of roughly ${population}, ${name} is one of the larger population centers in ${country}, and its local time (${timezone}) is a common reference point for scheduling calls, flights, and deliveries in and out of the ${region} region.`
    : `${name}, ${country} sits in the ${region} region and uses the ${timezone} timezone as its local reference for scheduling calls, flights, and deliveries.`;

  return `
    <section class="content-section">
      <h2>About Time in ${name}</h2>
      <p>${popSentence}</p>
      <p>Right now, ${name} is on ${abbrev ? `<strong>${abbrev}</strong> (` : ''}${offsetStr}${abbrev ? ')' : ''}. ${dstSentence}</p>
    </section>

    <section class="content-section">
      <h2>Meeting Time Overlap: ${name} with Major Hubs</h2>
      <p>If you keep a typical 9:00 AM–5:00 PM workday in ${name}, here is how that window lines up with other major business hubs right now:</p>
      <table class="overlap-table">
        <thead>
          <tr><th>Hub</th><th>Time Difference</th><th>${name}'s 9–5 workday, in their local time</th><th>Overlap</th></tr>
        </thead>
        <tbody>${overlapRows}
        </tbody>
      </table>
    </section>

    <section class="content-section">
      <h2>Frequently Asked Questions</h2>
      <details>
        <summary>What time zone is ${name} in?</summary>
        <p>${name}, ${country} uses the ${timezone} time zone, currently ${offsetStr}${abbrev ? ` (${abbrev})` : ''}.</p>
      </details>
      <details>
        <summary>Does ${name} observe Daylight Saving Time?</summary>
        <p>${dst ? `Yes. ${name} shifts its clocks for Daylight Saving Time, so its UTC offset changes across the year.` : `No. ${name} keeps the same UTC offset (${offsetStr}) throughout the year.`}</p>
      </details>
      <details>
        <summary>What is the current UTC offset for ${name}?</summary>
        <p>${name} is currently at ${offsetStr}. Use the live clock above for the exact current time.</p>
      </details>
    </section>`;
}

function buildCountryContent(country, cities) {
  const uniqueTz = [...new Set(cities.map(c => c.timezone))];
  const spansMultiple = uniqueTz.length > 1;
  const now = new Date();
  const offsets = uniqueTz.map(tz => ({ tz, offset: getOffsetMinutes(tz, now) }));
  offsets.sort((a, b) => a.offset - b.offset);
  const spanHours = offsets.length > 1
    ? Math.round(((offsets[offsets.length - 1].offset - offsets[0].offset) / 60) * 10) / 10
    : 0;

  const dstAny = uniqueTz.some(tz => observesDST(tz));

  const spanSentence = spansMultiple
    ? `${country} spans ${uniqueTz.length} distinct time zones, with local clocks differing by up to ${spanHours} hour${spanHours !== 1 ? 's' : ''} between its easternmost and westernmost tracked cities. When scheduling anything nationwide, check the specific city rather than assuming a single "${country} time."`
    : `${country} uses a single time zone (${uniqueTz[0]}) across the cities tracked here, so scheduling within the country is straightforward — no internal time differences to account for.`;

  const dstSentence = dstAny
    ? `At least one region in ${country} observes Daylight Saving Time, so offsets can shift by an hour depending on the time of year.`
    : `None of the tracked time zones in ${country} observe Daylight Saving Time, so offsets stay fixed year-round.`;

  return `
    <section class="content-section">
      <h2>Time Zones in ${country}</h2>
      <p>${spanSentence}</p>
      <p>${dstSentence} This page tracks ${cities.length} ${cities.length === 1 ? 'city' : 'cities'} in ${country}; use the list below to jump to a specific city's live clock and detailed timezone breakdown.</p>
    </section>`;
}

const EXTRA_CSS = `
<style>
  .content-section { max-width: 900px; margin: 0 0 40px 0; }
  .content-section h2 { font-size: 22px; margin-bottom: 12px; color: #1e293b; }
  .content-section p { margin-bottom: 12px; color: #334155; }
  .overlap-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
  .overlap-table th, .overlap-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  .overlap-table th { background: #f1f5f9; font-weight: 600; color: #334155; }
  .overlap-tag { background: #dbeafe; color: #1e40af; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  details { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; }
  details summary { font-weight: 600; cursor: pointer; color: #1e293b; }
  details p { margin-top: 10px; margin-bottom: 0; }
</style>
`;

function extractField(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

function enrichCityPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  if (html.includes('class="content-section"')) return false; // already enriched

  const name = extractField(html, /<h1>([^<]+)<\/h1>/);
  const country = extractField(html, /<h1>[^<]+<\/h1>\s*<p>([^<]+)<\/p>/);
  const timezone = extractField(html, /Timezone: ([^<]+)<\/p>/);
  const region = extractField(html, /Region<\/span>\s*<span class="info-value">([^<]+)</);
  const population = extractField(html, /Population<\/span>\s*<span class="info-value">([^<]+)</);

  if (!name || !timezone) return false;

  const contentHtml = buildCityContent({ name, country, region, timezone, population });

  // Insert extra CSS before </head>
  html = html.replace('</head>', `${EXTRA_CSS}</head>`);

  // Insert new content sections right after the info grid, before the "Other Cities" block (or before </main>)
  if (html.includes('<div>\n      <h2 style="margin-bottom: 24px; color: #1e293b;">Other Cities')) {
    html = html.replace(
      '<div>\n      <h2 style="margin-bottom: 24px; color: #1e293b;">Other Cities',
      `${contentHtml}\n\n    <div>\n      <h2 style="margin-bottom: 24px; color: #1e293b;">Other Cities`
    );
  } else {
    html = html.replace('</main>', `${contentHtml}\n  </main>`);
  }

  // Fix footer year
  html = html.replace('&copy; 2024', '&copy; 2026');

  fs.writeFileSync(filePath, html);
  return true;
}

function enrichCountryPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  if (html.includes('class="content-section"')) return false;

  const country = extractField(html, /<h1>([^<]+)<\/h1>/);
  if (!country) return false;

  // Pull city name + timezone pairs from the city-card links
  const cityMatches = [...html.matchAll(/<h4>([^<]+)<\/h4>\s*<p>([^<]+)<\/p>/g)];
  const cities = cityMatches.map(m => ({ name: m[1], timezone: m[2] }));
  if (cities.length === 0) return false;

  const contentHtml = buildCountryContent(country, cities);

  html = html.replace('</head>', `${EXTRA_CSS}</head>`);
  html = html.replace(
    '<div>\n      <h2 style="margin-bottom: 24px; color: #1e293b;">Cities in',
    `${contentHtml}\n\n    <div>\n      <h2 style="margin-bottom: 24px; color: #1e293b;">Cities in`
  );
  html = html.replace('&copy; 2024', '&copy; 2026');

  fs.writeFileSync(filePath, html);
  return true;
}

function run() {
  const files = fs.readdirSync(PAGES_DIR);
  let cityCount = 0, countryCount = 0, skipped = 0;

  for (const file of files) {
    const fp = path.join(PAGES_DIR, file);
    if (file.startsWith('city-') && file.endsWith('.html')) {
      if (enrichCityPage(fp)) cityCount++; else skipped++;
    } else if (file.startsWith('country-') && file.endsWith('.html')) {
      if (enrichCountryPage(fp)) countryCount++; else skipped++;
    }
  }

  console.log(`Enriched ${cityCount} city pages and ${countryCount} country pages. Skipped ${skipped}.`);
}

run();
