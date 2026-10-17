import { useEffect } from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const SITE_URL = 'https://www.whattime.info';

export default function Security() {
  useEffect(() => {
    setSEOMeta({
      title: 'Security Disclosures — WhatTime',
      description: 'How WhatTime protects your data, including transport security, infrastructure resilience, and how to report a vulnerability.',
      url: `${SITE_URL}/security`,
      type: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-4 mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Security &amp; Trust
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Security Disclosures</h1>
          <p className="text-sm text-foreground/60">Data protection, encryption, and responsible disclosure.</p>
        </div>

        <div className="space-y-8 text-foreground/80 leading-relaxed text-sm sm:text-base">
          <section className="flex gap-4 p-5 rounded-xl border border-border bg-card">
            <Lock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Encrypted in transit (HTTPS/TLS)</h2>
              <p>All traffic to WhatTime is strictly forced over HTTPS using modern TLS 1.3 encryption, ensuring confidentiality and integrity between your browser and our edge servers.</p>
            </div>
          </section>

          <section className="flex gap-4 p-5 rounded-xl border border-border bg-card">
            <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Minimal data collection</h2>
              <p>
                WhatTime utilities run client-side whenever possible and store user preferences locally
                in your browser rather than on remote servers. Consult our <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> for full details.
              </p>
            </div>
          </section>

          <section className="flex gap-4 p-5 rounded-xl border border-border bg-card">
            <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Responsible Disclosure Policy</h2>
              <p>
                If you believe you have discovered a vulnerability, please contact us immediately at{' '}
                <a href="mailto:support@whattime.info" className="text-accent underline font-mono">
                  support@whattime.info
                </a>{' '}
                or via our <Link href="/contact" className="text-accent hover:underline">contact page</Link>. We appreciate responsible reporting and will address validated vulnerabilities swiftly.
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
