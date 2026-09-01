import { TraitKey } from '@/types';
import { ARCHETYPES } from '@/data/archetypes';

export interface AdvisorScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface AdvisorArchetype {
  id: string;
  name: string;
  tagline: string;
}

export function generatePsychometricAdvice(
  userQuery: string,
  scores: AdvisorScores,
  archetype: AdvisorArchetype
): string {
  const query = userQuery.toLowerCase();
  const { openness: o, conscientiousness: c, extraversion: e, agreeableness: a, neuroticism: n } = scores;
  const archName = archetype.name || 'Visionary Professional';

  // 1. Leadership Style Query
  if (query.includes('leader') || query.includes('manage') || query.includes('direct') || query.includes('team lead')) {
    const introverted = e <= 48;
    const highStructure = c >= 60;
    const visionary = o >= 60;

    return `### 🧭 Your Optimal Leadership Blueprint as **${archName}**

Your profile points to a **${introverted ? 'Deep-Focus Strategic & Empowering' : 'High-Energy Catalytic & Persuasive'}** leadership style.

#### 1. Core Leadership Superpowers:
* **${highStructure ? 'Systematic Execution & High Standards' : 'Agile & Adaptive Problem-Solving'}:** With **${c}% Conscientiousness**, you lead by ${highStructure ? 'setting clear architectural benchmarks, rigorous deadlines, and structured accountability' : 'adapting rapidly to shifting realities and fostering creative flexibility'}.
* **${visionary ? 'Strategic Vision & Innovation' : 'Pragmatic Grounded Focus'}:** With **${o}% Openness**, your team looks to you for ${visionary ? 'long-range conceptual clarity, bold innovation, and macro perspectives' : 'operational feasibility, proven methodologies, and disciplined consistency'}.
* **${introverted ? 'Thoughtful Listening & Deep Synthesis' : 'Verbal Inspiration & Stakeholder Alignment'}:** With **${e}% Extraversion**, your leadership presence comes from ${introverted ? 'measured, high-trust 1-on-1 conversations and deep written synthesis rather than loud stage presence' : 'dynamic verbal communication, energized team meetings, and championing external buy-in'}.

#### 💡 Executive Coaching Recommendations:
1. **Leverage Asynchronous Directives:** ${introverted ? 'Give your team written briefs and documentation—this plays directly to your analytical strengths.' : 'Host brief, energetic syncs to maintain team momentum.'}
2. **Watch Your Blindspot:** ${a >= 75 ? 'Avoid delaying tough corrective feedback to preserve harmony. Be clear, kind, and direct.' : a <= 45 ? 'Remember to balance objective critique with genuine acknowledgment of team effort.' : 'Keep a balance between demanding execution and team morale.'}`;
  }

  // 2. Salary Negotiation & Career Leverage
  if (query.includes('salary') || query.includes('negotiat') || query.includes('raise') || query.includes('promotion') || query.includes('worth') || query.includes('pricing')) {
    const highAgreeable = a >= 65;
    const highConscientious = c >= 65;

    return `### 💼 Strategic Negotiation Guide for **${archName}**

Negotiation is primarily governed by your balance between **Agreeableness (${a}%)** and **Conscientiousness (${c}%)**.

#### 1. Your Psychological Dynamics in Negotiation:
* ${highAgreeable ? '⚠️ **Empathy Trap:** With high Agreeableness, your natural instinct is to preserve interpersonal goodwill and avoid tension, which often leads to accepting the first counter-offer or under-pricing your value.' : '🎯 **Objective Focus:** With moderate/low Agreeableness, you have no problem stating facts bluntly, but ensure you frame your ask as a win-win partnership.'}
* ${highConscientious ? '📊 **Evidence Anchor:** Your high Conscientiousness gives you immense leverage—you have a track record of meticulous delivery, metrics, and reliability.' : '💡 **Value & Innovation:** Highlight the creative pivots and high-impact solutions you uniquely bring to the table.'}

#### 🚀 Step-by-Step Action Plan:
1. **Decouple the Ask from Relational Harmony:** Frame your compensation request not as a personal demand, but as an *alignment of market value with high-leverage outcomes*.
2. **Lead with Cold Metrics:** Prepare a 1-page dossier showcasing 3 specific initiatives you executed, their quantified impact, and benchmark compensation data.
3. **The Script Strategy:** *"I am deeply committed to our mission and the high-standard execution I deliver. Based on the documented \$X value added and market benchmarks for this caliber of impact, I want to align my compensation to \$Y."*
4. **Master the Strategic Silence:** After stating your number, resist the urge to fill the silence with compromises. Let the other party respond first.`;
  }

  // 3. Burnout & Stress Management
  if (query.includes('burnout') || query.includes('stress') || query.includes('exhaust') || query.includes('anxiety') || query.includes('overwhelm') || query.includes('relax')) {
    const highReactivity = n >= 55;
    const introverted = e <= 48;
    const perfectionist = c >= 70;

    return `### 🧘 Sustainable Energy & Burnout Shield for **${archName}**

Your psychological stamina is shaped by your **Emotional Reactivity (${n}%)**, **Extraversion (${e}%)**, and **Conscientiousness (${c}%)**.

#### 1. What Triggers Your Burnout:
* ${introverted ? '🔋 **Social Drainage:** Constant back-to-back video calls, impromptu meetings, and open-plan noise rapidly deplete your cognitive battery.' : '🔋 **Isolation & Stagnation:** Lack of dynamic feedback and solitary confinement drains your enthusiasm.'}
* ${perfectionist ? '⚖️ **The Perfectionist Tax:** With ' + c + '% Conscientiousness, you hold yourself to uncompromising standards, creating internal pressure even when external demands are light.' : '⚖️ **Context Switching:** Drifting between unfinished projects without clear milestones creates cognitive fatigue.'}
* ${highReactivity ? '⚡ **Vigilance Fatigue:** With ' + n + '% Reactivity, your nervous system processes threats and ambiguities deeply, keeping you in prolonged alert mode.' : '🛡️ **Stable Resilience:** Your emotional stability gives you endurance, but beware of ignoring physical cues of fatigue.'}

#### 🛠️ Non-Negotiable Recovery Protocol:
1. **Implement "Deep Focus Quarantine" Blocks:** ${introverted ? 'Block 2-hour morning buffers with zero Slack/email notifications to do single-task deep work.' : 'Schedule structured collaborative sprints followed by active physical resets.'}
2. **The "85% Rule" on Routine Tasks:** Save your 100% perfectionism for high-leverage strategic deliverables; ship standard operational tasks at 85% completeness.
3. **Cognitive Brain-Dumping:** At the end of every workday, write down 3 priorities for tomorrow and close all work browser tabs to give your mind a clean psychological shutdown.`;
  }

  // 4. Communication with Opposite Personalities
  if (query.includes('communicat') || query.includes('conflict') || query.includes('opposite') || query.includes('coworker') || query.includes('boss') || query.includes('partner') || query.includes('talk')) {
    const introverted = e <= 48;

    return `### 🗣️ Cross-Personality Communication Strategy for **${archName}**

Mastering interpersonal dynamics requires adapting to temperaments on opposite ends of the spectrum.

#### 1. When Collaborating with Highly Extroverted / Expressive People:
* **Their Need:** Fast verbal brainstorming, immediate reactions, and enthusiastic validation.
* **Your Strategy:** ${introverted ? 'Do not feel pressured to debate on the spot. Say: *"That is a fascinating concept. Let me synthesize the key trade-offs and send you a structured summary by 2 PM."*' : 'Match their enthusiasm, but ensure decisions are documented in writing afterwards.'}

#### 2. When Collaborating with Detail-Obsessed Perfectionists (High Conscientiousness):
* **Their Need:** Exact timelines, documented steps, and zero ambiguity.
* **Your Strategy:** Front-load your communication with clear milestones, deadlines, and risk mitigation plans.

#### 3. When Collaborating with Skeptical / Direct Leaders (Low Agreeableness):
* **Their Need:** Pure bottom-line results, unsentimental facts, and concise summaries.
* **Your Strategy:** Lead with the conclusion first (BLUF: Bottom Line Up Front), then present supporting data. Skip emotional preamble.`;
  }

  // 5. Superpowers & Career Path Query
  if (query.includes('superpower') || query.includes('career') || query.includes('strength') || query.includes('job') || query.includes('skill') || query.includes('role')) {
    return `### 🚀 Top High-Leverage Superpowers of **${archName}**

Based on your exact psychometric balance across Openness (${o}%), Conscientiousness (${c}%), Extraversion (${e}%), Agreeableness (${a}%), and Reactivity (${n}%):

#### 1. Your 3 Distinct Strategic Superpowers:
1. **Architectural & Deep-Pattern Synthesis:** You possess an innate ability to connect disparate ideas into structured, high-value frameworks.
2. **High-Standard Execution & Integrity:** Your conscientiousness (${c}%) ensures you rarely deliver half-baked solutions; people trust your thoroughness.
3. **Calibrated Interpersonal Nuance:** Your social and empathy balance (${e}% / ${a}%) allows you to operate with high psychological safety and autonomy.

#### 🎯 Highest-Yield Environments:
* Roles where you have **high autonomy over execution** and can focus for uninterrupted blocks.
* Complex domains (product architecture, executive strategy, technical consulting, strategic leadership).
* Environments that reward **quality of thought and long-term durability** over loud corporate politics.`;
  }

  // 6. Default Comprehensive Response for Custom Queries
  return `### 💡 Personalized Psychometric Analysis for **${archName}**

Reflecting on your question through the lens of your **Big Five profile** (Openness: ${o}%, Conscientiousness: ${c}%, Extraversion: ${e}%, Agreeableness: ${a}%, Reactivity: ${n}%):

#### 1. Core Psychological Dynamics:
* **Dominant Trait Interaction:** Your profile is anchored by high-leverage expression in your primary dimensions. This means your intuitive instincts gravitate toward ${c >= 60 ? 'structure, rigor, and thorough execution' : 'creative agility, adaptability, and lateral thinking'} paired with ${e <= 50 ? 'independent solitary synthesis and deep focus' : 'collaborative energy and verbal brainstorming'}.
* **Strategic Leverage:** In whatever domain you are tackling, avoid playing against your natural grain. Build systems, habits, and communication cadences that amplify your ${e <= 48 ? 'reflective focus' : 'catalytic energy'} and ${o >= 60 ? 'conceptual vision' : 'pragmatic realism'}.

#### 🎯 Actionable Takeaways:
1. **Double Down on Your Archetype Strengths:** Use your ${archName} instincts to lead with clarity, data, and deliberate execution.
2. **Protect Your Cognitive Focus:** Align your environment and team expectations with your natural pacing for maximum productivity and fulfillment.`;
}
