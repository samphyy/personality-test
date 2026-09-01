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

    let geminiErrorDetails = null;

    // 1. If Gemini API Key is available, attempt generative AI generation
    if (geminiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];

      const conversationHistoryText = Array.isArray(history) && history.length > 0
        ? history
            .slice(-6)
            .map((h: any) => `${h.sender === 'user' ? 'Client' : 'Coach (You)'}: ${h.text}`)
            .join('\n\n')
        : '';

      const fullPrompt = `You are the insightful, empathetic, and highly conversational Executive Psychometrics & Career Coach for YSAMPHY LLC (https://personality-test.ysamphy.com).
You are speaking directly 1-on-1 with a client whose Big Five personality blueprint is:
- Primary Archetype: ${safeArchetype.name} ("${safeArchetype.tagline}")
- Openness to Experience: ${safeScores.openness}%
- Conscientiousness: ${safeScores.conscientiousness}%
- Extraversion: ${safeScores.extraversion}%
- Agreeableness: ${safeScores.agreeableness}%
- Emotional Reactivity (Neuroticism): ${safeScores.neuroticism}%

Conversational Coaching Rules:
1. Speak naturally, warmly, and empathetically—like an authentic trusted mentor having an engaging dialogue.
2. Directly answer the client's question with deep psychological intelligence. If they ask a follow-up, build on previous context.
3. Weave in their specific trait numbers naturally (e.g. "Because of your ${safeScores.conscientiousness}% conscientiousness...", "Given that you recharge through quiet focus at ${safeScores.extraversion}% extraversion...").
4. Use clean, readable markdown: bold key insights (**bold**), use bullet points (* bullet) when giving multi-step advice, and keep the tone empowering and practical.

${conversationHistoryText ? `--- PREVIOUS CONVERSATION CONTEXT ---\n${conversationHistoryText}\n--------------------------------------\n` : ''}
CLIENT QUESTION:
"${message}"

YOUR DIRECT COACHING RESPONSE:`;

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
                  parts: [{ text: fullPrompt }],
                },
              ],
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
            const errText = await aiRes.text();
            geminiErrorDetails = `Model ${modelName} returned ${aiRes.status}: ${errText.slice(0, 200)}`;
            console.warn(geminiErrorDetails);
          }
        } catch (modelErr: any) {
          geminiErrorDetails = `Exception on ${modelName}: ${modelErr.message}`;
          console.warn(geminiErrorDetails);
        }
      }
    }

    // 2. Intelligent Psychometric Knowledge Engine (Guaranteed zero-failure response)
    const synthesizedAdvice = generatePsychometricAdvice(message, safeScores, safeArchetype);

    return NextResponse.json({
      success: true,
      response: synthesizedAdvice,
      source: 'knowledge_engine',
      debug: {
        hasKey: Boolean(geminiKey),
        keyPrefix: geminiKey ? `${geminiKey.slice(0, 5)}...` : 'none',
        error: geminiErrorDetails,
      },
    });
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry.' }, { status: 500 });
  }
}
