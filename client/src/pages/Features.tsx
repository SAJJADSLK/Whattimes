import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Globe, Repeat, Users, Timer as TimerIcon, CalendarClock, Hash, BellRing } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

const FEATURES = [
  { icon: Globe, title: 'World Clock', desc: 'Live time for hundreds of cities worldwide, updated every second.', href: '/world-clock' },
  { icon: Repeat, title: 'Timezone Converter', desc: 'Compare multiple timezones side by side with a drag-to-scrub timeline.', href: '/converter' },
  { icon: Users, title: 'Meeting Scheduler', desc: 'Find the best meeting time across every timezone your team works in.', href: '/meeting-invite' },
  { icon: CalendarClock, title: 'DST Tracker', desc: 'Track upcoming daylight saving time changes for any timezone.', href: '/dst-tracker' },
  { icon: BellRing, title: 'Countdown Timer', desc: 'Create and share countdowns to any date and time.', href: '/countdown' },
  { icon: Hash, title: 'Unix Timestamp Converter', desc: 'Convert Unix timestamps to and from human-readable dates instantly.', href: '/unix-converter' },
  { icon: TimerIcon, title: 'Timer & Calendar', desc: 'A simple countdown timer and calendar for everyday planning.', href: '/timer' },
  { icon: Users, title: 'Team Dashboard', desc: 'See your whole distributed team\u2019s local time at a glance.', href: '/team-dashboard' },
];

export default function Features() {
  useEffect(() => {
    setSEOMeta({
      title: 'WhatTime Features - World Clock, Converter, Scheduler & More',
      description:
        'Explore all WhatTime features: world clock, timezone converter, meeting scheduler, DST tracker, countdown timer, and unix timestamp converter.',
      url: `${SITE_URL}/features`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to WhatTime
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-7 h-7 text-accent" />
          <span className="font-semibold text-lg">WhatTime</span>
        </div>

        <h1 className="text-4xl font-semibold mb-3">Everything you need to manage time zones</h1>
        <p className="text-foreground/60 mb-12 max-w-2xl">
          One free toolkit for checking the time anywhere, converting between zones, and
          scheduling across a distributed team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, href }) => (
            <Link key={href} href={href} className="minimalist-card p-6 rounded-lg border border-border block hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-sm text-foreground/60">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
