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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Psychometric Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          The Big Five Trait Library
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore the five foundational spectrums of human personality. Discover what high and low expressions look like, how they influence decisions, and where strengths lie.
        </p>
      </div>

      {/* Trait Navigation Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {traitKeys.map((key) => {
          const info = TRAIT_DEFINITIONS[key];
          const isSelected = selectedTrait === key;
          const displayLabel = info.label.split(' ')[0];

          return (
            <button
              key={key}
              onClick={() => setSelectedTrait(key)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md shadow-brand-500/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${info.color}20`,
                  color: info.color,
                }}
              >
                {getTraitIcon(key)}
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                  Dimension {key.charAt(0).toUpperCase()}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {displayLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Trait Deep-Dive Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl"
              style={{
                backgroundColor: `${activeInfo.color}20`,
                color: activeInfo.color,
              }}
            >
              {getTraitIcon(selectedTrait)}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeInfo.label}
              </h2>
              <span className="text-xs text-slate-400">
                Spectrum: {activeInfo.lowLabel} ⟷ {activeInfo.highLabel}
              </span>
            </div>
          </div>

          <Link
            href="/test"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm transition-transform hover:scale-105 shadow-md shadow-brand-500/20"
          >
            <span>Test This Trait</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          {activeInfo.shortDescription}
        </p>

        {/* High vs Low Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HIGH EXPRESSION */}
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                High Expression: {activeInfo.highLabel}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {highTier.summary}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Typical Strengths:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {highTier.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Suggested Career Paths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {highTier.suggestedCareers.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* LOW EXPRESSION */}
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Low Expression: {activeInfo.lowLabel}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {lowTier.summary}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Typical Strengths:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {lowTier.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mr-1.5 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Suggested Career Paths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lowTier.suggestedCareers.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
