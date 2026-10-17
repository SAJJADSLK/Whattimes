import { useParams, Link } from 'wouter';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { trpc } from '@/lib/trpc';
import { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, Globe, Share2, Copy, Sun, Moon, Calendar, ArrowRight, Check, Sliders, Info, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import {
  setSEOMeta,
  setStructuredData,
  generateCitySchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdBanner } from '@/components/AdBanner';

const SITE_URL = 'https://www.whattime.info';

const MAJOR_HUBS: Array<{ label: string; timezone: string }> = [
  { label: 'New York', timezone: 'America/New_York' },
  { label: 'London', timezone: 'Europe/London' },
  { label: 'Dubai', timezone: 'Asia/Dubai' },
  { label: 'Singapore', timezone: 'Asia/Singapore' },
  { label: 'Tokyo', timezone: 'Asia/Tokyo' },
  { label: 'Sydney', timezone: 'Australia/Sydney' },
];

const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '-');
const unslugify = (value: string) =>
  value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

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
  const [shared, setShared] = useState(false);
  const [scrubberHour, setScrubberHour] = useState<number>(new Date().getHours());

  // Fetch city data
  const { data: cityData, isLoading } = trpc.cities.getByName.useQuery(
    { name: city || '', country: country || '' },
    { enabled: !!city && !!country }
  );

  // Real-time clock for the city
  const { time } = useRealTimeClock(cityData?.timezone || 'UTC');

  // Visitor's local timezone
  const userTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'UTC';
    }
  }, []);

  // Time difference between city and visitor
  const localDiff = useMemo(() => {
    if (!cityData) return null;
    try {
      const cityDt = DateTime.now().setZone(cityData.timezone);
      const userDt = DateTime.now().setZone(userTimezone);
      const diffHours = Math.round((cityDt.offset - userDt.offset) / 60);
      return {
        diffHours,
        userCity: userTimezone.split('/').pop()?.replace(/_/g, ' ') || userTimezone,
        userTime: userDt.toFormat('h:mm a'),
      };
    } catch (e) {
      return null;
    }
  }, [cityData, userTimezone]);

  // Sun times query
  const { data: sunTimes } = trpc.time.getSunTimes.useQuery(
    {
      latitude: Number(cityData?.latitude) || 0,
      longitude: Number(cityData?.longitude) || 0,
      timezone: cityData?.timezone || 'UTC',
    },
    { enabled: !!cityData }
  );

  // Region cities for cross linking
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

  // Same country cities
  const { data: countryCities } = trpc.cities.getByCountry.useQuery(
    { country: cityData?.country || '' },
    { enabled: !!cityData?.country }
  );

  const sameCountryCities = useMemo(() => {
    if (!countryCities || !cityData) return [];
    return countryCities
      .filter((c: any) => c.id !== cityData.id)
      .slice(0, 6);
  }, [countryCities, cityData]);

  // Meeting overlap calculation
  const meetingOverlap = useMemo(() => {
    if (!cityData) return [];
    const cityNow = DateTime.now().setZone(cityData.timezone);

    return MAJOR_HUBS.filter((hub) => hub.timezone !== cityData.timezone).map((hub) => {
      const hubNow = DateTime.now().setZone(hub.timezone);
      const diffHours = Math.round((hubNow.offset - cityNow.offset) / 60);

      const workStart = cityNow.set({ hour: 9, minute: 0 }).plus({ hours: diffHours });
      const workEnd = cityNow.set({ hour: 17, minute: 0 }).plus({ hours: diffHours });

      let overlapLabel = 'Limited overlap';
      if (Math.abs(diffHours) <= 3) overlapLabel = 'Excellent overlap';
      else if (Math.abs(diffHours) <= 6) overlapLabel = 'Moderate overlap';

      return {
        label: hub.label,
        diffHours,
        workStart: workStart.toFormat('h:mm a'),
        workEnd: workEnd.toFormat('h:mm a'),
        overlapLabel,
      };
    });
  }, [cityData]);

  // FAQs
  const faqs = useMemo(() => {
    if (!cityData) return [];
    const offsetStr = formatUtcOffset(time?.offset);
    return [
      {
        question: `What time is it in ${cityData.name} right now?`,
        answer: `The current exact local time in ${cityData.name}, ${country ? unslugify(country) : cityData.country} is displayed on the live atomic-synchronized clock above, complete with seconds and AM/PM format.`,
      },
      {
        question: `What time zone does ${cityData.name} use?`,
        answer: `${cityData.name} is in the ${cityData.timezone} time zone, which is currently at UTC${offsetStr}.`,
      },
      {
        question: `Does ${cityData.name} observe Daylight Saving Time (DST)?`,
        answer: time?.isDst
          ? `Yes, ${cityData.name} is currently observing Daylight Saving Time (Summer Time). Clocks are shifted forward 1 hour from standard time.`
          : `${cityData.name} is currently on Standard Time. Check the DST section above for details on upcoming seasonal clock changes.`,
      },
      {
        question: `What is the best time to schedule a meeting with someone in ${cityData.name}?`,
        answer: `The standard business window in ${cityData.name} is 9:00 AM to 5:00 PM local time. Use the interactive 24-hour time slider on this page to compare working hours between ${cityData.name} and your local city.`,
      },
    ];
  }, [cityData, country, time]);

  // High-CTR SEO & Schema Markup
  useEffect(() => {
    if (!cityData || !country || !city) return;

    const countryLabel = unslugify(country);
    const pageUrl = `${SITE_URL}/${country}/${city}`;
    const offsetStr = formatUtcOffset(time?.offset);

    // Click-magnet title & description with emojis and exact hooks
    setSEOMeta({
      title: `Exact Time in ${cityData.name}, ${countryLabel} Now — Live Clock (AM/PM) & Time Zone`,
      description: `⏰ Exact current local time in ${cityData.name}, ${countryLabel} right now. Live clock with seconds, ${cityData.timezone} (UTC${offsetStr}), daylight saving status, time difference with your city, and meeting schedule planner.`,
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
            country: countryLabel,
            timezone: cityData.timezone,
            latitude: Number(cityData.latitude),
            longitude: Number(cityData.longitude),
          });
          return schema;
        })(),
        (() => {
          const { '@context': _omit, ...schema } = generateBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: countryLabel, url: `${SITE_URL}/${country}` },
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
  }, [cityData, country, city, faqs, time]);

  const handleCopyTime = () => {
    if (!cityData) return;
    const timeStr = formatClockTime(time);
    const offsetStr = formatUtcOffset(time?.offset);
    const textToCopy = `Current time in ${cityData.name}: ${timeStr} (${cityData.timezone}, UTC${offsetStr}) — via WhatTime.info`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Current time in ${cityData?.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Clock className="w-10 h-10 text-accent mx-auto animate-spin" />
            <p className="text-sm text-foreground/60">Loading exact atomic time...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <MapPin className="w-12 h-12 text-accent mx-auto" />
          <h1 className="text-2xl font-bold">City Not Found</h1>
          <p className="text-sm text-foreground/70">
            We couldn&apos;t find details for &ldquo;{city}&rdquo; in {country ? unslugify(country) : ''}.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/world-clock" className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold">
              Browse World Clock
            </Link>
            <Link href="/" className="px-4 py-2 rounded-lg border border-border text-sm font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const countryLabel = unslugify(country || cityData.country);

  // Computed scrubber time
  const scrubberCityTime = DateTime.now().setZone(cityData.timezone).set({ hour: scrubberHour, minute: 0 });
  const scrubberUserTime = DateTime.now().setZone(userTimezone).set({ hour: scrubberHour, minute: 0 });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-12 lg:py-16 border-b border-border bg-gradient-to-b from-card/50 to-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs text-foreground/60">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/${country}`} className="hover:text-accent transition-colors">{countryLabel}</Link>
              <span>/</span>
              <span className="text-accent font-medium">{cityData.name}</span>
            </nav>

            {/* Title */}
            <div className="space-y-3 mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
                Current Time in <span className="font-bold text-accent">{cityData.name}</span>
              </h1>
              <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
                Exact live clock with seconds, timezone offset, daylight saving information, and meeting overlap for{' '}
                <strong className="text-foreground">{cityData.name}, {countryLabel}</strong>.
              </p>
            </div>

            {/* Time Difference with Visitor's City (HIGH ENGAGEMENT HOOK) */}
            {localDiff && (
              <div className="mb-8 p-4 rounded-xl border border-accent/30 bg-accent/5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/15 text-accent">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground/70">Your local time ({localDiff.userCity}): </span>
                    <strong className="text-foreground font-mono">{localDiff.userTime}</strong>
                    <span className="mx-2 text-foreground/40">&bull;</span>
                    <span className="text-foreground/90 font-medium">
                      {cityData.name} is{' '}
                      {localDiff.diffHours === 0
                        ? 'in the same time zone as you'
                        : `${Math.abs(localDiff.diffHours)} hour${Math.abs(localDiff.diffHours) === 1 ? '' : 's'} ${localDiff.diffHours > 0 ? 'ahead of' : 'behind'} you`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCopyTime}
                  className="text-xs px-3 py-1.5 rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-colors font-medium flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy Time'}
                </button>
              </div>
            )}

            {/* Large Clock Display Card */}
            <div className="relative bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-8 relative">
                {/* Clock Face */}
                <div className="text-center space-y-3">
                  <div className="text-6xl sm:text-7xl lg:text-8xl font-light font-mono tracking-wider text-foreground">
                    {formatClockTime(time)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/60 font-medium">
                    <Globe className="w-4 h-4 text-accent" />
                    <span>{cityData.timezone}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-accent">UTC{formatUtcOffset(time?.offset)}</span>
                    <span>&bull;</span>
                    <span className={time?.isDst ? 'text-amber-500 font-semibold' : 'text-foreground/60'}>
                      {time?.isDst ? 'DST Active' : 'Standard Time'}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border text-center sm:text-left">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider text-foreground/50 uppercase">Country</span>
                    <p className="font-semibold text-sm sm:text-base">{countryLabel}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider text-foreground/50 uppercase">UTC Offset</span>
                    <p className="font-mono font-semibold text-sm sm:text-base text-accent">UTC{formatUtcOffset(time?.offset)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider text-foreground/50 uppercase">Coordinates</span>
                    <p className="font-mono text-xs sm:text-sm text-foreground/80">
                      {Number(cityData.latitude).toFixed(2)}&deg;, {Number(cityData.longitude).toFixed(2)}&deg;
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider text-foreground/50 uppercase">Population</span>
                    <p className="font-semibold text-sm sm:text-base">
                      {cityData.population ? Number(cityData.population).toLocaleString() : 'Major Hub'}
                    </p>
                  </div>
                </div>

                {/* Sun & Moon Times */}
                {sunTimes && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="text-[10px] uppercase text-foreground/50 block">Sunrise</span>
                        <span className="font-mono text-xs font-semibold">{sunTimes.sunrise}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <div>
                        <span className="text-[10px] uppercase text-foreground/50 block">Sunset</span>
                        <span className="font-mono text-xs font-semibold">{sunTimes.sunset}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-accent" />
                      <div>
                        <span className="text-[10px] uppercase text-foreground/50 block">Solar Noon</span>
                        <span className="font-mono text-xs font-semibold">{sunTimes.solarNoon || '12:00 PM'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="text-[10px] uppercase text-foreground/50 block">Day Length</span>
                        <span className="font-mono text-xs font-semibold">{sunTimes.dayLength || '12h 00m'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
                  <button
                    onClick={handleCopyTime}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-xs sm:text-sm hover:bg-accent/90 transition-all shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Exact Time'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-foreground/5 font-semibold text-xs sm:text-sm transition-all"
                  >
                    <Share2 className="w-4 h-4 text-accent" />
                    {shared ? 'Link Copied!' : 'Share Page'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 24-HOUR WORLD TIME SLIDER (STICKY ENGAGEMENT FEATURE) */}
        <section className="py-14 border-b border-border bg-card/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Interactive Meeting Planner
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Compare Hours: {cityData.name} vs World
                </h2>
                <p className="text-xs sm:text-sm text-foreground/70">
                  Drag the slider or click any hour to preview simultaneous local times across international business hubs.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Business (9am-5pm)
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-2" /> Extended
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block ml-2" /> Night
              </div>
            </div>

            {/* 24-hour visual bar */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
                {Array.from({ length: 24 }).map((_, h) => {
                  const isSelected = h === scrubberHour;
                  const isWorkHour = h >= 9 && h <= 17;
                  const isExtended = (h >= 7 && h < 9) || (h > 17 && h <= 21);

                  let bgClass = 'bg-foreground/5 hover:bg-foreground/15 text-foreground/60';
                  if (isSelected) bgClass = 'bg-accent text-accent-foreground font-bold shadow-md ring-2 ring-accent';
                  else if (isWorkHour) bgClass = 'bg-green-500/15 text-green-700 dark:text-green-300 hover:bg-green-500/25';
                  else if (isExtended) bgClass = 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25';

                  const label = h === 0 ? '12a' : h === 12 ? '12p' : h > 12 ? `${h - 12}p` : `${h}a`;

                  return (
                    <button
                      key={h}
                      onClick={() => setScrubberHour(h)}
                      className={`h-12 rounded flex flex-col items-center justify-center text-[10px] transition-all cursor-pointer ${bgClass}`}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant conversion output table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-[10px] uppercase text-foreground/50 block font-semibold">{cityData.name} Time</span>
                <span className="text-base font-bold font-mono text-accent">
                  {scrubberCityTime.toFormat('h:00 a')}
                </span>
                <span className="text-[11px] text-foreground/60 block mt-0.5">
                  {scrubberHour >= 9 && scrubberHour <= 17 ? '🟢 Normal Workday' : scrubberHour >= 22 || scrubberHour <= 6 ? '💤 Night / Sleep' : '🟡 Outside Hours'}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-[10px] uppercase text-foreground/50 block font-semibold">Your Time ({localDiff?.userCity || 'Local'})</span>
                <span className="text-base font-bold font-mono">
                  {scrubberUserTime.toFormat('h:00 a')}
                </span>
                <span className="text-[11px] text-foreground/60 block mt-0.5">
                  {localDiff?.diffHours ? `${Math.abs(localDiff.diffHours)}h ${localDiff.diffHours > 0 ? 'behind' : 'ahead'}` : 'Same hour'}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-[10px] uppercase text-foreground/50 block font-semibold">London (GMT/BST)</span>
                <span className="text-base font-bold font-mono">
                  {DateTime.now().setZone('Europe/London').set({ hour: scrubberHour, minute: 0 }).toFormat('h:00 a')}
                </span>
                <span className="text-[11px] text-foreground/60 block mt-0.5">Europe Hub</span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-[10px] uppercase text-foreground/50 block font-semibold">Tokyo (JST)</span>
                <span className="text-base font-bold font-mono">
                  {DateTime.now().setZone('Asia/Tokyo').set({ hour: scrubberHour, minute: 0 }).toFormat('h:00 a')}
                </span>
                <span className="text-[11px] text-foreground/60 block mt-0.5">Asia-Pacific Hub</span>
              </div>
            </div>
          </div>
        </section>

        {/* AD PLACEMENT: Responsive, Policy-Compliant Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner slot="9876543210" className="my-8" />
        </div>

        {/* MEETING OVERLAP TABLE */}
        <section className="py-12 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-3">
              Standard 9–5 Workday Overlap: {cityData.name} vs Global Centers
            </h2>
            <p className="text-sm text-foreground/70 mb-6 max-w-2xl">
              When keeping a standard 9:00 AM to 5:00 PM business schedule in {cityData.name}, here is how those working hours convert into local time for other international headquarters.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground/60 bg-foreground/5">
                    <th className="py-3 px-4 font-semibold">Global Financial Hub</th>
                    <th className="py-3 px-4 font-semibold">Time Difference</th>
                    <th className="py-3 px-4 font-semibold">{cityData.name}&apos;s 9&ndash;5 In Their Local Time</th>
                    <th className="py-3 px-4 font-semibold">Calling Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {meetingOverlap.map((row) => (
                    <tr key={row.label} className="hover:bg-foreground/2 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">{row.label}</td>
                      <td className="py-3.5 px-4 text-foreground/75">
                        {row.diffHours === 0
                          ? 'Same time'
                          : `${Math.abs(row.diffHours)} hour${Math.abs(row.diffHours) === 1 ? '' : 's'} ${row.diffHours > 0 ? 'ahead' : 'behind'}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">{row.workStart} &ndash; {row.workEnd}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          row.overlapLabel.includes('Excellent')
                            ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                            : row.overlapLabel.includes('Moderate')
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-foreground/10 text-foreground/60'
                        }`}>
                          {row.overlapLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* OTHER CITIES IN SAME COUNTRY & REGION (INTERNAL CROSS-LINKING) */}
        <section className="py-12 border-b border-border bg-card/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {sameCountryCities.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">
                    Other Major Cities in <span className="text-accent">{countryLabel}</span>
                  </h3>
                  <Link href={`/${country}`} className="text-xs text-accent hover:underline font-semibold flex items-center gap-1">
                    View all {countryLabel} cities <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {sameCountryCities.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/${slugify(c.country)}/${slugify(c.name)}`}
                      className="p-3 rounded-lg border border-border bg-card hover:border-accent hover:shadow-sm transition-all text-center group"
                    >
                      <p className="font-semibold text-xs group-hover:text-accent transition-colors">{c.name}</p>
                      <p className="text-[10px] text-foreground/50 mt-0.5">{c.timezone.split('/').pop()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedCities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Nearby Cities in <span className="text-accent">{cityData.region}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {relatedCities.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/${slugify(c.country)}/${slugify(c.name)}`}
                      className="p-3 rounded-lg border border-border bg-card hover:border-accent hover:shadow-sm transition-all text-center group"
                    >
                      <p className="font-semibold text-xs group-hover:text-accent transition-colors">{c.name}</p>
                      <p className="text-[10px] text-foreground/50 mt-0.5">{c.country}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* AUTHORITATIVE TIME EXPLAINER & FAQ (RICH SNIPPETS) */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-foreground/80 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                About Local Time in {cityData.name}, {countryLabel}
              </h2>
              <p>
                {cityData.population
                  ? `With an estimated metropolitan population of ${Number(cityData.population).toLocaleString()}, `
                  : ''}
                {cityData.name} is an important commercial, cultural, and logistics center in {countryLabel}.
                Its local standard time is anchored to the <strong>{cityData.timezone}</strong> IANA identifier,
                currently operating at an offset of <strong>UTC{formatUtcOffset(time?.offset)}</strong>.
              </p>
              <p>
                {time?.isDst
                  ? `${cityData.name} is currently observing Daylight Saving Time (DST). During this period, civil clocks are advanced by one hour to increase evening daylight hours.`
                  : `${cityData.name} is currently operating on Standard Time. When scheduling cross-border communications, always confirm whether your destination has recently adjusted its clocks for seasonal daylight shifts.`}
              </p>
            </article>

            {/* Accordion FAQs */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group border border-border rounded-xl p-4 bg-card [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm sm:text-base text-foreground">
                      <span>{faq.question}</span>
                      <span className="text-accent group-open:rotate-180 transition-transform text-lg">&darr;</span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-foreground/75 leading-relaxed pt-2 border-t border-border/50">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
