import React from "react";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";

const NAV_ITEMS = [
  { name: "Time", href: "/" },
  { name: "World Clock", href: "/world-clock" },
  { name: "Converter", href: "/converter" },
  { name: "Countdown", href: "/countdown" },
  { name: "Countries", href: "/countries" },
  { name: "Meeting", href: "/meeting-invite" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--t1)] font-[var(--sans)]">
      {/* TOPBAR */}
      <header className="sticky top-0 z-[200] h-[48px] bg-[var(--bg)]/95 backdrop-blur-[14px] border-b border-[var(--border)] flex items-center justify-between px-7">
        {/* Left: logo + nav */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-[7px] font-[var(--mono)] text-[14px] font-semibold tracking-[-0.03em] text-[var(--t1)] no-underline mr-8 opacity-100 hover:opacity-70 transition-opacity"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] flex-shrink-0 shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent)_20%,transparent)] animate-pulse" />
            WhatTime
          </Link>

          <nav className="hidden md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[12px] font-medium px-3 h-[48px] flex items-center whitespace-nowrap no-underline transition-colors
                  after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[1.5px] after:bg-[var(--accent)] after:transition-transform after:duration-200
                  ${location === item.href
                    ? "text-[var(--t1)] after:scale-x-100"
                    : "text-[var(--t3)] hover:text-[var(--t1)] after:scale-x-0 hover:after:scale-x-50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: search */}
        <div className="flex items-center gap-[7px] bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-[11px] h-[30px] transition-all focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--aclo)]">
          <Search className="w-[12px] h-[12px] text-[var(--t3)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search city or country…"
            className="border-none bg-transparent text-[12.5px] text-[var(--t1)] font-[var(--sans)] w-[100px] md:w-[140px] outline-none placeholder:text-[var(--t3)]"
          />
        </div>
      </header>

      <main className="max-w-[980px] mx-auto px-7">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="max-w-[980px] mx-auto px-7 flex items-center justify-between py-5 pb-7 flex-wrap gap-3 border-t border-[var(--border)] mt-10">
        <div className="flex gap-5 flex-wrap">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11.5px] text-[var(--t3)] hover:text-[var(--t2)] transition-colors no-underline"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <span className="font-[var(--mono)] text-[10.5px] text-[var(--t3)] tracking-[0.04em]">
          © {new Date().getFullYear()} WhatTime
        </span>
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
    <div className={`my-6 overflow-hidden flex flex-col items-center ${className}`}>
      <span className="font-[var(--mono)] text-[8.5px] text-[var(--t3)] uppercase tracking-[0.12em] mb-[5px]">
        Advertisement
      </span>
      <div className="w-full bg-[var(--bg2,var(--surface))] border border-[var(--border)] rounded-[6px] min-h-[90px] flex items-center justify-center">
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
