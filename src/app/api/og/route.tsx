import { ImageResponse } from 'next/og';
import { ARCHETYPES } from '@/data/archetypes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get('mode');
    const u1 = searchParams.get('u1');
    const u2 = searchParams.get('u2');
    const isCompare = mode === 'compare' || Boolean(u1 && u2);

    const archId = searchParams.get('arch');
    const o = searchParams.get('o') || '50';
    const c = searchParams.get('c') || '50';
    const e = searchParams.get('e') || '50';
    const a = searchParams.get('a') || '50';
    const n = searchParams.get('n') || '50';

    // Find Archetype info if available
    const archetypesList = Object.values(ARCHETYPES);
    const archetype = archetypesList.find((item) => item.id === archId) || {
      name: archId ? archId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Big Five Personality Blueprint',
      tagline: 'Scientifically validated self-discovery across 5 continuous dimensions.',
    };

    const isHome = mode === 'home' || (!archId && !isCompare);

    let displayTitle = isHome ? 'Decode Your True Personality Blueprint' : archetype.name;
    let displayTagline = isHome
      ? 'Discover where you stand across Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.'
      : `"${archetype.tagline}"`;

    if (isCompare) {
      displayTitle = `${u1 || 'Partner 1'} & ${u2 || 'Partner 2'}`;
      displayTagline = 'Psychometric Synergy, Communication Harmony, and Collaboration Blueprint.';
    }

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
            backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(20, 184, 166, 0.25) 0%, rgba(9, 13, 22, 0) 55%), radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.2) 0%, rgba(9, 13, 22, 0) 50%)',
            padding: '56px 64px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#1abc9c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '26px',
                  fontWeight: 900,
                  fontFamily: 'serif',
                  marginRight: '16px',
                  boxShadow: '0 8px 16px rgba(26, 188, 156, 0.35)',
                }}
              >
                y
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  OCEAN<span style={{ color: '#1abc9c' }}>Insight</span>
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  YSAMPHY LLC • PSYCHOMETRICS
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '8px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <span style={{ fontSize: '13px', color: isCompare ? '#c084fc' : '#5eead4', fontWeight: 700 }}>
                {isCompare ? 'Dual Profile Synergy' : 'Validated Five-Factor Model'}
              </span>
            </div>
          </div>

          {/* Center Archetype Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', margin: '24px 0' }}>
            {!isHome && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    backgroundColor: isCompare ? 'rgba(139, 92, 246, 0.2)' : 'rgba(20, 184, 166, 0.2)',
                    color: isCompare ? '#c084fc' : '#5eead4',
                    border: isCompare ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(20, 184, 166, 0.4)',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {isCompare ? 'Synergy & Compatibility Report' : 'Dominant Archetype'}
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: isHome ? '54px' : '52px',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                margin: '0 0 12px 0',
                lineHeight: 1.1,
                backgroundImage: isCompare
                  ? 'linear-gradient(to right, #ffffff, #c084fc, #5eead4)'
                  : 'linear-gradient(to right, #ffffff, #f1f5f9, #5eead4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {displayTitle}
            </h1>

            <p
              style={{
                fontSize: '20px',
                color: '#cbd5e1',
                margin: 0,
                maxWidth: '920px',
                lineHeight: 1.4,
                fontStyle: isHome || isCompare ? 'normal' : 'italic',
              }}
            >
              {displayTagline}
            </p>
          </div>

          {/* Bottom Scores Bar or Assessment Callout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '16px 24px',
            }}
          >
            {isCompare ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', color: '#c084fc', fontWeight: 800 }}>
                  👥 Dual Radar Overlay • Trait Delta Analysis • Communication & Workplace Guide
                </span>
              </div>
            ) : !isHome ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Openness</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#c084fc' }}>{o}%</span>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Conscientious</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#38bdf8' }}>{c}%</span>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Extraversion</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#2dd4bf' }}>{e}%</span>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Agreeable</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24' }}>{a}%</span>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Reactivity</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#f43f5e' }}>{n}%</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: '#5eead4', fontWeight: 800 }}>
                  🧠 30 Scientific Questions • Instant Interactive Radar Chart • Free PDF Export
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 700 }}>
                personality-test.ysamphy.com
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
