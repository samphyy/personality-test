import { TraitKey } from '@/types';
import { TRAIT_DEFINITIONS } from '@/data/questions';

export interface TraitPercentileInfo {
  traitKey: TraitKey;
  label: string;
  score: number;
  zScore: number;
  percentile: number;
  higherThanText: string;
  rarityTier: string;
  comparisonInsight: string;
  color: string;
}

// Approximation of the Error Function erf(x)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Normal Cumulative Distribution Function Φ(z)
export function normalCdf(score: number, mean = 50, sd = 15): number {
  const z = (score - mean) / sd;
  const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Math.max(1, Math.min(99, Math.round(cdf * 100)));
}

// Gaussian Probability Density Function f(x)
export function normalPdf(x: number, mean = 50, sd = 15): number {
  const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
  return coefficient * Math.exp(exponent);
}

export function computeTraitPercentile(score: number, traitKey: TraitKey): TraitPercentileInfo {
  const info = TRAIT_DEFINITIONS[traitKey];
  const mean = 50;
  const sd = 15;

  const z = Number(((score - mean) / sd).toFixed(2));
  const percentile = normalCdf(score, mean, sd);

  let rarityTier = 'Average / Mid-Spectrum';
  let comparisonInsight = `Your score aligns with typical normative population tendencies.`;

  if (percentile >= 95) {
    rarityTier = 'Top 5% (Highly Distinct)';
    comparisonInsight = `You express exceptionally higher ${info.label.toLowerCase()} than 95%+ of global test takers, representing a defining cognitive superpower.`;
  } else if (percentile >= 85) {
    rarityTier = `Top ${100 - percentile}th Percentile (Elevated)`;
    comparisonInsight = `You score higher in ${info.label} than ${percentile}% of the global population, showing a clear natural orientation toward ${info.highLabel.toLowerCase()}.`;
  } else if (percentile >= 65) {
    rarityTier = 'Above-Average Expression';
    comparisonInsight = `You lean noticeably toward ${info.highLabel.toLowerCase()} compared to approximately ${percentile}% of people.`;
  } else if (percentile <= 15) {
    rarityTier = `Lower ${percentile}th Percentile (Distinctly Low)`;
    comparisonInsight = `Your score is lower than ${100 - percentile}% of the population, reflecting a strong preference for ${info.lowLabel.toLowerCase()}.`;
  } else if (percentile <= 35) {
    rarityTier = 'Below-Average / Moderately Low';
    comparisonInsight = `You lean more toward ${info.lowLabel.toLowerCase()} than roughly ${100 - percentile}% of global test takers.`;
  } else {
    rarityTier = 'Balanced / Median Range (Typical)';
    comparisonInsight = `Your score sits right in the balanced middle 40% of the population, allowing you to fluidly adapt between ${info.lowLabel.toLowerCase()} and ${info.highLabel.toLowerCase()}.`;
  }

  const higherThanText =
    percentile >= 50
      ? `Higher than ${percentile}% of global assessment takers`
      : `Lower than ${100 - percentile}% of global assessment takers`;

  return {
    traitKey,
    label: info.label,
    score,
    zScore: z,
    percentile,
    higherThanText,
    rarityTier,
    comparisonInsight,
    color: info.color,
  };
}
