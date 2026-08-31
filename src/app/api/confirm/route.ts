import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Kit automatically appends ck_subscriber_id or subscriber_id upon confirmation redirect
    const subscriberId = searchParams.get('ck_subscriber_id') || searchParams.get('subscriber_id') || searchParams.get('id');
    const apiSecret = process.env.KIT_API_SECRET?.trim() || process.env.KIT_API_KEY?.trim();
    const apiKey = process.env.KIT_API_KEY?.trim();

    if (subscriberId && (apiSecret || apiKey)) {
      // Fetch subscriber's custom fields from Kit API (Kit v3 requires api_secret for subscriber details)
      const queryParam = apiSecret ? `api_secret=${apiSecret}` : `api_key=${apiKey}`;
      const kitRes = await fetch(
        `https://api.convertkit.com/v3/subscribers/${subscriberId}?${queryParam}`,
        { next: { revalidate: 0 } }
      );

      if (kitRes.ok) {
        const data = await kitRes.json();
        const reportUrl = data.subscriber?.fields?.report_url;

        if (reportUrl && reportUrl.startsWith('http')) {
          return NextResponse.redirect(reportUrl);
        }
      } else {
        console.warn('Kit subscriber lookup failed with status:', kitRes.status);
      }
    }

    // Fallback: Redirect to results dashboard
    return NextResponse.redirect(new URL('/results', req.url));
  } catch (error) {
    console.error('Error handling Kit confirmation redirect:', error);
    return NextResponse.redirect(new URL('/results', req.url));
  }
}
