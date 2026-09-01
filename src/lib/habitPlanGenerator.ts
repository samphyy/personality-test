import { AssessmentResult } from '@/types';

export interface DailyHabit {
  day: number;
  week: number;
  title: string;
  action: string;
  whyItWorks: string;
  timeEstimate: string;
}

export interface GrowthPlan {
  focusTrait: string;
  focusTitle: string;
  focusSubtitle: string;
  summary: string;
  weeks: {
    week: number;
    title: string;
    goal: string;
    habits: DailyHabit[];
  }[];
}

export function generateGrowthHabitPlan(result: AssessmentResult): GrowthPlan {
  const o = result.scores.openness.percentage;
  const c = result.scores.conscientiousness.percentage;
  const e = result.scores.extraversion.percentage;
  const a = result.scores.agreeableness.percentage;
  const n = result.scores.neuroticism.percentage;
  const arch = result.archetype;

  // Determine Primary Focus Dimension
  let focusTrait = 'Neuroticism';
  let focusTitle = 'Stress Resilience & Emotional Equanimity';
  let focusSubtitle = 'Calibrating your nervous system and building unshakeable composure under high stakes.';
  let summary = `Designed to help you navigate high-pressure deadlines with calm, grounded clarity rather than internal cognitive strain.`;

  if (n > 60) {
    focusTrait = 'Emotional Stability';
    focusTitle = 'Stress Shield & Composure Mastery';
    focusSubtitle = 'Transforming high emotional reactivity into centered, high-conviction decision making.';
    summary = `Your profile shows a rich sensitivity to environmental stimuli. This plan trains physiological calm and proactive cognitive reframing.`;
  } else if (c < 50) {
    focusTrait = 'Conscientiousness';
    focusTitle = 'Execution Architecture & Focus Systems';
    focusSubtitle = 'Building low-friction habits that turn ambitious ideas into automated, predictable results.';
    summary = `Your profile thrives on flexibility. This plan gives you lightweight operational systems that preserve your creative freedom while locking in high-standard delivery.`;
  } else if (a < 50) {
    focusTrait = 'Agreeableness';
    focusTitle = 'High-Trust Collaboration & Relational Capital';
    focusSubtitle = 'Mastering active empathy, psychological safety, and constructive stakeholder diplomacy.';
    summary = `Your independent critical eye is an asset. This plan refines your interpersonal delivery so your high-standard ideas are embraced with zero friction.`;
  } else if (e < 45) {
    focusTrait = 'Social Presence';
    focusTitle = 'Strategic Visibility & High-Leverage Self-Advocacy';
    focusSubtitle = 'Showcasing your deep work comfortably without depleting your introverted cognitive battery.';
    summary = `Your deep focus is your greatest superpower. This plan creates comfortable, asynchronous visibility channels so your contributions receive executive recognition.`;
  } else if (o < 50) {
    focusTrait = 'Openness';
    focusTitle = 'Cognitive Flexibility & Innovation Synthesis';
    focusSubtitle = 'Expanding your problem-solving toolkit with creative cross-pollination and lateral thinking.';
    summary = `Your grounded pragmatism ensures reliability. This plan introduces micro-explorations to unlock fresh conceptual angles.`;
  } else {
    focusTrait = 'High Performance';
    focusTitle = 'Executive Energy & Cognitive Peak Performance';
    focusSubtitle = 'Optimizing your multidisciplinary strengths into an effortless daily operating rhythm.';
    summary = `Your balanced blueprint gives you versatile leverage. This plan locks in peak mental energy and long-term sustainable mastery.`;
  }

  // Generate 30 specific habits structured in 4 weeks
  const generateHabitSet = (): DailyHabit[] => {
    return [
      // WEEK 1: AWARENESS & TRIGGER AUDIT (Days 1–7)
      {
        day: 1,
        week: 1,
        title: 'The 60-Second Trigger Audit',
        action: `Notice the exact moment today when you felt resistance, fatigue, or friction. Write down the single external trigger without judging yourself.`,
        whyItWorks: `Awareness precedes behavioral control. Naming the trigger deactivates the amygdala.`,
        timeEstimate: '2 mins',
      },
      {
        day: 2,
        week: 1,
        title: 'Cognitive Reset Breath',
        action: `Take two physiological sighs (double inhale through the nose, long slow exhale through the mouth) before starting your main work block.`,
        whyItWorks: `Rapidly downregulates the autonomic nervous system and restores prefrontal cortex focus.`,
        timeEstimate: '1 min',
      },
      {
        day: 3,
        week: 1,
        title: 'The Default Instinct Log',
        action: `Identify your default reaction when challenged: do you retreat, defend, over-analyze, or rush? Note it in one sentence.`,
        whyItWorks: `Creates psychological distance between stimulus and response.`,
        timeEstimate: '2 mins',
      },
      {
        day: 4,
        week: 1,
        title: 'Physical Boundary Check',
        action: `Clear one visual distraction off your primary desk and close all unrelated browser tabs before your core work session.`,
        whyItWorks: `External visual clutter directly correlates with cortisol production and attention fragmentation.`,
        timeEstimate: '3 mins',
      },
      {
        day: 5,
        week: 1,
        title: 'Empathetic Pause in Dialogue',
        action: `In your next conversation, wait a full 2 seconds after the other person finishes speaking before offering your reply.`,
        whyItWorks: `Signals executive confidence and prevents impulsive conversational friction.`,
        timeEstimate: '1 min',
      },
      {
        day: 6,
        week: 1,
        title: 'Energy Peak Audit',
        action: `Identify the 90-minute window today where your mental energy was at its highest. Mark that slot as protected deep work tomorrow.`,
        whyItWorks: `Chronobiological alignment doubles output without increasing work hours.`,
        timeEstimate: '2 mins',
      },
      {
        day: 7,
        week: 1,
        title: 'Week 1 Reflection & Baseline Victory',
        action: `Write down one micro-win where you acted intentionally rather than purely on autopilot this past week.`,
        whyItWorks: `Positive reinforcement solidifies neural pathways for newly formed habits.`,
        timeEstimate: '3 mins',
      },

      // WEEK 2: MICRO-INTERVENTIONS & FRICTION-FREE HABITS (Days 8–14)
      {
        day: 8,
        week: 2,
        title: 'The 3-Priority Rule',
        action: `Before looking at emails or messages, write down the 3 non-negotiable needle-movers for your day on a physical sticky note.`,
        whyItWorks: `Protects your agenda from being hijacked by reactive inputs.`,
        timeEstimate: '2 mins',
      },
      {
        day: 9,
        week: 2,
        title: 'The 5-Minute Micro-Chunk',
        action: `When faced with a daunting task, set a timer for just 5 minutes and commit to working with zero expectation of finishing.`,
        whyItWorks: `Eliminates the psychological activation energy required to start.`,
        timeEstimate: '5 mins',
      },
      {
        day: 10,
        week: 2,
        title: 'Asynchronous Clarity Brief',
        action: `Send one update or request today as a structured 3-bullet written summary instead of an open-ended message.`,
        whyItWorks: `Saves cognitive bandwidth for both you and your team.`,
        timeEstimate: '3 mins',
      },
      {
        day: 11,
        week: 2,
        title: 'The Micro-Recharge Ritual',
        action: `Step away from all screens for a 5-minute walk outside or look at the horizon to reset your visual field.`,
        whyItWorks: `Panoramic vision triggers optical relaxation and resets dopamine receptors.`,
        timeEstimate: '5 mins',
      },
      {
        day: 12,
        week: 2,
        title: 'Strategic Grace Script',
        action: `When an unexpected task or request comes in, reply: "Let me review my priorities and get back to you by [time]."`,
        whyItWorks: `Buys intentional time and protects your boundaries from automatic compliance.`,
        timeEstimate: '1 min',
      },
      {
        day: 13,
        week: 2,
        title: 'The Done List',
        action: `At the end of your workday, write down 3 things you successfully completed before closing your laptop.`,
        whyItWorks: `Counters the negativity bias and transitions your brain into restorative evening rest.`,
        timeEstimate: '2 mins',
      },
      {
        day: 14,
        week: 2,
        title: 'Week 2 System Calibration',
        action: `Review your past 7 days: which single micro-habit felt easiest to sustain? Double down on it.`,
        whyItWorks: `Friction-free habits are the ones that survive high-stress periods.`,
        timeEstimate: '3 mins',
      },

      // WEEK 3: INTERPERSONAL & HIGH-STAKES APPLICATION (Days 15–21)
      {
        day: 15,
        week: 3,
        title: 'Validating Before Solving',
        action: `When a teammate shares a problem today, say: "That makes total sense why that’s frustrating" before jumping into problem-solving mode.`,
        whyItWorks: `Validating emotions builds 10x higher psychological safety than immediate advice.`,
        timeEstimate: '2 mins',
      },
      {
        day: 16,
        week: 3,
        title: 'The 1-Sentence High-Conviction Pitch',
        action: `Summarize your core project or contribution today in a single clear, impactful sentence.`,
        whyItWorks: `Clarity creates executive presence. Complex explanations signal uncertainty.`,
        timeEstimate: '3 mins',
      },
      {
        day: 17,
        week: 3,
        title: 'Radical Candor with Warmth',
        action: `Deliver one piece of constructive feedback today with genuine warmth and belief in the other person’s capability.`,
        whyItWorks: `High challenge combined with high support produces peak performance in relationships.`,
        timeEstimate: '3 mins',
      },
      {
        day: 18,
        week: 3,
        title: 'The Anti-Overthinking Heuristic',
        action: `For any low-stakes decision today (under $50 or reversible in 10 minutes), make the decision within 15 seconds.`,
        whyItWorks: `Trains decision velocity and cures analysis paralysis.`,
        timeEstimate: '1 min',
      },
      {
        day: 19,
        week: 3,
        title: 'Proactive Alignment Check-In',
        action: `Send a quick 1-sentence note to a key collaborator: "Wanted to check in—are there any blockers on your end where I can help?"`,
        whyItWorks: `Proactive service builds immense organizational trust and goodwill.`,
        timeEstimate: '2 mins',
      },
      {
        day: 20,
        week: 3,
        title: 'Cognitive Reframing of Setbacks',
        action: `When something goes wrong today, immediately write: "This is valuable data because it reveals [X]."`,
        whyItWorks: `Shifts perspective from victimhood to objective scientific iteration.`,
        timeEstimate: '2 mins',
      },
      {
        day: 21,
        week: 3,
        title: 'Week 3 Social & Performance Victory',
        action: `Identify one relational friction point that you handled more smoothly this week compared to a month ago.`,
        whyItWorks: `Solidifies conscious competence into unconscious reflex.`,
        timeEstimate: '3 mins',
      },

      // WEEK 4: INTEGRATION, SYSTEMS & PERMANENT MASTERY (Days 22–30)
      {
        day: 22,
        week: 4,
        title: 'The Evening Shutdown Ritual',
        action: `Establish a distinct 3-minute physical closing sequence (close tabs, write tomorrow’s 3 goals, close laptop) to separate work from life.`,
        whyItWorks: `Eliminates the Zeigarnik effect (unfinished tasks lingering in working memory).`,
        timeEstimate: '3 mins',
      },
      {
        day: 23,
        week: 4,
        title: 'Automating Cognitive Decisions',
        action: `Standardize one recurring daily choice (e.g. morning routine, lunch meal, workspace setup) to preserve decision energy.`,
        whyItWorks: `Conserves finite prefrontal glucose for high-leverage strategic work.`,
        timeEstimate: '3 mins',
      },
      {
        day: 24,
        week: 4,
        title: 'The 80/20 Leverage Audit',
        action: `Identify the 20% of activities this week that generated 80% of your real progress. Cut or delegate one non-essential task.`,
        whyItWorks: `Multiplies efficiency by ruthlessly eliminating performative busywork.`,
        timeEstimate: '5 mins',
      },
      {
        day: 25,
        week: 4,
        title: 'Constructive Boundary Enforcement',
        action: `Politely decline one low-priority meeting or request with: "I am heads-down on [Primary Goal] to ensure we hit our deadline."`,
        whyItWorks: `Every 'no' to low-value distractions is a 'yes' to your primary life objectives.`,
        timeEstimate: '2 mins',
      },
      {
        day: 26,
        week: 4,
        title: 'The Mentorship Mindset',
        action: `Share one lesson or high-leverage insight you learned this month with a colleague, friend, or on LinkedIn.`,
        whyItWorks: `Teaching a concept permanently cements it in your own cognitive architecture.`,
        timeEstimate: '5 mins',
      },
      {
        day: 27,
        week: 4,
        title: 'Future Self Alignment Check',
        action: `Ask yourself: "Would the version of me I want to become in 3 years act the way I am acting right now?" Align accordingly.`,
        whyItWorks: `Leverages identity-based habit transformation over transient motivation.`,
        timeEstimate: '2 mins',
      },
      {
        day: 28,
        week: 4,
        title: 'Psychometric Growth Audit',
        action: `Compare how you feel today vs Day 1: observe the reduction in daily friction and increase in intentional clarity.`,
        whyItWorks: `Recognizing measurable progress fuels long-term self-efficacy.`,
        timeEstimate: '4 mins',
      },
      {
        day: 29,
        week: 4,
        title: 'Designing Your Permanent Operating Rule',
        action: `Write your personal 1-sentence "Golden Operating Rule" that embodies your archetype (${arch.name}).`,
        whyItWorks: `Creates a core heuristic for effortless decision-making for years to come.`,
        timeEstimate: '3 mins',
      },
      {
        day: 30,
        week: 4,
        title: '30-Day Mastery Graduation & Celebration',
        action: `Celebrate completing the 30-day challenge! Reward yourself with an intentional restorative experience.`,
        whyItWorks: `Dopaminergic reward locks in the 30-day behavioral neuroplasticity transformation.`,
        timeEstimate: '5 mins',
      },
    ];
  };

  const allHabits = generateHabitSet();

  const weeks = [
    {
      week: 1,
      title: 'Awareness & Trigger Audit',
      goal: 'Spotting instinctual triggers and establishing daily cognitive calm.',
      habits: allHabits.filter((h) => h.week === 1),
    },
    {
      week: 2,
      title: 'Micro-Interventions & Friction-Free Systems',
      goal: 'Embedding lightweight daily habits that protect focus and momentum.',
      habits: allHabits.filter((h) => h.week === 2),
    },
    {
      week: 3,
      title: 'High-Stakes Application & Communication',
      goal: 'Applying intentional behavioral habits in team meetings and relationships.',
      habits: allHabits.filter((h) => h.week === 3),
    },
    {
      week: 4,
      title: 'Integration & Permanent Mastery',
      goal: 'Solidifying your unique psychological blueprint into an unconscious reflex.',
      habits: allHabits.filter((h) => h.week === 4),
    },
  ];

  return {
    focusTrait,
    focusTitle,
    focusSubtitle,
    summary,
    weeks,
  };
}
