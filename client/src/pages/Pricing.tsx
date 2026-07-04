import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

const FEATURES = [
  'World clock for hundreds of cities',
  'Timezone converter with drag-to-scrub timeline',
  'Meeting invite scheduler',
  'DST tracker and alerts',
  'Countdown timers and unix timestamp converter',
  'Team dashboard for distributed teams',
];

export default function Pricing() {
  useEffect(() => {
    setSEOMeta({
      title: 'WhatTime Pricing - Free World Clock & Timezone Tools',
      description:
        'WhatTime is free to use. See what is included in our world clock, timezone converter, and team scheduling tools at no cost.',
      url: `${SITE_URL}/pricing`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to WhatTime
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-7 h-7 text-accent" />
          <span className="font-semibold text-lg">WhatTime</span>
        </div>

        <h1 className="text-4xl font-semibold mb-3">Simple, free pricing</h1>
        <p className="text-foreground/60 mb-10">
          Every core tool on WhatTime is free, with no account or credit card required.
        </p>

        <div className="rounded-xl border border-border p-8">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold">$0</span>
            <span className="text-foreground/60">/ forever</span>
          </div>
          <p className="text-sm text-foreground/60 mb-6">Free plan, no limits on the core tools.</p>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link href="/world-clock">
            <Button className="w-full mt-8">Start using WhatTime</Button>
          </Link>
        </div>

        <p className="text-sm text-foreground/60 mt-8">
          WhatTime is supported by minimal, clearly labeled advertising. Interested in an
          ad-free or team plan? <Link href="/contact" className="text-accent hover:underline">Let us know</Link>.
        </p>
      </div>
    </div>
  );
}
