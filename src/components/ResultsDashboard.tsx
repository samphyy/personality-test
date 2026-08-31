'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header & Export Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">
            Psychometric Assessment Report
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Your Big Five Personality Blueprint
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Completed on {new Date(result.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })} • {result.mode === 'quick' ? '15-Question Quick Mode' : '30-Question Comprehensive Mode'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Results</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <Link
            href="/test"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors border border-brand-200/60 dark:border-brand-800/60"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake</span>
          </Link>
        </div>
      </div>

      {/* Archetype Hero Card */}
      <div className={`relative rounded-3xl p-8 sm:p-12 text-white bg-gradient-to-r ${result.archetype.colorTheme} shadow-2xl shadow-brand-500/15 overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Primary Archetype</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {result.archetype.name}
          </h2>

          <p className="text-lg sm:text-xl font-medium text-white/90 italic">
            &ldquo;{result.archetype.tagline}&rdquo;
          </p>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed pt-2">
            {result.archetype.description}
          </p>

          {/* Growth Advice Callout */}
          <div className="mt-6 pt-4 border-t border-white/20 flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Core Growth Advice
              </h4>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                {result.archetype.growthAdvice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KIT (CONVERTKIT) EMAIL CAPTURE SECTION */}
      <div className="print:hidden">
        <KitSubscribeForm result={result} />
      </div>

      {/* Radar Chart & Trait Snapshot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar Chart Visual */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Dimensional Map
            </h3>
            <span className="text-xs text-slate-500">5 Factor Polygon</span>
          </div>
          <RadarChartComponent result={result} />
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-2">
            Higher values indicate greater expression of that trait relative to average benchmarks.
          </p>
        </div>

        {/* 5 Trait Summary Bars */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
            Trait Breakdown
          </h3>

          {traitKeys.map((key) => {
            const scoreObj = result.scores[key];
            const info = TRAIT_DEFINITIONS[key];
            const isExpanded = expandedTraits[key];

            return (
              <div
                key={key}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-4 mb-2.5">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        backgroundColor: `${info.color}20`,
                        color: info.color,
                      }}
                    >
                      {key.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base leading-none">
                        {info.label}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {scoreObj.tier} ({scoreObj.percentage}%)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTraitExpand(key)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${scoreObj.percentage}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5">
                  <span>{info.lowLabel}</span>
                  <span>{info.highLabel}</span>
                </div>

                {/* Expandable Deep Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                    <p className="leading-relaxed font-medium">
                      {scoreObj.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center mb-1">
                          <Check className="w-3.5 h-3.5 mr-1" /> Key Strengths
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                          {scoreObj.strengths.slice(0, 2).map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                        <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center mb-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" /> Growth Opportunities
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                          {scoreObj.growthAreas.slice(0, 2).map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Tab Comprehensive Insights Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-brand-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              In-Depth Personality Analysis
            </h3>
          </div>

          {/* Navigation Tabs */}
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

        {/* Tab Content Views */}
        <div>
          {/* TAB 1: OVERVIEW */}
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
                    <div
                      key={key}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {info.label}
                        </h5>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${info.color}15`,
                            color: info.color,
                          }}
                        >
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

          {/* TAB 2: STRENGTHS & GROWTH */}
          {activeTab === 'strengths' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strengths Col */}
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
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                            {info.label} ({s.tier})
                          </span>
                        </div>
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

              {/* Growth Areas Col */}
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
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-800 dark:text-amber-300">
                            {info.label} ({s.tier})
                          </span>
                        </div>
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

          {/* TAB 3: CAREER & WORK */}
          {activeTab === 'careers' && (
            <div className="space-y-8">
              {/* Ideal Roles Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white space-y-3 border border-teal-800/30">
                <span className="text-xs uppercase tracking-wider text-brand-300 font-bold">
                  Recommended Career Matches
                </span>
                <h4 className="text-xl font-bold">
                  High-Fit Domains for {result.archetype.name}
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {result.archetype.idealRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white border border-white/10 transition-colors"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Working Style Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {traitKeys.map((key) => {
                  const s = result.scores[key];
                  const info = TRAIT_DEFINITIONS[key];

                  return (
                    <div
                      key={key}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: info.color }}
                        />
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {info.label} • Work Dynamics
                        </h5>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <strong className="text-slate-900 dark:text-slate-200">Ideal Workplace:</strong>{' '}
                          {s.careerInsights.idealEnvironment}
                        </div>
                        <div>
                          <strong className="text-slate-900 dark:text-slate-200">Working Style:</strong>{' '}
                          {s.careerInsights.workStyle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: RELATIONSHIPS & COMMUNICATION */}
          {activeTab === 'relationships' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {traitKeys.map((key) => {
                const s = result.scores[key];
                const info = TRAIT_DEFINITIONS[key];

                return (
                  <div
                    key={key}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {info.label} • Interpersonal Style
                      </h5>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                          🗣️ Communication Approach:
                        </span>
                        {s.relationshipInsights.communication}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                          🤝 Team Collaboration:
                        </span>
                        {s.relationshipInsights.collaboration}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                          ⚖️ Conflict Resolution:
                        </span>
                        {s.relationshipInsights.conflictStyle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
