import { useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { AdSlot } from '@/components/PublicLayout';
import { Link } from 'wouter';

export default function Countries() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: cities, isLoading } = trpc.cities.getAll.useQuery({ limit: 500 });

  const countries = useMemo(() => {
    if (!cities) return [];
    const countrySet = new Set<string>();
    cities.forEach(city => {
      if (city.country) countrySet.add(city.country);
    });
    return Array.from(countrySet).sort();
  }, [cities]);

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  if (isLoading) {
    return <div className="py-12 text-center text-[var(--t3)]">Loading countries...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">Countries</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">Browse Countries</h2>
        <p className="text-[var(--t2)] mt-2">Explore timezones and cities across the globe</p>
      </section>

      <div className="py-4">
        <input 
          type="text"
          placeholder="Search countries..."
          className="w-full max-w-md bg-[var(--surface)] border border-[var(--brd2)] rounded-[var(--r)] px-4 py-2 text-sm outline-none focus:border-[var(--accent)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AdSlot />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
        {filteredCountries.map((country) => (
          <Link 
            key={country} 
            href={`/country/${country.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-[var(--surface)] p-[13px_15px] hover:bg-[var(--bg)] transition-colors flex flex-col gap-[2px]"
          >
            <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{country}</div>
            <div className="text-[14px] text-[var(--t1)] mt-1">
              {cities?.filter(c => c.country === country).length} Cities
            </div>
          </Link>
        ))}
      </div>

      <AdSlot />
    </div>
  );
}
