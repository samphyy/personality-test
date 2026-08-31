import Link from 'next/link';
import { Sparkles, Shield, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                OCEAN<span className="text-brand-500">Insight</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Discover your true psychological blueprint through the scientifically validated Five Factor Model (OCEAN). Built for self-awareness, clearer thinking, career clarity, and personal growth.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-brand-500" />
              <span>100% Client-Side & Private. No personal data sold or tracked.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Assessment
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/test?mode=full" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Full Assessment (30 Questions)
                </Link>
              </li>
              <li>
                <Link href="/test?mode=quick" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Quick Assessment (15 Questions)
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  OCEAN Trait Library
                </Link>
              </li>
              <li>
                <a
                  href="https://ysamphy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <span>Visit YSamphy.com</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Science & Credits */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Psychometrics
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Based on the open-source International Personality Item Pool (IPIP) and the Five-Factor Model (Goldberg, 1992; McCrae & Costa, 1987).
            </p>
            <div className="text-xs text-slate-400">
              A project by{' '}
              <a href="https://ysamphy.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline font-semibold">
                YSAMPHY LLC
              </a>.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 YSAMPHY LLC. Built for educational and self-reflection purposes.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-2">
            <a
              href="https://ysamphy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors font-medium flex items-center space-x-1"
            >
              <span>ysamphy.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
