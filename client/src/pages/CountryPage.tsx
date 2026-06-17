import { useParams } from 'wouter';
import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useLocation } from 'wouter';

export default function CountryPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const countryParam = params.country || '';

  // Format country name: united-arab-emirates -> United Arab Emirates
  const formattedCountry = useMemo(() => {
    return countryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [countryParam]);

  // Fetch all cities
  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 500 });

  // Filter cities by country
  const citiesInCountry = useMemo(() => {
    if (!allCities) return [];
    return allCities.filter((city) =>
      city.country.toLowerCase() === formattedCountry.toLowerCase()
    );
  }, [allCities, formattedCountry]);

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
                <MapPin className="w-8 h-8 text-accent" />
                {formattedCountry}
              </h1>
              <p className="text-slate-600 mt-1">
                {citiesInCountry.length} cities • Time zones and current time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {citiesInCountry.length > 0 ? (
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
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-accent transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{city.country}</p>
                    </div>
                    <Clock className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    className="w-full mt-4 bg-foreground hover:bg-blue-700"
                    onClick={() => handleCityClick(city.name)}
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

      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Time in ${formattedCountry} - All Cities`,
          description: `Check current time in all cities of ${formattedCountry}. Real-time clock, timezone converter, and DST information.`,
          url: `https://www.whattime.info/${countryParam}`,
          areaServed: formattedCountry,
          numberOfItems: citiesInCountry.length,
        })}
      </script>
    </div>
  );
}
