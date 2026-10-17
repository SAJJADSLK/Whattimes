import { Link } from 'wouter';
import { Clock, Globe, Shield, Mail, Heart } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'New York', country: 'United States', slug: 'united-states/new-york' },
  { name: 'London', country: 'United Kingdom', slug: 'united-kingdom/london' },
  { name: 'Tokyo', country: 'Japan', slug: 'japan/tokyo' },
  { name: 'Dubai', country: 'United Arab Emirates', slug: 'united-arab-emirates/dubai' },
  { name: 'Paris', country: 'France', slug: 'france/paris' },
  { name: 'Singapore', country: 'Singapore', slug: 'singapore/singapore' },
  { name: 'Sydney', country: 'Australia', slug: 'australia/sydney' },
  { name: 'Los Angeles', country: 'United States', slug: 'united-states/los-angeles' },
  { name: 'Toronto', country: 'Canada', slug: 'canada/toronto' },
  { name: 'Berlin', country: 'Germany', slug: 'germany/berlin' },
  { name: 'Hong Kong', country: 'Hong Kong', slug: 'hong-kong/hong-kong' },
  { name: 'Mumbai', country: 'India', slug: 'india/mumbai' },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-20">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                WhatTime
              </span>
            </Link>
            <p className="text-sm text-foreground/70 leading-relaxed max-w-sm">
              WhatTime is a precision timekeeping and timezone platform providing real-time clocks,
              time difference calculators, daylight saving alerts, and global meeting planners for
              distributed teams and international travelers.
            </p>
            <div className="pt-2 text-xs text-foreground/60 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>Contact: support@whattime.info</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span>Time synchronization: IANA tz database &amp; NTP servers</span>
              </p>
            </div>
          </div>

          {/* Tools Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-foreground/90">
              Time Tools
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/world-clock" className="hover:text-accent transition-colors">
                  World Clock
                </Link>
              </li>
              <li>
                <Link href="/converter" className="hover:text-accent transition-colors">
                  Time Zone Converter
                </Link>
              </li>
              <li>
                <Link href="/meeting-invite" className="hover:text-accent transition-colors">
                  Meeting Planner
                </Link>
              </li>
              <li>
                <Link href="/dst-tracker" className="hover:text-accent transition-colors">
                  Daylight Saving Tracker
                </Link>
              </li>
              <li>
                <Link href="/countdown" className="hover:text-accent transition-colors">
                  Countdown Timers
                </Link>
              </li>
              <li>
                <Link href="/unix-converter" className="hover:text-accent transition-colors">
                  Unix Timestamp Converter
                </Link>
              </li>
              <li>
                <Link href="/countries" className="hover:text-accent transition-colors">
                  All Countries Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-foreground/90">
              Major Cities
            </h4>
            <ul className="space-y-1.5 text-xs text-foreground/70">
              {POPULAR_CITIES.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="hover:text-accent transition-colors">
                    Time in {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/countries" className="text-accent hover:underline font-medium">
                  View all 190+ countries →
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Col (CRITICAL FOR ADSENSE APPROVAL) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-foreground/90">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors font-medium">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-accent transition-colors">
                  Security Disclosures
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Timezone &amp; DST Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AdSense Notice & Copyright Bar */}
      <div className="border-t border-border/80 bg-background/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/60">
          <p>
            &copy; {currentYear} <strong>WhatTime</strong> (whattime.info). All rights reserved. Real-time timekeeping powered by IANA standards.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-accent underline">
              Cookie Choices &amp; Ad Disclosure
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-accent underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-accent underline">
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

