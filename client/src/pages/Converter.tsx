import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { TimeScrubber } from '@/components/TimeScrubber';
import { AdSlot } from '@/components/PublicLayout';
import { X, Plus } from 'lucide-react';

export default function Converter() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'America/New_York', 'Asia/Dubai']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrubberTime, setScrubberTime] = useState(0);

  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 200 });

  const filteredCities = useMemo(() => {
    if (!allCities || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
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
    setSelectedTimezones(selectedTimezones.filter((tz) => tz !== timezone));
  };

  const calculateTimeForTimezone = (timezone: string) => {
    try {
      const now = new Date(Date.now() + scrubberTime);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return formatter.format(now);
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="space-y-6">
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">Converter</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">Timezone Converter</h2>
        <p className="text-[var(--t2)] mt-2">Compare times across multiple timezones easily</p>
      </section>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] p-6 space-y-4">
        <div className="flex justify-between text-[10.5px] text-[var(--t3)] font-[var(--mono)] uppercase tracking-wider">
          <span>Adjust Time</span>
          <span>{Math.floor(scrubberTime / 3600000)}h offset</span>
        </div>
        <TimeScrubber value={scrubberTime} onChange={setScrubberTime} />
      </div>

      <AdSlot />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
        {selectedTimezones.map((timezone) => (
          <div key={timezone} className="bg-[var(--surface)] p-6 relative group">
            <button
              onClick={() => removeTimezone(timezone)}
              className="absolute top-3 right-3 p-1 text-[var(--t3)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={14} />
            </button>
            <div className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] mb-1">{timezone}</div>
            <div className="font-[var(--mono)] text-[32px] font-light text-[var(--t1)] tracking-[-0.03em] leading-none mb-2">
              {calculateTimeForTimezone(timezone)}
            </div>
            <div className="text-[12px] text-[var(--t3)]">
              {new Date().toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
        
        <div className="bg-[var(--bg2)] p-6 flex flex-col items-center justify-center min-h-[140px]">
          {!showSearch ? (
            <button 
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 text-[var(--t3)] hover:text-[var(--t1)] transition-colors text-sm font-medium"
            >
              <Plus size={16} /> Add Timezone
            </button>
          ) : (
            <div className="w-full space-y-2">
              <input 
                autoFocus
                type="text"
                placeholder="Search city..."
                className="w-full bg-[var(--surface)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filteredCities.length > 0 && (
                <div className="max-h-32 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] shadow-sm">
                  {filteredCities.slice(0, 5).map(city => (
                    <button 
                      key={city.id}
                      onClick={() => addTimezone(city.timezone)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg)]"
                    >
                      {city.name}, {city.country}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setShowSearch(false)} className="text-[10px] text-[var(--t3)] uppercase tracking-wider w-full text-center">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  );
}
