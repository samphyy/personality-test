import { UserProfileSummary } from '@/lib/synergy';

export type RelationshipContext = 'cofounder' | 'romantic' | 'creative';

export interface DecisionRole {
  domain: string;
  leadPartner: string;
  rationale: string;
  vetoRule: string;
}

export interface AlignmentDossier {
  context: RelationshipContext;
  title: string;
  badge: string;
  superpower: string;
  blindspot: string;
  decisionMatrix: DecisionRole[];
  divisionOfLabor: {
    partner1Focus: string[];
    partner2Focus: string[];
    sharedFocus: string[];
  };
  conflictProtocol: {
    ruleTitle: string;
    description: string;
    trigger: string;
  }[];
}

export function generatePartnerAlignment(
  user1: UserProfileSummary,
  user2: UserProfileSummary,
  context: RelationshipContext
): AlignmentDossier {
  const u1 = user1.scores;
  const u2 = user2.scores;

  // Determine who has higher traits
  const higherOpenness = u1.openness >= u2.openness ? user1.name : user2.name;
  const higherConscientiousness = u1.conscientiousness >= u2.conscientiousness ? user1.name : user2.name;
  const higherExtraversion = u1.extraversion >= u2.extraversion ? user1.name : user2.name;
  const higherAgreeableness = u1.agreeableness >= u2.agreeableness ? user1.name : user2.name;

  if (context === 'cofounder') {
    return {
      context: 'cofounder',
      title: 'Co-Founder Operating Agreement & Executive Blueprint',
      badge: 'Startup & Business Partnership',
      superpower: `A dynamic balance of ${u1.openness > 60 || u2.openness > 60 ? 'market vision' : 'structured pragmatism'} and ${u1.conscientiousness > 60 || u2.conscientiousness > 60 ? 'disciplined operational execution' : 'rapid pivoting capability'}.`,
      blindspot:
        Math.abs(u1.conscientiousness - u2.conscientiousness) > 25
          ? `Pacing Discrepancy: ${higherConscientiousness} may feel frustrated by perceived disorganization, while the other feels micromanaged.`
          : `Groupthink on risk tolerance: ensure external advisors audit major capital commitments.`,
      decisionMatrix: [
        {
          domain: 'Product Innovation & Long-Term Roadmap',
          leadPartner: higherOpenness,
          rationale: `Higher Openness (${Math.max(u1.openness, u2.openness)}%) provides superior creative pattern synthesis and strategic market foresight.`,
          vetoRule: `${higherOpenness} leads roadmap ideation; ${higherConscientiousness} must approve engineering feasibility and delivery deadlines.`,
        },
        {
          domain: 'Operations, Finance & Delivery Milestones',
          leadPartner: higherConscientiousness,
          rationale: `Higher Conscientiousness (${Math.max(u1.conscientiousness, u2.conscientiousness)}%) guarantees disciplined budgeting, KPI enforcement, and execution rigor.`,
          vetoRule: `${higherConscientiousness} has final veto on budget allocations, hiring timelines, and compliance standards.`,
        },
        {
          domain: 'Investor Pitching, Sales & External PR',
          leadPartner: higherExtraversion,
          rationale: `Higher Extraversion (${Math.max(u1.extraversion, u2.extraversion)}%) excels at high-energy storytelling, networking, and charismatic evangelism.`,
          vetoRule: `${higherExtraversion} leads investor pitches and key sales calls; commercial term sheets require dual sign-off.`,
        },
        {
          domain: 'Team Culture, Dispute Resolution & Hiring',
          leadPartner: higherAgreeableness,
          rationale: `Higher Agreeableness (${Math.max(u1.agreeableness, u2.agreeableness)}%) fosters psychological safety and spots organizational friction early.`,
          vetoRule: `${higherAgreeableness} leads candidate cultural interviews and internal team conflict resolution.`,
        },
      ],
      divisionOfLabor: {
        partner1Focus: [
          u1.openness > u2.openness ? 'Vision & Architectural Roadmaps' : 'Operational Delivery & Systems',
          u1.extraversion > u2.extraversion ? 'Outbound Partnerships & Investor Relations' : 'Deep Technical & Analytical Execution',
          `${user1.name}'s Archetype Strengths (${user1.archetypeName})`,
        ],
        partner2Focus: [
          u2.openness > u1.openness ? 'Vision & Architectural Roadmaps' : 'Operational Delivery & Systems',
          u2.extraversion > u1.extraversion ? 'Outbound Partnerships & Investor Relations' : 'Deep Technical & Analytical Execution',
          `${user2.name}'s Archetype Strengths (${user2.archetypeName})`,
        ],
        sharedFocus: [
          'Quarterly OKR Definition & Strategic Pivots',
          'Cap Table, Equity Allocation & Executive Hires',
          'Company Core Values and Cultural Benchmarks',
        ],
      },
      conflictProtocol: [
        {
          ruleTitle: 'The 24-Hour Asynchronous Cooling Rule',
          trigger: 'Heated disagreement during strategic debates or product direction',
          description:
            'Do not force a decision in the meeting. The dissenting partner writes a 1-page "Opportunity vs Risk" memo within 24 hours. Decisions are made on data, not emotional stamina.',
        },
        {
          ruleTitle: 'Domain Ownership Sovereignty',
          trigger: 'Second-guessing functional decisions in each other’s primary domain',
          description:
            'In disagreements where consensus cannot be reached, the designated Lead Partner retains final tie-breaking authority for their functional domain.',
        },
        {
          ruleTitle: 'Weekly 1-on-1 Founder Health Sync',
          trigger: 'Unexpressed resentment regarding workload or recognition',
          description:
            'Hold a recurring 30-minute Friday sync dedicated exclusively to partnership relationship dynamics—zero project status updates allowed.',
        },
      ],
    };
  }

  if (context === 'romantic') {
    return {
      context: 'romantic',
      title: 'Romantic & Life Partner Alignment Charter',
      badge: 'Couple & Relationship Dynamics',
      superpower: `Complementary emotional and operational balance that creates a supportive, stable, and deeply fulfilling home partnership.`,
      blindspot:
        Math.abs(u1.extraversion - u2.extraversion) > 25
          ? `Social Recharge Imbalance: ${higherExtraversion} recharges through group activities, while the other requires quiet solitude to recover.`
          : `Communication Style Differences: Ensure practical logic does not overshadow emotional validation.`,
      decisionMatrix: [
        {
          domain: 'Home Organization, Budgeting & Long-Term Planning',
          leadPartner: higherConscientiousness,
          rationale: `Natural knack for structured logistics, budgeting accuracy, and reliable scheduling.`,
          vetoRule: `${higherConscientiousness} manages calendar logistics; major financial expenditures (>$500) require joint agreement.`,
        },
        {
          domain: 'Weekend Social Calendar & Travel Adventures',
          leadPartner: higherOpenness,
          rationale: `Inspirational curiosity for novel experiences, travel itineraries, and cultural exploration.`,
          vetoRule: `Both partners maintain veto power to ensure downtime is preserved without burnout.`,
        },
        {
          domain: 'Emotional Climate & Family Connection',
          leadPartner: higherAgreeableness,
          rationale: `High empathy and deep relational sensitivity that keeps interpersonal warmth alive.`,
          vetoRule: `When emotional friction arises, ${higherAgreeableness} initiates the structured de-escalation conversation.`,
        },
      ],
      divisionOfLabor: {
        partner1Focus: [
          u1.conscientiousness > u2.conscientiousness ? 'Financial Planning & Household Operations' : 'Spontaneous Quality Time & Joy',
          `${user1.name}'s Natural Superpowers (${user1.archetypeName})`,
        ],
        partner2Focus: [
          u2.conscientiousness > u1.conscientiousness ? 'Financial Planning & Household Operations' : 'Spontaneous Quality Time & Joy',
          `${user2.name}'s Natural Superpowers (${user2.archetypeName})`,
        ],
        sharedFocus: [
          'Shared Life Dreams, Relocation & Family Milestones',
          'Financial Security & Savings Architecture',
          'Daily Reconnection & Uninterrupted Quality Time',
        ],
      },
      conflictProtocol: [
        {
          ruleTitle: 'Validation Before Problem Solving',
          trigger: 'When one partner is stressed or sharing emotional distress',
          description:
            'The listening partner must ask: "Do you want comfort, advice, or just space to vent?" before offering solutions.',
        },
        {
          ruleTitle: 'The 20-Minute Time-Out Clause',
          trigger: 'When an argument reaches emotional flooding (heart rate elevated)',
          description:
            'Either partner can call a 20-minute pause with the explicit commitment: "I love you, I need 20 minutes to cool down, and I will return to finish this calmly."',
        },
        {
          ruleTitle: 'Appreciation to Critique Ratio (5:1)',
          trigger: 'Daily communication and constructive requests',
          description:
            'Maintain at least 5 genuine micro-affirmations for every 1 constructive behavioral request.',
        },
      ],
    };
  }

  // Creative Collaborators Context
  return {
    context: 'creative',
    title: 'Creative Collaborator & Project Synergies',
    badge: 'Creative & Intellectual Partnership',
    superpower: `High-resonance creative synergy capable of transforming abstract artistic concepts into polished, finished masterpieces.`,
    blindspot: `Perfectionism vs Deadline Friction: balance iterative brainstorming with concrete milestone lockdowns.`,
    decisionMatrix: [
      {
        domain: 'Aesthetic Direction & Conceptual Vision',
        leadPartner: higherOpenness,
        rationale: `Rich creative imagination and unconventional stylistic synthesis.`,
        vetoRule: `${higherOpenness} leads conceptual mood boards; both partners align on core thematic tone.`,
      },
      {
        domain: 'Production Timeline & Milestone Delivery',
        leadPartner: higherConscientiousness,
        rationale: `Ensures artistic vision doesn't get lost in infinite revisions and hits launch deadlines.`,
        vetoRule: `${higherConscientiousness} enforces release milestones and sprint schedules.`,
      },
    ],
    divisionOfLabor: {
      partner1Focus: ['Creative Concept & Ideation', `${user1.name}'s Style (${user1.archetypeName})`],
      partner2Focus: ['Execution, Editing & Quality Polishing', `${user2.name}'s Style (${user2.archetypeName})`],
      sharedFocus: ['Final Deliverable Sign-Off & Public Launch'],
    },
    conflictProtocol: [
      {
        ruleTitle: 'Separate Creative Work from Personal Identity',
        trigger: 'Receiving sharp artistic critiques',
        description: 'Critique the artifact, not the artist. Frame feedback as "How can we make this piece hit its goal harder?"',
      },
      {
        ruleTitle: 'The Rapid Prototyping Rule',
        trigger: 'Debating two differing creative directions',
        description: 'Instead of debating theoretically for hours, spend 30 minutes mocking up a low-fidelity draft of both and test with real users.',
      },
    ],
  };
}
