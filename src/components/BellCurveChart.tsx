'use client';

import React from 'react';
import { normalPdf } from '@/lib/percentileStats';

interface BellCurveChartProps {
  score: number;
  traitColor: string;
  traitLabel: string;
  percentile: number;
}

export default function BellCurveChart({
  score,
  traitColor,
  traitLabel,
  percentile,
}: BellCurveChartProps) {
  const width = 360;
  const height = 130;
  const paddingX = 20;
  const paddingBottom = 25;
  const paddingTop = 15;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Generate points for the normal curve
  const pointsCount = 60;
  const points: { x: number; y: number; val: number }[] = [];
  const maxPdf = normalPdf(50); // Peak at mean

  for (let i = 0; i <= pointsCount; i++) {
    const val = (i / pointsCount) * 100;
    const pdf = normalPdf(val);
    const chartX = paddingX + (val / 100) * chartWidth;
    const chartY = paddingTop + chartHeight - (pdf / maxPdf) * chartHeight;
    points.push({ x: chartX, y: chartY, val });
  }

  // Construct SVG path string for the full curve
  const curvePath = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Construct filled area up to the user's score
  const userChartX = paddingX + (score / 100) * chartWidth;
  const userPdf = normalPdf(score);
  const userChartY = paddingTop + chartHeight - (userPdf / maxPdf) * chartHeight;

  const filledPoints = points.filter((p) => p.val <= score);
  let filledPath = '';
  if (filledPoints.length > 0) {
    filledPath = filledPoints.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
    filledPath += ` L ${userChartX} ${userChartY} L ${userChartX} ${height - paddingBottom} L ${paddingX} ${height - paddingBottom} Z`;
  }

  const gradId = `bell-grad-${traitLabel.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="w-full flex flex-col items-center select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-w-sm overflow-visible"
        aria-label={`Bell curve for ${traitLabel}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={traitColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={traitColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Base Baseline */}
        <line
          x1={paddingX}
          y1={height - paddingBottom}
          x2={width - paddingX}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth="1.5"
          className="dark:stroke-slate-700"
        />

        {/* Standard Deviation Reference Lines */}
        {/* Mean (50%) */}
        <line
          x1={paddingX + chartWidth * 0.5}
          y1={paddingTop}
          x2={paddingX + chartWidth * 0.5}
          y2={height - paddingBottom}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.6"
        />
        {/* -1 SD (35%) */}
        <line
          x1={paddingX + chartWidth * 0.35}
          y1={paddingTop + chartHeight * 0.4}
          x2={paddingX + chartWidth * 0.35}
          y2={height - paddingBottom}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.4"
        />
        {/* +1 SD (65%) */}
        <line
          x1={paddingX + chartWidth * 0.65}
          y1={paddingTop + chartHeight * 0.4}
          x2={paddingX + chartWidth * 0.65}
          y2={height - paddingBottom}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.4"
        />

        {/* Shaded Area Under Curve up to User Score */}
        {filledPath && <path d={filledPath} fill={`url(#${gradId})`} />}

        {/* Full Bell Curve Outline */}
        <path
          d={curvePath}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          className="dark:stroke-slate-500"
        />

        {/* User Score Vertical Marker Pin */}
        <line
          x1={userChartX}
          y1={userChartY}
          x2={userChartX}
          y2={height - paddingBottom}
          stroke={traitColor}
          strokeWidth="2.5"
        />

        {/* User Score Pin Head */}
        <circle
          cx={userChartX}
          cy={userChartY}
          r="4.5"
          fill={traitColor}
          stroke="#ffffff"
          strokeWidth="2"
          className="shadow-md"
        />

        {/* Axis Labels */}
        <text
          x={paddingX}
          y={height - 8}
          fontSize="9"
          fill="#94a3b8"
          textAnchor="start"
          fontWeight="500"
        >
          Low
        </text>
        <text
          x={paddingX + chartWidth * 0.5}
          y={height - 8}
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
          fontWeight="500"
        >
          Avg (50%)
        </text>
        <text
          x={width - paddingX}
          y={height - 8}
          fontSize="9"
          fill="#94a3b8"
          textAnchor="end"
          fontWeight="500"
        >
          High
        </text>

        {/* User Position Tooltip Label */}
        <g transform={`translate(${Math.max(paddingX + 24, Math.min(width - paddingX - 24, userChartX))}, ${Math.max(12, userChartY - 8)})`}>
          <rect
            x="-22"
            y="-12"
            width="44"
            height="14"
            rx="4"
            fill={traitColor}
            className="shadow-sm"
          />
          <text
            x="0"
            y="-2"
            fontSize="8"
            fill="#ffffff"
            textAnchor="middle"
            fontWeight="bold"
          >
            {score}%
          </text>
        </g>
      </svg>

      <div className="flex items-center justify-between w-full text-[11px] px-1 pt-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Global Rank:
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {percentile}th Percentile
        </span>
      </div>
    </div>
  );
}
