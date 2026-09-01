import { NextResponse } from 'next/server';
import { generatePsychometricAdvice } from '@/lib/advisorKnowledge';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, scores, archetype, history } = body;

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

    // 1. If Gemini API Key is available, attempt multi-turn conversational generation
    if (geminiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];

      const systemInstructionText = `You are an insightful, warm, and highly conversational Executive Psychometrics & Career Coach for YSAMPHY LLC (https://personality-test.ysamphy.com).
You are speaking 1-on-1 with a client whose Big Five personality profile is:
- Primary Archetype: ${safeArchetype.name} ("${safeArchetype.tagline}")
- Openness to Experience: ${safeScores.openness}%
- Conscientiousness: ${safeScores.conscientiousness}%
- Extraversion: ${safeScores.extraversion}%
- Agreeableness: ${safeScores.agreeableness}%
- Emotional Reactivity (Neuroticism): ${safeScores.neuroticism}%

Conversational Coaching Guidelines:
1. Speak naturally, warmly, and empathetically—like an authentic executive coach and trusted mentor in a genuine 1-on-1 dialogue.
2. Avoid robotic templates: If the user asks a brief follow-up, respond fluidly and conversationally. If they ask for a detailed framework or strategy, use clean formatting with bold callouts and bullet points.
3. Weave in their specific trait numbers naturally (e.g. "Because you operate with ${safeScores.conscientiousness}% conscientiousness...", "Given that you recharge through solitary reflection at ${safeScores.extraversion}% extraversion...").
4. Always remember previous conversation context and build continuous momentum. Keep advice practical, uplifting, and actionable.`;

      // Build multi-turn message history for natural continuous dialogue
      const previousTurns = Array.isArray(history)
        ? history.slice(-8).map((h: any) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          }))
        : [];

      const contents = [
        ...previousTurns,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      for (const modelName of modelsToTry) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
          const aiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemInstructionText }],
              },
              generationConfig: {
                temperature: 0.75,
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
            // Fallback: Try with system prompt inside contents if systemInstruction is rejected on older API endpoints
            const fallbackContents = [
              {
                role: 'user',
                parts: [{ text: `System Context: ${systemInstructionText}\n\nClient Question: ${message}` }],
              },
            ];
            const fallbackRes = await fetch(geminiEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: fallbackContents,
                generationConfig: {
                  temperature: 0.75,
                  maxOutputTokens: 1200,
                },
              }),
            });
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const fallbackText = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (fallbackText) {
                return NextResponse.json({
                  success: true,
                  response: fallbackText,
                  source: 'gemini_ai',
                  model: modelName,
                });
              }
            }
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
