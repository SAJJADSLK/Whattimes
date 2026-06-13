import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { Link } from 'wouter';
import { AdSlot } from '@/components/PublicLayout';

export default function WorldClock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data: regions } = trpc.cities.getRegions.useQuery();

  const { data: searchResults, isLoading: searchLoading } = trpc.cities.search.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: searchQuery.length >= 2 }
  );

  const { data: regionCities, isLoading: regionLoading } = trpc.cities.getByRegion.useQuery(
    { region: selectedRegion || '', limit: 50 },
    { enabled: !!selectedRegion }
  );

  const { data: defaultCities, isLoading: defaultLoading } = trpc.cities.getAll.useQuery(
    { limit: 100 },
    { enabled: !searchQuery && !selectedRegion }
  );

  const filteredCities = useMemo(() => {
    if (searchQuery.length >= 2) return searchResults || [];
    if (selectedRegion) return regionCities || [];
    return defaultCities || [];
  }, [searchQuery, selectedRegion, searchResults, regionCities, defaultCities]);

  const citiesLoading = searchLoading || regionLoading || defaultLoading;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">World Clock</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">100+ Cities at a Glance</h2>
        <p className="text-[var(--t2)] mt-2">View current time across major cities worldwide</p>
      </section>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 py-4">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-3 py-1.5 rounded-[var(--r)] text-xs font-medium transition-colors ${
            selectedRegion === null 
              ? 'bg-[var(--accent)] text-white' 
              : 'bg-[var(--bg2)] text-[var(--t2)] hover:bg-[var(--border)]'
          }`}
        >
          All Regions
        </button>
        {regions?.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1.5 rounded-[var(--r)] text-xs font-medium transition-colors ${
              selectedRegion === region 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--bg2)] text-[var(--t2)] hover:bg-[var(--border)]'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <AdSlot />

      {/* GRID */}
      {citiesLoading ? (
        <div className="text-center py-12 text-[var(--t3)]">Loading cities...</div>
      ) : filteredCities.length === 0 ? (
        <div className="text-center py-12 text-[var(--t3)]">No cities found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
          {filteredCities.map((city) => (
            <CityItem key={city.id} city={city} />
          ))}
        </div>
      )}

      <AdSlot />
    </div>
  );
}

function CityItem({ city }: { city: any }) {
  const { time } = useRealTimeClock(city.timezone);
  
  return (
    <Link href={`/city-detail/${city.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-[var(--surface)] p-[13px_15px] hover:bg-[var(--bg)] transition-colors flex flex-col gap-[2px]">
      <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{city.name}</div>
      <div className="font-[var(--mono)] text-[21px] font-light text-[var(--t1)] tracking-[-0.03em] leading-[1.2]">
        {time ? formatClockTime(time).substring(0, 5) : '--:--'}
      </div>
      <div className="text-[10px] text-[var(--t3)] truncate">{city.country}</div>
    </Link>
  );
}
