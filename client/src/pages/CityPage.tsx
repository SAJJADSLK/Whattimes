import { useParams, Link } from 'wouter';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { trpc } from '@/lib/trpc';
import { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, Globe, Share2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import {
  setSEOMeta,
  setStructuredData,
  generateCitySchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

// Reference hubs used to build a real, per-city meeting-overlap table.
// This is genuine computed content (not copy/paste boilerplate) because the
// numbers are derived live from each city's actual UTC offset.
const MAJOR_HUBS: Array<{ label: string; timezone: string }> = [
  { label: 'New York', timezone: 'America/New_York' },
  { label: 'London', timezone: 'Europe/London' },
  { label: 'Dubai', timezone: 'Asia/Dubai' },
  { label: 'Singapore', timezone: 'Asia/Singapore' },
  { label: 'Tokyo', timezone: 'Asia/Tokyo' },
];

const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '-');
const unslugify = (value: string) =>
  value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// FIX: the clock hook exposes the offset as minutes on `time.offset`, not as
// a pre-formatted `time.utcOffset` string. Reading a field that never
// existed meant the "UTC Offset" box (and every sentence quoting it) always
// silently rendered blank/N/A. Format it properly here instead.
function formatUtcOffset(offsetMinutes: number | undefined): string {
  if (offsetMinutes === undefined || offsetMinutes === null) return 'N/A';
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return minutes === 0 ? `${sign}${hours}` : `${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

export default function CityPage() {
  const { t } = useTranslation();
  const { country, city } = useParams<{ country: string; city: string }>();
  const [copied, setCopied] = useState(false);

  // Fetch city data (now filtered by country as well as name, see server fix)
  const { data: cityData, isLoading } = trpc.cities.getByName.useQuery(
    { name: city || '', country: country || '' },
    { enabled: !!city && !!country }
  );

  // Get real-time clock
  const { time } = useRealTimeClock(cityData?.timezone || 'UTC');

  // Get sun times
  const { data: sunTimes } = trpc.time.getSunTimes.useQuery(
    {
      latitude: cityData?.latitude || 0,
      longitude: cityData?.longitude || 0,
      timezone: cityData?.timezone || 'UTC',
    },
    { enabled: !!cityData }
  );

  // Real nearby/related cities (same region), used to build genuine internal
  // links instead of the previous permanent "Loading related cities..." stub.
  const { data: regionCities } = trpc.cities.getByRegion.useQuery(
    { region: cityData?.region || '', limit: 50 },
    { enabled: !!cityData?.region }
  );

  const relatedCities = useMemo(() => {
    if (!regionCities || !cityData) return [];
    return regionCities
      .filter((c: any) => c.id !== cityData.id)
      .slice(0, 6);
  }, [regionCities, cityData]);

  // Live meeting-overlap table: for each major hub, compute the actual
  // current time difference and what the city's 9-5 workday looks like
  // in the hub's local time right now.
  const meetingOverlap = useMemo(() => {
    if (!cityData) return [];
    const cityNow = DateTime.now().setZone(cityData.timezone);

    return MAJOR_HUBS.filter((hub) => hub.timezone !== cityData.timezone).map((hub) => {
      const hubNow = DateTime.now().setZone(hub.timezone);
      const diffHours = Math.round(hubNow.offset / 60 - cityNow.offset / 60);

      const workStart = cityNow.set({ hour: 9, minute: 0 }).plus({ hours: diffHours });
      const workEnd = cityNow.set({ hour: 17, minute: 0 }).plus({ hours: diffHours });
      const overlapHours = workEnd.diff(workStart, 'hours').hours;

      let overlapLabel = 'Limited overlap';
      if (Math.abs(diffHours) <= 3) overlapLabel = 'Good overlap';
      else if (Math.abs(diffHours) <= 6) overlapLabel = 'Some overlap';

      return {
        label: hub.label,
        diffHours,
        workStart: workStart.toFormat('h:mm a'),
        workEnd: workEnd.toFormat('h:mm a'),
        overlapLabel,
      };
    });
  }, [cityData]);

  const faqs = useMemo(() => {
    if (!cityData) return [];
    return [
      {
        question: `What time zone is ${cityData.name} in?`,
        answer: `${cityData.name}, ${country ? unslugify(country) : ''} uses the ${cityData.timezone} time zone.`,
      },
      {
        question: `Does ${cityData.name} observe Daylight Saving Time?`,
        answer: time?.isDst
          ? `Yes. ${cityData.name} is currently observing Daylight Saving Time, so its UTC offset is temporarily shifted.`
          : `${cityData.name} is not currently observing Daylight Saving Time. Some regions in this timezone do shift clocks seasonally, so the offset can change across the year.`,
      },
      {
        question: `What is the current UTC offset for ${cityData.name}?`,
        answer: `${cityData.name} is currently at UTC${formatUtcOffset(time?.offset)}. Use the live clock above for the exact current time, since the offset can shift with Daylight Saving Time.`,
      },
    ];
  }, [cityData, country, time]);

  // Unique per-page SEO: title, meta description, canonical, and JSON-LD.
  // Without this, every city page shows Google the same generic homepage
  // title/description instead of a unique one per city.
  useEffect(() => {
    if (!cityData || !country || !city) return;

    const pageUrl = `${SITE_URL}/${country}/${city}`;

    setSEOMeta({
      title: `Current Time in ${cityData.name}, ${unslugify(country)} - Live Clock & Timezone`,
      description: `What time is it in ${cityData.name} right now? Live local time, ${cityData.timezone} timezone details, UTC offset, and sunrise/sunset for ${cityData.name}, ${unslugify(country)}.`,
      url: pageUrl,
      type: 'website',
    });

    const faqSchema = faqs.length ? generateFAQSchema(faqs) : null;

    setStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        (() => {
          const { '@context': _omit, ...schema } = generateCitySchema({
            name: cityData.name,
            country: unslugify(country),
            timezone: cityData.timezone,
            latitude: Number(cityData.latitude),
            longitude: Number(cityData.longitude),
          });
          return schema;
        })(),
        (() => {
          const { '@context': _omit, ...schema } = generateBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: unslugify(country), url: `${SITE_URL}/${country}` },
            { name: cityData.name, url: pageUrl },
          ]);
          return schema;
        })(),
        ...(faqSchema ? [(() => {
          const { '@context': _omit, ...schema } = faqSchema as any;
          return schema;
        })()] : []),
      ],
    });
  }, [cityData, country, city, faqs]);

  const handleCopyTime = () => {
    const timeStr = formatClockTime(time);
    navigator.clipboard.writeText(timeStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-foreground/60">{t('cityPage.loadingCity')}</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('cityPage.notFoundTitle')}</h1>
          <p className="text-foreground/60">{t('cityPage.notFoundDesc', { city, country })}</p>
        </div>
      </div>
    );
  }

  const countryLabel = unslugify(country || cityData.country);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-foreground/60">
            <Link href="/" className="hover:text-accent transition-luxury">{t('nav.home')}</Link>
            <span>/</span>
            <Link href={`/${country}`} className="hover:text-accent transition-luxury">{countryLabel}</Link>
            <span>/</span>
            <span className="text-accent">{cityData.name}</span>
          </div>

          {/* Title */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl lg:text-6xl font-light">
              {t('cityPage.currentTimeIn')} <span className="font-semibold text-accent">{cityData.name}</span>
            </h1>
            <p className="text-lg text-foreground/70">
              {t('cityPage.realTimeClockFor', { city: cityData.name, country: countryLabel })}
            </p>
          </div>

          {/* Large Clock Display */}
          <div className="relative max-w-2xl">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />

            <div className="relative bg-card border border-border rounded-lg p-12 luxury-shadow">
              {/* Art Deco corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

              <div className="space-y-8">
                {/* Time */}
                <div className="text-center space-y-3">
                  <div className="text-7xl font-light font-mono tracking-wider text-foreground">
                    {formatClockTime(time)}
                  </div>
                  <div className="art-deco-divider" />
                  <div className="text-sm font-semibold tracking-widest text-foreground/60 uppercase">
                    {time?.timezone || t('common.loading')}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('home.location')}</span>
                    <p className="text-lg font-semibold">{cityData.name}, {countryLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.timezone')}</span>
                    <p className="text-lg font-mono font-semibold text-accent">{cityData.timezone}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.utcOffset')}</span>
                    <p className="text-lg font-mono font-semibold">{formatUtcOffset(time?.offset)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.coordinates')}</span>
                    <p className="text-sm font-mono">{Number(cityData.latitude).toFixed(2)}°, {Number(cityData.longitude).toFixed(2)}°</p>
                  </div>
                </div>

                {/* Sun Times */}
                {sunTimes && (
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.sunrise')}</span>
                      <p className="text-lg font-mono font-semibold">{sunTimes.sunrise}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.sunset')}</span>
                      <p className="text-lg font-mono font-semibold">{sunTimes.sunset}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <button
                    onClick={handleCopyTime}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-luxury"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? t('cityPage.copied') : t('cityPage.copyTime')}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-luxury">
                    <Share2 className="w-4 h-4" />
                    {t('cityPage.share')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting overlap: real, computed content — not a copy/paste template */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light mb-4">
            Meeting Time Overlap: <span className="font-semibold text-accent">{cityData.name}</span> with Major Hubs
          </h2>
          <p className="text-foreground/70 mb-8 max-w-2xl">
            If you keep a typical 9:00 AM–5:00 PM workday in {cityData.name}, here is how that
            window lines up with other major business hubs right now.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-widest text-foreground/60">
                  <th className="py-3 pr-4">Hub</th>
                  <th className="py-3 pr-4">Time Difference</th>
                  <th className="py-3 pr-4">{cityData.name}'s 9–5, in their local time</th>
                  <th className="py-3">Overlap</th>
                </tr>
              </thead>
              <tbody>
                {meetingOverlap.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium">{row.label}</td>
                    <td className="py-3 pr-4 text-foreground/70">
                      {row.diffHours === 0
                        ? 'Same time'
                        : `${Math.abs(row.diffHours)} hour${Math.abs(row.diffHours) === 1 ? '' : 's'} ${row.diffHours > 0 ? 'ahead of' : 'behind'}`}
                    </td>
                    <td className="py-3 pr-4 font-mono text-sm">{row.workStart} – {row.workEnd}</td>
                    <td className="py-3 text-sm">{row.overlapLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Cities — real nearby cities, not a permanent loading stub */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light mb-12">
            {t('cityPage.otherCitiesIn')} <span className="font-semibold text-accent">{cityData.region}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCities.length === 0 && (
              <div className="minimalist-card">
                <p className="text-foreground/60">No other cities indexed in this region yet.</p>
              </div>
            )}
            {relatedCities.map((c: any) => (
              <Link
                key={c.id}
                href={`/${slugify(c.country)}/${slugify(c.name)}`}
                className="minimalist-card block hover:border-accent transition-luxury"
              >
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-foreground/60">{c.country} · {c.timezone}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 border-t border-border bg-foreground/2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-light mb-6">
              {t('cityPage.aboutCity')} <span className="font-semibold text-accent">{cityData.name}</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              {cityData.population
                ? `With a population of roughly ${Number(cityData.population).toLocaleString()}, `
                : ''}
              {cityData.name} is located in {countryLabel}, and its local time ({cityData.timezone})
              is a common reference point for scheduling calls, flights, and deliveries in and
              out of the {cityData.region} region.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Right now, {cityData.name} is on UTC{formatUtcOffset(time?.offset)}.{' '}
              {time?.isDst
                ? `${cityData.name} is currently observing Daylight Saving Time, so this offset is temporary and will shift back later in the year.`
                : `${cityData.name} is not currently observing Daylight Saving Time. If it does so seasonally, double-check the date when planning calls months in advance.`}
            </p>
          </div>

          {/* Visible FAQ content, mirrored in the FAQPage schema above */}
          <div className="mt-16 space-y-6">
            <h2 className="text-3xl font-light mb-6">Frequently Asked Questions</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold mb-1">{faq.question}</h3>
                <p className="text-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
