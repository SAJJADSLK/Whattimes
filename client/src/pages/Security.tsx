import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, ShieldCheck, Lock, Mail } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function Security() {
  useEffect(() => {
    setSEOMeta({
      title: 'Security - WhatTime',
      description: 'How WhatTime protects your data, including transport security and how to report a vulnerability.',
      url: `${SITE_URL}/security`,
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

        <h1 className="text-4xl font-semibold mb-6">Security</h1>

        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section className="flex gap-4">
            <Lock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Encrypted in transit</h2>
              <p>All traffic to WhatTime is served over HTTPS, encrypting data between your browser and our servers.</p>
            </div>
          </section>

          <section className="flex gap-4">
            <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Minimal data collection</h2>
              <p>
                Most WhatTime tools run entirely in your browser and store preferences locally
                rather than on our servers. See our <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> for details on what we do collect.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Report a vulnerability</h2>
              <p>
                If you believe you've found a security issue with WhatTime, please tell us
                through our <Link href="/contact" className="text-accent hover:underline">contact page</Link> with
                as much detail as possible so we can investigate promptly. Please avoid
                accessing or modifying data that isn't yours while testing.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
