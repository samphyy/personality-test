import { ImageResponse } from 'next/og';
import { ARCHETYPES } from '@/data/archetypes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const archId = searchParams.get('arch');
    const format = searchParams.get('format') === 'story' ? 'story' : 'square';
    const isDownload = searchParams.get('download') === '1';

    const o = searchParams.get('o') || '50';
    const c = searchParams.get('c') || '50';
    const e = searchParams.get('e') || '50';
    const a = searchParams.get('a') || '50';
    const n = searchParams.get('n') || '50';

    const archetypesList = Object.values(ARCHETYPES);
    const archetype = archetypesList.find((item) => item.id === archId) || {
      name: archId ? archId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'The Visionary Architect',
      tagline: 'High-leverage analytical problem solving and strategic depth.',
      growthAdvice: 'Focus on strategic delegation and sustainable momentum.',
    };

    const isStory = format === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const headers: Record<string, string> = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (isDownload) {
      headers['Content-Disposition'] = `attachment; filename="ocean-personality-${format}.png"`;
    }

    if (isStory) {
      // 9:16 STORY LAYOUT (1080 x 1920)
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#090d16',
              backgroundImage: 'linear-gradient(to bottom right, #090d16, #0f172a, #042f2e)',
              padding: '80px 72px',
              fontFamily: 'sans-serif',
              color: '#ffffff',
            }}
          >
            {/* Top Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#1abc9c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '38px',
                    fontWeight: 900,
                    fontFamily: 'serif',
                    marginRight: '20px',
                  }}
                >
                  y
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff' }}>
                    OCEAN<span style={{ color: '#1abc9c' }}>Insight</span>
                  </span>
                  <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    YSAMPHY LLC • PSYCHOMETRICS
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px 24px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontSize: '18px', color: '#5eead4', fontWeight: 800 }}>
                  Big Five Blueprint
                </span>
              </div>
            </div>

            {/* Middle: Archetype Hero Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(20, 184, 166, 0.35)',
                borderRadius: '40px',
                padding: '56px 48px',
              }}
            >
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(20, 184, 166, 0.25)',
                    color: '#5eead4',
                    border: '1px solid rgba(20, 184, 166, 0.5)',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  Primary Archetype
                </span>
              </div>

              <h1
                style={{
                  fontSize: '64px',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 1.05,
                  margin: '0 0 16px 0',
                  color: '#ffffff',
                }}
              >
                {archetype.name}
              </h1>

              <p style={{ fontSize: '26px', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 32px 0', lineHeight: 1.35 }}>
                &ldquo;{archetype.tagline}&rdquo;
              </p>

              {/* 5 Trait Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', marginTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span style={{ color: '#c084fc' }}>Openness to Experience</span>
                    <span style={{ color: '#c084fc' }}>{o}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${o}%`, height: '100%', backgroundColor: '#8B5CF6', borderRadius: '999px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span style={{ color: '#38bdf8' }}>Conscientiousness</span>
                    <span style={{ color: '#38bdf8' }}>{c}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${c}%`, height: '100%', backgroundColor: '#0284C7', borderRadius: '999px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span style={{ color: '#2dd4bf' }}>Extraversion</span>
                    <span style={{ color: '#2dd4bf' }}>{e}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${e}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '999px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span style={{ color: '#fbbf24' }}>Agreeableness</span>
                    <span style={{ color: '#fbbf24' }}>{a}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${a}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '999px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span style={{ color: '#f43f5e' }}>Emotional Reactivity</span>
                    <span style={{ color: '#f43f5e' }}>{n}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${n}%`, height: '100%', backgroundColor: '#E11D48', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Callout & Domain */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '30px',
                padding: '32px',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '20px', color: '#5eead4', fontWeight: 900 }}>
                Decode your psychological blueprint in 3 minutes
              </span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
                personality-test.ysamphy.com
              </span>
            </div>
          </div>
        ),
        { width, height, headers }
      );
    }

    // 1:1 SQUARE BADGE LAYOUT (1080 x 1080)
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#090d16',
            backgroundImage: 'linear-gradient(to bottom right, #090d16, #0f172a, #042f2e)',
            padding: '64px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#1abc9c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '30px',
                  fontWeight: 900,
                  fontFamily: 'serif',
                  marginRight: '16px',
                }}
              >
                y
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff' }}>
                  OCEAN<span style={{ color: '#1abc9c' }}>Insight</span>
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  YSAMPHY LLC • PSYCHOMETRICS
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '8px 20px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <span style={{ fontSize: '15px', color: '#5eead4', fontWeight: 800 }}>
                Big Five Assessment
              </span>
            </div>
          </div>

          {/* Center Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '2px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '32px',
              padding: '48px 40px',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(20, 184, 166, 0.25)',
                  color: '#5eead4',
                  border: '1px solid rgba(20, 184, 166, 0.5)',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Primary Archetype
              </span>
            </div>

            <h1
              style={{
                fontSize: '56px',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                lineHeight: 1.1,
                margin: '0 0 14px 0',
                color: '#ffffff',
              }}
            >
              {archetype.name}
            </h1>

            <p style={{ fontSize: '22px', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 28px 0', lineHeight: 1.3 }}>
              &ldquo;{archetype.tagline}&rdquo;
            </p>

            {/* Score Badges Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px', borderRadius: '18px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 800 }}>Openness</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{o}%</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 800 }}>Conscientious</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{c}%</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#2dd4bf', fontWeight: 800 }}>Extraversion</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{e}%</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 800 }}>Agreeable</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{a}%</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 800 }}>Reactivity</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{n}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Watermark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
            <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 700 }}>
              🧠 Five-Factor Model Psychometrics
            </span>
            <span style={{ fontSize: '18px', color: '#5eead4', fontWeight: 900 }}>
              personality-test.ysamphy.com
            </span>
          </div>
        </div>
      ),
      { width, height, headers }
    );
  } catch (e: any) {
    console.error('Error generating card image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
