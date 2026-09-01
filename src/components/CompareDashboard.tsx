'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Share2,
  Printer,
  Sparkles,
  Check,
  RotateCcw,
  Compass,
  MessageSquare,
  Briefcase,
  AlertTriangle,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SynergyReport } from '@/lib/synergy';
import DualRadarChartComponent from './DualRadarChartComponent';

interface CompareDashboardProps {
  report: SynergyReport;
}

export default function CompareDashboard({ report }: CompareDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'communication' | 'workplace' | 'conflict'>('overview');
  const [copied, setCopied] = useState(false);

  const { user1, user2, synergyScore, overallDynamicTagline, overallSummary, traitDeltas, strengths, communicationTips, conflictResolution, workplaceSynergy } = report;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 print:py-0 print:px-0 print:space-y-6">
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
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">YSAMPHY LLC • DUAL PSYCHOMETRIC SYNERGY REPORT</span>
            <h1 className="text-xl font-black text-slate-900 leading-none mt-0.5">
              {user1.name} & {user2.name} — Personality Compatibility Dossier
            </h1>
          </div>
        </div>
        <div className="text-right text-xs text-slate-600 font-medium">
          <p>{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          <p className="text-teal-700 font-bold">personality-test.ysamphy.com/compare</p>
        </div>
      </div>

      {/* WEB-ONLY HEADER & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 text-xs font-semibold text-purple-700 dark:text-purple-300">
            <Users className="w-3.5 h-3.5 text-purple-500" />
            <span>Dual Profile Compatibility & Synergy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
            {user1.name} <span className="text-purple-500">&</span> {user2.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Psychometric synergy analysis across the Five-Factor Model (OCEAN)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Compare</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors shadow-md shadow-brand-500/25"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>

          <Link
            href="/test"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Test</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: HEAD-TO-HEAD HERO SHOWCASE & SYNERGY BADGE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* User 1 Hero Card */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white border-2 border-teal-500/40 shadow-xl space-y-3 flex flex-col justify-between print:rounded-2xl print:border-slate-300 print:text-slate-900 print:bg-white">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider print:bg-slate-100 print:text-slate-800">
              <span>Profile 1</span>
            </div>
            <h3 className="text-2xl font-black text-white print:text-slate-900">{user1.name}</h3>
            <h4 className="text-base font-bold text-teal-400 print:text-teal-700">{user1.archetypeName}</h4>
            <p className="text-xs text-slate-300 italic print:text-slate-600">&ldquo;{user1.archetypeTagline}&rdquo;</p>
          </div>

          <div className="pt-3 border-t border-slate-800 print:border-slate-200 grid grid-cols-5 gap-1 text-center text-[10px]">
            <div><span className="block text-slate-400">O</span><strong className="text-teal-300 print:text-slate-900">{user1.scores.openness}%</strong></div>
            <div><span className="block text-slate-400">C</span><strong className="text-teal-300 print:text-slate-900">{user1.scores.conscientiousness}%</strong></div>
            <div><span className="block text-slate-400">E</span><strong className="text-teal-300 print:text-slate-900">{user1.scores.extraversion}%</strong></div>
            <div><span className="block text-slate-400">A</span><strong className="text-teal-300 print:text-slate-900">{user1.scores.agreeableness}%</strong></div>
            <div><span className="block text-slate-400">N</span><strong className="text-teal-300 print:text-slate-900">{user1.scores.neuroticism}%</strong></div>
          </div>
        </div>

        {/* Center Synergy Summary Box */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-slate-900 text-white border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 shadow-xl print:rounded-2xl print:border-slate-300 print:bg-white print:text-slate-900">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-purple-600 p-1 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center print:bg-white">
                <span className="text-2xl font-black text-white print:text-slate-900">{synergyScore}%</span>
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">Synergy</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider">
              {overallDynamicTagline}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs print:text-slate-600">
              {overallSummary}
            </p>
          </div>
        </div>

        {/* User 2 Hero Card */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 text-white border-2 border-purple-500/40 shadow-xl space-y-3 flex flex-col justify-between print:rounded-2xl print:border-slate-300 print:text-slate-900 print:bg-white">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider print:bg-slate-100 print:text-slate-800">
              <span>Profile 2</span>
            </div>
            <h3 className="text-2xl font-black text-white print:text-slate-900">{user2.name}</h3>
            <h4 className="text-base font-bold text-purple-400 print:text-purple-700">{user2.archetypeName}</h4>
            <p className="text-xs text-slate-300 italic print:text-slate-600">&ldquo;{user2.archetypeTagline}&rdquo;</p>
          </div>

          <div className="pt-3 border-t border-slate-800 print:border-slate-200 grid grid-cols-5 gap-1 text-center text-[10px]">
            <div><span className="block text-slate-400">O</span><strong className="text-purple-300 print:text-slate-900">{user2.scores.openness}%</strong></div>
            <div><span className="block text-slate-400">C</span><strong className="text-purple-300 print:text-slate-900">{user2.scores.conscientiousness}%</strong></div>
            <div><span className="block text-slate-400">E</span><strong className="text-purple-300 print:text-slate-900">{user2.scores.extraversion}%</strong></div>
            <div><span className="block text-slate-400">A</span><strong className="text-purple-300 print:text-slate-900">{user2.scores.agreeableness}%</strong></div>
            <div><span className="block text-slate-400">N</span><strong className="text-purple-300 print:text-slate-900">{user2.scores.neuroticism}%</strong></div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: DUAL RADAR MAP & TRAIT DELTA BREAKDOWN
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dual Radar Chart Visual */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm print:col-span-5 print:rounded-2xl print:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white print:text-slate-900">
              Dimensional Map Overlay
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Dual 5-Factor Polygon</span>
          </div>
          <DualRadarChartComponent user1={user1} user2={user2} />
        </div>

        {/* Trait Spectrum Delta Bars */}
        <div className="lg:col-span-7 space-y-3 print:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white print:text-slate-900">
              Trait-by-Trait Spectrum Comparison
            </h3>
            <span className="text-xs text-slate-400">Head-to-head score deltas</span>
          </div>

          <div className="space-y-3">
            {traitDeltas.map((trait) => {
              const isAligned = trait.dynamicType === 'aligned';
              const isComp = trait.dynamicType === 'complementary';

              return (
                <div
                  key={trait.key}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5 print:rounded-xl print:border-slate-300 print:p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white print:text-slate-900">
                      {trait.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isAligned
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isComp
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {trait.dynamicType} (Δ {trait.delta}%)
                    </span>
                  </div>

                  {/* Dual Comparison Bars */}
                  <div className="space-y-1.5 text-xs">
                    {/* User 1 Bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 truncate text-[11px] font-semibold text-teal-600 dark:text-teal-400">{user1.name}:</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all duration-500"
                          style={{ width: `${trait.score1}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-bold text-[11px] text-slate-700 dark:text-slate-300">{trait.score1}%</span>
                    </div>

                    {/* User 2 Bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 truncate text-[11px] font-semibold text-purple-600 dark:text-purple-400">{user2.name}:</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${trait.score2}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-bold text-[11px] text-slate-700 dark:text-slate-300">{trait.score2}%</span>
                    </div>
                  </div>

                  {/* Psychometric Insight */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {trait.insight}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: WEB MULTI-TAB DEEP-DIVE SYNERGY GUIDE
         ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Psychological Synergy & Collaboration Playbook
            </h3>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Strengths', icon: Award },
              { id: 'communication', label: 'Communication Guide', icon: MessageSquare },
              { id: 'workplace', label: 'Workplace & Roles', icon: Briefcase },
              { id: 'conflict', label: 'Harmony & Blindspots', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
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

        {/* Tab 1: Overview Strengths */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <h4 className="font-bold text-purple-950 dark:text-purple-200 text-base mb-2">
                Core Dynamic Strengths
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {overallSummary}
              </p>
            </div>

            <div className="space-y-3">
              {strengths.map((str, idx) => (
                <div key={idx} className="flex items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Communication Guide */}
        {activeTab === 'communication' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                How {user1.name} should communicate with {user2.name}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {communicationTips.user1ToUser2}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                How {user2.name} should communicate with {user1.name}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {communicationTips.user2ToUser1}
              </p>
            </div>

            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                🤝 Shared Relational Protocol
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {communicationTips.sharedDynamic}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Workplace & Roles */}
        {activeTab === 'workplace' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-teal-200 dark:border-teal-900/40 bg-white dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {user1.name}&apos;s Ideal Role & Strength
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {workplaceSynergy.roleDivision.user1BestAt}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {user2.name}&apos;s Ideal Role & Strength
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {workplaceSynergy.roleDivision.user2BestAt}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                High-Leverage Joint Initiatives
              </span>
              <ul className="space-y-2">
                {workplaceSynergy.idealProjects.map((proj, idx) => (
                  <li key={idx} className="flex items-center text-xs sm:text-sm text-slate-200">
                    <ArrowRight className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                    <span>{proj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Conflict Handling */}
        {activeTab === 'conflict' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Primary Potential Friction Point</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {conflictResolution.frictionPoint}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Actionable Resolution Strategy</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {conflictResolution.resolutionStrategy}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          PRINT-ONLY COMPREHENSIVE DOSSIER
         ========================================================================= */}
      <div className="hidden print:block space-y-6">
        <div className="p-4 rounded-xl border border-slate-300 space-y-2">
          <h4 className="font-bold text-xs uppercase text-slate-900">Communication & Collaboration Strategy</h4>
          <p className="text-xs text-slate-700 leading-relaxed">{communicationTips.sharedDynamic}</p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div><strong>{user1.name}:</strong> {communicationTips.user1ToUser2}</div>
            <div><strong>{user2.name}:</strong> {communicationTips.user2ToUser1}</div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-200 text-[10px] text-slate-500">
          <p>© 2026 YSAMPHY LLC • Dual Personality Synergy Blueprint • personality-test.ysamphy.com</p>
        </div>
      </div>
    </div>
  );
}
