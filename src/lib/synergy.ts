import { AssessmentResult, TraitKey } from '@/types';
import { ARCHETYPES } from '@/data/archetypes';

export interface UserProfileSummary {
  name: string;
  archetypeId: string;
  archetypeName: string;
  archetypeTagline: string;
  archetypeTheme: string;
  scores: Record<TraitKey, number>;
}

export interface TraitDelta {
  key: TraitKey;
  label: string;
  score1: number;
  score2: number;
  delta: number;
  dynamicType: 'aligned' | 'complementary' | 'divergent';
  insight: string;
}

export interface SynergyReport {
  user1: UserProfileSummary;
  user2: UserProfileSummary;
  synergyScore: number; // 0-100%
  overallDynamicTagline: string;
  overallSummary: string;
  traitDeltas: TraitDelta[];
  strengths: string[];
  communicationTips: {
    user1ToUser2: string;
    user2ToUser1: string;
    sharedDynamic: string;
  };
  conflictResolution: {
    frictionPoint: string;
    resolutionStrategy: string;
  };
  workplaceSynergy: {
    idealProjects: string[];
    roleDivision: {
      user1BestAt: string;
      user2BestAt: string;
    };
  };
}

export function computeSynergy(u1: UserProfileSummary, u2: UserProfileSummary): SynergyReport {
  const o1 = u1.scores.openness;
  const o2 = u2.scores.openness;
  const c1 = u1.scores.conscientiousness;
  const c2 = u2.scores.conscientiousness;
  const e1 = u1.scores.extraversion;
  const e2 = u2.scores.extraversion;
  const a1 = u1.scores.agreeableness;
  const a2 = u2.scores.agreeableness;
  const n1 = u1.scores.neuroticism;
  const n2 = u2.scores.neuroticism;

  const deltaO = Math.abs(o1 - o2);
  const deltaC = Math.abs(c1 - c2);
  const deltaE = Math.abs(e1 - e2);
  const deltaA = Math.abs(a1 - a2);
  const deltaN = Math.abs(n1 - n2);

  // Trait Deltas & Detailed Insights
  const traitDeltas: TraitDelta[] = [
    {
      key: 'openness',
      label: 'Openness to Experience',
      score1: o1,
      score2: o2,
      delta: deltaO,
      dynamicType: deltaO <= 15 ? 'aligned' : deltaO <= 35 ? 'complementary' : 'divergent',
      insight:
        deltaO <= 15
          ? 'Shared curiosity and appetite for exploration. You naturally resonate on innovation and intellectual depth.'
          : o1 > o2
          ? `${u1.name} introduces visionary ideas and conceptual possibilities, while ${u2.name} anchors projects with pragmatic realism.`
          : `${u2.name} introduces visionary ideas and conceptual possibilities, while ${u1.name} anchors projects with pragmatic realism.`,
    },
    {
      key: 'conscientiousness',
      label: 'Conscientiousness & Execution',
      score1: c1,
      score2: c2,
      delta: deltaC,
      dynamicType: deltaC <= 15 ? 'aligned' : deltaC <= 35 ? 'complementary' : 'divergent',
      insight:
        deltaC <= 15
          ? 'Matching execution standards and work ethic. You hold similar expectations around deadlines, structure, and quality.'
          : c1 > c2
          ? `${u1.name} drives organization, milestone tracking, and rigorous planning, while ${u2.name} brings adaptability and spontaneous pivots.`
          : `${u2.name} drives organization, milestone tracking, and rigorous planning, while ${u1.name} brings adaptability and spontaneous pivots.`,
    },
    {
      key: 'extraversion',
      label: 'Extraversion & Social Energy',
      score1: e1,
      score2: e2,
      delta: deltaE,
      dynamicType: deltaE <= 15 ? 'aligned' : deltaE <= 35 ? 'complementary' : 'divergent',
      insight:
        deltaE <= 15
          ? e1 <= 48
            ? 'Quiet Harmony: Both value deep solitary focus, low-distraction environments, and thoughtful, non-intrusive collaboration.'
            : 'Dynamic Energy: Both thrive on verbal brainstorming, energetic discussions, and external stakeholder engagement.'
          : e1 > e2
          ? `${u1.name} naturally leads outreach, client presentations, and verbal communication, while ${u2.name} powers deep-focus analysis and methodical synthesis.`
          : `${u2.name} naturally leads outreach, client presentations, and verbal communication, while ${u1.name} powers deep-focus analysis and methodical synthesis.`,
    },
    {
      key: 'agreeableness',
      label: 'Agreeableness & Empathy',
      score1: a1,
      score2: a2,
      delta: deltaA,
      dynamicType: deltaA <= 15 ? 'aligned' : deltaA <= 35 ? 'complementary' : 'divergent',
      insight:
        deltaA <= 15
          ? 'Consistent relational baseline. You approach consensus, empathy, and feedback with a very similar temperament.'
          : a1 > a2
          ? `${u1.name} champions team morale, diplomacy, and interpersonal harmony, while ${u2.name} provides objective scrutiny and tough decision-making.`
          : `${u2.name} champions team morale, diplomacy, and interpersonal harmony, while ${u1.name} provides objective scrutiny and tough decision-making.`,
    },
    {
      key: 'neuroticism',
      label: 'Emotional Reactivity & Resilience',
      score1: n1,
      score2: n2,
      delta: deltaN,
      dynamicType: deltaN <= 15 ? 'aligned' : deltaN <= 35 ? 'complementary' : 'divergent',
      insight:
        deltaN <= 15
          ? 'Synchronized stress response. You handle urgency, stakes, and high-pressure situations with comparable emotional balance.'
          : n1 < n2
          ? `${u1.name} acts as a steady emotional anchor during turbulence, while ${u2.name} brings keen vigilance and early risk-detection.`
          : `${u2.name} acts as a steady emotional anchor during turbulence, while ${u1.name} brings keen vigilance and early risk-detection.`,
    },
  ];

  // Calculate Overall Synergy Score (Weighted complementary balance)
  let rawScore = 80;
  if (deltaC <= 25) rawScore += 6;
  if (deltaE > 20 && deltaE < 50) rawScore += 8; // Classic complementary introvert + extrovert power team
  if (deltaO <= 30) rawScore += 4;
  if (deltaA <= 30) rawScore += 4;
  if (deltaN > 40) rawScore -= 4; // High friction if stress responses diverge drastically without awareness

  const synergyScore = Math.min(96, Math.max(68, rawScore));

  // Determine Tagline & Overall Summary
  let overallDynamicTagline = 'High-Leverage Strategic Balance';
  if (deltaE > 25 && deltaC <= 20) {
    overallDynamicTagline = 'The Visionary & Execution Power Duo';
  } else if (deltaE <= 15 && e1 <= 48) {
    overallDynamicTagline = 'Deep-Focus Collaborative Resonance';
  } else if (deltaE <= 15 && e1 > 50) {
    overallDynamicTagline = 'High-Energy Catalytic Partnership';
  } else if (deltaO <= 15 && deltaC <= 15) {
    overallDynamicTagline = 'Synchronized Intellectual Alignment';
  }

  const overallSummary = `${u1.name} (${u1.archetypeName}) and ${u2.name} (${u2.archetypeName}) form a ${synergyScore}% complementary partnership. Together, your profiles balance conceptual innovation, analytical depth, and tailored social dynamics, creating a robust framework for high-trust collaboration.`;

  // Strengths
  const strengths: string[] = [
    deltaE > 20
      ? 'Complementary energy distribution: Balances internal deep-focus mastery with external communication and stakeholder outreach.'
      : 'Harmonious social pacing: Zero friction regarding meeting frequency or social interaction energy.',
    deltaC <= 25
      ? 'Aligned operational standards: Reliable execution and mutual respect for commitments and deadlines.'
      : 'Dynamic balance of structure and agility: Combines rigorous process design with spontaneous adaptability.',
    deltaA > 20
      ? 'Balanced decision-making: Unites warm relational diplomacy with rigorous, unsentimental analytical scrutiny.'
      : 'Mutual communication comfort: Shared approach to consensus building, empathy, and direct feedback.',
  ];

  // Communication Guidance
  const communicationTips = {
    user1ToUser2:
      e2 <= 48
        ? `Give ${u2.name} time to reflect and process asynchronously before expecting instant decisions. Prefer written summaries over impromptu calls.`
        : `Engage ${u2.name} in active verbal dialogue and brainstorming sessions. Keep discussions engaging, responsive, and energetic.`,
    user2ToUser1:
      e1 <= 48
        ? `Respect ${u1.name}'s solitary focus blocks. Provide context and agendas in advance so they can formulate structured thoughts.`
        : `Communicate with ${u1.name} through interactive touchpoints, real-time updates, and open, dynamic discussions.`,
    sharedDynamic:
      deltaA > 25
        ? 'Establish clear ground rules for feedback: Clarify when a discussion is meant for emotional alignment vs. analytical debate.'
        : 'Maintain transparent check-ins to ensure your mutual goals and priorities stay tightly aligned.',
  };

  // Conflict Resolution
  const conflictResolution = {
    frictionPoint:
      deltaC > 30
        ? 'Speed vs. Precision: Disagreements may arise if one prefers meticulous perfection while the other prioritizes speed and iterative shipping.'
        : deltaE > 30
        ? 'Communication Pacing: One partner may feel overwhelmed by rapid discussions, while the other feels stalled by quiet contemplation.'
        : 'Differing cognitive priorities during high-pressure deadlines or ambiguous challenges.',
    resolutionStrategy:
      'Agree upfront on clear ownership domains. Separate the ideation and strategic phase from the execution and final review phase.',
  };

  // Workplace Role Division
  const workplaceSynergy = {
    idealProjects: [
      'End-to-end strategic initiatives (from initial concept to structured delivery)',
      'Cross-functional projects requiring both high-level design and rigorous execution',
      'Long-term partnerships, joint ventures, and executive co-leadership',
    ],
    roleDivision: {
      user1BestAt:
        c1 >= c2 && o1 >= o2
          ? 'Architecting overall systems, high-level frameworks, and quality control.'
          : e1 >= e2
          ? 'Leading stakeholder presentations, external relationships, and verbal pitch delivery.'
          : 'Deep analytical focus, independent problem-solving, and detail execution.',
      user2BestAt:
        c2 > c1 && o2 >= o1
          ? 'Architecting overall systems, high-level frameworks, and quality control.'
          : e2 > e1
          ? 'Leading stakeholder presentations, external relationships, and verbal pitch delivery.'
          : 'Deep analytical focus, independent problem-solving, and detail execution.',
    },
  };

  return {
    user1: u1,
    user2: u2,
    synergyScore,
    overallDynamicTagline,
    overallSummary,
    traitDeltas,
    strengths,
    communicationTips,
    conflictResolution,
    workplaceSynergy,
  };
}

export function profileSummaryFromResult(result: AssessmentResult, userName: string = 'You'): UserProfileSummary {
  return {
    name: userName,
    archetypeId: result.archetype.id,
    archetypeName: result.archetype.name,
    archetypeTagline: result.archetype.tagline,
    archetypeTheme: result.archetype.colorTheme,
    scores: {
      openness: result.scores.openness.percentage,
      conscientiousness: result.scores.conscientiousness.percentage,
      extraversion: result.scores.extraversion.percentage,
      agreeableness: result.scores.agreeableness.percentage,
      neuroticism: result.scores.neuroticism.percentage,
    },
  };
}

export function profileSummaryFromParams(
  name: string,
  archId: string,
  o: number,
  c: number,
  e: number,
  a: number,
  n: number
): UserProfileSummary {
  const archetypesList = Object.values(ARCHETYPES);
  const found = archetypesList.find((arch) => arch.id === archId);

  const archetypeName = found
    ? found.name
    : archId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const archetypeTagline = found ? found.tagline : 'Unique psychological blueprint.';
  const archetypeTheme = found ? found.colorTheme : 'from-brand-600 via-teal-700 to-slate-800';

  return {
    name: name || 'Partner',
    archetypeId: archId || 'default-profile',
    archetypeName,
    archetypeTagline,
    archetypeTheme,
    scores: {
      openness: o,
      conscientiousness: c,
      extraversion: e,
      agreeableness: a,
      neuroticism: n,
    },
  };
}
