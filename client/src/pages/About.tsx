import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Globe, Users, Zap } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function About() {
  useEffect(() => {
    setSEOMeta({
      title: 'About WhatTime - Precision Timekeeping for a Connected World',
      description:
        'Learn about WhatTime, a free world clock, timezone converter, and meeting scheduler built to help distributed teams and travelers coordinate across time zones.',
      url: `${SITE_URL}/about`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to WhatTime
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-7 h-7 text-accent" />
          <span className="font-semibold text-lg">WhatTime</span>
        </div>

        <h1 className="text-4xl font-semibold mb-6">About WhatTime</h1>

        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            WhatTime is a free set of timekeeping tools built for anyone who works, travels,
            or keeps in touch across time zones. Our world clock, timezone converter, meeting
            scheduler, and DST tracker are designed to answer one simple question as quickly
            as possible: what time is it, there, right now?
          </p>
          <p>
            The project grew out of a common frustration: existing timezone tools were either
            cluttered with ads, slow to load, or simply out of date on daylight saving rules.
            We set out to build something fast, accurate, and genuinely useful for remote
            teams, international families, and anyone scheduling across borders.
          </p>
          <p>
            WhatTime is free to use, with no account required for the core tools. We keep the
            lights on through minimal, clearly labeled advertising rather than subscriptions
            or paywalls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="minimalist-card p-6 rounded-lg border border-border">
            <Globe className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Global coverage</h3>
            <p className="text-sm text-foreground/60">Hundreds of cities and every IANA timezone, kept current with DST changes.</p>
          </div>
          <div className="minimalist-card p-6 rounded-lg border border-border">
            <Zap className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Fast by default</h3>
            <p className="text-sm text-foreground/60">No sign-up required to check the time, convert zones, or schedule a meeting.</p>
          </div>
          <div className="minimalist-card p-6 rounded-lg border border-border">
            <Users className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Built for teams</h3>
            <p className="text-sm text-foreground/60">Meeting invites and team dashboards designed for distributed work.</p>
          </div>
        </div>

        <p className="text-sm text-foreground/60 mt-12">
          Questions or feedback? Visit our <Link href="/contact" className="text-accent hover:underline">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
