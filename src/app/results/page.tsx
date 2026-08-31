'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AssessmentResult } from '@/types';
import ResultsDashboard from '@/components/ResultsDashboard';
import { Compass, Sparkles } from 'lucide-react';
import { computeAssessmentResults, decodeResultFromQueryParams } from '@/lib/scoring';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if scores are passed via URL query parameters
    const decodedFromUrl = decodeResultFromQueryParams(searchParams);
    if (decodedFromUrl) {
      setResult(decodedFromUrl);
      setLoading(false);
      return;
    }

    // 2. Otherwise load from local storage
    try {
      const stored = localStorage.getItem('ocean_last_result');
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading result from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Loading your personality profile...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-center mx-auto text-brand-600 dark:text-brand-400">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          No Assessment Found Yet
        </h1>

        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          You haven&apos;t taken the Big Five personality test yet on this device. Complete the assessment to unlock your radar map and full psychological report.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/test"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Take 30-Question Assessment</span>
          </Link>

          <button
            onClick={() => {
              // Sample profile (Introverted Visionary Architect)
              const sampleAnswers: Record<number, number> = {
                1: 5, 2: 4, 3: 1, 4: 5, 5: 1, 6: 4,
                7: 4, 8: 5, 9: 2, 10: 5, 11: 2, 12: 4,
                13: 2, 14: 2, 15: 4, 16: 2, 17: 5, 18: 3, // Introverted Extraversion
                19: 4, 20: 4, 21: 2, 22: 4, 23: 4, 24: 2,
                25: 2, 26: 4, 27: 2, 28: 2, 29: 4, 30: 2,
              };
              const sampleResult = computeAssessmentResults(sampleAnswers, 'full');
              setResult(sampleResult);
            }}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            Load Sample Profile
          </button>
        </div>
      </div>
    );
  }

  return <ResultsDashboard result={result} />;
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading report...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
