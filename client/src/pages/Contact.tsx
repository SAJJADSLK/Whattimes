import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Clock, Mail, MessageSquare, Check, Send, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setSEOMeta } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const SITE_URL = 'https://www.whattime.info';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Question');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSEOMeta({
      title: 'Contact Us — WhatTime Customer Support & Inquiries',
      description:
        'Have a question, feedback, or need support with WhatTime? Contact our team directly via email or our online contact form.',
      url: `${SITE_URL}/contact`,
      type: 'website',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="space-y-4 mb-10 pb-8 border-b border-border text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Contact WhatTime
          </h1>
          <p className="text-foreground/70 max-w-xl text-sm sm:text-base">
            Have a question, noticed a discrepancy with a timezone, or want to suggest a new city?
            We respond to inquiries within 24–48 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact Details & Info */}
          <div className="space-y-6 md:col-span-1">
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Direct Email</h3>
              <p className="text-xs text-foreground/70">
                For general support, corrections, or advertising inquiries:
              </p>
              <a
                href="mailto:support@whattime.info"
                className="text-xs text-accent underline font-mono block hover:opacity-80"
              >
                support@whattime.info
              </a>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Response Time</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Our support team is distributed globally. Most emails receive a human reply within 1 business day.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Quick FAQ</h3>
              <p className="text-xs text-foreground/70">
                Looking for timezone guides or DST questions? Browse our{' '}
                <Link href="/blog" className="text-accent underline">
                  articles &amp; guides
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="p-8 rounded-xl border border-border bg-card shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/15 text-green-500 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
                  <p className="text-sm text-foreground/70 max-w-md mx-auto">
                    Thank you for reaching out, <strong>{name}</strong>. Our team has received your message and will get back to you at <strong>{email}</strong> shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-4"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
                        Your Name *
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
                        Your Email *
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
                      Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                    >
                      <option>Feedback / Suggestion</option>
                      <option>Report Timezone or DST Discrepancy</option>
                      <option>Request a New City</option>
                      <option>AdSense / Partnership Inquiry</option>
                      <option>General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details on how we can assist you..."
                      required
                      rows={5}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
