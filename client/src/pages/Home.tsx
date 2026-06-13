import { useState, useEffect } from 'react';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { useTimezoneDetection } from '@/hooks/useTimezoneDetection';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { AdSlot } from '@/components/PublicLayout';

export default function Home() {
  const { timezone: detectedTimezone } = useTimezoneDetection();
  const userTz = detectedTimezone?.name || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { time, isLoading } = useRealTimeClock(userTz);
  
  const [dayProgress, setDayProgress] = useState(0);

  useEffect(() => {
    if (time) {
      const now = new Date(time.date);
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      const progress = (totalSeconds / 86400) * 100;
      setDayProgress(progress);
    }
  }, [time]);

  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 12 });

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-6 items-center py-9 border-b border-[var(--border)]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-[7px] text-[11px] font-semibold tracking-[.09em] uppercase text-[var(--t3)]">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--green)] animate-pulse" />
            {detectedTimezone?.city || detectedTimezone?.name || 'Local Time'} · {detectedTimezone?.country || ''} · Live
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
            <span className="font-[var(--mono)] text-[10.5px] text-[var(--t3)] bg-[var(--bg2)] border border-[var(--border)] px-2 py-[2px] rounded-[20px]">{userTz}</span>
            <span className="font-[var(--mono)] text-[12.5px] text-[var(--t2)]">UTC {detectedTimezone?.offsetString || ''}</span>
          </div>

          <div className="mt-[13px] space-y-1">
            <div className="flex justify-between text-[10.5px] text-[var(--t3)] font-[var(--mono)]">
              <span>00:00</span>
              <span>{dayProgress.toFixed(1)}%</span>
              <span>24:00</span>
            </div>
            <div className="h-[3px] bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] overflow-hidden">
              <div 
                className="h-full rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[#f97316] transition-all duration-1000 linear" 
                style={{ width: `${dayProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ANALOG CLOCK (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center">
          <svg className="w-[130px] h-[130px] drop-shadow-sm" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="62" fill="white" stroke="var(--border)" strokeWidth="1"/>
            <circle cx="65" cy="65" r="58" fill="none" stroke="var(--bg2)" strokeWidth="1"/>
            {/* Simple Hands - in a real app these would rotate */}
            <line x1="65" y1="65" x2="65" y2="33" stroke="var(--t1)" strokeWidth="3.5" strokeLinecap="round" transform="rotate(30 65 65)"/>
            <line x1="65" y1="65" x2="65" y2="22" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" transform="rotate(180 65 65)"/>
            <line x1="65" y1="74" x2="65" y2="18" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" transform="rotate(270 65 65)"/>
            <circle cx="65" cy="65" r="4" fill="var(--accent)"/>
            <circle cx="65" cy="65" r="1.8" fill="white"/>
          </svg>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="grid grid-cols-3 md:grid-cols-6 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">UTC Offset</div>
          <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">{detectedTimezone?.offsetString || '+00:00'}</div>
        </div>
        <div className="p-[13px_16px] border-r border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[.09em] uppercase mb-1">DST</div>
          <div className={`font-[var(--mono)] text-[14px] ${detectedTimezone?.isDST ? 'text-[var(--accent)]' : 'text-[var(--t1)]'}`}>
            {detectedTimezone?.isDST ? 'Active' : 'No DST'}
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
          <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">3.33M</div>
        </div>
      </div>

      <AdSlot />

      {/* WORLD CLOCK SECTION */}
      <section className="py-[26px] border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase">World Clock</span>
          <Link href="/world-clock" className="text-[12px] text-[var(--t3)] hover:text-[var(--accent)] transition-colors">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
          {allCities?.map((city) => (
            <Link key={city.id} href={`/city-detail/${city.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-[var(--surface)] p-[13px_15px] hover:bg-[var(--bg)] transition-colors flex flex-col gap-[2px]">
              <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{city.name}</div>
              <div className="font-[var(--mono)] text-[21px] font-light text-[var(--t1)] tracking-[-0.03em] leading-[1.2]">12:45</div>
              <div className="font-[var(--mono)] text-[10px] font-medium p-[2px_6px] rounded-[4px] mt-[2px] w-fit bg-[var(--gnlo)] text-[var(--green)]">Ahead</div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot />
    </div>
  );
}
