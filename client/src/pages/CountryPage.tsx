import { useParams } from 'wouter';
import { useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useLocation } from 'wouter';

export default function CountryPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const countryParam = params.country || '';

  // Convert URL slug to proper country name for DB matching
  // e.g. "united-arab-emirates" -> "United Arab Emirates"
  const formattedCountry = useMemo(() => {
    return countryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [countryParam]);

  // FIX: Use getByCountry instead of getAll+filter
  // getAll has a 200-item default limit and may not return all cities for a country
  const { data: citiesInCountry = [], isLoading } = trpc.cities.getByCountry.useQuery(
    { country: formattedCountry },
    { enabled: !!formattedCountry }
  );

  // Update page title dynamically
  useEffect(() => {
    if (formattedCountry) {
      document.title = `Time in ${formattedCountry} - All Cities & Timezones`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Check current local time in all cities of ${formattedCountry}. Real-time clocks, timezone info, and UTC offsets.`
        );
      }
    }
  }, [formattedCountry]);

  const handleCityClick = (cityName: string) => {
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${countryParam}/${citySlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-8 h-8 text-blue-600" />
                {formattedCountry}
              </h1>
              <p className="text-slate-600 mt-1">
                {isLoading ? 'Loading...' : `${citiesInCountry.length} cities • Time zones and current time`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded mb-3 w-3/4" />
                <div className="h-4 bg-slate-100 rounded mb-2 w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : citiesInCountry.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesInCountry.map((city) => (
              <Card
                key={city.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleCityClick(city.name)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{city.country}</p>
                    </div>
                    <Clock className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Timezone:</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {city.timezone}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">UTC Offset:</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {city.utcOffset || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCityClick(city.name);
                    }}
                  >
                    View Time
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              No cities found for {formattedCountry}
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate('/')}
            >
              Go Back Home
            </Button>
          </div>
        )}
      </div>

      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Time in ${formattedCountry} - All Cities`,
          description: `Check current time in all cities of ${formattedCountry}. Real-time clock, timezone converter, and DST information.`,
          url: `https://www.worldclock.info/${countryParam}`,
          areaServed: formattedCountry,
          numberOfItems: citiesInCountry.length,
        })}
      </script>
    </div>
  );
}
