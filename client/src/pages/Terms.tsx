import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';
const LAST_UPDATED = 'July 4, 2026';

export default function Terms() {
  useEffect(() => {
    setSEOMeta({
      title: 'Terms of Service - WhatTime',
      description: 'Read the terms and conditions for using WhatTime\u2019s world clock, timezone converter, and scheduling tools.',
      url: `${SITE_URL}/terms`,
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

        <h1 className="text-4xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-sm text-foreground/60 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Acceptance of terms</h2>
            <p>
              By accessing or using WhatTime ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Description of service</h2>
            <p>
              WhatTime provides free tools for checking the time, converting between timezones,
              scheduling meetings, and related timekeeping utilities. We aim for accuracy but do
              not guarantee that timezone or daylight saving time data is error-free at all
              times, and the Service should not be relied on for safety-critical timing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Acceptable use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Attempt to disrupt, overload, or reverse-engineer the Service.</li>
              <li>Scrape or bulk-extract data from the Service without our prior consent.</li>
              <li>Misrepresent shared links (such as countdowns or meeting invites) in a misleading or harmful way.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Advertising</h2>
            <p>
              WhatTime is supported by advertising, including through Google AdSense. Ads are
              provided by third parties and we are not responsible for the content of
              third-party advertisements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. No warranty</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, express or
              implied. We do not warrant that the Service will be uninterrupted, error-free, or
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, WhatTime shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the
              Service, including missed meetings or scheduling errors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Changes to the service or terms</h2>
            <p>
              We may modify or discontinue the Service, or update these Terms, at any time. We
              will update the "last updated" date above when the Terms change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact</h2>
            <p>
              Questions about these Terms? <Link href="/contact" className="text-accent hover:underline">Contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
