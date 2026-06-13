import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, X, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { TimeScrubber } from '@/components/TimeScrubber';

export default function Converter() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'America/New_York']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrubberTime, setScrubberTime] = useState(0); // Time in milliseconds from midnight

  // Fetch all cities for timezone selection
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

  const { time } = useRealTimeClock();

  // Calculate time for each timezone based on scrubber
  const calculateTimeForTimezone = (timezone: string) => {
    try {
      const now = new Date(Date.now() + scrubberTime);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      return formatter.format(now);
    } catch {
      return '--:--:--';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Timezone Converter</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Time Scrubber Section */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Adjust Time</h2>
          <TimeScrubber value={scrubberTime} onChange={setScrubberTime} />
        </div>

        {/* Timezone Comparison Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Timezones</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {selectedTimezones.map((timezone) => (
              <div
                key={timezone}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 relative"
              >
                <button
                  onClick={() => removeTimezone(timezone)}
                  className="absolute top-2 right-2 p-1 hover:bg-blue-200 rounded"
                  title="Remove timezone"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{timezone}</h3>
                </div>

                <div className="text-4xl font-bold text-blue-600 font-mono mb-2">
                  {calculateTimeForTimezone(timezone)}
                </div>

                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    timeZone: timezone,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add Timezone Button */}
          <div className="relative">
            <Button
              onClick={() => setShowSearch(!showSearch)}
              variant="outline"
              className="gap-2 mb-4"
            >
              <Plus className="w-4 h-4" />
              Add Timezone
            </Button>

            {showSearch && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                <Input
                  placeholder="Search cities or timezones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                  autoFocus
                />

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredCities?.slice(0, 20).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => addTimezone(city.timezone)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-600">{city.timezone}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tip</h3>
          <p className="text-gray-700">
            Use the time scrubber above to see how times change throughout the day across all selected timezones. This is perfect for finding the best meeting time for distributed teams.
          </p>
        </div>
      </div>
    </div>
  );
}
