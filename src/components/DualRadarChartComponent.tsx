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
  Legend,
} from 'recharts';
import { TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';
import { UserProfileSummary } from '@/lib/synergy';

interface DualRadarChartProps {
  user1: UserProfileSummary;
  user2: UserProfileSummary;
}

export default function DualRadarChartComponent({ user1, user2 }: DualRadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 sm:h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl animate-pulse">
        <span className="text-xs text-slate-400">Loading dual radar map...</span>
      </div>
    );
  }

  const traitOrder: TraitKey[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  const data = traitOrder.map((key) => {
    const info = TRAIT_DEFINITIONS[key];
    const displayName = key === 'neuroticism' ? 'Reactivity' : info.label.split(' ')[0];
    return {
      traitKey: key,
      subject: displayName,
      [user1.name]: user1.scores[key],
      [user2.name]: user2.scores[key],
      fullMark: 100,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-2xl p-3 shadow-2xl border border-slate-700 space-y-1.5">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{item.subject}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center space-x-1.5 font-medium text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
              <span>{user1.name}:</span>
            </span>
            <span className="font-bold text-white">{item[user1.name]}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center space-x-1.5 font-medium text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span>{user2.name}:</span>
            </span>
            <span className="font-bold text-white">{item[user2.name]}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96 md:h-[420px] print:h-72 flex flex-col items-center justify-center relative print-avoid-break">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 9 }}
            tickCount={5}
          />
          <Radar
            name={user1.name}
            dataKey={user1.name}
            stroke="#1abc9c"
            fill="#1abc9c"
            fillOpacity={0.28}
            strokeWidth={2.5}
          />
          <Radar
            name={user2.name}
            dataKey={user2.name}
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.28}
            strokeWidth={2.5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '12px' }}
            formatter={(value) => (
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
