import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Code2 } from 'lucide-react';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function ApiDocs() {
  useEffect(() => {
    setSEOMeta({
      title: 'WhatTime API & Embed Widgets',
      description:
        'Embed a live WhatTime clock widget on your own site, or get in touch about API access to timezone and city data.',
      url: `${SITE_URL}/api-docs`,
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

        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
          <Code2 className="w-6 h-6 text-accent" />
        </div>

        <h1 className="text-4xl font-semibold mb-3">API & embeds</h1>
        <p className="text-foreground/60 mb-8 leading-relaxed">
          The fastest way to put WhatTime data on your own site today is our embeddable
          clock widget - no API key required.
        </p>

        <Link
          href="/widget"
          className="inline-block rounded-lg border border-border px-5 py-3 text-sm font-medium hover:border-accent/50 transition-colors mb-10"
        >
          Get an embeddable clock widget &rarr;
        </Link>

        <h2 className="text-xl font-semibold mb-3">Public data API</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          We're working on a public, documented REST API for timezone and city time data
          for developers who want programmatic access. If you have a use case in mind,{' '}
          <Link href="/contact" className="text-accent hover:underline">reach out</Link>{' '}
          and we'll let you know when it's available.
        </p>
      </div>
    </div>
  );
}
