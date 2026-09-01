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
  Bot,
  Target,
  BarChart3,
  Globe2,
} from 'lucide-react';
import { AssessmentResult, TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';
import { encodeResultToQueryParams } from '@/lib/scoring';
import { generateCareerAssets } from '@/lib/careerGenerator';
import { generateGrowthHabitPlan } from '@/lib/habitPlanGenerator';
import { computeTraitPercentile } from '@/lib/percentileStats';
import RadarChartComponent from './RadarChartComponent';
import KitSubscribeForm from './KitSubscribeForm';
import CompareInviteModal from './CompareInviteModal';
import AiAdvisor from './AiAdvisor';
import CareerAssetModal from './CareerAssetModal';
import GrowthPlanModal from './GrowthPlanModal';
import PercentileBenchmarkModal from './PercentileBenchmarkModal';

interface ResultsDashboardProps {
  result: AssessmentResult;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'careers' | 'relationships'>('overview');
  const [expandedTraits, setExpandedTraits] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [growthModalOpen, setGrowthModalOpen] = useState(false);
  const [percentileModalOpen, setPercentileModalOpen] = useState(false);

  const careerAssets = generateCareerAssets(result);
  const growthPlan = generateGrowthHabitPlan(result);
  const percentileStats = (['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as TraitKey[]).map(
    (key) => computeTraitPercentile(result.scores[key].percentage, key)
  );

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
          {/* Global Percentile Benchmarks Button */}
          <button
            onClick={() => setPercentileModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200/80 dark:border-purple-800/80 transition-all shadow-sm active:scale-95"
          >
            <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Global Norms</span>
          </button>

          {/* 30-Day Growth Plan Button */}
          <button
            onClick={() => setGrowthModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200/80 dark:border-amber-800/80 transition-all shadow-sm active:scale-95"
          >
            <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>30-Day Plan</span>
          </button>

          {/* Resume & Bio Generator Button */}
          <button
            onClick={() => setCareerModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/80 dark:border-blue-800/80 transition-all shadow-sm active:scale-95"
          >
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Resume & Bio</span>
          </button>

          {/* Ask AI Coach Button */}
          <button
            onClick={() => {
              const el = document.getElementById('ai-advisor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition-all shadow-md shadow-teal-500/20 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Coach</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={() => setCompareModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200/80 dark:border-purple-800/80 transition-all shadow-sm"
          >
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Compare</span>
          </button>

          {/* Download Social Card Button */}
          <button
            onClick={() => setCardModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
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

      {/* COMPARE PROFILES & SYNERGY MODAL */}
      <CompareInviteModal
        result={result}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* RESUME & LINKEDIN BIO MODAL */}
      <CareerAssetModal
        result={result}
        isOpen={careerModalOpen}
        onClose={() => setCareerModalOpen(false)}
      />

      {/* 30-DAY GROWTH HABIT PLAN MODAL */}
      <GrowthPlanModal
        result={result}
        isOpen={growthModalOpen}
        onClose={() => setGrowthModalOpen(false)}
      />

      {/* GLOBAL POPULATION PERCENTILES & BELL CURVES MODAL */}
      <PercentileBenchmarkModal
        result={result}
        isOpen={percentileModalOpen}
        onClose={() => setPercentileModalOpen(false)}
      />

      {/* =========================================================================
          PAGE 1 (PRINT & SCREEN): EXECUTIVE SUMMARY & DIMENSIONAL RADAR MAP
         ========================================================================= */}
      <div className="space-y-6 print:space-y-3 print-page">
        <div className="space-y-6 print:space-y-2.5">
          {/* Archetype Hero Card */}
          <div
            className="print-avoid-break print-dark-card relative rounded-3xl p-6 sm:p-10 text-white bg-slate-900 shadow-xl shadow-brand-500/15 overflow-hidden print:shadow-none print:rounded-2xl print:p-5"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 50%, #042f2e 100%)',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none print:hidden" />
            
            <div className="relative z-10 max-w-3xl space-y-3 print:space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-teal-200 print:bg-white/20 print:text-teal-200">
                <Award className="w-3.5 h-3.5 text-teal-300" />
                <span>Primary Archetype</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white print:text-2xl">
                {result.archetype.name}
              </h2>

              <p className="text-base sm:text-lg font-medium text-teal-100 italic print:text-sm">
                &ldquo;{result.archetype.tagline}&rdquo;
              </p>

              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed pt-1 print:text-[11px]">
                {result.archetype.description}
              </p>

              {/* Growth Advice Callout */}
              <div className="mt-3 pt-3 border-t border-white/20 flex items-start space-x-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 print:bg-white/15 print:p-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    Core Growth Advice
                  </h4>
                  <p className="text-xs text-white/95 mt-0.5 leading-snug print:text-[10.5px]">
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
          <div className="print-avoid-break grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:grid-cols-12 print:gap-3">
            {/* Radar Chart Visual */}
            <div className="print-avoid-break lg:col-span-5 print:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm print:rounded-2xl print:border-slate-300 print:shadow-none print:p-2.5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white print:text-xs print:font-black">
                  Dimensional Map
                </h3>
                <span className="text-[11px] text-slate-500 font-medium print:text-[9px]">5 Factor Polygon</span>
              </div>
              <RadarChartComponent result={result} />
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1 print:text-[8.5px] print:text-slate-500">
                Higher values indicate greater expression of that trait.
              </p>
            </div>

            {/* 5 Trait Summary Bars */}
            <div className="print-avoid-break lg:col-span-7 print:col-span-7 space-y-2.5 print:space-y-1.5">
              <div className="flex items-center justify-between mb-1.5 print:mb-0.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white print:text-xs print:font-black">
                  Trait Breakdown
                </h3>
                <button
                  onClick={() => setPercentileModalOpen(true)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors print:hidden"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Bell Curves</span>
                </button>
              </div>

              {traitKeys.map((key) => {
                const scoreObj = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];
                const isExpanded = expandedTraits[key];

                return (
                  <div
                    key={key}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 transition-all shadow-sm print:rounded-lg print:p-2 print:border-slate-300"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs print:w-5 print:h-5"
                          style={{
                            backgroundColor: `${info.color}20`,
                            color: info.color,
                          }}
                        >
                          {key.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight print:text-xs">
                            {info.label}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium print:text-[9.5px]">
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
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-1 print:bg-slate-200 print:h-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${scoreObj.percentage}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5 print:text-[8.5px] print:text-slate-500">
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

        {/* Page 1 Bottom-Pinned Footer (Print only) */}
        <div className="hidden print:flex justify-between items-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
          <span>© 2026 YSAMPHY LLC • Validated IPIP Five-Factor Psychometrics</span>
          <span>Page 1 of 4 • Executive Summary</span>
        </div>
      </div>

      {/* =========================================================================
          WEB MULTI-TAB IN-DEPTH ANALYSIS (HIDDEN ON PRINT)
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
              <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold">Archetype Synthesis</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Understanding {result.archetype.name}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {result.archetype.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traitKeys.map((key) => {
                const s = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];
                return (
                  <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label}</h5>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {s.tier} ({s.percentage}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Strengths & Growth */}
        {activeTab === 'strengths' && (
          <div className="space-y-6">
            {/* 30-Day Growth Plan Launcher Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-teal-500/10 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
                    🎯 Interactive Growth Curriculum
                  </span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                    30 Daily 2-Min Micro-Habits
                  </span>
                </div>
                <h5 className="text-base font-bold text-slate-900 dark:text-white">
                  30-Day Personalized Growth Habit Plan
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Turn your primary growth area into an unfair advantage with daily actionable micro-exercises.
                </p>
              </div>

              <button
                onClick={() => setGrowthModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition-all shrink-0 active:scale-95"
              >
                <Target className="w-4 h-4" />
                <span>Open 30-Day Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {traitKeys.map((key) => {
                const s = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];
                return (
                  <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label}</h5>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Key Strengths</span>
                      </span>
                      <ul className="space-y-1">
                        {s.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1.5">
                            <span className="text-emerald-500">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Growth Opportunities</span>
                      </span>
                      <ul className="space-y-1">
                        {s.growthAreas.map((grw, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1.5">
                            <span className="text-amber-500">•</span>
                            <span>{grw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Careers */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl text-white space-y-2"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 50%, #042f2e 100%)',
                backgroundColor: '#0f172a',
                color: '#ffffff',
              }}
            >
              <span className="text-xs uppercase tracking-wider text-teal-300 font-bold">Recommended Career Matches</span>
              <h4 className="text-xl font-bold text-white">High-Fit Domains for {result.archetype.name}</h4>
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
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{info.label} • Career Style</h5>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🏢 Ideal Work Environment:</span>{s.careerInsights.idealEnvironment}</div>
                      <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">⚡ Work & Execution Style:</span>{s.careerInsights.workStyle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Relationships */}
        {activeTab === 'relationships' && (
          <div className="space-y-6">
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
          </div>
        )}
      </div>

      {/* AI PSYCHOMETRIC & CAREER ADVISOR ("ASK MY BLUEPRINT") */}
      <div className="print:hidden">
        <AiAdvisor result={result} />
      </div>

      {/* =========================================================================
          PRINT-ONLY COMPREHENSIVE 5-PAGE EXECUTIVE DOSSIER
         ========================================================================= */}
      <div className="hidden print:block space-y-0 text-slate-900">
        {/* =========================================================================
            PRINT PAGE 2: SECTION 2 (FIVE-FACTOR PSYCHOMETRIC ANALYSIS)
           ========================================================================= */}
        <div className="print-page space-y-2.5">
          {/* Section 2 Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
              SECTION 2: FIVE-FACTOR PSYCHOMETRIC ANALYSIS
            </span>
            <span className="text-[9.5px] font-bold text-slate-500">Page 2 of 5</span>
          </div>

          {/* Section 2: 5-Trait Deep-Dive Cards */}
          <div className="space-y-2">
            {traitKeys.map((key) => {
              const s = result.scores[key];
              const info = TRAIT_DEFINITIONS[key];

              return (
                <div key={key} className="print-avoid-break p-2.5 rounded-xl border border-slate-300 bg-white space-y-1 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                      <h4 className="font-black text-xs text-slate-900">{info.label}</h4>
                    </div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {s.tier} • {s.percentage}% ({info.lowLabel} ⟷ {info.highLabel})
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-700 leading-snug">{s.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-0.5 text-[9.5px]">
                    <div className="bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-200">
                      <strong className="text-emerald-900 block mb-0.5">Key Strengths:</strong>
                      <ul className="space-y-0.5 text-slate-800">
                        {s.strengths.map((str, idx) => (
                          <li key={idx}>• {str}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50/50 p-1.5 rounded-lg border border-amber-200">
                      <strong className="text-amber-900 block mb-0.5">Growth Opportunities:</strong>
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

          {/* Page 2 Bottom-Pinned Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
            <span>© 2026 YSAMPHY LLC • Validated IPIP Five-Factor Psychometrics</span>
            <span>Page 2 of 5 • Psychometrics</span>
          </div>
        </div>

        {/* =========================================================================
            PRINT PAGE 3: SECTION 3 & SECTION 4 (CAREER STRATEGY & GLOBAL NORMS)
           ========================================================================= */}
        <div className="print-page space-y-3">
          {/* Section 3 & 4 Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
              SECTION 3 & 4: CAREER STRATEGY & GLOBAL POPULATION BENCHMARKS
            </span>
            <span className="text-[9.5px] font-bold text-slate-500">Page 3 of 5</span>
          </div>

          {/* Section 3: Career Strategy & Workplace Alignment */}
          <div className="print-avoid-break p-3.5 rounded-2xl border border-teal-300 bg-teal-50/30 space-y-2">
            <div className="flex items-center justify-between border-b border-teal-200 pb-1">
              <span className="text-[10px] font-black uppercase text-teal-900">Recommended Career Roles & Domains</span>
              <span className="text-[9px] text-slate-500 font-medium">Archetype: {result.archetype.name}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {result.archetype.idealRoles.map((role, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-white border border-teal-300 text-[10px] font-bold text-teal-950 shadow-sm">
                  {role}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-[10px] text-slate-700">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">🏢 Ideal Workplace Environment:</strong>
                <p className="leading-relaxed">{result.scores[result.dominantTraits[0]].careerInsights.idealEnvironment}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">⚡ Work & Execution Style:</strong>
                <p className="leading-relaxed">{result.scores[result.dominantTraits[0]].careerInsights.workStyle}</p>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 text-[10px] text-slate-700">
              <strong className="text-slate-900 block font-bold">🗣️ Interpersonal & Communication Dynamics:</strong>
              <p className="leading-relaxed">{result.scores[result.dominantTraits[0]].relationshipInsights.communication}</p>
            </div>
          </div>

          {/* Section 4: Global Population Percentiles Grid */}
          <div className="print-avoid-break space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                Global Scientific Percentile Distribution Norms (N = 100,000+)
              </h4>
              <span className="text-[8.5px] text-slate-500">IPIP-NEO Benchmark Distribution (μ=50, σ=15)</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {percentileStats.map((ps) => (
                <div key={ps.traitKey} className="p-2.5 rounded-xl border border-slate-300 bg-white space-y-1 text-center shadow-sm">
                  <span className="font-black text-slate-900 text-[10px] block truncate">{ps.label}</span>
                  <span className="font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 text-[10px] block">
                    {ps.percentile}th %ile
                  </span>
                  <span className="text-[9px] text-teal-800 font-bold block">{ps.rarityTier}</span>
                  <p className="text-slate-600 text-[8.5px] leading-tight pt-0.5">{ps.higherThanText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Page 3 Bottom-Pinned Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
            <span>© 2026 YSAMPHY LLC • Validated IPIP Five-Factor Psychometrics</span>
            <span>Page 3 of 5 • Careers & Global Norms</span>
          </div>
        </div>

        {/* =========================================================================
            PRINT PAGE 4: SECTION 5 (COMPLETE 30-DAY GROWTH ROADMAP)
           ========================================================================= */}
        <div className="print-page space-y-2">
          {/* Section 5 Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
              SECTION 5: 30-DAY PERSONALIZED BEHAVIORAL GROWTH ROADMAP
            </span>
            <span className="text-[9.5px] font-bold text-slate-500">Page 4 of 5</span>
          </div>

          {/* Section 5: Growth Plan Header */}
          <div className="flex items-center justify-between bg-amber-50/50 p-2 rounded-xl border border-amber-200 text-xs">
            <div>
              <strong className="text-[10px] uppercase font-bold text-amber-950 block">Primary Growth Focus: {growthPlan.focusTitle}</strong>
              <p className="text-[9px] text-slate-700 leading-snug">{growthPlan.summary}</p>
            </div>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg bg-amber-200 text-amber-900 shrink-0 ml-2">
              Focus: {growthPlan.focusTrait}
            </span>
          </div>

          {/* Section 5: ALL 4 WEEKS & ALL 30 DAYS IN 2-COLUMN CHECKLIST GRID */}
          <div className="grid grid-cols-2 gap-2">
            {growthPlan.weeks.map((w) => (
              <div key={w.week} className="print-avoid-break p-2.5 rounded-xl border border-slate-300 bg-white space-y-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                  <strong className="text-[9.5px] text-slate-900 uppercase">Week {w.week}: {w.title}</strong>
                  <span className="text-[8px] text-slate-500 truncate max-w-[140px]">Goal: {w.goal}</span>
                </div>
                <div className="space-y-1">
                  {w.habits.map((h) => (
                    <div key={h.day} className="p-1.5 rounded-lg bg-slate-50 border border-slate-150 text-[8.5px] leading-snug">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>[ ] Day {h.day}: {h.title}</span>
                        <span className="text-[7.5px] text-slate-400 font-normal">{h.timeEstimate}</span>
                      </div>
                      <p className="text-slate-700 mt-0.5"><span className="font-semibold text-slate-800">Action:</span> {h.action}</p>
                      <p className="text-slate-500 italic text-[8px] mt-0.5">💡 <em>Why it works:</em> {h.whyItWorks}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Page 4 Bottom-Pinned Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
            <span>© 2026 YSAMPHY LLC • Validated IPIP Five-Factor Psychometrics</span>
            <span>Page 4 of 5 • Growth Habits</span>
          </div>
        </div>

        {/* =========================================================================
            PRINT PAGE 5: SECTION 6 (CAREER ASSETS, INTERVIEW SCRIPTS & CERTIFICATION)
           ========================================================================= */}
        <div className="print-page space-y-2.5">
          {/* Section 6 Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
              SECTION 6: EXECUTIVE CAREER ASSETS & BEHAVIORAL INTERVIEW SCRIPTS
            </span>
            <span className="text-[9.5px] font-bold text-slate-500">Page 5 of 5</span>
          </div>

          {/* Section 6 Overview Description */}
          <p className="text-[9.5px] text-slate-600 bg-blue-50/40 p-2 rounded-xl border border-blue-200 leading-tight">
            <strong>Overview:</strong> Psychometrically tailored career positioning assets, behavioral interview talking scripts, and LinkedIn summaries calibrated to your Big Five strengths as a <em>{result.archetype.name}</em>.
          </p>

          {/* 5 Psychometric Resume Impact Bullets */}
          <div className="print-avoid-break p-2.5 rounded-xl border border-slate-300 bg-white space-y-1">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-900">5 Psychometric Resume Impact Bullets</h4>
            <div className="space-y-1 text-xs text-slate-700">
              {careerAssets.resumeBullets.map((b, i) => (
                <div key={i} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[9.5px]">
                  <strong className="text-slate-900">{b.title} ({b.trait}):</strong> &ldquo;{b.bullet}&rdquo;
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Interview Scripts */}
          <div className="print-avoid-break p-2.5 rounded-xl border border-slate-300 bg-white space-y-1.5">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-900">Behavioral Interview Talking Scripts</h4>
            <div className="space-y-1 text-xs text-slate-700">
              {careerAssets.interviewScripts.map((scr, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5 text-[9.5px]">
                  <strong className="text-slate-900 block font-bold">Q: {scr.question}</strong>
                  <p className="text-slate-800 italic bg-white p-1 rounded border border-slate-200">&ldquo;{scr.script}&rdquo;</p>
                  <p className="text-[8.5px] text-slate-500">💡 Context: {scr.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Executive LinkedIn Bio */}
          <div className="print-avoid-break p-2.5 rounded-xl border border-slate-300 bg-white space-y-1">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-900">LinkedIn &ldquo;About&rdquo; Bio (Executive Version)</h4>
            <p className="text-[9px] text-slate-700 whitespace-pre-line bg-slate-50 p-2 rounded-lg border border-slate-200 leading-relaxed">
              {careerAssets.linkedInBios.executive}
            </p>
          </div>

          {/* Verification & Certification Footer Pinned at Bottom of Page 5 */}
          <div className="print-avoid-break text-center pt-2.5 border-t border-slate-300 text-[9px] text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-700">© 2026 YSAMPHY LLC • Psychological Blueprint Dossier • Validated IPIP Psychometrics</p>
            <p>Generated online at personality-test.ysamphy.com • All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
