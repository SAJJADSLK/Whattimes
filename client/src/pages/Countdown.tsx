import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Share2, Play, Pause, RotateCcw } from 'lucide-react';

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

  // Calculate time remaining
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
    const params = new URLSearchParams({
      id: countdownId,
      name: eventName,
      date: targetDate,
      time: targetTime,
    });
    const link = `${window.location.origin}/countdown/${countdownId}?${params.toString()}`;
    setShareLink(link);
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetCountdown = () => {
    setIsRunning(false);
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
            <span className="text-xl font-bold text-slate-900">Countdown Timer</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Countdown to Your Event</h1>
          <p className="text-lg text-slate-600">Create shareable countdowns for events and launches</p>
        </div>

        <div className="space-y-8">
          {/* Event Details */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Event Name
              </label>
              <Input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-lg py-3"
                placeholder="e.g., New Year 2027"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Target Date
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-lg py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Target Time
                </label>
                <Input
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-lg py-3"
                />
              </div>
            </div>
          </div>

          {/* Countdown Display */}
          {timeRemaining && (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-12 text-white text-center space-y-8">
              <h2 className="text-3xl font-bold">{eventName}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CountdownUnit label="Days" value={timeRemaining.days} />
                <CountdownUnit label="Hours" value={timeRemaining.hours} />
                <CountdownUnit label="Minutes" value={timeRemaining.minutes} />
                <CountdownUnit label="Seconds" value={timeRemaining.seconds} />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetCountdown}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Generate Share Link */}
          <Button
            onClick={generateShareLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Generate Shareable Link
          </Button>

          {/* Share Link Display */}
          {shareLink && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-green-900">Countdown Link Generated!</h3>
              <div className="bg-white border-2 border-green-200 rounded-lg p-4 flex items-center justify-between">
                <code className="text-sm text-slate-600 break-all">{shareLink}</code>
                <Button
                  onClick={copyToClipboard}
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-green-700">
                Share this link with anyone to let them watch the countdown in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
      <div className="text-4xl font-bold mb-2">{String(value).padStart(2, '0')}</div>
      <div className="text-sm font-semibold opacity-90">{label}</div>
    </div>
  );
}
