import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Clock, ArrowRight, Zap, RefreshCw, Globe } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock } from '@/hooks/useRealTimeClock';
import { TimeScrubber } from '@/components/TimeScrubber';
import { useTranslation } from 'react-i18next';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdBanner } from '@/components/AdBanner';

const PRESETS = [
  { name: 'NY & London', tz: ['America/New_York', 'Europe/London'] },
  { name: 'Tokyo & SF', tz: ['Asia/Tokyo', 'America/Los_Angeles'] },
  { name: 'Dubai & Singapore', tz: ['Asia/Dubai', 'Asia/Singapore'] },
  { name: 'Sydney & NY', tz: ['Australia/Sydney', 'America/New_York'] },
  { name: 'London & Paris', tz: ['Europe/London', 'Europe/Paris'] },
];

export default function Converter() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setSEOMeta({
      title: 'Time Zone Converter — Compare Time Across Any Cities Instantly',
      description:
        '⏰ Free online timezone converter. Compare live local times between multiple cities, calculate exact time differences, and drag the interactive 24-hour slider for meeting planning.',
      url: 'https://www.whattime.info/converter',
      type: 'website',
    });
  }, []);

  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrubberTime, setScrubberTime] = useState(0);

  // Fetch all cities for timezone selection
  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 500 });

  const filteredCities = useMemo(() => {
    if (!allCities || !searchQuery) return [];
    const query = searchQuery.toLowerCase().trim();
    return allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query) ||
        city.timezone.toLowerCase().includes(query)
    );
  }, [allCities, searchQuery]);

  const addTimezone = (timezone: string) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeTimezone = (timezone: string) => {
    if (selectedTimezones.length <= 1) return;
    setSelectedTimezones(selectedTimezones.filter((tz) => tz !== timezone));
  };

  const calculateTimeForTimezone = (timezone: string) => {
    try {
      const now = new Date(Date.now() + scrubberTime);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
    } catch {
      return '--:--:--';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 border-b border-border bg-gradient-to-b from-card/60 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5" /> Instant Time Difference Tool
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Time Zone Converter
              </h1>
              <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
                Convert and compare times across multiple international cities in real time. Use the interactive scrubber to align global schedules.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50 block">Popular comparisons:</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedTimezones(p.tz)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border hover:border-accent hover:text-accent transition-all"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Converter Tool Area */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Time Scrubber Section */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Drag Timeline to Adjust Global Time
              </h2>
              {scrubberTime !== 0 && (
                <button
                  onClick={() => setScrubberTime(0)}
                  className="text-xs text-accent underline hover:opacity-80"
                >
                  Reset to Current Time
                </button>
              )}
            </div>
            <TimeScrubber value={scrubberTime} onChange={setScrubberTime} />
          </div>

          {/* Timezone Comparison Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Active Locations ({selectedTimezones.length})
              </h2>

              {/* Add Timezone Button & Search Modal */}
              <div className="relative">
                <Button
                  onClick={() => setShowSearch(!showSearch)}
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add City / Timezone
                </Button>

                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-xs text-foreground uppercase tracking-wider">Search City or Zone</span>
                      <button onClick={() => setShowSearch(false)} className="text-foreground/50 hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      placeholder="e.g. Paris, Sydney, Chicago..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-3 bg-background text-sm"
                      autoFocus
                    />

                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {filteredCities && filteredCities.length > 0 ? (
                        filteredCities.slice(0, 15).map((city) => (
                          <button
                            key={city.id}
                            onClick={() => addTimezone(city.timezone)}
                            className="w-full text-left px-3 py-2 hover:bg-accent/10 rounded-lg text-xs transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <span className="font-semibold text-foreground group-hover:text-accent block">{city.name}</span>
                              <span className="text-[10px] text-foreground/50">{city.country}</span>
                            </div>
                            <span className="font-mono text-[10px] text-foreground/60">{city.timezone}</span>
                          </button>
                        ))
                      ) : searchQuery ? (
                        <p className="text-xs text-foreground/50 text-center py-4">No matching cities found.</p>
                      ) : (
                        <p className="text-xs text-foreground/50 text-center py-4">Type a city name to search.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedTimezones.map((tz) => {
                const parts = tz.split('/');
                const cityName = parts[parts.length - 1].replace(/_/g, ' ');

                return (
                  <div
                    key={tz}
                    className="p-6 rounded-xl border border-border bg-card relative shadow-sm hover:border-accent transition-all group"
                  >
                    {selectedTimezones.length > 1 && (
                      <button
                        onClick={() => removeTimezone(tz)}
                        className="absolute top-3 right-3 p-1 rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                        title="Remove timezone"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-accent" />
                      <h3 className="font-bold text-lg text-foreground">{cityName}</h3>
                    </div>

                    <div className="text-4xl font-bold text-accent font-mono tracking-wide mb-2">
                      {calculateTimeForTimezone(tz)}
                    </div>

                    <div className="text-xs text-foreground/60 flex items-center justify-between pt-3 border-t border-border/70">
                      <span>{tz}</span>
                      <span>
                        {new Date(Date.now() + scrubberTime).toLocaleDateString(i18n.language, {
                          timeZone: tz,
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <AdBanner slot="5432109876" className="mt-8" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
