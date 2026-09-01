'use client';

import React from 'react';
import { AssessmentResult, TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';

interface PrintRadarChartProps {
  result: AssessmentResult;
}

export default function PrintRadarChart({ result }: PrintRadarChartProps) {
  const traitOrder: TraitKey[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  const size = 300;
  const center = size / 2; // 150
  const maxRadius = 85;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, ratio: number, offsetRadius = 0) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / traitOrder.length;
    const r = maxRadius * ratio + offsetRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getPolygonPoints = (ratio: number) => {
    return traitOrder
      .map((_, i) => {
        const { x, y } = getCoordinates(i, ratio);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const dataPoints = traitOrder.map((key, i) => {
    const scoreObj = result.scores[key];
    const ratio = Math.max(0.1, Math.min(1.0, scoreObj.percentage / 100));
    const coords = getCoordinates(i, ratio);
    const labelCoords = getCoordinates(i, 1.0, 24);
    const info = TRAIT_DEFINITIONS[key];
    const shortLabel = key === 'neuroticism' ? 'Reactivity' : info.label.split(' ')[0];

    return {
      key,
      label: shortLabel,
      score: scoreObj.percentage,
      color: info.color,
      x: coords.x,
      y: coords.y,
      labelX: labelCoords.x,
      labelY: labelCoords.y,
    };
  });

  const dataPolygonPoints = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="w-full flex items-center justify-center py-1">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-[240px] h-[200px]"
        style={{ overflow: 'visible' }}
      >
        {/* Concentric Grid Levels */}
        {levels.map((level, idx) => (
          <polygon
            key={idx}
            points={getPolygonPoints(level)}
            fill={idx === levels.length - 1 ? '#f8fafc' : 'none'}
            stroke="#cbd5e1"
            strokeWidth={idx === levels.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
          />
        ))}

        {/* Axis Lines from Center */}
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
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={dataPolygonPoints}
          fill="#14b8a6"
          fillOpacity="0.35"
          stroke="#0d9488"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data Vertices */}
        {dataPoints.map((p) => (
          <circle
            key={p.key}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#ffffff"
            stroke={p.color}
            strokeWidth="2"
          />
        ))}

        {/* Trait Labels & Scores */}
        {dataPoints.map((p) => {
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (p.labelX < center - 15) textAnchor = 'end';
          else if (p.labelX > center + 15) textAnchor = 'start';

          return (
            <g key={`lbl-${p.key}`}>
              <text
                x={p.labelX}
                y={p.labelY - 2}
                textAnchor={textAnchor}
                fill="#334155"
                style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'sans-serif' }}
              >
                {p.label}
              </text>
              <text
                x={p.labelX}
                y={p.labelY + 9}
                textAnchor={textAnchor}
                fill="#0f766e"
                style={{ fontSize: '9px', fontWeight: 700, fontFamily: 'sans-serif' }}
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
