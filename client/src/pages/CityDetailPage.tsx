import { useParams, useLocation, Link } from 'wouter';
import { useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { DateTime } from 'luxon';
import { AdSlot } from '@/components/PublicLayout';

export default function CityDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  
  const cityParam = params.city?.replace(/-/g, ' ') || params.city || '';
  const countryParam = params.country || '';

  const formattedCountry = useMemo(() => {
    if (!countryParam) return '';
    return countryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [countryParam]);

  const { data: cities } = trpc.cities.getAll.useQuery({ limit: 500 });

  const city = useMemo(() => {
    if (!cities) return undefined;
    if (formattedCountry) {
      const match = cities.find(
        (c) =>
          c.name.toLowerCase() === cityParam.toLowerCase() &&
          c.country.toLowerCase() === formattedCountry.toLowerCase()
      );
      return match ?? cities.find((c) => c.name.toLowerCase() === cityParam.toLowerCase());
    }
    return cities.find((c) => c.name.toLowerCase() === cityParam.toLowerCase());
  }, [cities, cityParam, formattedCountry]);

  const { time, isLoading } = useRealTimeClock(city?.timezone || 'UTC');

  useEffect(() => {
    if (city) {
      document.title = `Exact Time in ${city.name} Right Now - Live Clock`;
    }
  }, [city]);

  if (!city) {
    return (
      <div className="py-24 text-center">
        <p className="text-[var(--t3)] mb-4">City not found</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--r)] text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-[5px] text-[11.5px] text-[var(--t3)] pt-[14px]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
        <span className="text-[var(--brd2)]">/</span>
        <Link href={`/country/${city.country.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[var(--accent)] transition-colors">{city.country}</Link>
        <span className="text-[var(--brd2)]">/</span>
        <span className="text-[var(--t2)]">{city.name}</span>
      </nav>

      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-6 items-center py-9 border-b border-[var(--border)]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-[7px] text-[11px] font-semibold tracking-[.09em] uppercase text-[var(--t3)]">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--green)] animate-pulse" />
            {city.name} · {city.country} · Live
          </div>
          
          <div className="font-[var(--mono)] text-[clamp(58px,9vw,100px)] font-light tracking-[-0.04em] text-[var(--t1)] leading-none select-none">
            {isLoading ? (
              <span>--:--:--</span>
            ) : (
              <>
                <span>{formatClockTime(time).split(':')[0]}</span>
                <span className="text-[var(--accent)] animate-pulse mx-1">:</span>
                <span>{formatClockTime(time).split(':')[1]}</span>
                <span className="text-[var(--accent)] animate-pulse mx-1">:</span>
                <span>{formatClockTime(time).split(':')[2]}</span>
              </>
            )}
          </div>

          <div className="text-[15px] text-[var(--t2)] flex items-center gap-[10px] flex-wrap">
            <span>{time?.date ? new Date(time.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Loading…'}</span>
            <span className="font-[var(--mono)] text-[10.5px] text-[var(--t3)] bg-[var(--bg2)] border border-[var(--border)] px-2 py-[2px] rounded-[20px]">{city.timezone}</span>
            <span className="font-[var(--mono)] text-[12.5px] text-[var(--t2)]">UTC {city.utcOffset || ''}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <svg className="w-[130px] h-[130px] drop-shadow-sm" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="62" fill="white" stroke="var(--border)" strokeWidth="1"/>
            <circle cx="65" cy="65" r="58" fill="none" stroke="var(--bg2)" strokeWidth="1"/>
            <circle cx="65" cy="65" r="4" fill="var(--accent)"/>
            <circle cx="65" cy="65" r="1.8" fill="white"/>
          </svg>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="grid grid-cols-3 md:grid-cols-6 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">UTC Offset</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">{city.utcOffset || '+00:00'}</div>
        </div>
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">DST</div>
          <div className={`font-[var(--mono)] text-[14px] ${city.dst ? 'text-[var(--accent)]' : 'text-[var(--t1)]'}`}>
            {city.dst ? 'Active' : 'No DST'}
          </div>
        </div>
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">Sunrise</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--amber)]">05:32 AM</div>
        </div>
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors md:border-r">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">Sunset</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--amber)]">07:14 PM</div>
        </div>
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">Day Length</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">13h 42m</div>
        </div>
        <div className="p-[13px_16px] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">Population</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">
            {city.population ? (parseInt(city.population) / 1000000).toFixed(2) + 'M' : 'N/A'}
          </div>
        </div>
      </div>

      <AdSlot />

      {/* ADDITIONAL CONTENT SECTION */}
      <section className="py-[26px] border-b border-[var(--border)]">
        <div className="sec-head mb-4 flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase">Time in {city.country}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
          {cities?.filter(c => c.country === city.country && c.id !== city.id).slice(0, 8).map((c) => (
            <Link key={c.id} href={`/city-detail/${c.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-[var(--surface)] p-[13px_15px] hover:bg-[var(--bg)] transition-colors flex flex-col gap-[2px]">
              <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{c.name}</div>
              <div className="font-[var(--mono)] text-[18px] font-light text-[var(--t1)] tracking-[-0.03em]">12:45</div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot />
    </div>
  );
}
