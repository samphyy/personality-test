import { NextResponse } from 'next/server';
import { generatePsychometricAdvice } from '@/lib/advisorKnowledge';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, scores, archetype } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const safeScores = {
      openness: scores?.openness ?? 50,
      conscientiousness: scores?.conscientiousness ?? 50,
      extraversion: scores?.extraversion ?? 50,
      agreeableness: scores?.agreeableness ?? 50,
      neuroticism: scores?.neuroticism ?? 50,
    };

    const safeArchetype = {
      id: archetype?.id || 'visionary-architect',
      name: archetype?.name || 'The Visionary Architect',
      tagline: archetype?.tagline || 'High-leverage analytical problem solving.',
    };

    const geminiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    )?.trim();

    // 1. If Gemini API Key is available, attempt direct LLM generation
    if (geminiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];

      const systemPrompt = `You are the Executive Psychometrics & Career Advisor for YSAMPHY LLC (https://personality-test.ysamphy.com).
The user just completed the validated Big Five (OCEAN) personality assessment with the following exact scores:
- Archetype: ${safeArchetype.name} ("${safeArchetype.tagline}")
- Openness to Experience: ${safeScores.openness}%
- Conscientiousness: ${safeScores.conscientiousness}%
- Extraversion: ${safeScores.extraversion}%
- Agreeableness: ${safeScores.agreeableness}%
- Emotional Reactivity (Neuroticism): ${safeScores.neuroticism}%

User's Question: "${message}"

Instructions:
1. Provide actionable, empathetic, and evidence-based advice directly customized to their unique combination of trait percentages.
2. Structure your answer with clear markdown headings (###), bold callouts (**bold**), and bullet points (* bullet).
3. Address specific workplace dynamics, communication nuances, or growth habits that fit their exact psychological profile.
4. Keep the tone executive, empowering, warm, and highly practical.`;

      for (const modelName of modelsToTry) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
          const aiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
              },
            }),
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            const generatedText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
              return NextResponse.json({
                success: true,
                response: generatedText,
                source: 'gemini_ai',
                model: modelName,
              });
            }
          } else {
            const errData = await aiRes.text();
            console.warn(`Gemini model ${modelName} returned status ${aiRes.status}:`, errData);
          }
        } catch (modelErr) {
          console.warn(`Error calling Gemini ${modelName}:`, modelErr);
        }
      }
    }

    // 2. Intelligent Psychometric Knowledge Engine (Guaranteed zero-failure response)
    const synthesizedAdvice = generatePsychometricAdvice(message, safeScores, safeArchetype);

    return NextResponse.json({
      success: true,
      response: synthesizedAdvice,
      source: 'knowledge_engine',
    });
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry.' }, { status: 500 });
  }
}
