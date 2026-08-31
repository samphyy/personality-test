'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  Check,
  Briefcase,
  Users,
  Compass,
  TrendingUp,
  AlertCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { AssessmentResult, TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';
import { encodeResultToQueryParams } from '@/lib/scoring';
import RadarChartComponent from './RadarChartComponent';
import KitSubscribeForm from './KitSubscribeForm';

interface ResultsDashboardProps {
  result: AssessmentResult;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'careers' | 'relationships'>('overview');
  const [expandedTraits, setExpandedTraits] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#1abc9c', '#0284C7', '#10B981', '#F59E0B', '#E11D48'],
      });
    } catch (e) {}
  }, []);

  const toggleTraitExpand = (traitKey: string) => {
    setExpandedTraits((prev) => ({
      ...prev,
      [traitKey]: !prev[traitKey],
    }));
  };

  const handleCopySummary = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/results?${encodeResultToQueryParams(result)}`;

    const summaryText = `🧠 My OCEAN Big Five Personality Profile:
Archetype: ${result.archetype.name} - "${result.archetype.tagline}"

📊 Scores:
• Openness: ${result.scores.openness.percentage}% (${result.scores.openness.tier})
• Conscientiousness: ${result.scores.conscientiousness.percentage}% (${result.scores.conscientiousness.tier})
• Extraversion: ${result.scores.extraversion.percentage}% (${result.scores.extraversion.tier})
• Agreeableness: ${result.scores.agreeableness.percentage}% (${result.scores.agreeableness.tier})
• Emotional Reactivity: ${result.scores.neuroticism.percentage}% (${result.scores.neuroticism.tier})

🔗 View My Interactive Radar Chart & Full Blueprint:
${shareUrl}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const traitKeys: TraitKey[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

  const o = result.scores.openness.percentage;
  const c = result.scores.conscientiousness.percentage;
  const e = result.scores.extraversion.percentage;
  const a = result.scores.agreeableness.percentage;
  const n = result.scores.neuroticism.percentage;
  const archId = result.archetype.id;

  const squareCardUrl = `/api/card?format=square&arch=${archId}&o=${o}&c=${c}&e=${e}&a=${a}&n=${n}`;
  const storyCardUrl = `/api/card?format=story&arch=${archId}&o=${o}&c=${c}&e=${e}&a=${a}&n=${n}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 print:py-0 print:px-0 print:space-y-6">
      {/* PRINT-ONLY EXECUTIVE HEADER */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-brand-500 shrink-0">
            <Image
              src="/logo.png"
              alt="YSAMPHY Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">YSAMPHY LLC • COMPREHENSIVE PSYCHOMETRIC REPORT</span>
            <h1 className="text-xl font-black text-slate-900 leading-none mt-0.5">The Big Five (OCEAN) Personality Blueprint</h1>
          </div>
        </div>
        <div className="text-right text-xs text-slate-600 font-medium">
          <p>{new Date(result.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          <p className="text-teal-700 font-bold">personality-test.ysamphy.com</p>
        </div>
      </div>

      {/* WEB-ONLY HEADER & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">
            Psychometric Assessment Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Your Big Five Personality Blueprint
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Completed on {new Date(result.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })} • {result.mode === 'quick' ? '15-Question Quick Mode' : '30-Question Comprehensive Mode'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Social Card Button */}
          <button
            onClick={() => setCardModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200/80 dark:border-teal-800/80 transition-all shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Social Card (PNG)</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors shadow-md shadow-brand-500/25"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Report</span>
          </button>

          <Link
            href="/test"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SOCIAL CARD DOWNLOAD MODAL
         ========================================================================= */}
      {cardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg sm:text-xl font-bold">Download Your Social Card</h3>
              </div>
              <button
                onClick={() => setCardModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Download a high-resolution PNG image badge of your personality archetype to share on Instagram Stories, LinkedIn, X, or Threads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Option 1: 1:1 Square */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Square Card (1:1)</span>
                  <p className="text-xs text-slate-400">Best for LinkedIn, Instagram Posts, X (Twitter), & Profiles.</p>
                  <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={squareCardUrl} alt="Square Card Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                <a
                  href={`${squareCardUrl}&download=1`}
                  download={`personality-badge-square.png`}
                  className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/25 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Square (1:1 PNG)</span>
                </a>
              </div>

              {/* Option 2: 9:16 Story */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Story Card (9:16)</span>
                  <p className="text-xs text-slate-400">Best for Instagram Stories, TikTok, Reels, & Phone Wallpapers.</p>
                  <div className="aspect-[9/16] max-h-48 mx-auto rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={storyCardUrl} alt="Story Card Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                <a
                  href={`${storyCardUrl}&download=1`}
                  download={`personality-badge-story.png`}
                  className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md shadow-brand-500/25 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Story (9:16 PNG)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 1 (PRINT): EXECUTIVE SUMMARY & DIMENSIONAL RADAR MAP
         ========================================================================= */}
      <div className="space-y-6">
        {/* Archetype Hero Card */}
        <div className={`print-avoid-break relative rounded-3xl p-6 sm:p-10 text-white bg-gradient-to-r ${result.archetype.colorTheme} shadow-xl shadow-brand-500/15 overflow-hidden print:shadow-none print:rounded-2xl print:p-6`}>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none print:hidden" />
          
          <div className="relative z-10 max-w-3xl space-y-3 print:space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider print:bg-white/30">
              <Award className="w-3.5 h-3.5" />
              <span>Primary Archetype</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {result.archetype.name}
            </h2>

            <p className="text-base sm:text-lg font-medium text-white/95 italic">
              &ldquo;{result.archetype.tagline}&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed pt-1">
              {result.archetype.description}
            </p>

            {/* Growth Advice Callout */}
            <div className="mt-3 pt-3 border-t border-white/20 flex items-start space-x-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 print:bg-white/15">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                  Core Growth Advice
                </h4>
                <p className="text-xs text-white/95 mt-0.5 leading-snug">
                  {result.archetype.growthAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KIT (CONVERTKIT) EMAIL CAPTURE SECTION (Hidden on print) */}
        <div className="print:hidden">
          <KitSubscribeForm result={result} />
        </div>

        {/* Radar Chart & Trait Snapshot Grid */}
        <div className="print-avoid-break grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:grid-cols-12 print:gap-4">
          {/* Radar Chart Visual */}
          <div className="print-avoid-break lg:col-span-5 print:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm print:rounded-2xl print:border-slate-300 print:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white print:text-slate-900">
                Dimensional Map
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">5 Factor Polygon</span>
            </div>
            <RadarChartComponent result={result} />
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1 print:text-slate-500">
              Higher values indicate greater expression of that trait.
            </p>
          </div>

          {/* 5 Trait Summary Bars */}
          <div className="print-avoid-break lg:col-span-7 print:col-span-7 space-y-2.5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5 print:text-slate-900">
              Trait Breakdown
            </h3>

            {traitKeys.map((key) => {
              const scoreObj = result.scores[key];
              const info = TRAIT_DEFINITIONS[key];
              const isExpanded = expandedTraits[key];

              return (
                <div
                  key={key}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 transition-all shadow-sm print:rounded-xl print:p-2.5 print:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{
                          backgroundColor: `${info.color}20`,
                          color: info.color,
                        }}
                      >
                        {key.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight print:text-slate-900">
                          {info.label}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {scoreObj.tier} ({scoreObj.percentage}%)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTraitExpand(key)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors print:hidden"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-1 print:bg-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${scoreObj.percentage}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5 print:text-slate-500">
                    <span>{info.lowLabel}</span>
                    <span>{info.highLabel}</span>
                  </div>

                  {/* Expandable Details on Web */}
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 print:hidden">
                      <p className="leading-relaxed font-medium">
                        {scoreObj.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          WEB MULTI-TAB IN-DEPTH ANALYSIS
         ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-brand-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              In-Depth Personality Analysis
            </h3>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Summary', icon: Compass },
              { id: 'strengths', label: 'Strengths & Growth', icon: TrendingUp },
              { id: 'careers', label: 'Career & Work', icon: Briefcase },
              { id: 'relationships', label: 'Communication', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/30">
              <h4 className="font-bold text-brand-950 dark:text-brand-200 text-base mb-2">
                The Big Picture
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Your profile is characterized by dominant expression in{' '}
                <strong className="text-brand-600 dark:text-brand-400">
                  {TRAIT_DEFINITIONS[result.dominantTraits[0]].label}
                </strong>{' '}
                and{' '}
                <strong className="text-brand-600 dark:text-brand-400">
                  {TRAIT_DEFINITIONS[result.dominantTraits[1]].label}
                </strong>
                . This dynamic shapes your everyday instincts, interpersonal interactions, and approach to challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {traitKeys.map((key) => {
                const s = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];
                return (
                  <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label}</h5>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${info.color}15`, color: info.color }}>
                        {s.tier} ({s.percentage}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Strengths & Growth */}
        {activeTab === 'strengths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <Award className="w-5 h-5" />
                <h4>Your Core Superpowers</h4>
              </div>
              <div className="space-y-3">
                {traitKeys.map((key) => {
                  const s = result.scores[key];
                  const info = TRAIT_DEFINITIONS[key];
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
                      <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">{info.label} ({s.tier})</span>
                      <ul className="space-y-1">
                        {s.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start text-xs text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-base">
                <TrendingUp className="w-5 h-5" />
                <h4>Actionable Growth Areas</h4>
              </div>
              <div className="space-y-3">
                {traitKeys.map((key) => {
                  const s = result.scores[key];
                  const info = TRAIT_DEFINITIONS[key];
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2">
                      <span className="font-bold text-xs text-amber-800 dark:text-amber-300">{info.label} ({s.tier})</span>
                      <ul className="space-y-1">
                        {s.growthAreas.map((grw, idx) => (
                          <li key={idx} className="flex items-start text-xs text-slate-700 dark:text-slate-300">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                            <span>{grw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Careers */}
        {activeTab === 'careers' && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white space-y-3 border border-teal-800/30">
              <span className="text-xs uppercase tracking-wider text-brand-300 font-bold">Recommended Career Matches</span>
              <h4 className="text-xl font-bold">High-Fit Domains for {result.archetype.name}</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {result.archetype.idealRoles.map((role, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white border border-white/10 transition-colors">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {traitKeys.map((key) => {
                const s = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];
                return (
                  <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label} • Work Dynamics</h5>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div><strong className="text-slate-900 dark:text-slate-200">Ideal Workplace:</strong> {s.careerInsights.idealEnvironment}</div>
                      <div><strong className="text-slate-900 dark:text-slate-200">Working Style:</strong> {s.careerInsights.workStyle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Relationships */}
        {activeTab === 'relationships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {traitKeys.map((key) => {
              const s = result.scores[key];
              const info = TRAIT_DEFINITIONS[key];
              return (
                <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label} • Interpersonal Style</h5>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🗣️ Communication Approach:</span>{s.relationshipInsights.communication}</div>
                    <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🤝 Team Collaboration:</span>{s.relationshipInsights.collaboration}</div>
                    <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">⚖️ Conflict Resolution:</span>{s.relationshipInsights.conflictStyle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          PRINT-ONLY COMPREHENSIVE MULTI-PAGE DETAILED DOSSIER
         ========================================================================= */}
      <div className="hidden print:block space-y-8">
        {/* PRINT PAGE 2: COMPREHENSIVE 5-TRAIT PSYCHOMETRIC BREAKDOWN */}
        <div className="print-page-break-before space-y-4">
          <div className="border-b-2 border-slate-900 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">SECTION 2</span>
            <h3 className="text-lg font-black text-slate-900">Detailed Five-Factor Psychometric Analysis</h3>
          </div>

          <div className="space-y-4">
            {traitKeys.map((key) => {
              const s = result.scores[key];
              const info = TRAIT_DEFINITIONS[key];

              return (
                <div key={key} className="print-avoid-break p-4 rounded-xl border border-slate-300 bg-white space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                      <h4 className="font-black text-sm text-slate-900">{info.label}</h4>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      {s.tier} • {s.percentage}% ({info.lowLabel} ⟷ {info.highLabel})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{s.description}</p>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                    <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                      <strong className="text-emerald-900 block mb-1">Key Strengths:</strong>
                      <ul className="space-y-0.5 text-slate-800">
                        {s.strengths.map((str, idx) => (
                          <li key={idx}>• {str}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                      <strong className="text-amber-900 block mb-1">Growth Opportunities:</strong>
                      <ul className="space-y-0.5 text-slate-800">
                        {s.growthAreas.map((grw, idx) => (
                          <li key={idx}>• {grw}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRINT PAGE 3: CAREER, WORKPLACE & COMMUNICATION DYNAMICS */}
        <div className="print-page-break-before space-y-4">
          <div className="border-b-2 border-slate-900 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">SECTION 3</span>
            <h3 className="text-lg font-black text-slate-900">Career Strategy, Workplace Alignment & Communication</h3>
          </div>

          {/* High-Fit Career Roles */}
          <div className="print-avoid-break p-4 rounded-xl border border-teal-300 bg-teal-50/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-teal-900">High-Fit Career Roles for {result.archetype.name}</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.archetype.idealRoles.map((role, idx) => (
                <span key={idx} className="px-3 py-1 rounded-md bg-white border border-teal-300 text-xs font-bold text-teal-950">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Workplace & Execution Dynamics */}
          <div className="print-avoid-break p-4 rounded-xl border border-slate-300 bg-white space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Workplace & Execution Style</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900 block mb-0.5">Ideal Workplace Environment:</strong>
                {result.scores[result.dominantTraits[0]].careerInsights.idealEnvironment}
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Working Style & Execution:</strong>
                {result.scores[result.dominantTraits[0]].careerInsights.workStyle}
              </div>
            </div>
          </div>

          {/* Interpersonal & Communication Style */}
          <div className="print-avoid-break p-4 rounded-xl border border-slate-300 bg-white space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Interpersonal & Collaboration Dynamics</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <strong className="text-slate-900 block mb-0.5">🗣️ Communication:</strong>
                {result.scores[result.dominantTraits[0]].relationshipInsights.communication}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <strong className="text-slate-900 block mb-0.5">🤝 Team Collaboration:</strong>
                {result.scores[result.dominantTraits[0]].relationshipInsights.collaboration}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <strong className="text-slate-900 block mb-0.5">⚖️ Conflict Handling:</strong>
                {result.scores[result.dominantTraits[0]].relationshipInsights.conflictStyle}
              </div>
            </div>
          </div>

          {/* Verification & Copyright Footer */}
          <div className="print-avoid-break text-center pt-6 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">© 2026 YSAMPHY LLC • Psychological Blueprint</p>
            <p>Generated online at personality-test.ysamphy.com • Validated IPIP Five-Factor Psychometrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
