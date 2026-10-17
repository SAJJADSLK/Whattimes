import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot = '1234567890', format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only attempt to load once
    if (isLoaded.current) return;
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      // Ignore adsbygoogle errors when AdBlocker is active or in dev
    }
  }, []);

  return (
    <div className={`my-8 text-center overflow-hidden clear-both ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-foreground/40 font-mono block mb-1">
        Advertisement
      </span>
      <div className="min-h-[100px] flex items-center justify-center bg-card/40 border border-dashed border-border/80 rounded-lg p-2 overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '280px', width: '100%' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

