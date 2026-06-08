import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Share2, Plus, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';

export default function MeetingInvite() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'America/New_York']);
  const [meetingTime, setMeetingTime] = useState('14:00');
  const [meetingTitle, setMeetingTitle] = useState('Team Standup');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const generateInvite = () => {
    // Generate a unique invite link
    const inviteId = Math.random().toString(36).substring(2, 11);
    const params = new URLSearchParams({
      id: inviteId,
      title: meetingTitle,
      time: meetingTime,
      timezones: selectedTimezones.join(','),
    });
    const link = `${window.location.origin}/invite/${inviteId}?${params.toString()}`;
    setInviteLink(link);
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
              onClick={() => (window.location.href = '/')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Meeting Invite</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Create Meeting Invite</h1>
          <p className="text-lg text-slate-600">
            Generate shareable meeting invites with automatic timezone localization
          </p>
        </div>

        <div className="space-y-8">
          {/* Meeting Details */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Meeting Title
              </label>
              <Input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-lg py-3"
                placeholder="e.g., Team Standup"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Meeting Time (UTC)
              </label>
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-lg py-3"
              />
            </div>

            {/* Timezone Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-4">
                Participant Timezones
              </label>

              <div className="relative mb-4">
                <Button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 justify-start"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Timezone
                </Button>

                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg p-4 z-10">
                    <Input
                      type="text"
                      placeholder="Search cities or timezones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4 border-2 border-slate-200 focus:border-blue-600"
                      autoFocus
                    />

                    {filteredCities.length > 0 && (
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredCities.slice(0, 20).map((city) => (
                          <button
                            key={city.id}
                            onClick={() => addTimezone(city.timezone)}
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

              {/* Selected Timezones */}
              <div className="flex flex-wrap gap-2">
                {selectedTimezones.map((tz) => (
                  <div
                    key={tz}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full"
                  >
                    <span className="font-medium">{tz}</span>
                    <button
                      onClick={() => removeTimezone(tz)}
                      className="hover:text-blue-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Meeting Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTimezones.map((timezone) => (
                <MeetingTimeCard
                  key={timezone}
                  timezone={timezone}
                  meetingTime={meetingTime}
                />
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateInvite}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Generate Invite Link
          </Button>

          {/* Invite Link Display */}
          {inviteLink && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-green-900">Invite Link Generated!</h3>
              <div className="bg-white border-2 border-green-200 rounded-lg p-4 flex items-center justify-between">
                <code className="text-sm text-slate-600 break-all">{inviteLink}</code>
                <Button
                  onClick={copyToClipboard}
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-green-700">
                Share this link with participants. Each person will see the meeting time in their local timezone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MeetingTimeCard({
  timezone,
  meetingTime,
}: {
  timezone: string;
  meetingTime: string;
}) {
  // Parse meeting time
  const [hours, minutes] = meetingTime.split(':').map(Number);

  // Create a date with the meeting time in UTC
  const meetingDate = new Date();
  meetingDate.setUTCHours(hours, minutes, 0, 0);

  // Format time in the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const localTime = formatter.format(meetingDate);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
      <div className="text-sm text-slate-500 mb-1">{timezone}</div>
      <div className="text-3xl font-mono font-bold text-blue-600">{localTime}</div>
    </div>
  );
}
