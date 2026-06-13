import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { AdSlot } from '@/components/PublicLayout';
import { Share2, Plus, X, Copy } from 'lucide-react';

export default function MeetingInvite() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'America/New_York']);
  const [meetingTime, setMeetingTime] = useState('14:00');
  const [meetingTitle, setMeetingTitle] = useState('Team Standup');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const generateInvite = () => {
    const inviteId = Math.random().toString(36).substring(2, 11);
    const link = `${window.location.origin}/invite/${inviteId}`;
    setInviteLink(link);
  };

  return (
    <div className="space-y-6">
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">Meeting</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">Create Meeting Invite</h2>
        <p className="text-[var(--t2)] mt-2">Generate shareable meeting invites with automatic localization</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Meeting Title</label>
            <input 
              type="text" 
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Time (UTC)</label>
            <input 
              type="time" 
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Participants</label>
            <div className="flex flex-wrap gap-2">
              {selectedTimezones.map(tz => (
                <div key={tz} className="flex items-center gap-1 bg-[var(--bg2)] px-2 py-1 rounded-[var(--r)] text-xs text-[var(--t2)] border border-[var(--border)]">
                  {tz}
                  <button onClick={() => removeTimezone(tz)} className="hover:text-[var(--accent)]"><X size={10} /></button>
                </div>
              ))}
              <button onClick={() => setShowSearch(!showSearch)} className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider">+ Add</button>
            </div>
            {showSearch && (
              <div className="mt-2 space-y-2">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search city..."
                  className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
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
              </div>
            )}
          </div>
          <button 
            onClick={generateInvite}
            className="w-full bg-[var(--accent)] text-white py-2 rounded-[var(--r)] text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Generate Invite
          </button>
        </div>

        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r)] p-6 space-y-4">
          <div className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase">Local Previews</div>
          <div className="space-y-3">
            {selectedTimezones.map(tz => (
              <div key={tz} className="bg-[var(--surface)] p-3 border border-[var(--border)] rounded-[var(--r)] flex justify-between items-center">
                <div className="text-[11px] font-semibold text-[var(--t3)]">{tz}</div>
                <div className="font-[var(--mono)] text-[18px] font-light text-[var(--t1)]">14:00</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdSlot />

      {inviteLink && (
        <div className="bg-[var(--gnlo)] border border-[var(--green)] rounded-[var(--r)] p-4 flex items-center justify-between gap-4">
          <div className="truncate text-xs font-[var(--mono)] text-[var(--green)]">{inviteLink}</div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="shrink-0 bg-[var(--green)] text-white px-3 py-1.5 rounded-[var(--r)] text-xs font-medium"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      <AdSlot />
    </div>
  );
}
