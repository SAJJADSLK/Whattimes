import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, Share2, BarChart3, Clock, Code, ArrowRight, MapPin, Edit2, Check, X } from 'lucide-react';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { useTimezoneDetection } from '@/hooks/useTimezoneDetection';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const { timezone: detectedTimezone, isLoading: tzLoading } = useTimezoneDetection();
  const userTz = detectedTimezone?.name || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { time, isLoading } = useRealTimeClock(userTz);
  const [userTimezone, setUserTimezone] = useState(userTz);
  const [isEditingTz, setIsEditingTz] = useState(false);
  const [tzSearch, setTzSearch] = useState('');
  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 500 });
  
  const filteredCities = useMemo(() => {
    if (!allCities || !tzSearch) return [];
    const query = tzSearch.toLowerCase();
    return allCities.filter(c => 
      c.timezone.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [allCities, tzSearch]);

  const { data: sunTimes } = trpc.time.getSunTimes.useQuery(
    {
      latitude: 0,
      longitude: 0,
      timezone: userTimezone,
    },
    { enabled: !!time }
  );

  useEffect(() => {
    if (detectedTimezone) {
      try {
        const saved = localStorage.getItem('whattime-user-timezone');
        if (saved) {
          setUserTimezone(saved);
        } else {
          setUserTimezone(detectedTimezone.name);
          localStorage.setItem('whattime-user-timezone', detectedTimezone.name);
        }
      } catch (e) {
        setUserTimezone(detectedTimezone.name);
      }
    }
  }, [detectedTimezone]);

  const handleTimezoneChange = (tz: string) => {
    setUserTimezone(tz);
    try {
      localStorage.setItem('whattime-user-timezone', tz);
    } catch (e) {
      console.error('Failed to save timezone preference');
    }
    setIsEditingTz(false);
    setTzSearch('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION - Minimalist + Art Deco */}
      <section className="relative overflow-hidden">
        {/* Art Deco background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          {/* Sunburst rays anchoring the top of the hero, just under the nav */}
          <svg
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-[140%] max-w-4xl opacity-[0.07] pointer-events-none"
            viewBox="0 0 800 200"
            fill="none"
          >
            {Array.from({ length: 17 }).map((_, i) => {
              const angle = (i / 16) * 180;
              const rad = (angle * Math.PI) / 180;
              const x2 = 400 + 700 * Math.cos(rad);
              const y2 = 200 - 700 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1="400"
                  y1="200"
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  className="text-accent"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pt-20 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Premium Typography */}
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-xs font-semibold tracking-widest text-accent uppercase">{t('home.badge')}</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight leading-tight">
                  <span className="font-semibold text-accent">{t('app.tagline')}</span>
                </h1>
                
                <p className="text-lg text-foreground/70 max-w-lg leading-relaxed">
                  {t('home.subtitle')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 pt-4">
                <button className="btn-premium bg-foreground text-background hover:bg-foreground/90">
                  {t('home.cta.getStarted')}
                </button>
                <button className="btn-premium border border-foreground/20 hover:border-foreground/40">
                  {t('home.cta.learnMore')}
                </button>
              </div>
            </div>

            {/* Right: Premium Clock Display */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Decorative Art Deco frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
                
                <div className="relative bg-card border border-border rounded-lg p-8 luxury-shadow">
                  {/* Art Deco corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

                  <div className="space-y-8">
                    {/* Large Clock */}
                    <div className="text-center space-y-3">
                      <div className="text-6xl font-light font-mono tracking-wider text-foreground">
                        {isLoading ? '00:00:00' : formatClockTime(time)}
                      </div>
                      <div className="art-deco-divider" />
                      <div className="text-sm font-semibold tracking-widest text-foreground/60 uppercase">
                        {time?.timezone || t('common.loading')}
                      </div>
                    </div>

                    {/* Timezone Info */}
                    {detectedTimezone && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60">{t('home.location')}</span>
                          <span className="font-semibold">{detectedTimezone.city || detectedTimezone.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60">{t('home.utcOffset')}</span>
                          <span className="font-mono font-semibold text-accent">{detectedTimezone.offsetString}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Minimalist Grid */}
      <section className="relative py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">{t('home.capabilitiesBadge')}</span>
            <h2 className="text-5xl font-light">
              <span className="font-semibold">{t('home.featuresTitleBold')}</span> {t('home.featuresTitleRest')}
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(() => {
              const icons = [Globe, Zap, Users, Clock, BarChart3, Share2];
              const features = t('home.features', { returnObjects: true }) as Array<{ title: string; desc: string }>;
              return icons.map((Icon, idx) => {
                const feature = features[idx];
                return (
                  <div key={idx} className="minimalist-card group">
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-luxury">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-sm text-foreground/60">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Art Deco Inspired */}
      <section className="relative py-32 bg-foreground text-background overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1 h-32 bg-accent" />
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-accent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-light">
              <span className="font-semibold">{t('home.ctaSection.titleBold')}</span> {t('home.ctaSection.titleRest')}
            </h2>
            <p className="text-lg text-background/70">
              {t('home.ctaSection.subtitle')}
            </p>
          </div>

          <button className="btn-premium bg-accent text-foreground hover:bg-accent/90 mx-auto">
            {t('home.ctaSection.button')} <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>

      {/* FOOTER - Minimalist */}
      <footer className="border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-accent" />
                <span className="font-semibold text-lg">WhatTime</span>
              </div>
              <p className="text-sm text-foreground/60">{t('app.description')}</p>
            </div>

            {(t('home.footer.columns', { returnObjects: true }) as Array<{ title: string; links: string[] }>).map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="font-semibold text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition-luxury">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-foreground/60">
            <p>{t('home.footer.copyright', { year: new Date().getFullYear() })}</p>
            <div className="flex gap-4">
              {(t('home.footer.social', { returnObjects: true }) as string[]).map((social) => (
                <a key={social} href="#" className="hover:text-foreground transition-luxury">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
