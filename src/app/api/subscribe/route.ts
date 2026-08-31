import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, archetype, scores } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.KIT_API_KEY?.trim();
    const apiSecret = process.env.KIT_API_SECRET?.trim();
    const formId = process.env.KIT_FORM_ID?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    // Determine clean base URL without www on subdomains
    const rawOrigin = req.headers.get('origin') || req.headers.get('referer') || 'https://personality-test.ysamphy.com';
    let baseUrl = 'https://personality-test.ysamphy.com';
    try {
      baseUrl = new URL(rawOrigin).origin.replace('www.personality-test.', 'personality-test.');
    } catch (e) {
      baseUrl = rawOrigin.split('?')[0].replace(/\/$/, '');
    }

    const o = scores?.openness?.percentage ?? 50;
    const c = scores?.conscientiousness?.percentage ?? 50;
    const e = scores?.extraversion?.percentage ?? 50;
    const a = scores?.agreeableness?.percentage ?? 50;
    const n = scores?.neuroticism?.percentage ?? 50;
    const archId = archetype?.id || 'default-balanced';
    const archetypeName = archetype?.name || 'The Visionary Architect';

    const reportUrl = `${baseUrl}/results?o=${o}&c=${c}&e=${e}&a=${a}&n=${n}&arch=${archId}`;

    // Step 1: Programmatically ensure custom fields exist in Kit
    if (apiKey) {
      try {
        await fetch('https://api.convertkit.com/v3/custom_fields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, name: 'report_url' }),
        });
        await fetch('https://api.convertkit.com/v3/custom_fields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, name: 'personality_archetype' }),
        });
      } catch (err) {
        console.warn('Could not auto-create Kit custom field:', err);
      }
    }

    // Step 2: Push subscriber into Kit Form with custom fields
    const customFields: Record<string, string> = {
      report_url: reportUrl,
      personality_archetype: archetypeName,
      openness_score: `${o}%`,
      conscientiousness_score: `${c}%`,
      extraversion_score: `${e}%`,
      agreeableness_score: `${a}%`,
      emotional_stability_score: `${n}%`,
    };

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = name?.trim() || undefined;

    const kitPayload = {
      api_key: apiKey,
      email: cleanEmail,
      first_name: cleanFirstName,
      fields: customFields,
    };

    let subscriptionData = null;

    if (apiKey && formId) {
      const convertKitEndpoint = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;
      const kitResponse = await fetch(convertKitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kitPayload),
      });

      const kitData = await kitResponse.json();
      if (!kitResponse.ok) {
        console.error('Kit API Error:', kitData);
        return NextResponse.json(
          { error: kitData.message || 'Failed to register with Kit.' },
          { status: kitResponse.status }
        );
      }
      subscriptionData = kitData.subscription;

      // Step 3: Explicitly create & apply tags via ConvertKit Tag API
      const tagsToApply = [
        'OCEAN_Assessment_Lead',
        `Archetype: ${archetypeName}`,
      ];

      for (const tagName of tagsToApply) {
        try {
          // 1. Create or fetch tag ID
          const tagRes = await fetch('https://api.convertkit.com/v3/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey, tag: { name: tagName } }),
          });

          if (tagRes.ok) {
            const tagData = await tagRes.json();
            const tagId = tagData.id || tagData.tag?.id;

            if (tagId) {
              // 2. Tag the subscriber
              await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  api_key: apiKey,
                  email: cleanEmail,
                  first_name: cleanFirstName,
                }),
              });
            }
          }
        } catch (tagErr) {
          console.warn(`Could not apply tag ${tagName}:`, tagErr);
        }
      }

      // If subscriber exists, explicitly update their custom fields using api_secret or api_key
      const subId = subscriptionData?.id;
      if (subId && (apiSecret || apiKey)) {
        try {
          const updateEndpoint = `https://api.convertkit.com/v3/subscribers/${subId}`;
          await fetch(updateEndpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_secret: apiSecret || apiKey,
              fields: customFields,
            }),
          });
        } catch (e) {
          console.warn('Could not update subscriber fields:', e);
        }
      }
    }

    // Step 4 (Optional direct email delivery via Resend if configured)
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'YSAMPHY Personality Assessment <assessment@ysamphy.com>',
            to: [cleanEmail],
            subject: 'Your Big Five Personality Blueprint is ready 🧠',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #0d9488; letter-spacing: 1px;">YSAMPHY LLC</span>
                  <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 8px 0;">Your Personality Blueprint is Ready</h1>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                  <p style="font-size: 14px; margin: 0 0 8px 0; color: #64748b;">Primary Archetype:</p>
                  <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #0d9488;">${archetypeName}</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0;">
                    Your scores: Openness (${o}%), Conscientiousness (${c}%), Extraversion (${e}%), Agreeableness (${a}%), Emotional Stability (${n}%).
                  </p>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="${reportUrl}" style="background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">
                    View My Interactive Radar Chart & Blueprint →
                  </a>
                </div>

                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px;">
                  Direct link: <a href="${reportUrl}" style="color: #0d9488;">${reportUrl}</a>
                </p>
              </div>
            `,
          }),
        });
      } catch (e) {
        console.warn('Direct Resend email dispatch skipped:', e);
      }
    }

    const response = NextResponse.json({
      success: true,
      mode: apiKey && formId ? 'live' : 'demo',
      reportUrl,
      subscription: subscriptionData,
      message: 'Your report link has been generated and subscriber tagged in Kit!',
    });

    // Set cookie with report URL so confirmation redirect on this device can find it instantly
    response.cookies.set('latest_report_url', reportUrl, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Error subscribing to Kit:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
