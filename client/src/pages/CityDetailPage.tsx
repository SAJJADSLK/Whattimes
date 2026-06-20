import { useParams, useLocation } from 'wouter';
import { useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Sunrise, Sunset, Compass } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function CityDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  
  // Support both old (/city-detail/:city) and new (/:country/:city) routes
  const cityParam = params.city?.replace(/-/g, ' ') || params.city || '';
  const countryParam = params.country || '';

  // Fetch city data
  const { data: cities } = trpc.cities.getAll.useQuery({ limit: 500 });
  const city = useMemo(() => {
    return cities?.find(c => c.name.toLowerCase() === cityParam.toLowerCase());
  }, [cities, cityParam]);

  const { time } = useRealTimeClock(city?.timezone || 'UTC');

  // Fetch all cities for comparison table
  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 500 });

  // Calculate time differences
  const timeDifferences = useMemo(() => {
    if (!city || !allCities) return [];
    
    const cityTime = DateTime.now().setZone(city.timezone);
    
    return allCities
      .filter(c => c.id !== city.id)
      .map(c => {
        const otherTime = DateTime.now().setZone(c.timezone);
        const diffMinutes = otherTime.diff(cityTime, 'minutes').minutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const diffMins = diffMinutes % 60;
        
        return {
          name: c.name,
          country: c.country,
          diffHours,
          diffMins,
          timezone: c.timezone,
        };
      })
      .sort((a, b) => a.diffHours - b.diffHours)
      .slice(0, 20);
  }, [city, allCities]);

  // Calculate sunrise/sunset
  const sunData = useMemo(() => {
    if (!city) return null;
    
    try {
      const now = DateTime.now().setZone(city.timezone);
      const sunrise = now.set({ hour: 5, minute: 30 });
      const sunset = now.set({ hour: 20, minute: 0 });
      const dayLength = sunset.diff(sunrise, 'hours').hours;
      
      return {
        sunrise: sunrise.toFormat('hh:mm a'),
        sunset: sunset.toFormat('hh:mm a'),
        dayLength: dayLength.toFixed(1),
      };
    } catch {
      return null;
    }
  }, [city]);

  // Update page title and meta tags dynamically
  useEffect(() => {
    if (city) {
      const canonical = `${SITE_URL}/${countryParam}/${cityParam.toLowerCase().replace(/\s+/g, '-')}`;
      setSEOMeta({
        title: `Exact Time in ${city.name} Right Now - Live Clock`,
        description: `What time is it in ${city.name}? Check the official current local time, timezone data (${city.timezone}), and daylight saving time changes for ${city.name}, ${city.country}.`,
        url: canonical,
        type: 'website',
      });
    }
  }, [city, countryParam, cityParam]);

  if (!city) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('cityDetailPage.notFound')}</p>
          <Button onClick={() => navigate('/')}>{t('cityDetailPage.goBack')}</Button>
        </div>
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/${countryParam}/${cityParam.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: `Time in ${city.name}`,
          url: canonicalUrl,
          areaServed: city.country,
          description: `Current local time in ${city.name}, ${city.country}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressCountry: city.country,
          },
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Navigation */}
        <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">
              {city.name}, {city.country}
            </h1>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="mb-12 space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-slate-900">
                {t('cityDetailPage.exactTimeIn')} {city.name}
              </h1>
              <p className="text-xl text-slate-600">{city.country}</p>
              <p className="text-sm text-slate-500">{t('common.timezone')}: {city.timezone}</p>
            </div>

            {/* Large Clock Display - NO ADS ABOVE FOLD */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white text-center space-y-6 shadow-lg">
              <div className="text-8xl font-mono font-bold tracking-wider">
                {time ? formatClockTime(time) : '00:00:00'}
              </div>
              <div className="text-2xl font-semibold">{time?.date || t('common.loading')}</div>
              <div className="text-sm opacity-90">
                {city.timezone} • {city.country}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Location Info */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                {t('home.location')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('cityDetailPage.city')}</span>
                  <span className="font-semibold text-slate-900">{city.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('cityDetailPage.country')}</span>
                  <span className="font-semibold text-slate-900">{city.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('cityDetailPage.region')}</span>
                  <span className="font-semibold text-slate-900">{city.region || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('cityDetailPage.population')}</span>
                  <span className="font-semibold text-slate-900">
                    {city.population ? parseInt(city.population).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Timezone Info */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                {t('common.timezone')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('common.timezone')}</span>
                  <span className="font-mono font-semibold text-slate-900">{city.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('common.utcOffset')}</span>
                  <span className="font-mono font-semibold text-slate-900">{city.utcOffset || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('common.dst')}</span>
                  <span className="font-semibold text-slate-900">{city.dst ? t('common.active') : t('common.inactive')}</span>
                </div>
              </div>
            </Card>

            {/* Sun Data */}
            {sunData && (
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Sunrise className="w-5 h-5 text-red-600" />
                  {t('cityDetailPage.sunTimes')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cityPage.sunrise')}</span>
                    <span className="font-semibold text-slate-900">{sunData.sunrise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cityPage.sunset')}</span>
                    <span className="font-semibold text-slate-900">{sunData.sunset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cityDetailPage.dayLength')}</span>
                    <span className="font-semibold text-slate-900">{t('cityDetailPage.hoursUnit', { count: sunData.dayLength })}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Time Differences */}
          {timeDifferences.length > 0 && (
            <Card className="p-6 mb-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Compass className="w-5 h-5 text-red-600" />
                {t('cityDetailPage.timeDifferencesFrom')} {city.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeDifferences.map((diff) => (
                  <div
                    key={`${diff.name}-${diff.timezone}`}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900">{diff.name}</p>
                        <p className="text-xs text-slate-600">{diff.country}</p>
                      </div>
                      <span className="text-sm font-mono font-bold text-red-600">
                        {diff.diffHours > 0 ? '+' : ''}{diff.diffHours}h {diff.diffMins}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
