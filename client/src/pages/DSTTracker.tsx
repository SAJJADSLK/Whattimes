import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { DateTime } from 'luxon';

export default function DSTTracker() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Common timezones with DST
  const timezonesWithDST = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Pacific/Auckland',
  ];

  // Calculate DST changes for the year
  const dstChanges = useMemo(() => {
    const changes: Array<{
      timezone: string;
      type: 'spring' | 'fall';
      date: string;
      time: string;
    }> = [];

    timezonesWithDST.forEach((tz) => {
      // Check for DST changes throughout the year
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 28; day++) {
          const dt = DateTime.fromObject(
            { year: selectedYear, month, day, hour: 12 },
            { zone: tz }
          );
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

  // Group by timezone
  const groupedByTimezone = useMemo(() => {
    const grouped: Record<string, typeof dstChanges> = {};
    dstChanges.forEach((change) => {
      if (!grouped[change.timezone]) {
        grouped[change.timezone] = [];
      }
      grouped[change.timezone].push(change);
    });
    return grouped;
  }, [dstChanges]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = '/')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">DST Tracker</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Daylight Saving Time Tracker</h1>
          <p className="text-lg text-slate-600">
            Never miss DST changes across the world
          </p>
        </div>

        {/* Year Selector */}
        <div className="mb-12 flex items-center gap-4">
          <label className="text-sm font-semibold text-slate-700">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
          >
            {[2024, 2025, 2026, 2027, 2028].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* DST Changes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedByTimezone).map(([timezone, changes]) => (
            <div
              key={timezone}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">{timezone}</h3>

              <div className="space-y-4">
                {changes.map((change, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      change.type === 'spring'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-orange-50 border border-orange-200'
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        change.type === 'spring' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {change.type === 'spring' ? 'Spring Forward' : 'Fall Back'}
                      </div>
                      <div className="text-sm text-slate-600">
                        {change.date} at {change.time}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {change.type === 'spring'
                          ? 'Clocks move forward 1 hour'
                          : 'Clocks move back 1 hour'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 border-2 border-blue-200 rounded-xl p-8 space-y-4">
          <h3 className="text-lg font-semibold text-blue-900">About Daylight Saving Time</h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                DST is the practice of setting clocks forward by one hour during warmer months
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Not all countries observe DST; some regions use it partially</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                DST typically begins in spring (March/April) and ends in fall (September/October)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                Always verify DST dates for your specific timezone, as they can vary by region
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
