import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, Share2, BarChart3, Clock, Code, ArrowRight, MapPin, Edit2, Check, X } from 'lucide-react';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { useTimezoneDetection } from '@/hooks/useTimezoneDetection';
import { Input } from '@/components/ui/input';
import { LanguageSelector } from '@/components/LanguageSelector';
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

  // Get sunrise/sunset times
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* NO DUPLICATE NAV - MobileNav is global in App.tsx */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Clock Display */}
            <div className="flex flex-col items-center lg:items-start gap-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Always On Time
                  </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg">
                  Precision timekeeping for a connected world. Real-time clock synchronization, timezone conversion, and team coordination tools.
                </p>
              </div>

              {/* Large Clock Display */}
              <div className="w-full max-w-md">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="space-y-6">
                    {/* Time */}
                    <div className="text-center">
                      <div className="text-7xl font-mono font-bold text-blue-600 tracking-wider">
                        {isLoading ? '00:00:00' : formatClockTime(time)}
                      </div>
                      <div className="text-sm text-slate-500 mt-2">
                        {time?.timezone || 'Loading...'}
                      </div>
                    </div>

                    {/* Detected Timezone Card */}
                    {detectedTimezone && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-slate-700">Your Timezone</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Location:</span>
                            <span className="font-medium text-slate-900">{detectedTimezone.city || detectedTimezone.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">UTC Offset:</span>
                            <span className="font-mono font-medium text-blue-600">{detectedTimezone.offsetString}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">DST Status:</span>
                            <span className={`text-sm font-medium ${detectedTimezone.isDST ? 'text-amber-600' : 'text-green-600'}`}>
                              {detectedTimezone.isDST ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date & Info */}
                    <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date</span>
                        <span className="font-medium text-slate-900">
                          {time?.date ? new Date(time.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }) : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Week</span>
                        <span className="font-medium text-slate-900">
                          {time?.weekNumber ? `Week ${time.weekNumber}` : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">DST</span>
                        <span className={`font-medium ${time?.isDst ? 'text-amber-600' : 'text-green-600'}`}>
                          {time?.isDst ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Sunrise/Sunset */}
                    {sunTimes && (
                      <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sunrise</span>
                          <span className="font-medium text-slate-900">{sunTimes.sunrise}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sunset</span>
                          <span className="font-medium text-slate-900">{sunTimes.sunset}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Feature Cards */}
              {[
                {
                  icon: Globe,
                  title: 'World Clock',
                  desc: '100+ cities at a glance with real-time updates',
                  href: '/world-clock',
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  icon: Zap,
                  title: 'Instant Converter',
                  desc: 'Compare times across multiple timezones',
                  href: '/converter',
                  color: 'from-cyan-500 to-cyan-600',
                },
                {
                  icon: Users,
                  title: 'Team Dashboard',
                  desc: 'Find perfect meeting times for distributed teams',
                  href: '/team-dashboard',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  icon: Share2,
                  title: 'Smart Invites',
                  desc: 'Share meeting times with automatic localization',
                  href: '/meeting-invite',
                  color: 'from-pink-500 to-pink-600',
                },
                {
                  icon: BarChart3,
                  title: 'DST Tracker',
                  desc: 'Never miss daylight saving time changes',
                  href: '/dst-tracker',
                  color: 'from-amber-500 to-amber-600',
                },
                {
                  icon: Clock,
                  title: 'Countdown Timer',
                  desc: 'Shareable countdowns for events and launches',
                  href: '/countdown',
                  color: 'from-red-500 to-red-600',
                },
                {
                  icon: MapPin,
                  title: 'Countries & Cities',
                  desc: 'Browse all countries and their timezones',
                  href: '/countries',
                  color: 'from-emerald-500 to-emerald-600',
                },
              ].map((feature, idx) => (
                <a
                  key={idx}
                  href={feature.href}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{feature.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </a>
              ))}

              {/* Widget Card */}
              <a
                href="/widget"
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Embed Widget
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">Add a customizable clock to your website</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to master time zones?</h2>
          <p className="text-blue-100 mb-8">Start using WhatTime today for seamless global coordination</p>
          <Button size="lg" variant="secondary" className="gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-white">WhatTime</span>
              </div>
              <p className="text-sm">Precision timekeeping for a connected world</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex justify-between items-center">
            <p className="text-sm">© 2024 WhatTime. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition">GitHub</a>
              <a href="#" className="text-slate-400 hover:text-white transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
