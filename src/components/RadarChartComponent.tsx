'use client';

import React, { useState } from 'react';
import { AssessmentResult, TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';

interface RadarChartProps {
  result: AssessmentResult;
}

export default function RadarChartComponent({ result }: RadarChartProps) {
  const [hoveredTrait, setHoveredTrait] = useState<TraitKey | null>(null);

  const traitOrder: TraitKey[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  const size = 360;
  const center = size / 2;
  const maxRadius = 115;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate coordinates for a given trait index and radius ratio (0 to 1)
  const getCoordinates = (index: number, ratio: number, offsetRadius = 0) => {
    // Start at top (-PI/2) and rotate clockwise
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / traitOrder.length;
    const r = maxRadius * ratio + offsetRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Build polygon path for a given level
  const getPolygonPoints = (ratio: number) => {
    return traitOrder
      .map((_, i) => {
        const { x, y } = getCoordinates(i, ratio);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Build data points for user scores
  const dataPoints = traitOrder.map((key, i) => {
    const scoreObj = result.scores[key];
    const ratio = Math.max(0.08, Math.min(1.0, scoreObj.percentage / 100));
    const coords = getCoordinates(i, ratio);
    const labelCoords = getCoordinates(i, 1.0, 32);
    const info = TRAIT_DEFINITIONS[key];
    const shortLabel = key === 'neuroticism' ? 'Reactivity' : info.label.split(' ')[0];

    return {
      key,
      label: shortLabel,
      fullLabel: info.label,
      score: scoreObj.percentage,
      tier: scoreObj.tier,
      color: info.color,
      x: coords.x,
      y: coords.y,
      labelX: labelCoords.x,
      labelY: labelCoords.y,
    };
  });

  const dataPolygonPoints = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[320px] sm:max-w-[340px] h-auto max-h-[260px] sm:max-h-[280px]"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {levels.map((level, idx) => (
          <polygon
            key={idx}
            points={getPolygonPoints(level)}
            fill={idx === levels.length - 1 ? '#f8fafc' : 'none'}
            stroke="#cbd5e1"
            strokeWidth={idx === levels.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
            className="dark:fill-slate-900/40 dark:stroke-slate-700"
          />
        ))}

        {/* Axis Lines from Center to Vertices */}
        {traitOrder.map((_, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
              className="dark:stroke-slate-700"
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={dataPolygonPoints}
          fill="url(#radarGradient)"
          stroke="#0d9488"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data Vertices (Dots) & Tooltip Triggers */}
        {dataPoints.map((p) => (
          <g
            key={p.key}
            className="cursor-pointer transition-transform"
            onMouseEnter={() => setHoveredTrait(p.key)}
            onMouseLeave={() => setHoveredTrait(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredTrait === p.key ? '6' : '4.5'}
              fill="#ffffff"
              stroke={p.color}
              strokeWidth="2.5"
              className="transition-all"
            />
            {/* Score pill near point in print or hover */}
            <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
          </g>
        ))}

        {/* Trait Labels with Score Badges */}
        {dataPoints.map((p) => {
          // Adjust text anchoring based on position relative to center
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (p.labelX < center - 20) textAnchor = 'end';
          else if (p.labelX > center + 20) textAnchor = 'start';

          const isHovered = hoveredTrait === p.key;

          return (
            <g
              key={`label-${p.key}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredTrait(p.key)}
              onMouseLeave={() => setHoveredTrait(null)}
            >
              <text
                x={p.labelX}
                y={p.labelY - 4}
                textAnchor={textAnchor}
                className={`text-[11px] font-bold ${
                  isHovered ? 'fill-teal-600 dark:fill-teal-400 font-extrabold' : 'fill-slate-700 dark:fill-slate-300'
                }`}
                style={{ fontSize: '11px', fontWeight: 700 }}
              >
                {p.label}
              </text>
              <text
                x={p.labelX}
                y={p.labelY + 8}
                textAnchor={textAnchor}
                className="text-[10px] font-semibold fill-teal-700 dark:fill-teal-300"
                style={{ fontSize: '10px', fontWeight: 600 }}
              >
                {p.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

