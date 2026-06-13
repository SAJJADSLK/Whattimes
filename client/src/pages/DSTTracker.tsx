import { useState, useMemo } from 'react';
import { AdSlot } from '@/components/PublicLayout';
import { DateTime } from 'luxon';

export default function DSTTracker() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const timezonesWithDST = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Australia/Sydney',
    'Australia/Melbourne', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong',
    'Asia/Singapore', 'Asia/Dubai', 'Asia/Kolkata', 'Pacific/Auckland',
  ];

  const dstChanges = useMemo(() => {
    const changes: Array<{
      timezone: string;
      type: 'spring' | 'fall';
      date: string;
      time: string;
    }> = [];

    timezonesWithDST.forEach((tz) => {
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 28; day++) {
          const dt = DateTime.fromObject({ year: selectedYear, month, day, hour: 12 }, { zone: tz });
          const dtNext = dt.plus({ days: 1 });
          const isDstNow = dt.isInDST;
          const isDstNext = dtNext.isInDST;

          if (isDstNow !== isDstNext) {
            changes.push({
              timezone: tz,
              type: isDstNext ? 'spring' : 'fall',
              date: dtNext.toFormat('MMM dd, yyyy'),
              time: dtNext.toFormat('HH:mm'),
            });
          }
        }
      }
    });
    return changes;
  }, [selectedYear]);

  const groupedByTimezone = useMemo(() => {
    const grouped: Record<string, typeof dstChanges> = {};
    dstChanges.forEach((change) => {
      if (!grouped[change.timezone]) grouped[change.timezone] = [];
      grouped[change.timezone].push(change);
    });
    return grouped;
  }, [dstChanges]);

  return (
    <div className="space-y-6">
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">DST Tracker</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">Daylight Saving Time</h2>
        <p className="text-[var(--t2)] mt-2">Never miss DST changes across the world</p>
      </section>

      <div className="flex items-center gap-3 py-4">
        <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Select Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[var(--surface)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-1 text-xs outline-none focus:border-[var(--accent)]"
        >
          {[2024, 2025, 2026, 2027, 2028].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <AdSlot />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden">
        {Object.entries(groupedByTimezone).map(([timezone, changes]) => (
          <div key={timezone} className="bg-[var(--surface)] p-6 space-y-4">
            <h3 className="text-[11px] font-semibold text-[var(--t3)] tracking-[.02em] truncate">{timezone}</h3>
            <div className="space-y-3">
              {changes.map((change, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className={`text-[10px] font-bold uppercase tracking-tight ${change.type === 'spring' ? 'text-[var(--green)]' : 'text-[var(--accent)]'}`}>
                    {change.type === 'spring' ? 'Spring Forward' : 'Fall Back'}
                  </div>
                  <div className="font-[var(--mono)] text-[14px] text-[var(--t1)]">{change.date}</div>
                  <div className="text-[11px] text-[var(--t3)]">{change.time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AdSlot />
    </div>
  );
}
