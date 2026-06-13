import { useState, useEffect } from 'react';
import { AdSlot } from '@/components/PublicLayout';
import { Copy, Share2, Play, Pause, RotateCcw } from 'lucide-react';

export default function Countdown() {
  const [eventName, setEventName] = useState('New Year 2027');
  const [targetDate, setTargetDate] = useState('2027-01-01');
  const [targetTime, setTargetTime] = useState('00:00');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsRunning(false);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime, isRunning]);

  const generateShareLink = () => {
    const countdownId = Math.random().toString(36).substring(2, 11);
    const link = `${window.location.origin}/countdown/${countdownId}`;
    setShareLink(link);
  };

  return (
    <div className="space-y-6">
      <section className="py-9 border-b border-[var(--border)]">
        <h1 className="text-[10.5px] font-bold text-[var(--t3)] tracking-[.11em] uppercase mb-2">Countdown</h1>
        <h2 className="text-3xl font-bold text-[var(--t1)]">Countdown to Your Event</h2>
        <p className="text-[var(--t2)] mt-2">Create shareable countdowns for events and launches</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Event Name</label>
            <input 
              type="text" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Date</label>
              <input 
                type="date" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Time</label>
              <input 
                type="time" 
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--brd2)] rounded-[var(--r)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
          <button 
            onClick={generateShareLink}
            className="w-full bg-[var(--accent)] text-white py-2 rounded-[var(--r)] text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Generate Link
          </button>
        </div>

        <div className="bg-[var(--t1)] text-white rounded-[var(--r)] p-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">{eventName}</div>
          <div className="grid grid-cols-4 gap-4 w-full">
            <CountdownUnit label="Days" value={timeRemaining?.days || 0} />
            <CountdownUnit label="Hrs" value={timeRemaining?.hours || 0} />
            <CountdownUnit label="Min" value={timeRemaining?.minutes || 0} />
            <CountdownUnit label="Sec" value={timeRemaining?.seconds || 0} />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsRunning(!isRunning)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => setTimeRemaining(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      <AdSlot />

      {shareLink && (
        <div className="bg-[var(--gnlo)] border border-[var(--green)] rounded-[var(--r)] p-4 flex items-center justify-between gap-4">
          <div className="truncate text-xs font-[var(--mono)] text-[var(--green)]">{shareLink}</div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
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

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="font-[var(--mono)] text-3xl font-light">{String(value).padStart(2, '0')}</div>
      <div className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-tighter">{label}</div>
    </div>
  );
}
