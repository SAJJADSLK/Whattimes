import { useEffect } from 'react';
import { Link } from 'wouter';
import { Clock, Globe, Users, Zap, Shield, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const SITE_URL = 'https://www.whattime.info';

export default function About() {
  useEffect(() => {
    setSEOMeta({
      title: 'About WhatTime — Global Precision Timekeeping & Scheduling',
      description:
        'Learn about WhatTime, our mission, atomic time synchronization standards, IANA database integration, and our team dedicated to making international scheduling effortless.',
      url: `${SITE_URL}/about`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="space-y-4 mb-12 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Our Mission &amp; Standards
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            About WhatTime
          </h1>
          <p className="text-lg text-foreground/75 leading-relaxed max-w-2xl">
            Precision timekeeping, live timezone conversion, and frictionless meeting scheduling
            built for distributed teams, international travelers, and global citizens.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-8 text-foreground/85 leading-relaxed text-sm sm:text-base">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Why We Built WhatTime</h2>
            <p>
              In an increasingly interconnected global economy, millions of professionals collaborate
              across five, eight, or twelve time zones every single day. Yet, checking local time and
              calculating cross-border call windows has remained surprisingly frustrating: legacy time
              websites are frequently bogged down by invasive popups, slow loading times, outdated
              daylight saving transition databases, or paywalls.
            </p>
            <p>
              <strong>WhatTime</strong> was created to solve this problem permanently: a lightning-fast,
              clean, beautifully designed platform that answers the fundamental question:{' '}
              <em>&ldquo;What exact time is it over there, right now?&rdquo;</em> with zero friction, zero
              mandatory sign-ups, and sub-second accuracy.
            </p>
          </section>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">Authoritative Data</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Powered by the standard IANA Time Zone Database (tzdb) updated in real time to capture
                international daylight saving shifts and government boundary changes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">Speed &amp; Simplicity</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Designed to load in under a second worldwide. Instant city search, live seconds counter,
                and one-click time difference calculations.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">Team First</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Tools built specifically for remote organizations, such as our 9-to-5 mutual business
                hours calculator and shareable meeting invites.
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Our Editorial &amp; Quality Commitment</h2>
            <p>
              WhatTime is maintained by an independent engineering team passionate about digital
              utilities and developer tools. We are committed to editorial transparency: all guides,
              articles, and timezone explainers published on our blog are original, thoroughly
              fact-checked, and regularly reviewed to ensure full compliance with global timekeeping
              conventions.
            </p>
            <p>
              To keep WhatTime completely free and open to everyone, we support our server infrastructure
              via clearly labeled, non-intrusive advertisements served through Google AdSense. We do not
              sell user data, engage in deceptive layouts, or lock core features behind subscriptions.
            </p>
          </section>

          {/* Quick Links */}
          <div className="p-6 rounded-xl border border-border bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-foreground">Have feedback or need to get in touch?</h3>
              <p className="text-xs text-foreground/70 mt-1">
                We love hearing from our users and continuously add new cities and features.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors flex-shrink-0"
            >
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
