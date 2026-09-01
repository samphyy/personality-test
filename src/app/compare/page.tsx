'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';
import {
  computeSynergy,
  profileSummaryFromParams,
  profileSummaryFromResult,
  UserProfileSummary,
} from '@/lib/synergy';
import CompareDashboard from '@/components/CompareDashboard';
import { ARCHETYPES } from '@/data/archetypes';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Profile 1 Query Params
  const u1Name = searchParams.get('u1') || 'Profile 1';
  const o1 = searchParams.get('o1');
  const c1 = searchParams.get('c1');
  const e1 = searchParams.get('e1');
  const a1 = searchParams.get('a1');
  const n1 = searchParams.get('n1');
  const arch1 = searchParams.get('arch1') || 'visionary-builder';

  // Profile 2 Query Params
  const u2Name = searchParams.get('u2');
  const o2 = searchParams.get('o2');
  const c2 = searchParams.get('c2');
  const e2 = searchParams.get('e2');
  const a2 = searchParams.get('a2');
  const n2 = searchParams.get('n2');
  const arch2 = searchParams.get('arch2') || 'dynamic-catalyst';

  const [cachedUserResult, setCachedUserResult] = useState<UserProfileSummary | null>(null);

  // Check if current visitor has a saved result in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ocean_last_result') || localStorage.getItem('ocean_latest_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.scores) {
          setCachedUserResult(profileSummaryFromResult(parsed, 'You'));
        }
      }
    } catch (e) {}
  }, []);

  const hasP1 = o1 !== null && c1 !== null && e1 !== null && a1 !== null && n1 !== null;
  const hasP2 = o2 !== null && c2 !== null && e2 !== null && a2 !== null && n2 !== null;

  // Case 1: Full Dual Comparison Present
  if (hasP1 && hasP2) {
    const profile1 = profileSummaryFromParams(
      u1Name,
      arch1,
      parseInt(o1, 10),
      parseInt(c1, 10),
      parseInt(e1, 10),
      parseInt(a1, 10),
      parseInt(n1, 10)
    );

    const profile2 = profileSummaryFromParams(
      u2Name || 'Partner',
      arch2,
      parseInt(o2, 10),
      parseInt(c2, 10),
      parseInt(e2, 10),
      parseInt(a2, 10),
      parseInt(n2, 10)
    );

    const synergyReport = computeSynergy(profile1, profile2);
    return <CompareDashboard report={synergyReport} />;
  }

  // Case 2: User 1 Invite Link (Visitor needs to take test or compare with sample)
  if (hasP1 && !hasP2) {
    const profile1 = profileSummaryFromParams(
      u1Name,
      arch1,
      parseInt(o1, 10),
      parseInt(c1, 10),
      parseInt(e1, 10),
      parseInt(a1, 10),
      parseInt(n1, 10)
    );

    const handleCompareWithMySavedResult = () => {
      if (cachedUserResult) {
        const u = cachedUserResult;
        const compareUrl = `/compare?u1=${encodeURIComponent(profile1.name)}&o1=${profile1.scores.openness}&c1=${profile1.scores.conscientiousness}&e1=${profile1.scores.extraversion}&a1=${profile1.scores.agreeableness}&n1=${profile1.scores.neuroticism}&arch1=${profile1.archetypeId}&u2=You&o2=${u.scores.openness}&c2=${u.scores.conscientiousness}&e2=${u.scores.extraversion}&a2=${u.scores.agreeableness}&n2=${u.scores.neuroticism}&arch2=${u.archetypeId}`;
        router.push(compareUrl);
      }
    };

    const handleCompareWithSample = (sampleId: string) => {
      const sampleArch = Object.values(ARCHETYPES).find((a) => a.id === sampleId) || Object.values(ARCHETYPES)[0];
      const compareUrl = `/compare?u1=${encodeURIComponent(profile1.name)}&o1=${profile1.scores.openness}&c1=${profile1.scores.conscientiousness}&e1=${profile1.scores.extraversion}&a1=${profile1.scores.agreeableness}&n1=${profile1.scores.neuroticism}&arch1=${profile1.archetypeId}&u2=${encodeURIComponent(sampleArch.name)}&o2=75&c2=60&e2=85&a2=70&n2=30&arch2=${sampleArch.id}`;
      router.push(compareUrl);
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
            <Users className="w-4 h-4 text-purple-500" />
            <span>Personality Comparison Invitation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Compare Your Blueprint with{' '}
            <span className="bg-gradient-to-r from-teal-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              {profile1.name}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {profile1.name} took the Big Five (OCEAN) assessment and scored as <strong>{profile1.archetypeName}</strong>. Take the 3-minute test to unlock your dual radar chart and synergy analysis!
          </p>
        </div>

        {/* User 1 Profile Preview Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-teal-400">Inviter Profile</span>
            <span className="text-xs text-slate-400">{profile1.name}&apos;s Archetype</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">{profile1.archetypeName}</h3>
            <p className="text-sm text-slate-300 italic mt-1">&ldquo;{profile1.archetypeTagline}&rdquo;</p>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="bg-slate-950/60 p-2 rounded-xl"><span className="text-slate-400 block text-[10px]">Openness</span><strong className="text-teal-400">{profile1.scores.openness}%</strong></div>
            <div className="bg-slate-950/60 p-2 rounded-xl"><span className="text-slate-400 block text-[10px]">Conscientious</span><strong className="text-teal-400">{profile1.scores.conscientiousness}%</strong></div>
            <div className="bg-slate-950/60 p-2 rounded-xl"><span className="text-slate-400 block text-[10px]">Extraversion</span><strong className="text-teal-400">{profile1.scores.extraversion}%</strong></div>
            <div className="bg-slate-950/60 p-2 rounded-xl"><span className="text-slate-400 block text-[10px]">Agreeable</span><strong className="text-teal-400">{profile1.scores.agreeableness}%</strong></div>
            <div className="bg-slate-950/60 p-2 rounded-xl"><span className="text-slate-400 block text-[10px]">Reactivity</span><strong className="text-teal-400">{profile1.scores.neuroticism}%</strong></div>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-4">
          {/* If user already has cached test results */}
          {cachedUserResult && (
            <button
              onClick={handleCompareWithMySavedResult}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Compare with My Saved Results ({cachedUserResult.archetypeName})</span>
            </button>
          )}

          {/* Primary CTA: Take Test */}
          <Link
            href="/test"
            className="w-full p-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <span>Take 3-Minute Assessment & Compare</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Fallback Sample Compare */}
          <div className="text-center pt-2">
            <span className="text-xs text-slate-400 block mb-2">Or preview instant synergy against a sample profile:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['dynamic-catalyst', 'empathic-harmonizer', 'visionary-builder'].map((id) => (
                <button
                  key={id}
                  onClick={() => handleCompareWithSample(id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Default Blank Compare Landing (Pick two profiles to compare)
  const defaultP1 = profileSummaryFromParams('Samphy', 'deep-focus-architect', 88, 78, 30, 65, 22);
  const defaultP2 = profileSummaryFromParams('Partner', 'dynamic-catalyst', 75, 55, 88, 72, 28);
  const sampleReport = computeSynergy(defaultP1, defaultP2);

  return <CompareDashboard report={sampleReport} />;
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-6xl mx-auto py-20 text-center">
          <span className="text-xs text-slate-400">Loading comparison dashboard...</span>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
