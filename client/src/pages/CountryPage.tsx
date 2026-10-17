import { useParams, Link } from 'wouter';
import { useEffect, useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Search, ArrowRight, Globe, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { setSEOMeta, setStructuredData, generateBreadcrumbSchema } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdBanner } from '@/components/AdBanner';

const SITE_URL = 'https://www.whattime.info';

export default function CountryPage() {
  const { t } = useTranslation();
  const params = useParams();
  const countryParam = params.country || '';
  const [filterQuery, setFilterQuery] = useState('');

  // Format country name: united-arab-emirates -> United Arab Emirates
  const formattedCountry = useMemo(() => {
    return countryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [countryParam]);

  // Fetch all cities
  const { data: allCities, isLoading } = trpc.cities.getAll.useQuery({ limit: 500 });

  // Filter cities by country
  const citiesInCountry = useMemo(() => {
    if (!allCities) return [];
    return allCities.filter((city) =>
      city.country.toLowerCase() === formattedCountry.toLowerCase()
    );
  }, [allCities, formattedCountry]);

  // Search filtered cities
  const filteredCities = useMemo(() => {
    if (!filterQuery.trim()) return citiesInCountry;
    const q = filterQuery.toLowerCase().trim();
    return citiesInCountry.filter((c) =>
      c.name.toLowerCase().includes(q) || c.timezone.toLowerCase().includes(q)
    );
  }, [citiesInCountry, filterQuery]);

  // Unique timezones in this country
  const countryTimezones = useMemo(() => {
    return Array.from(new Set(citiesInCountry.map((c) => c.timezone)));
  }, [citiesInCountry]);

  const citySlug = (cityName: string) => cityName.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    if (!countryParam) return;

    const pageUrl = `${SITE_URL}/${countryParam}`;

    setSEOMeta({
      title: `Current Time in ${formattedCountry} — All Cities & Time Zones Live Clock`,
      description: `⏰ Exact current time in ${formattedCountry}. Live clocks, timezones, and UTC offsets for ${citiesInCountry.length || 'major'} cities across ${formattedCountry}. Free and real-time.`,
      url: pageUrl,
      type: 'website',
    });

    setStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `Current Time in ${formattedCountry} — All Major Cities`,
          description: `Real-time clocks and time zone information for all major cities in ${formattedCountry}.`,
          url: pageUrl,
          areaServed: formattedCountry,
          numberOfItems: citiesInCountry.length,
        },
        (() => {
          const { '@context': _omit, ...schema } = generateBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Countries', url: `${SITE_URL}/countries` },
            { name: formattedCountry, url: pageUrl },
          ]);
          return schema;
        })(),
      ],
    });
  }, [countryParam, formattedCountry, citiesInCountry.length]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="py-12 lg:py-16 border-b border-border bg-gradient-to-b from-card/60 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-foreground/60">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/countries" className="hover:text-accent transition-colors">Countries</Link>
              <span>/</span>
              <span className="text-accent font-medium">{formattedCountry}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> Country Directory
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                  Current Time in <span className="text-accent">{formattedCountry}</span>
                </h1>
                <p className="text-sm sm:text-base text-foreground/70 max-w-xl">
                  Explore real-time clocks, official timezones, and UTC offsets across{' '}
                  <strong className="text-foreground">{citiesInCountry.length}</strong> indexed cities in {formattedCountry}.
                </p>
              </div>

              {/* Timezones Summary Badge */}
              {countryTimezones.length > 0 && (
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1.5 min-w-[200px]">
                  <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-accent" /> Timezone{countryTimezones.length > 1 ? 's' : ''} ({countryTimezones.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {countryTimezones.map((tz) => (
                      <span key={tz} className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-foreground/5 border border-border">
                        {tz.split('/').pop()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Search Bar */}
            <div className="relative max-w-md pt-2">
              <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 mt-1" />
              <input
                type="text"
                placeholder={`Search city in ${formattedCountry}...`}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="text-center py-20 space-y-3">
              <Clock className="w-8 h-8 text-accent mx-auto animate-spin" />
              <p className="text-sm text-foreground/60">Loading cities for {formattedCountry}...</p>
            </div>
          ) : filteredCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${countryParam}/${citySlug(city.name)}`}
                  className="block group"
                >
                  <Card className="p-5 h-full hover:border-accent hover:shadow-md transition-all border-border bg-card group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-xs text-foreground/60">{formattedCountry}</p>
                      </div>
                      <div className="p-1.5 rounded-md bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-foreground/75 pt-3 border-t border-border/70">
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Timezone:</span>
                        <span className="font-mono font-medium text-foreground">{city.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Coordinates:</span>
                        <span className="font-mono text-foreground/70">
                          {Number(city.latitude).toFixed(2)}&deg;, {Number(city.longitude).toFixed(2)}&deg;
                        </span>
                      </div>
                      {city.population && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">Population:</span>
                          <span className="font-medium">{Number(city.population).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-foreground/60">
                {filterQuery
                  ? `No cities matching "${filterQuery}" in ${formattedCountry}.`
                  : `No cities currently indexed for ${formattedCountry}.`}
              </p>
              <Link
                href="/countries"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90"
              >
                Browse All Countries
              </Link>
            </div>
          )}

          <AdBanner className="mt-14" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
