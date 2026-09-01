import { AssessmentResult } from '@/types';

export interface CareerAssets {
  headlineIdeas: string[];
  linkedInBios: {
    executive: string;
    storyteller: string;
    analytical: string;
  };
  resumeBullets: {
    title: string;
    bullet: string;
    trait: string;
  }[];
  interviewScripts: {
    question: string;
    context: string;
    script: string;
  }[];
}

export function generateCareerAssets(result: AssessmentResult): CareerAssets {
  const o = result.scores.openness.percentage;
  const c = result.scores.conscientiousness.percentage;
  const e = result.scores.extraversion.percentage;
  const a = result.scores.agreeableness.percentage;
  const n = result.scores.neuroticism.percentage;
  const arch = result.archetype;

  const topRole = arch.idealRoles[0] || 'Strategic Leader';
  const secondRole = arch.idealRoles[1] || 'Specialist Consultant';

  // 1. LinkedIn Headlines
  const headlineIdeas = [
    `${topRole} | ${arch.name} • Specializing in High-Leverage Strategic Systems & Innovation`,
    `${topRole} & ${secondRole} | Driving Measurable Impact through Deep Focus & Integrity`,
    `${arch.name} | Transforming Complex Challenges into Scalable, High-Standard Solutions`,
  ];

  // 2. LinkedIn Bios (3 Styles)
  const linkedInBios = {
    executive: `As a ${topRole} recognized for high-standard execution and strategic clarity, I specialize in bridging high-level vision with disciplined organizational impact. My operating blueprint as "${arch.name}" allows me to lead with data-backed conviction, foster psychological safety across cross-functional teams, and build durable frameworks that scale.

🎯 Core Focus Areas:
• Strategic Alignment & High-Stakes Decision Making (${c}% Conscientiousness / ${o}% Openness)
• Cross-Functional Collaboration & High-Trust Stakeholder Relations
• Designing Sustainable Systems that Eliminate Operational Friction

I believe that the best outcomes happen when rigorous execution meets authentic empathy. Always open to connecting with fellow leaders, innovators, and problem-solvers.`,

    storyteller: `I thrive at the intersection of curiosity, structure, and human connection. As a "${arch.name}", my career has been shaped by a simple philosophy: understand the underlying patterns of complex problems, then build elegant, human-centric solutions to solve them.

Whether architecting roadmap strategies as a ${topRole} or collaborating closely with specialized teams, I bring a unique balance of ${o > 60 ? 'creative conceptual vision' : 'pragmatic grounded realism'} (${o}%) and meticulous integrity (${c}%).

🚀 What Drives Me:
• Crafting meaningful work that leaves a measurable, positive footprint.
• Fostering transparent team cultures built on mutual respect and shared ownership.
• Continually refining my craft and mastering emerging industry paradigms.

Let's connect and discuss building the next generation of impactful products, strategies, and teams.`,

    analytical: `${topRole} with an analytical, high-integrity operating methodology centered on systematic problem decomposition, data-driven optimization, and high-standard delivery.

Psychometrically mapped as "${arch.name}", my professional value is defined by:
1. Deep-Pattern Synthesis (${o}% Openness): Rapidly analyzing multifaceted technical and business domains to extract high-leverage architectural opportunities.
2. Disciplined Execution (${c}% Conscientiousness): Establishing rigorous benchmarks, verifiable KPIs, and automated feedback loops that eliminate delivery risk.
3. Calibrated Stakeholder Communication: Translating intricate technical nuance into clear, actionable executive directives.

Core Domains: ${arch.idealRoles.join(' • ')}`,
  };

  // 3. 5 Tailored Resume Impact Bullets
  const resumeBullets = [
    {
      title: 'Strategic Architectural Synthesis',
      trait: 'Openness & Conscientiousness',
      bullet: `Architected and spearheaded multi-quarter strategic roadmaps, leveraging deep-pattern synthesis to translate ambiguous organizational goals into high-leverage, measurable execution milestones.`,
    },
    {
      title: 'Operational Rigor & Quality Benchmarks',
      trait: 'Conscientiousness (High Execution)',
      bullet: `Instituted rigorous quality standards and structured review workflows, resulting in a 35%+ reduction in execution discrepancies and establishing cross-team operating benchmarks.`,
    },
    {
      title: 'Cross-Functional Stakeholder Alignment',
      trait: 'Agreeableness & Empathy',
      bullet: `Orchestrated seamless alignment across multidisciplinary stakeholders, fostering high psychological safety and establishing collaborative agreements that accelerated project delivery cadences.`,
    },
    {
      title: 'Innovation & Process Optimization',
      trait: 'Openness to Experience',
      bullet: `Pioneered innovative methodologies and modernized legacy processes, unlocking continuous operational efficiencies while preserving core system durability and compliance.`,
    },
    {
      title: 'High-Pressure Resilience & Adaptability',
      trait: 'Emotional Stability & Focus',
      bullet: `Navigated high-stakes pivot points and compressed delivery windows with calm, methodical focus, maintaining team morale and delivering core business objectives ahead of deadline.`,
    },
  ];

  // 4. Behavioral Interview Talking Scripts
  const interviewScripts = [
    {
      question: 'Tell me about yourself and how you work.',
      context: 'Use this 60-second pitch in opening rounds to position your working style with executive confidence.',
      script: `"At my core, I operate as ${arch.name}—which means my strength lies in combining ${o > 60 ? 'deep strategic vision' : 'pragmatic realism'} with high-integrity, disciplined execution. Throughout my career as a ${topRole}, I’ve focused on taking complex, ambiguous challenges and turning them into scalable, predictable results. I do my best work in environments that value high standards, thoughtful collaboration, and continuous improvement."`,
    },
    {
      question: 'What is your greatest professional superpower?',
      context: 'Use this answer to explain why your psychometric traits make you an irreplaceable asset on high-stakes teams.',
      script: `"My greatest strength is my ability to maintain relentless quality and structural integrity without losing sight of the human element. Psychometrically, I score in the top tier for Conscientiousness (${c}%) and ${o > 60 ? 'Openness' : 'Agreeableness'} (${o > 60 ? o : a}%), which means I naturally spot edge cases, hold high standards for my work, and build high-trust relationships where teammates feel empowered to do their best work."`,
    },
    {
      question: 'How do you handle team disagreements or tight deadlines?',
      context: 'Demonstrates emotional intelligence, composure, and calibrated conflict resolution.',
      script: `"When high-pressure deadlines or differing opinions arise, I rely on transparent data, early communication, and deep listening rather than emotional reactivity. I separate the problem from the person, establish common objectives, and create clear, written execution milestones so everyone is pulling in the exact same direction with total clarity."`,
    },
  ];

  return {
    headlineIdeas,
    linkedInBios,
    resumeBullets,
    interviewScripts,
  };
}
