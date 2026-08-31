import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Kit automatically appends ck_subscriber_id or subscriber_id upon confirmation redirect
    const subscriberId = searchParams.get('ck_subscriber_id') || searchParams.get('subscriber_id') || searchParams.get('id');
    const apiKey = process.env.KIT_API_KEY?.trim();

    if (subscriberId && apiKey) {
      // Fetch subscriber's custom fields from Kit API
      const kitRes = await fetch(
        `https://api.convertkit.com/v3/subscribers/${subscriberId}?api_key=${apiKey}`,
        { next: { revalidate: 0 } }
      );

      if (kitRes.ok) {
        const data = await kitRes.json();
        const reportUrl = data.subscriber?.fields?.report_url;

        if (reportUrl && reportUrl.startsWith('http')) {
          return NextResponse.redirect(reportUrl);
        }
      }
    }

    // Fallback if no subscriber ID or no report_url found
    return NextResponse.redirect(new URL('/results', req.url));
  } catch (error) {
    console.error('Error handling Kit confirmation redirect:', error);
    return NextResponse.redirect(new URL('/results', req.url));
  }
}
