import { useParams, Link } from 'wouter';
import { useEffect, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { setSEOMeta, setStructuredData } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

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
  const { data: citiesInCountry = [] } = trpc.cities.getByCountry.useQuery({
  country: formattedCountry,
});

  const citySlug = (cityName: string) => cityName.toLowerCase().replace(/\s+/g, '-');

  // Unique per-page SEO: title, meta description, canonical, and JSON-LD
  // with the correct production domain.
  useEffect(() => {
    if (!countryParam) return;

    const pageUrl = `${SITE_URL}/${countryParam}`;

    setSEOMeta({
      title: `Current Time in ${formattedCountry} - All Cities & Timezones`,
      description: `Check the current time in every major city in ${formattedCountry}. Live clocks, timezones, and UTC offsets for ${citiesInCountry.length || 'all'} cities.`,
      url: pageUrl,
      type: 'website',
    });

    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Time in ${formattedCountry} - All Cities`,
      description: `Check current time in all cities of ${formattedCountry}. Real-time clock, timezone converter, and DST information.`,
      url: pageUrl,
      areaServed: formattedCountry,
      numberOfItems: citiesInCountry.length,
    });
  }, [countryParam, formattedCountry, citiesInCountry.length]);

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
              <Link
                key={city.id}
                href={`/${countryParam}/${citySlug(city.name)}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
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

                    <Button className="w-full mt-4 bg-foreground hover:bg-blue-700">
                      View Time
                    </Button>
                  </div>
                </Card>
              </Link>
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
    </div>
  );
}
