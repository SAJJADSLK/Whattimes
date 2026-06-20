import { useParams } from 'wouter';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Globe, Zap, Share2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  setSEOMeta,
  setStructuredData,
  generateCitySchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function CityPage() {
  const { t } = useTranslation();
  const { country, city } = useParams<{ country: string; city: string }>();
  const [copied, setCopied] = useState(false);

  // Fetch city data
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

  // Unique per-page SEO: title, meta description, canonical, and JSON-LD.
  // Without this, every city page shows Google the same generic homepage
  // title/description instead of a unique one per city.
  useEffect(() => {
    if (!cityData || !country || !city) return;

    const pageUrl = `${SITE_URL}/${country}/${city}`;

    setSEOMeta({
      title: `Current Time in ${cityData.name}, ${country} - Live Clock & Timezone`,
      description: `What time is it in ${cityData.name} right now? Live local time, ${cityData.timezone} timezone details, UTC offset, and sunrise/sunset for ${cityData.name}, ${country}.`,
      url: pageUrl,
      type: 'website',
    });

    setStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        (() => {
          const { '@context': _omit, ...schema } = generateCitySchema({
            name: cityData.name,
            country,
            timezone: cityData.timezone,
            latitude: Number(cityData.latitude),
            longitude: Number(cityData.longitude),
          });
          return schema;
        })(),
        (() => {
          const { '@context': _omit, ...schema } = generateBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: country, url: `${SITE_URL}/${country}` },
            { name: cityData.name, url: pageUrl },
          ]);
          return schema;
        })(),
      ],
    });
  }, [cityData, country, city]);

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
            <a href="/" className="hover:text-accent transition-luxury">{t('nav.home')}</a>
            <span>/</span>
            <a href={`/${country}`} className="hover:text-accent transition-luxury">{country}</a>
            <span>/</span>
            <span className="text-accent">{cityData.name}</span>
          </div>

          {/* Title */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl lg:text-6xl font-light">
              {t('cityPage.currentTimeIn')} <span className="font-semibold text-accent">{cityData.name}</span>
            </h1>
            <p className="text-lg text-foreground/70">
              {t('cityPage.realTimeClockFor', { city: cityData.name, country })}
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
                    <p className="text-lg font-semibold">{cityData.name}, {country}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.timezone')}</span>
                    <p className="text-lg font-mono font-semibold text-accent">{cityData.timezone}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">{t('cityPage.utcOffset')}</span>
                    <p className="text-lg font-mono font-semibold">{time?.utcOffset || 'N/A'}</p>
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

      {/* Related Cities */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light mb-12">
            {t('cityPage.otherCitiesIn')} <span className="font-semibold text-accent">{country}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Would load related cities here */}
            <div className="minimalist-card">
              <p className="text-foreground/60">{t('cityPage.loadingRelatedCities')}</p>
            </div>
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
              {t('cityPage.descriptionP1', { city: cityData.name, country, timezone: cityData.timezone })}
            </p>
            <p className="text-foreground/70 leading-relaxed">
              {t('cityPage.descriptionP2', { city: cityData.name })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
