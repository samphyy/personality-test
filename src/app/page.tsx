import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Compass,
  CheckCircle2,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { TRAIT_DEFINITIONS } from '@/data/questions';

export default function HomePage() {
  const traitEntries = Object.entries(TRAIT_DEFINITIONS);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-500/20 via-teal-500/20 to-emerald-500/15 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Brand & Scientific Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs sm:text-sm font-semibold text-brand-800 dark:text-brand-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>The Gold Standard in Modern Personality Science</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Decode Your True{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Psychological Blueprint
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover where you stand across the scientifically validated Five-Factor Model (OCEAN). Gain actionable clarity on your strengths, career trajectory, and relationship dynamics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/test?mode=full"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Take Full Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/test?mode=quick"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick Test (3 min)</span>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>100% Free & Private</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Validated IPIP Psychometrics</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Instant Interactive Radar Chart</span>
            </div>
            <a
              href="https://ysamphy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors font-medium"
            >
              <span>By YSAMPHY LLC</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* THE 5 DIMENSIONS PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
            The OCEAN Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The 5 Universal Pillars of Human Personality
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Decades of academic research across cultures have shown that human personality can be reliably described through 5 continuous dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traitEntries.map(([key, trait], idx) => (
            <div
              key={key}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${trait.color}15`,
                  color: trait.color,
                }}
              >
                {key.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {trait.label}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {trait.shortDescription}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{trait.lowLabel}</span>
                <span className="text-slate-300">⟷</span>
                <span>{trait.highLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY BIG FIVE VS OTHERS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-400">
              Scientific Credibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why the Big Five Model is Trusted by Psychologists Worldwide
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Unlike simplistic type systems that box you into rigid, all-or-nothing categories, the Big Five measures personality on continuous spectrums. This accurately reflects human nature—revealing not just a label, but your exact nuances, adaptability, and balance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <BarChart3 className="w-5 h-5 text-brand-400 mb-2" />
                <h4 className="font-bold text-sm">Empirical Validity</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Replicated across hundreds of cross-cultural psychological studies.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Users className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="font-bold text-sm">Actionable Depth</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Direct correlations with workplace performance and relationship happiness.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Layers className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm">Nuanced Spectrum</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Scores are presented as percentiles rather than restrictive black-and-white types.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* START ASSESSMENT BANNER */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Ready to discover your personality profile?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Take 3 to 5 minutes to answer straightforward questions and unlock your comprehensive psychometric report.
        </p>
        <div>
          <Link
            href="/test"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <Compass className="w-5 h-5" />
            <span>Begin Free Assessment</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
