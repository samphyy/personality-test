'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Users, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 sm:space-x-3 group"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-brand-500 shrink-0">
                <Image
                  src="/logo.png"
                  alt="YSAMPHY Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  OCEAN<span className="text-brand-500">Insight</span>
                </span>
                <span className="hidden md:inline-block ml-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  Big Five Test
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center space-x-2 md:space-x-3">
            {/* Back to ysamphy.com */}
            <a
              href="https://ysamphy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/70 dark:hover:bg-brand-950/40 border border-transparent hover:border-brand-200 dark:hover:border-brand-800/60 transition-all"
              title="Return to YSamphy.com homepage"
            >
              <span>ysamphy.com</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            <Link
              href="/library"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                pathname === '/library'
                  ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Trait Library</span>
            </Link>

            <Link
              href="/compare"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                pathname === '/compare'
                  ? 'bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Compare</span>
            </Link>

            <Link
              href="/test"
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/25 hover:shadow-brand-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4" />
              <span>Take Test</span>
            </Link>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center space-x-2">
            <Link
              href="/test"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-500 text-white shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Test</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              pathname === '/'
                ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Home
          </Link>

          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              pathname === '/library'
                ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Trait Library</span>
          </Link>

          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              pathname === '/compare'
                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Compare Profiles</span>
          </Link>

          <Link
            href="/test"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-sm"
          >
            <span className="flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Take Assessment (Free)</span>
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">3 min</span>
          </Link>

          <a
            href="https://ysamphy.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Visit YSamphy.com</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
