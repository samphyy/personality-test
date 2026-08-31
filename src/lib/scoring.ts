import { ARCHETYPES } from '@/data/archetypes';
import { QUESTIONS, TRAIT_DEFINITIONS } from '@/data/questions';
import { TRAIT_TIER_DESCRIPTIONS } from '@/data/traitDescriptions';
import { Archetype, AssessmentResult, ScoreTier, TraitKey, TraitScore } from '@/types';

export function calculateScoreTier(percentage: number): ScoreTier {
  if (percentage >= 80) return 'Very High';
  if (percentage >= 60) return 'High';
  if (percentage >= 40) return 'Moderate';
  if (percentage >= 20) return 'Low';
  return 'Very Low';
}

export function computeAssessmentResults(
  answers: Record<number, number>,
  mode: 'full' | 'quick' = 'full'
): AssessmentResult {
  const activeQuestions = mode === 'quick' 
    ? QUESTIONS.filter(q => q.isQuickTest) 
    : QUESTIONS;

  const traitSums: Record<TraitKey, { total: number; count: number }> = {
    openness: { total: 0, count: 0 },
    conscientiousness: { total: 0, count: 0 },
    extraversion: { total: 0, count: 0 },
    agreeableness: { total: 0, count: 0 },
    neuroticism: { total: 0, count: 0 },
  };

  activeQuestions.forEach((question) => {
    const rawVal = answers[question.id] ?? 3;
    const scoredVal = question.keyed === 'positive' ? rawVal : (6 - rawVal);
    traitSums[question.trait].total += scoredVal;
    traitSums[question.trait].count += 1;
  });

  const scores: Record<TraitKey, TraitScore> = {} as Record<TraitKey, TraitScore>;

  (Object.keys(traitSums) as TraitKey[]).forEach((traitKey) => {
    const { total, count } = traitSums[traitKey];
    const rawScore = count > 0 ? Number((total / count).toFixed(2)) : 3.0;
    const percentage = Math.round(Math.max(0, Math.min(100, ((rawScore - 1) / 4) * 100)));
    const tier = calculateScoreTier(percentage);
    const details = TRAIT_TIER_DESCRIPTIONS[traitKey][tier];
    const traitInfo = TRAIT_DEFINITIONS[traitKey];

    scores[traitKey] = {
      trait: traitKey,
      rawScore,
      percentage,
      tier,
      label: traitInfo.label,
      description: details.summary,
      strengths: details.strengths,
      growthAreas: details.growthAreas,
      careerInsights: {
        idealEnvironment: details.idealEnvironment,
        workStyle: details.workStyle,
        suggestedCareers: details.suggestedCareers,
      },
      relationshipInsights: {
        communication: details.communication,
        collaboration: details.collaboration,
        conflictStyle: details.conflictStyle,
      },
    };
  });

  // Rank traits by percentage
  const rankedTraits = (['openness', 'conscientiousness', 'extraversion', 'agreeableness'] as TraitKey[])
    .map((k) => ({ key: k, pct: scores[k].percentage }))
    .sort((a, b) => b.pct - a.pct);

  const top1 = rankedTraits[0].key;
  const top2 = rankedTraits[1].key;
  const isIntroverted = scores.extraversion.percentage <= 48;

  let matchedArchetype: Archetype = ARCHETYPES['default-balanced'];

  if (scores.neuroticism.percentage <= 25 && rankedTraits[0].pct < 75) {
    matchedArchetype = ARCHETYPES['high-resilience'];
  } else if (isIntroverted) {
    // Select Introverted Archetypes
    if ((top1 === 'openness' && top2 === 'conscientiousness') || (top1 === 'conscientiousness' && top2 === 'openness')) {
      matchedArchetype = ARCHETYPES['introvert-openness-conscientiousness'];
    } else if ((top1 === 'openness' && top2 === 'agreeableness') || (top1 === 'agreeableness' && top2 === 'openness')) {
      matchedArchetype = ARCHETYPES['introvert-openness-agreeableness'];
    } else if ((top1 === 'conscientiousness' && top2 === 'agreeableness') || (top1 === 'agreeableness' && top2 === 'conscientiousness')) {
      matchedArchetype = ARCHETYPES['introvert-conscientiousness-agreeableness'];
    } else {
      matchedArchetype = ARCHETYPES['introvert-openness-conscientiousness'];
    }
  } else {
    // Select Extroverted Archetypes
    if (top1 === 'extraversion' && top2 === 'openness' || top1 === 'openness' && top2 === 'extraversion') {
      matchedArchetype = ARCHETYPES['extrovert-openness-extraversion'];
    } else if (top1 === 'extraversion' && top2 === 'conscientiousness' || top1 === 'conscientiousness' && top2 === 'extraversion') {
      matchedArchetype = ARCHETYPES['extrovert-conscientiousness-extraversion'];
    } else if (top1 === 'extraversion' && top2 === 'agreeableness' || top1 === 'agreeableness' && top2 === 'extraversion') {
      matchedArchetype = ARCHETYPES['extrovert-extraversion-agreeableness'];
    } else if ((top1 === 'openness' && top2 === 'conscientiousness') || (top1 === 'conscientiousness' && top2 === 'openness')) {
      matchedArchetype = ARCHETYPES['extrovert-openness-conscientiousness'];
    } else {
      matchedArchetype = ARCHETYPES['default-balanced'];
    }
  }

  const resultId = `ocean_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id: resultId,
    timestamp: Date.now(),
    mode,
    answers,
    scores,
    archetype: matchedArchetype,
    dominantTraits: [top1, top2],
    completedQuestions: Object.keys(answers).length,
    totalQuestions: activeQuestions.length,
  };
}

/**
 * URL Generator & Parser for Persistent, Shareable Results
 */

export function encodeResultToQueryParams(result: AssessmentResult): string {
  const params = new URLSearchParams();
  params.set('o', result.scores.openness.percentage.toString());
  params.set('c', result.scores.conscientiousness.percentage.toString());
  params.set('e', result.scores.extraversion.percentage.toString());
  params.set('a', result.scores.agreeableness.percentage.toString());
  params.set('n', result.scores.neuroticism.percentage.toString());
  params.set('arch', result.archetype.id);
  params.set('m', result.mode);
  return params.toString();
}

export function decodeResultFromQueryParams(searchParams: URLSearchParams): AssessmentResult | null {
  const o = parseInt(searchParams.get('o') || '', 10);
  const c = parseInt(searchParams.get('c') || '', 10);
  const e = parseInt(searchParams.get('e') || '', 10);
  const a = parseInt(searchParams.get('a') || '', 10);
  const n = parseInt(searchParams.get('n') || '', 10);
  const archId = searchParams.get('arch');
  const mode = (searchParams.get('m') === 'quick' ? 'quick' : 'full') as 'full' | 'quick';

  if (isNaN(o) || isNaN(c) || isNaN(e) || isNaN(a) || isNaN(n)) {
    return null;
  }

  const percentages: Record<TraitKey, number> = {
    openness: Math.max(0, Math.min(100, o)),
    conscientiousness: Math.max(0, Math.min(100, c)),
    extraversion: Math.max(0, Math.min(100, e)),
    agreeableness: Math.max(0, Math.min(100, a)),
    neuroticism: Math.max(0, Math.min(100, n)),
  };

  const scores: Record<TraitKey, TraitScore> = {} as Record<TraitKey, TraitScore>;

  (Object.keys(percentages) as TraitKey[]).forEach((traitKey) => {
    const percentage = percentages[traitKey];
    const tier = calculateScoreTier(percentage);
    const details = TRAIT_TIER_DESCRIPTIONS[traitKey][tier];
    const traitInfo = TRAIT_DEFINITIONS[traitKey];
    const rawScore = Number((1 + (percentage / 100) * 4).toFixed(2));

    scores[traitKey] = {
      trait: traitKey,
      rawScore,
      percentage,
      tier,
      label: traitInfo.label,
      description: details.summary,
      strengths: details.strengths,
      growthAreas: details.growthAreas,
      careerInsights: {
        idealEnvironment: details.idealEnvironment,
        workStyle: details.workStyle,
        suggestedCareers: details.suggestedCareers,
      },
      relationshipInsights: {
        communication: details.communication,
        collaboration: details.collaboration,
        conflictStyle: details.conflictStyle,
      },
    };
  });

  // Resolve archetype from archId or recalculate
  let matchedArchetype: Archetype | undefined;
  if (archId) {
    matchedArchetype = Object.values(ARCHETYPES).find((arch) => arch.id === archId);
  }

  if (!matchedArchetype) {
    // Compute dominant traits
    const rankedTraits = (['openness', 'conscientiousness', 'extraversion', 'agreeableness'] as TraitKey[])
      .map((k) => ({ key: k, pct: scores[k].percentage }))
      .sort((a, b) => b.pct - a.pct);

    const isIntroverted = scores.extraversion.percentage <= 48;
    if (isIntroverted) {
      matchedArchetype = ARCHETYPES['introvert-openness-conscientiousness'];
    } else {
      matchedArchetype = ARCHETYPES['default-balanced'];
    }
  }

  const rankedTraits = (['openness', 'conscientiousness', 'extraversion', 'agreeableness'] as TraitKey[])
    .map((k) => ({ key: k, pct: scores[k].percentage }))
    .sort((a, b) => b.pct - a.pct);

  return {
    id: `ocean_url_${Date.now()}`,
    timestamp: Date.now(),
    mode,
    answers: {},
    scores,
    archetype: matchedArchetype,
    dominantTraits: [rankedTraits[0].key, rankedTraits[1].key],
    completedQuestions: mode === 'quick' ? 15 : 30,
    totalQuestions: mode === 'quick' ? 15 : 30,
  };
}
