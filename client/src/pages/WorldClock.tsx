import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, Globe, Star, ArrowRight, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { useTranslation } from 'react-i18next';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdBanner } from '@/components/AdBanner';
import { DateTime } from 'luxon';

const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '-');

export default function WorldClock() {
  const { t } = useTranslation();

  useEffect(() => {
    setSEOMeta({
      title: 'World Clock — Current Exact Local Time in Every Major City',
      description:
        '⏰ See current exact local time in hundreds of cities worldwide. Live atomic-synced world clock with seconds, UTC offsets, daylight saving time (DST) alerts, and interactive search.',
      url: 'https://www.whattime.info/world-clock',
      type: 'website',
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Check URL query param on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchQuery(q);
    } catch (e) {}
  }, []);

  // Fetch regions
  const { data: regions } = trpc.cities.getRegions.useQuery();

  // Search cities
  const { data: searchResults, isLoading: searchLoading } = trpc.cities.search.useQuery(
    { query: searchQuery, limit: 24 },
    { enabled: searchQuery.length >= 2 }
  );

  // Fetch cities by region
  const { data: regionCities, isLoading: regionLoading } = trpc.cities.getByRegion.useQuery(
    { region: selectedRegion || '', limit: 60 },
    { enabled: !!selectedRegion }
  );

  // Default cities
  const { data: defaultCities, isLoading: defaultLoading } = trpc.cities.getAll.useQuery(
    { limit: 120 },
    { enabled: !searchQuery && !selectedRegion }
  );

  const filteredCities = useMemo(() => {
    if (searchQuery.length >= 2) return searchResults || [];
    if (selectedRegion) return regionCities || [];
    return defaultCities || [];
  }, [searchQuery, selectedRegion, searchResults, regionCities, defaultCities]);

  const citiesLoading = searchLoading || regionLoading || defaultLoading;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader onSearch={(q) => setSearchQuery(q)} />

      <main className="flex-1">
        {/* Hero search */}
        <section className="py-12 border-b border-border bg-gradient-to-b from-card/60 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" /> Global Time Synchronization
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                World Clock &amp; Time Zones
              </h1>
              <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
                Accurate, real-time local times for financial hubs, capital cities, and regions across all continents.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search by city name, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-5 bg-card border-border text-foreground placeholder:text-foreground/40 text-sm rounded-xl focus:border-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/50 hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filter Buttons */}
            {regions && regions.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50 block">Filter by continent:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedRegion === null
                        ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                        : 'bg-card border border-border text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    All Continents
                  </button>
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region);
                        setSearchQuery('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedRegion === region
                          ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                          : 'bg-card border border-border text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Cities Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {citiesLoading ? (
            <div className="text-center py-20 space-y-3">
              <Clock className="w-8 h-8 text-accent mx-auto animate-spin" />
              <p className="text-sm text-foreground/60">Synchronizing world clocks...</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-foreground/70">No cities found matching &ldquo;{searchQuery}&rdquo;.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedRegion(null); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          )}

          <AdBanner className="mt-14" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function CityCard({ city }: { city: any }) {
  const { t } = useTranslation();
  const { time } = useRealTimeClock(city.timezone);
  const cityUrl = `/${slugify(city.country)}/${slugify(city.name)}`;

  // Visitor's local timezone comparison
  const diffBadge = useMemo(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityDt = DateTime.now().setZone(city.timezone);
      const userDt = DateTime.now().setZone(userTz);
      const diffHours = Math.round((cityDt.offset - userDt.offset) / 60);
      if (diffHours === 0) return 'Same time';
      return `${Math.abs(diffHours)}h ${diffHours > 0 ? 'ahead' : 'behind'}`;
    } catch (e) {
      return null;
    }
  }, [city.timezone]);

  return (
    <Link
      href={cityUrl}
      className="block group bg-card border border-border rounded-xl p-5 hover:border-accent hover:shadow-lg transition-all group-hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-1.5">
            {city.name}
          </h3>
          <p className="text-xs text-foreground/60">{city.country}</p>
        </div>
        {diffBadge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            {diffBadge}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Live Clock Display */}
        <div className="bg-foreground/5 rounded-lg p-3 text-center">
          <div className="text-3xl font-mono font-light tracking-wide text-accent">
            {time ? formatClockTime(time) : '00:00:00'}
          </div>
          <span className="text-[10px] uppercase font-mono text-foreground/50 block mt-0.5">
            {city.timezone} &bull; {time?.isDst ? 'DST' : 'Standard'}
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-xs text-foreground/60 pt-2 border-t border-border/70">
          <span>UTC Offset: {time ? `UTC${time.offset >= 0 ? '+' : ''}${Math.floor(time.offset / 60)}` : 'N/A'}</span>
          <span className="text-accent group-hover:underline flex items-center gap-1 font-medium">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
