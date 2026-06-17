import { useParams } from 'wouter';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Globe, Zap, Share2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CityPage() {
  const { t } = useTranslation();
  const { country, city } = useParams<{ country: string; city: string }>();
  const [copied, setCopied] = useState(false);

  // Fetch city data
  const { data: cityData, isLoading } = trpc.cities.getByName.useQuery(
    { name: city || '', country: country || '' },
    { enabled: !!city && !!country }
  );

  // Get real-time clock
  const { time } = useRealTimeClock(cityData?.timezone || 'UTC');

  // Get sun times
  const { data: sunTimes } = trpc.time.getSunTimes.useQuery(
    {
      latitude: cityData?.latitude || 0,
      longitude: cityData?.longitude || 0,
      timezone: cityData?.timezone || 'UTC',
    },
    { enabled: !!cityData }
  );

  const handleCopyTime = () => {
    const timeStr = formatClockTime(time);
    navigator.clipboard.writeText(timeStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-foreground/60">Loading city data...</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">City Not Found</h1>
          <p className="text-foreground/60">We couldn't find {city}, {country}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-foreground/60">
            <a href="/" className="hover:text-accent transition-luxury">Home</a>
            <span>/</span>
            <a href={`/${country}`} className="hover:text-accent transition-luxury">{country}</a>
            <span>/</span>
            <span className="text-accent">{cityData.name}</span>
          </div>

          {/* Title */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl lg:text-6xl font-light">
              Current Time in <span className="font-semibold text-accent">{cityData.name}</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Real-time clock for {cityData.name}, {country}
            </p>
          </div>

          {/* Large Clock Display */}
          <div className="relative max-w-2xl">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
            
            <div className="relative bg-card border border-border rounded-lg p-12 luxury-shadow">
              {/* Art Deco corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

              <div className="space-y-8">
                {/* Time */}
                <div className="text-center space-y-3">
                  <div className="text-7xl font-light font-mono tracking-wider text-foreground">
                    {formatClockTime(time)}
                  </div>
                  <div className="art-deco-divider" />
                  <div className="text-sm font-semibold tracking-widest text-foreground/60 uppercase">
                    {time?.timezone || 'Loading...'}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">Location</span>
                    <p className="text-lg font-semibold">{cityData.name}, {country}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">Timezone</span>
                    <p className="text-lg font-mono font-semibold text-accent">{cityData.timezone}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">UTC Offset</span>
                    <p className="text-lg font-mono font-semibold">{time?.utcOffset || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">Coordinates</span>
                    <p className="text-sm font-mono">{cityData.latitude.toFixed(2)}°, {cityData.longitude.toFixed(2)}°</p>
                  </div>
                </div>

                {/* Sun Times */}
                {sunTimes && (
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">Sunrise</span>
                      <p className="text-lg font-mono font-semibold">{sunTimes.sunrise}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">Sunset</span>
                      <p className="text-lg font-mono font-semibold">{sunTimes.sunset}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <button
                    onClick={handleCopyTime}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-luxury"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Time'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-luxury">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Cities */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light mb-12">
            Other Cities in <span className="font-semibold text-accent">{country}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Would load related cities here */}
            <div className="minimalist-card">
              <p className="text-foreground/60">Loading related cities...</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 border-t border-border bg-foreground/2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-light mb-6">
              About <span className="font-semibold text-accent">{cityData.name}</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              {cityData.name} is located in {country} and operates on the {cityData.timezone} timezone. 
              This page provides real-time, accurate time information for {cityData.name}, including current time, 
              timezone details, sunrise and sunset times, and geographic coordinates.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Use this page to check the current time in {cityData.name} for scheduling meetings, 
              coordinating with teams, or planning international activities. The time is automatically 
              synchronized and updates every second.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
