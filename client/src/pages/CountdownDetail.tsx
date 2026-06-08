import { useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CountdownData {
  id: string;
  title: string;
  targetTime: number;
  createdBy: string;
  description?: string;
}

export default function CountdownDetail() {
  const [route, params] = useRoute('/countdown/:countdownId');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mock countdown data - in production, this would come from the server
  const countdown: CountdownData = {
    id: params?.countdownId || '',
    title: 'Product Launch',
    targetTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
    createdBy: 'Team',
    description: 'Countdown to our biggest product launch of the year',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = countdown.targetTime - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown.targetTime]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = timeRemaining.days === 0 && timeRemaining.hours === 0 && 
                    timeRemaining.minutes === 0 && timeRemaining.seconds === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{countdown.title}</h1>
          {countdown.description && (
            <p className="text-gray-600">{countdown.description}</p>
          )}
        </div>

        {/* Main Countdown Card */}
        <Card className="mb-6 p-12 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          {isExpired ? (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600 mb-2">🎉 Time's Up!</h2>
              <p className="text-gray-600">The countdown has finished!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Countdown Display */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: timeRemaining.days, label: 'Days' },
                  { value: timeRemaining.hours, label: 'Hours' },
                  { value: timeRemaining.minutes, label: 'Minutes' },
                  { value: timeRemaining.seconds, label: 'Seconds' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-white rounded-lg p-4 mb-2 shadow">
                      <div className="text-4xl font-bold text-blue-600">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((countdown.targetTime - Date.now()) / (15 * 24 * 60 * 60 * 1000)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Share Section */}
        <Card className="mb-6 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share This Countdown
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={window.location.href}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-600"
            />
            <Button
              onClick={handleCopyLink}
              variant="default"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Info Section */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">About This Countdown</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Created by:</span> {countdown.createdBy}
            </p>
            <p>
              <span className="font-medium">Target Date:</span>{' '}
              {new Date(countdown.targetTime).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Countdown ID:</span> {countdown.id}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
