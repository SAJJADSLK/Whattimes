import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('whattime-cookie-consent');
      if (!consent) {
        setShow(true);
      }
    } catch (e) {
      // In case localStorage is blocked
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('whattime-cookie-consent', 'accepted');
    } catch (e) {}
    setShow(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('whattime-cookie-consent', 'essential_only');
    } catch (e) {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[999] bg-card border border-border shadow-2xl rounded-xl p-5 text-card-foreground animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0 mt-0.5">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">We value your privacy</h3>
            <button
              onClick={handleAcceptEssential}
              className="text-foreground/50 hover:text-foreground p-1 -mr-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-foreground/75 leading-relaxed text-xs">
            We use cookies and similar technologies to enhance your experience, analyze site usage,
            and serve personalized ads through Google AdSense. You can adjust your choices anytime.
            Read our{' '}
            <Link href="/privacy" className="text-accent underline hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs px-3 h-8"
            >
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcceptEssential}
              className="text-xs px-3 h-8 border-border hover:bg-accent/10"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

