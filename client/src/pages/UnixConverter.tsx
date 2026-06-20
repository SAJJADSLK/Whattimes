import { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UnixConverter() {
  const { t } = useTranslation();
  const [unixTimestamp, setUnixTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [humanDate, setHumanDate] = useState(new Date().toISOString());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHumanDate(new Date(unixTimestamp * 1000).toISOString());
  }, [unixTimestamp]);

  const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setUnixTimestamp(value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setUnixTimestamp(Math.floor(date.getTime() / 1000));
    setHumanDate(date.toISOString());
  };

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setUnixTimestamp(now);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(unixTimestamp * 1000);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-light">
            <span className="font-semibold text-accent">{t('unixConverter.heading')}</span>
          </h1>
          <p className="text-lg text-foreground/70">{t('unixConverter.subtitle')}</p>
        </div>

        {/* Converter */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
          
          <div className="relative bg-card border border-border rounded-lg p-8 luxury-shadow space-y-6">
            {/* Art Deco corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

            {/* Unix Timestamp Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground/60 uppercase">{t('unixConverter.unixTimestamp')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={unixTimestamp}
                  onChange={handleUnixChange}
                  className="flex-1 bg-background border border-border rounded px-4 py-3 font-mono text-sm"
                />
                <button
                  onClick={() => handleCopy(unixTimestamp.toString())}
                  className="px-4 py-3 bg-foreground/10 hover:bg-foreground/20 rounded transition-luxury"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="art-deco-divider" />

            {/* Human Date Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground/60 uppercase">{t('unixConverter.isoDate')}</label>
              <input
                type="datetime-local"
                value={humanDate.slice(0, 16)}
                onChange={handleDateChange}
                className="w-full bg-background border border-border rounded px-4 py-3 text-sm"
              />
            </div>

            <div className="art-deco-divider" />

            {/* Date Information */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground/60 uppercase">{t('unixConverter.date')}</p>
                  <p className="font-mono text-sm">{date.toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground/60 uppercase">{t('unixConverter.time')}</p>
                  <p className="font-mono text-sm">{date.toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground/60 uppercase">{t('unixConverter.fullIso')}</p>
                <p className="font-mono text-xs break-all text-accent">{date.toISOString()}</p>
              </div>
            </div>

            {/* Now Button */}
            <button
              onClick={handleNow}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-luxury font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              {t('unixConverter.currentUnixTime')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
