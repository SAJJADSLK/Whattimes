import { useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, Clock, Lock, Eye, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const SITE_URL = 'https://www.whattime.info';
const LAST_UPDATED = 'October 17, 2026';

export default function Privacy() {
  useEffect(() => {
    setSEOMeta({
      title: 'Privacy Policy & Cookie Disclosure — WhatTime',
      description:
        'Read the WhatTime privacy policy, Google AdSense cookie disclosure, GDPR and CCPA privacy rights, and data protection practices.',
      url: `${SITE_URL}/privacy`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="space-y-4 mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Privacy &amp; Data Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Privacy Policy &amp; Cookie Disclosure
          </h1>
          <p className="text-sm text-foreground/60">
            Effective Date: January 1, 2026 &bull; Last Updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-foreground/85 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">01.</span> Introduction
            </h2>
            <p>
              Welcome to <strong>WhatTime</strong> (accessible at{' '}
              <a href={SITE_URL} className="text-accent underline">
                https://www.whattime.info
              </a>
              ). We respect your privacy and are committed to maintaining transparent, fair data practices.
              This Privacy Policy explains what information we collect when you use our world clock,
              timezone converter, and scheduling tools, how we use it, how we protect it, and the
              choices available to you under applicable data protection regulations including the EU
              General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
          </section>

          {/* CRITICAL FOR GOOGLE ADSENSE APPROVAL */}
          <section className="space-y-4 p-6 rounded-xl border border-accent/30 bg-accent/5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">02.</span> Google AdSense &amp; Advertising Cookies Disclosure
            </h2>
            <p>
              WhatTime partners with <strong>Google AdSense</strong> to display relevant advertisements
              and keep our timekeeping tools free for all users worldwide. Under Google publisher
              policies, we provide the following required disclosures regarding advertising cookies
              and user tracking:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>
                <strong>Third-Party Vendors &amp; Cookies:</strong> Third-party vendors, including Google,
                use cookies (such as the DoubleClick DART cookie) to serve ads based on a user&apos;s prior
                visits to WhatTime or other websites on the Internet.
              </li>
              <li>
                <strong>Personalized Advertising:</strong> Google&apos;s use of advertising cookies enables
                it and its partners to serve advertisements tailored to you based on your visit to
                WhatTime and/or other sites across the World Wide Web.
              </li>
              <li>
                <strong>How to Opt Out:</strong> You have the right to opt out of personalized advertising
                at any time. You may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold underline hover:opacity-80"
                >
                  Google Ads Settings
                </a>
                . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
                personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold underline hover:opacity-80"
                >
                  www.aboutads.info/choices
                </a>
                .
              </li>
              <li>
                <strong>Consent Management:</strong> For visitors located in the European Economic Area (EEA),
                the United Kingdom, and Switzerland, WhatTime utilizes a consent banner enabling you to
                accept or decline non-essential cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">03.</span> Information We Collect
            </h2>
            <p>
              We practice data minimization and do not require user account registration for any of our
              core public timekeeping utilities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-1">Local Browser Storage</h3>
                <p className="text-xs text-foreground/70">
                  Your selected default timezone, favorite cities, 12h/24h format preference, and theme
                  mode are stored locally on your own device via <code className="text-xs bg-foreground/10 px-1 py-0.5 rounded">localStorage</code>. This data never leaves your browser.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-1">Server Log Data</h3>
                <p className="text-xs text-foreground/70">
                  Standard web server diagnostic logs (IP address, browser user-agent, referring URL,
                  and request timestamps) are processed transiently for site security, DDoS mitigation,
                  and routing.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">04.</span> European Privacy Rights (GDPR)
            </h2>
            <p>
              If you reside in the European Economic Area (EEA) or the United Kingdom, you have rights
              under the General Data Protection Regulation, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-foreground/80">
              <li>The right to access, rectify, or erase any personal information we hold about you.</li>
              <li>The right to restrict or object to the processing of your data.</li>
              <li>The right to withdraw cookie consent at any time without penalty.</li>
              <li>The right to lodge a complaint with your local data protection supervisory authority.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">05.</span> California Privacy Rights (CCPA / CPRA)
            </h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-foreground/80">
              <li>
                <strong>We Do Not Sell Personal Information:</strong> WhatTime does not sell, rent, or trade
                your personal information to third parties for monetary consideration.
              </li>
              <li>
                <strong>Right to Know &amp; Delete:</strong> California consumers may request disclosure of
                information collected and request deletion by emailing us at{' '}
                <a href="mailto:support@whattime.info" className="text-accent underline">
                  support@whattime.info
                </a>
                .
              </li>
              <li>
                <strong>Non-Discrimination:</strong> We will never discriminate against you for exercising
                any of your privacy rights.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">06.</span> Accuracy of Timekeeping &amp; Disclaimer
            </h2>
            <p>
              While WhatTime utilizes official IANA tz database tables and NTP synchronization to achieve
              high precision, world time calculations, sunrise/sunset times, and Daylight Saving Time (DST)
              dates are provided for informational and planning purposes only. WhatTime makes no
              guarantees of absolute fitness for mission-critical, aviation, or high-frequency trading
              operations where sub-millisecond precision is required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-accent font-mono text-sm">07.</span> Contacting Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, our advertising practices, or wish to
              exercise your data protection rights, please reach out directly:
            </p>
            <div className="p-4 rounded-lg border border-border bg-card flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">WhatTime Support &amp; Privacy Officer</p>
                <p className="text-sm text-foreground/70">
                  Email:{' '}
                  <a href="mailto:support@whattime.info" className="text-accent underline font-mono">
                    support@whattime.info
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
