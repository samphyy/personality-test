'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Target,
  Zap,
  HeartHandshake,
  Activity,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { TRAIT_DEFINITIONS } from '@/data/questions';
import { TRAIT_TIER_DESCRIPTIONS } from '@/data/traitDescriptions';
import { TraitKey } from '@/types';

export default function LibraryPage() {
  const [selectedTrait, setSelectedTrait] = useState<TraitKey>('openness');

  const traitKeys: TraitKey[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  const activeInfo = TRAIT_DEFINITIONS[selectedTrait];
  const highTier = TRAIT_TIER_DESCRIPTIONS[selectedTrait]['High'];
  const lowTier = TRAIT_TIER_DESCRIPTIONS[selectedTrait]['Low'];

  const getTraitIcon = (key: TraitKey) => {
    switch (key) {
      case 'openness':
        return <Sparkles className="w-5 h-5" />;
      case 'conscientiousness':
        return <Target className="w-5 h-5" />;
      case 'extraversion':
        return <Zap className="w-5 h-5" />;
      case 'agreeableness':
        return <HeartHandshake className="w-5 h-5" />;
      case 'neuroticism':
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Psychometric Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          The Big Five Trait Library
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore the five foundational spectrums of human personality. Discover what high and low expressions look like, how they influence decisions, and where strengths lie.
        </p>
      </div>

      {/* Trait Navigation Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {traitKeys.map((key, idx) => {
          const info = TRAIT_DEFINITIONS[key];
          const isSelected = selectedTrait === key;
          const displayLabel = info.label.split(' ')[0];

          return (
            <button
              key={key}
              onClick={() => setSelectedTrait(key)}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              } ${
                isSelected
                  ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md shadow-brand-500/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                style={{
                  backgroundColor: `${info.color}20`,
                  color: info.color,
                }}
              >
                {getTraitIcon(key)}
              </div>
              <div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold block uppercase tracking-wider">
                  Dimension {key.charAt(0).toUpperCase()}
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {displayLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Trait Deep-Dive Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-10 shadow-sm space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0"
              style={{
                backgroundColor: `${activeInfo.color}20`,
                color: activeInfo.color,
              }}
            >
              {getTraitIcon(selectedTrait)}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Five-Factor Dimension
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {activeInfo.label}
              </h2>
            </div>
          </div>

          {/* Polarity Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{activeInfo.lowLabel}</span>
            <span className="text-slate-400">⟷</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">{activeInfo.highLabel}</span>
          </div>
        </div>

        {/* Scientific Overview */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            What is {activeInfo.label.split(' ')[0]}?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeInfo.shortDescription}
          </p>
        </div>

        {/* High vs Low Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* HIGH SPECTRUM */}
          <div className="rounded-2xl p-5 sm:p-6 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                High Expression ({activeInfo.highLabel})
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                Top ~30%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {highTier?.summary || 'High expression indicates pronounced manifestations of this trait in daily decisions.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-teal-200/60 dark:border-teal-800/40">
              <h5 className="text-xs font-bold text-teal-900 dark:text-teal-200">
                Core Strengths & Superpowers:
              </h5>
              <ul className="space-y-1.5">
                {highTier?.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mr-2 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LOW SPECTRUM */}
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Low Expression ({activeInfo.lowLabel})
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                Bottom ~30%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lowTier?.summary || 'Low expression provides complementary strengths, prioritizing stability and alternative focus.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Complementary Strengths:
              </h5>
              <ul className="space-y-1.5">
                {lowTier?.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA to test */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Curious where you land on {activeInfo.label.split(' ')[0]}?
            </h4>
            <p className="text-xs text-slate-500">
              Take the free 30-question assessment to receive your exact percentile.
            </p>
          </div>

          <Link
            href="/test"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>Take Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
