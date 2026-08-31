'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AssessmentEngine from '@/components/AssessmentEngine';

function TestContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const initialMode = modeParam === 'quick' ? 'quick' : 'full';

  return <AssessmentEngine initialMode={initialMode} />;
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center text-slate-400 animate-pulse">
          Loading assessment...
        </div>
      }
    >
      <TestContent />
    </Suspense>
  );
}
