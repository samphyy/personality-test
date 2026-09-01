'use client';

import React, { useState } from 'react';
import {
  X,
  BarChart3,
  Globe2,
  Copy,
  Check,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';
import { AssessmentResult, TraitKey } from '@/types';
import { computeTraitPercentile } from '@/lib/percentileStats';
import BellCurveChart from './BellCurveChart';

interface PercentileBenchmarkModalProps {
  result: AssessmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export default function PercentileBenchmarkModal({
  result,
  isOpen,
  onClose,
}: PercentileBenchmarkModalProps) {
  const [copied, setCopied] = useState(false);
  const traitKeys: TraitKey[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  if (!isOpen) return null;

  const stats = traitKeys.map((key) => {
    const score = result.scores[key].percentage;
    return computeTraitPercentile(score, key);
  });

  const handleCopyReport = () => {
    let text = `📊 Global Population Percentile Report\nArchetype: ${result.archetype.name}\n\n`;
    stats.forEach((s) => {
      text += `• ${s.label}: ${s.score}% (${s.percentile}th Percentile) — ${s.higherThanText} [${s.rarityTier}]\n`;
    });
    text += `\nGenerated at https://personality-test.ysamphy.com`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 text-slate-900 dark:text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
                  Scientific Distribution
                </span>
                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                  Gaussian Normal Curve ($\mu=50, \sigma=15$)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Global Population Percentile Benchmarks
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 text-white space-y-2 border border-purple-800/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                Psychometric Population Norms
              </span>
              <h4 className="text-base sm:text-lg font-bold">
                Where You Sit Relative to the Global Population
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-0.5">
                Each bell curve illustrates where your individual score lands against standard psychological population curves ($N=100,000+$ normalized datasets).
              </p>
            </div>

            <button
              onClick={handleCopyReport}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Percentiles</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-Trait Bell Curve Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stats.map((s) => (
            <div
              key={s.traitKey}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {s.label}
                    </h5>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Raw Score: {s.score}% (z = {s.zScore >= 0 ? `+${s.zScore}` : s.zScore})
                    </span>
                  </div>
                </div>

                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg text-white shadow-sm shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.percentile}th %ile
                </span>
              </div>

              {/* Bell Curve Graph */}
              <div className="py-1">
                <BellCurveChart
                  score={s.score}
                  traitColor={s.color}
                  traitLabel={s.label}
                  percentile={s.percentile}
                />
              </div>

              {/* Rarity & Scientific Comparison */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <strong className="text-slate-900 dark:text-slate-200">
                    {s.higherThanText}
                  </strong>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {s.rarityTier}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {s.comparisonInsight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
