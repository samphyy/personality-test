'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AssessmentResult, TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';

interface RadarChartProps {
  result: AssessmentResult;
}

export default function RadarChartComponent({ result }: RadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse">
        <span className="text-sm text-slate-400">Loading chart...</span>
      </div>
    );
  }

  // Convert scores to radar chart dataset
  // Note: For display, we can show "Emotional Stability" (100 - Neuroticism) or "Emotional Reactivity" (Neuroticism). Let's present clear labels.
  const traitOrder: TraitKey[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  const data = traitOrder.map((key) => {
    const scoreObj = result.scores[key];
    const info = TRAIT_DEFINITIONS[key];
    const displayName = key === 'neuroticism' ? 'Emotional Reactivity' : info.label.split(' ')[0];
    return {
      traitKey: key,
      subject: displayName,
      score: scoreObj.percentage,
      tier: scoreObj.tier,
      fullMark: 100,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl border border-slate-700">
          <p className="font-semibold text-teal-300">{item.subject}</p>
          <p className="font-medium text-slate-100">
            Score: <span className="font-bold">{item.score}%</span> ({item.tier})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Your Profile"
            dataKey="score"
            stroke="#1abc9c"
            fill="#1abc9c"
            fillOpacity={0.35}
            strokeWidth={2.5}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
