import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setSEOMeta } from '@/lib/seo';

const SITE_URL = 'https://www.whattime.info';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSEOMeta({
      title: 'Contact WhatTime - Questions, Feedback & Support',
      description:
        'Get in touch with the WhatTime team for support, feedback, or partnership inquiries about our world clock, timezone converter, and scheduling tools.',
      url: `${SITE_URL}/contact`,
      type: 'website',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: wire this up to a real backend endpoint (e.g. a tRPC mutation or
    // /api/contact serverless function) before relying on it in production.
    setSubmitted(true);
  };

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

        <h1 className="text-4xl font-semibold mb-3">Contact us</h1>
        <p className="text-foreground/60 mb-10">
          Have a question, found a bug, or want to suggest a feature? Send us a message below.
        </p>

        {submitted ? (
          <div className="flex items-start gap-3 p-6 rounded-lg border border-accent/30 bg-accent/5">
            <Check className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold">Thanks for reaching out.</p>
              <p className="text-sm text-foreground/60 mt-1">We'll get back to you as soon as we can.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                required
                rows={5}
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <Button type="submit" className="w-full">Send message</Button>
          </form>
        )}

        <div className="flex items-center gap-2 text-sm text-foreground/60 mt-10">
          <Mail className="w-4 h-4" />
          <span>Or email us directly at support@whattime.info</span>
        </div>
      </div>
    </div>
  );
}
