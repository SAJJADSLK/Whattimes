import { useParams, Link } from 'wouter';
import { useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { AdSlot } from '@/components/PublicLayout';

export default function CountryPage() {
  const params = useParams();
  const countryParam = params.country || '';

  const formattedCountry = useMemo(() => {
    return countryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [countryParam]);

  const { data: citiesInCountry = [], isLoading } = trpc.cities.getByCountry.useQuery(
    { country: formattedCountry },
    { enabled: !!formattedCountry }
  );

  useEffect(() => {
    if (formattedCountry) {
      document.title = `Time in ${formattedCountry} - All Cities & Timezones`;
    }
  }, [formattedCountry]);

  return (
    <div className="space-y-6">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-[5px] text-[11.5px] text-[var(--t3)] pt-[14px]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
        <span className="text-[var(--brd2)]">/</span>
        <span className="text-[var(--t2)]">{formattedCountry}</span>
      </nav>

      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">Country</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">{formattedCountry}</h2>
        <p className="text-[var(--t2)] mt-2">
          {isLoading ? 'Loading...' : `${citiesInCountry.length} cities in ${formattedCountry}`}
        </p>
      </section>

      <AdSlot />

      {isLoading ? (
        <div className="py-12 text-center text-[var(--t3)]">Loading cities...</div>
      ) : citiesInCountry.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
          {citiesInCountry.map((city) => (
            <Link 
              key={city.id} 
              href={`/city-detail/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-[var(--surface)] p-[13px_15px] hover:bg-[var(--bg)] transition-colors flex flex-col gap-[2px]"
            >
              <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{city.name}</div>
              <div className="font-[var(--mono)] text-[18px] font-light text-[var(--t1)] tracking-[-0.03em]">12:45</div>
              <div className="text-[10px] text-[var(--t3)] truncate">{city.timezone}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-[var(--t3)]">No cities found for this country.</div>
      )}

      <AdSlot />
    </div>
  );
}
