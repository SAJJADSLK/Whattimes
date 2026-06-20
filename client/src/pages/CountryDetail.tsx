import { useParams } from 'wouter';
import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Globe } from 'lucide-react';
import { Link } from 'wouter';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export default function CountryDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const countryName = params.country ? decodeURIComponent(params.country) : '';

  // Fetch all cities
  const { data: cities, isLoading } = trpc.cities.getAll.useQuery({ limit: 500 });

  // Filter cities for this country
  const countryCities = useMemo(() => {
    if (!cities) return [];
    return cities.filter(c => c.country === countryName).sort((a, b) => a.name.localeCompare(b.name));
  }, [cities, countryName]);

  // Get unique timezones
  const timezones = useMemo(() => {
    return Array.from(new Set(countryCities.map(c => c.timezone)));
  }, [countryCities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (countryCities.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('countryDetail.notFound')}</p>
          <Link href="/countries">
            <Button>{t('countryDetail.backToCountries')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/countries">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {countryName}
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Country Overview */}
        <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-accent" />
                <p className="text-sm text-slate-600">{t('countryDetail.cities')}</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{countryCities.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-accent" />
                <p className="text-sm text-slate-600">{t('countryDetail.timezones')}</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{timezones.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-accent" />
                <p className="text-sm text-slate-600">{t('countryDetail.region')}</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{countryCities[0]?.region || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Timezones Section */}
        {timezones.length > 1 && (
          <Card className="p-6 mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('countryDetail.timezonesIn')} {countryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timezones.map(tz => {
                const tzCities = countryCities.filter(c => c.timezone === tz);
                return (
                  <div key={tz} className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-mono text-sm font-semibold text-slate-900 mb-2">{tz}</p>
                    <p className="text-xs text-slate-600">
                      {t('countryDetail.cityCount', { count: tzCities.length })}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Cities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('countryDetail.citiesIn')} {countryName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryCities.map((city) => (
              <CityCard key={city.id} city={city} countrySlug={countryName.toLowerCase().replace(/\s+/g, '-')} />
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 pt-12 border-t border-slate-200 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('countryDetail.about')} {countryName}</h2>
          <p className="text-slate-600 mb-4">
            {t('countryDetail.aboutDescP1', { country: countryName, cityCount: countryCities.length, tzCount: timezones.length })}
          </p>
          <p className="text-slate-600">
            {t('countryDetail.aboutDescP2', { country: countryName })}
          </p>
        </div>
      </div>
    </div>
  );
}

function CityCard({ city, countrySlug }: { city: any; countrySlug: string }) {
  const { time } = useRealTimeClock(city.timezone);
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`/${countrySlug}/${citySlug}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900">{city.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{city.timezone}</p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <p className="text-2xl font-mono font-bold text-accent">
            {time ? formatClockTime(time) : '00:00:00'}
          </p>
        </div>
        
        <div className="text-xs text-slate-600">
          <p>UTC {city.utcOffsetMinutes > 0 ? '+' : ''}{(city.utcOffsetMinutes / 60).toFixed(1)}</p>
        </div>
      </Card>
    </Link>
  );
}
