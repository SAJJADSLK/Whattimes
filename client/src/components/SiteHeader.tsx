import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Clock, Search, Menu, X, Globe, Calendar, Timer, Share2 } from 'lucide-react';

interface SiteHeaderProps {
  onSearch?: (query: string) => void;
}

const NAV_LINKS = [
  { label: 'World Clock', href: '/world-clock' },
  { label: 'Converter', href: '/converter' },
  { label: 'Meeting Planner', href: '/meeting-invite' },
  { label: 'Countries', href: '/countries' },
  { label: 'DST Tracker', href: '/dst-tracker' },
  { label: 'Blog', href: '/blog' },
];

export function SiteHeader({ onSearch }: SiteHeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    if (onSearch) {
      onSearch(searchVal.trim());
    } else {
      window.location.href = `/world-clock?q=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                WhatTime
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                  Live
                </span>
              </span>
              <span className="text-[10px] text-foreground/50 -mt-1 hidden sm:inline">
                World Clock &amp; Time Zones
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Search */}
          <div className="hidden sm:flex items-center flex-1 max-w-xs ml-auto lg:ml-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city or country..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
            />
          </form>
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-accent/10 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-foreground/60">
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:underline">About</Link>
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:underline">Privacy</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:underline">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}

