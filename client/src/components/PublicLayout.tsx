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
    <div
      className="min-h-screen text-[var(--t1)] font-[var(--sans)]"
      style={{ background: "var(--bg)" }}
    >
      <style>{`
        .wt-logo {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--t1);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-right: 32px;
          transition: opacity 0.15s;
        }
        .wt-logo:hover { opacity: 0.75; }
        .wt-logo-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent); }
          50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 10%, transparent); }
        }

        .wt-nav-link {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.01em;
          padding: 0 12px;
          height: 48px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          text-decoration: none;
          color: var(--t3);
          position: relative;
          transition: color 0.15s;
        }
        .wt-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 1.5px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left;
        }
        .wt-nav-link:hover { color: var(--t1); }
        .wt-nav-link:hover::after { transform: scaleX(0.5); }
        .wt-nav-link.active { color: var(--t1); }
        .wt-nav-link.active::after { transform: scaleX(1); }

        .wt-search {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0 11px;
          height: 30px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .wt-search:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
        }
        .wt-search input {
          border: none;
          background: transparent;
          font-size: 12.5px;
          color: var(--t1);
          font-family: var(--sans);
          width: 140px;
          outline: none;
        }
        .wt-search input::placeholder { color: var(--t3); }

        .wt-header {
          position: sticky;
          top: 0;
          z-index: 200;
          height: 48px;
          background: color-mix(in srgb, var(--bg) 92%, transparent);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
        }

        .wt-header-left {
          display: flex;
          align-items: center;
        }

        .wt-footer {
          max-width: 980px;
          margin: 0 auto;
          padding: 20px 28px 28px;
          border-top: 1px solid var(--border);
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wt-footer-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .wt-footer-link {
          font-size: 11.5px;
          color: var(--t3);
          text-decoration: none;
          transition: color 0.12s;
          letter-spacing: 0.01em;
        }
        .wt-footer-link:hover { color: var(--t2); }
        .wt-footer-copy {
          font-family: var(--mono);
          font-size: 10.5px;
          color: var(--t3);
          letter-spacing: 0.04em;
        }

        /* Ad slot */
        .wt-ad {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 24px 0;
        }
        .wt-ad-label {
          font-size: 8.5px;
          color: var(--t3);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 5px;
          font-family: var(--mono);
        }
        .wt-ad-box {
          width: 100%;
          background: var(--bg2, var(--surface));
          border: 1px solid var(--border);
          border-radius: 6px;
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* TOPBAR */}
      <header className="wt-header">
        <div className="wt-header-left">
          <Link href="/" className="wt-logo">
            <span className="wt-logo-dot" />
            WhatTime
          </Link>
          <nav className="hidden md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`wt-nav-link${location === item.href ? " active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="wt-search">
          <Search width={12} height={12} color="var(--t3)" />
          <input
            type="text"
            placeholder="Search city or country…"
          />
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "0 28px" }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="wt-footer">
        <div className="wt-footer-links">
          <Link href="/" className="wt-footer-link">Home</Link>
          <Link href="/world-clock" className="wt-footer-link">World Clock</Link>
          <Link href="/converter" className="wt-footer-link">Converter</Link>
          <Link href="/countdown" className="wt-footer-link">Countdown</Link>
          <Link href="/countries" className="wt-footer-link">Countries</Link>
          <Link href="/meeting-invite" className="wt-footer-link">Meeting</Link>
        </div>
        <span className="wt-footer-copy">
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
    <div className={`wt-ad ${className}`}>
      <span className="wt-ad-label">Advertisement</span>
      <div className="wt-ad-box">
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
