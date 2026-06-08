import { useParams } from 'wouter';
import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Globe } from 'lucide-react';
import { Link } from 'wouter';
import { DateTime } from 'luxon';

export default function CountryDetail() {
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
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (countryCities.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Country not found</p>
          <Link href="/countries">
            <Button>Back to Countries</Button>
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
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {countryName}
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Country Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-slate-600">Cities</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{countryCities.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-slate-600">Timezones</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{timezones.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-slate-600">Region</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{countryCities[0]?.region || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Timezones Section */}
        {timezones.length > 1 && (
          <Card className="p-6 mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Timezones in {countryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timezones.map(tz => {
                const tzCities = countryCities.filter(c => c.timezone === tz);
                return (
                  <div key={tz} className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-mono text-sm font-semibold text-slate-900 mb-2">{tz}</p>
                    <p className="text-xs text-slate-600">
                      {tzCities.length} {tzCities.length === 1 ? 'city' : 'cities'}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Cities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Cities in {countryName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 pt-12 border-t border-slate-200 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About {countryName}</h2>
          <p className="text-slate-600 mb-4">
            {countryName} has {countryCities.length} major cities across {timezones.length} timezone{timezones.length > 1 ? 's' : ''}. 
            Use this page to find current times in cities across {countryName} and compare them with other timezones worldwide.
          </p>
          <p className="text-slate-600">
            Perfect for scheduling meetings, calls, or events with people in {countryName}. 
            Each city page provides real-time accuracy, sunrise/sunset times, and timezone information.
          </p>
        </div>
      </div>
    </div>
  );
}

function CityCard({ city }: { city: any }) {
  const { time } = useRealTimeClock(city.timezone);

  return (
    <Link href={`/city-detail/${encodeURIComponent(city.name)}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900">{city.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{city.timezone}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-2xl font-mono font-bold text-blue-600">
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
