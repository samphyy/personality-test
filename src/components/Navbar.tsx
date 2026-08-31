'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Compass, BookOpen, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  OCEAN<span className="text-brand-500">Insight</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  Big Five Test
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Right Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
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
              <span className="hidden md:inline">Trait Library</span>
              <span className="md:hidden">Library</span>
            </Link>

            <Link
              href="/test"
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/25 hover:shadow-brand-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4" />
              <span>Take Test</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
