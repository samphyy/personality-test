export type Language = 'en' | 'km';

export type TraitKey = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';

export interface TraitInfo {
  key: TraitKey;
  label: string;
  labelKm: string;
  shortDescription: string;
  shortDescriptionKm: string;
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  lowLabel: string;
  lowLabelKm: string;
  highLabel: string;
  highLabelKm: string;
}

export interface Question {
  id: number;
  text: string;
  textKm: string;
  trait: TraitKey;
  keyed: 'positive' | 'negative';
  facet?: string;
  facetKm?: string;
  isQuickTest?: boolean;
}

export type ScoreTier = 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';

export interface TraitScore {
  trait: TraitKey;
  rawScore: number;
  percentage: number;
  tier: ScoreTier;
  tierKm?: string;
  label: string;
  labelKm?: string;
  description: string;
  descriptionKm?: string;
  strengths: string[];
  strengthsKm?: string[];
  growthAreas: string[];
  growthAreasKm?: string[];
  careerInsights: {
    idealEnvironment: string;
    idealEnvironmentKm?: string;
    workStyle: string;
    workStyleKm?: string;
    suggestedCareers: string[];
    suggestedCareersKm?: string[];
  };
  relationshipInsights: {
    communication: string;
    communicationKm?: string;
    collaboration: string;
    collaborationKm?: string;
    conflictStyle: string;
    conflictStyleKm?: string;
  };
}

export interface Archetype {
  id: string;
  name: string;
  nameKm?: string;
  tagline: string;
  taglineKm?: string;
  description: string;
  descriptionKm?: string;
  avatarIcon: string;
  colorTheme: string;
  primaryTraits: TraitKey[];
  idealRoles: string[];
  idealRolesKm?: string[];
  famousExamples?: string[];
  growthAdvice: string;
  growthAdviceKm?: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: number;
  mode: 'full' | 'quick';
  answers: Record<number, number>;
  scores: Record<TraitKey, TraitScore>;
  archetype: Archetype;
  dominantTraits: TraitKey[];
  completedQuestions: number;
  totalQuestions: number;
}
