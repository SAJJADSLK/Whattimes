import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';
const LAST_UPDATED = 'July 4, 2026';

export default function Privacy() {
  useEffect(() => {
    setSEOMeta({
      title: 'Privacy Policy - WhatTime',
      description: 'Read the WhatTime privacy policy to learn what data we collect, how we use it, and the choices you have.',
      url: `${SITE_URL}/privacy`,
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

        <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-foreground/60 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Overview</h2>
            <p>
              This Privacy Policy explains what information WhatTime ("we", "us") collects when
              you use whattime.info, how we use it, and the choices available to you. By using
              WhatTime you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Information we collect</h2>
            <p className="mb-2">We collect the minimum information needed to operate the site:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Local storage preferences:</strong> your selected timezone and display
                preferences, stored in your browser and never sent to our servers.
              </li>
              <li>
                <strong>Usage and log data:</strong> standard web server logs (IP address, browser
                type, pages visited, timestamps) used for security and troubleshooting.
              </li>
              <li>
                <strong>Information you provide directly:</strong> such as your name and email if
                you contact us through our <Link href="/contact" className="text-accent hover:underline">contact form</Link>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Cookies and advertising</h2>
            <p>
              WhatTime displays advertising through Google AdSense. Google and its partners may
              use cookies or similar technologies to serve ads based on your prior visits to
              this or other websites. You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. How we use information</h2>
            <p>
              We use the information above to operate and improve WhatTime, respond to support
              requests, monitor for abuse, and serve relevant advertising. We do not sell your
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Data retention and security</h2>
            <p>
              We retain server logs for a limited period for security purposes and take
              reasonable technical measures to protect information we hold. No method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Children's privacy</h2>
            <p>
              WhatTime is not directed at children under 13, and we do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We'll update the "last
              updated" date above when we do.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact us</h2>
            <p>
              Questions about this policy? <Link href="/contact" className="text-accent hover:underline">Contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
