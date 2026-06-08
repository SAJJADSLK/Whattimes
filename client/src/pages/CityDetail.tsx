import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Sun, Moon } from 'lucide-react';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';

export default function CityDetail() {
  const [cityName] = useState('New York');
  const [timezone] = useState('America/New_York');

  const { time } = useRealTimeClock(timezone);

  // Set page title and meta tags for SEO
  useEffect(() => {
    document.title = `${cityName} Time - Chronos`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Current time in ${cityName} (${timezone}). Real-time clock, timezone offset, DST status, and sunrise/sunset times.`
      );
    }
  }, [cityName, timezone]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = '/world-clock')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">{cityName}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900">{cityName}</h1>
            <p className="text-xl text-slate-600">{timezone}</p>
          </div>

          {/* Large Clock Display */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white text-center space-y-6">
            <div className="text-7xl font-mono font-bold">
              {time ? formatClockTime(time) : '00:00:00'}
            </div>
            <div className="text-2xl font-semibold">{time?.date || 'Loading...'}</div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Timezone Info */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Timezone Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Timezone</span>
                <span className="font-semibold text-slate-900">{timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">UTC Offset</span>
                <span className="font-semibold text-slate-900">
                  {time ? `UTC${time.offset >= 0 ? '+' : ''}${Math.floor(time.offset / 60)}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Daylight Saving</span>
                <span className={`font-semibold ${time?.isDst ? 'text-orange-600' : 'text-slate-900'}`}>
                  {time?.isDst ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Week Number</span>
                <span className="font-semibold text-slate-900">
                  {time?.weekNumber ? `Week ${time.weekNumber}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Sun Times */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-600" />
              Sun Schedule
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Sun className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-sm text-slate-600">Sunrise</div>
                  <div className="text-2xl font-semibold text-slate-900">06:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Moon className="w-8 h-8 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-600">Sunset</div>
                  <div className="text-2xl font-semibold text-slate-900">08:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 space-y-4">
          <h3 className="text-lg font-semibold text-blue-900">About {cityName}</h3>
          <p className="text-blue-800">
            {cityName} is located in the {timezone} timezone. This page displays real-time information
            including the current time, timezone offset, daylight saving time status, and sunrise/sunset
            times. Use this information for scheduling meetings, coordinating with teams, or planning events
            across different timezones.
          </p>
        </div>

        {/* SEO Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: cityName,
            description: `Current time and timezone information for ${cityName}`,
            url: `https://chronos.example.com/city/${timezone}`,
          })}
        </script>
      </div>
    </div>
  );
}
