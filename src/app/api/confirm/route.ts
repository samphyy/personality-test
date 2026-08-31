import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get('ck_subscriber_id') || searchParams.get('subscriber_id') || searchParams.get('id');
    const apiSecret = process.env.KIT_API_SECRET?.trim() || process.env.KIT_API_KEY?.trim();
    const apiKey = process.env.KIT_API_KEY?.trim();

    // 1. Check if subscriber ID is available and fetch from Kit
    if (subscriberId && (apiSecret || apiKey)) {
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
      }
    }

    // 2. Check if the user has their latest report stored in their browser cookie
    const cookiesHeader = req.headers.get('cookie') || '';
    const match = cookiesHeader.match(/latest_report_url=([^;]+)/);
    if (match && match[1]) {
      const cookieUrl = decodeURIComponent(match[1]);
      if (cookieUrl.startsWith('http')) {
        return NextResponse.redirect(cookieUrl);
      }
    }

    // 3. Fallback
    return NextResponse.redirect(new URL('/results', req.url));
  } catch (error) {
    console.error('Error handling Kit confirmation redirect:', error);
    return NextResponse.redirect(new URL('/results', req.url));
  }
}
