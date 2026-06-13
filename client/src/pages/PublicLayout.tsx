import React from "react";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--t1)] font-[var(--sans)]">
      {/* TOPBAR */}
      <header className="sticky top-0 z-[200] h-[46px] bg-[rgba(245,245,240,0.96)] backdrop-blur-[12px] border-b border-[var(--border)] flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="font-[var(--mono)] text-[15px] font-medium color-[var(--accent)] tracking-[-0.02em] mr-7">
            wht.is
          </Link>
          <nav className="hidden md:flex">
            {[
              { name: "Time", href: "/" },
              { name: "World Clock", href: "/world-clock" },
              { name: "Converter", href: "/converter" },
              { name: "Countdown", href: "/countdown" },
              { name: "Countries", href: "/countries" },
              { name: "Meeting", href: "/meeting-invite" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12.5px] font-medium px-[11px] h-[46px] flex items-center border-b-2 transition-all whitespace-nowrap ${
                  location === item.href
                    ? "text-[var(--t1)] border-[var(--accent)]"
                    : "text-[var(--t3)] border-transparent hover:text-[var(--t1)]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-[7px] bg-[var(--surface)] border border-[var(--brd2)] rounded-[var(--r)] px-[11px] h-[31px] transition-all focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--aclo)]">
          <Search className="w-[13px] h-[13px] text-[var(--t3)]" />
          <input
            type="text"
            placeholder="Search city or country…"
            className="border-none bg-transparent text-[13px] text-[var(--t1)] font-[var(--sans)] w-[100px] md:w-[152px] outline-none placeholder:text-[var(--t3)]"
          />
        </div>
      </header>

      <main className="max-w-[980px] mx-auto px-6">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="max-w-[980px] mx-auto px-6 flex items-center justify-between py-5 pb-7 flex-wrap gap-3 border-t border-[var(--border)] mt-8">
        <div className="flex gap-[18px]">
          <Link href="/" className="text-[12px] text-[var(--t3)] hover:text-[var(--t2)] transition-colors">Home</Link>
          <Link href="/world-clock" className="text-[12px] text-[var(--t3)] hover:text-[var(--t2)] transition-colors">World Clock</Link>
          <Link href="/converter" className="text-[12px] text-[var(--t3)] hover:text-[var(--t2)] transition-colors">Converter</Link>
          <Link href="/countdown" className="text-[12px] text-[var(--t3)] hover:text-[var(--t2)] transition-colors">Countdown</Link>
        </div>
        <div className="font-[var(--mono)] text-[11px] text-[var(--t3)]">
          © {new Date().getFullYear()} WhatTime
        </div>
      </footer>
    </div>
  );
}

export function AdSlot({ className = "", slot = "default" }: { className?: string; slot?: string }) {
  React.useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`my-[22px] overflow-hidden flex flex-col items-center ${className}`}>
      <span className="text-[9px] text-[var(--t3)] uppercase tracking-widest mb-1">Advertisement</span>
      <div className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r)] min-h-[90px] flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot={slot === "default" ? "7333552882" : slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
