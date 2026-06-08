import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, X, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';

export default function TeamDashboard() {
  const [teamCities, setTeamCities] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Fetch all cities
  const { data: allCities } = trpc.cities.getAll.useQuery({
    limit: 200,
  });

  // Filter cities based on search
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

  const addCity = (timezone: string) => {
    if (!teamCities.includes(timezone)) {
      setTeamCities([...teamCities, timezone]);
    }
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeCity = (timezone: string) => {
    setTeamCities(teamCities.filter((tz) => tz !== timezone));
  };

  // Calculate working hours overlap
  const calculateOverlap = useMemo(() => {
    if (teamCities.length === 0) return null;

    const overlapHours: Record<number, number> = {};

    // Check each hour of the day
    for (let hour = 0; hour < 24; hour++) {
      let workingCount = 0;

      teamCities.forEach((timezone) => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          hour12: false,
        });

        const localHour = parseInt(formatter.format(now));
        // Working hours: 9 AM to 5 PM
        if (localHour >= 9 && localHour < 17) {
          workingCount++;
        }
      });

      overlapHours[hour] = workingCount;
    }

    return overlapHours;
  }, [teamCities]);

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
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Team Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Team Timezone Management</h1>
          <p className="text-lg text-slate-600">
            Manage your team's timezones and find the best meeting times
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: City Management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>

              <div className="relative">
                <Button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 justify-start"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Timezone
                </Button>

                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg p-4 z-10">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full mb-4 border-2 border-slate-200 focus:border-blue-600 rounded-lg px-3 py-2 focus:outline-none"
                      autoFocus
                    />

                    {filteredCities.length > 0 && (
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredCities.slice(0, 20).map((city) => (
                          <button
                            key={city.id}
                            onClick={() => addCity(city.timezone)}
                            className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <div className="font-semibold text-slate-900">{city.name}</div>
                            <div className="text-sm text-slate-500">{city.timezone}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {teamCities.map((tz) => (
                  <div
                    key={tz}
                    className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <span className="font-medium text-slate-900">{tz}</span>
                    <button
                      onClick={() => removeCity(tz)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Team Times & Overlap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Times */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Current Times</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamCities.map((timezone) => (
                  <TeamMemberCard key={timezone} timezone={timezone} />
                ))}
              </div>
            </div>

            {/* Working Hours Overlap */}
            {calculateOverlap && (
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Working Hours Overlap</h3>
                <div className="space-y-2">
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const overlap = calculateOverlap[hour];
                    const percentage = (overlap / teamCities.length) * 100;
                    let color = 'bg-red-500'; // No overlap
                    if (percentage >= 75) color = 'bg-green-500'; // Full overlap
                    else if (percentage >= 50) color = 'bg-yellow-500'; // Partial overlap

                    return (
                      <div key={hour} className="flex items-center gap-3">
                        <div className="w-12 text-sm font-semibold text-slate-600">
                          {String(hour).padStart(2, '0')}:00
                        </div>
                        <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                          <div
                            className={`h-full ${color} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-slate-600">
                          {overlap}/{teamCities.length}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span>Full overlap (75-100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded" />
                    <span>Partial (50-75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />
                    <span>Limited (&lt;50%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ timezone }: { timezone: string }) {
  const { time } = useRealTimeClock(timezone);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-slate-200 rounded-lg p-4">
      <div className="text-sm text-slate-600 mb-2">{timezone}</div>
      <div className="text-3xl font-mono font-bold text-blue-600">
        {time ? formatClockTime(time) : '00:00:00'}
      </div>
      <div className="text-xs text-slate-500 mt-2">
        {time?.isDst ? 'DST Active' : 'Standard Time'}
      </div>
    </div>
  );
}
