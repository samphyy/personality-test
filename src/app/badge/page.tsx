import { Metadata } from 'next';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import { TRAIT_DEFINITIONS } from '@/data/questions';

interface BadgeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: BadgeProps): Promise<Metadata> {
  // Await searchParams in Next.js 15
  const sp = await searchParams;
  const archId = (sp.arch as string) || '';
  const o = (sp.o as string) || '50';
  const c = (sp.c as string) || '50';
  const e = (sp.e as string) || '50';
  const a = (sp.a as string) || '50';
  const n = (sp.n as string) || '50';

  const archetypesList = Object.values(ARCHETYPES);
  const archetype = archetypesList.find((item) => item.id === archId);

  const title = archetype ? `${archetype.name} | My Personality Blueprint` : 'My Personality Blueprint';
  const description = archetype ? archetype.tagline : 'Discover your Big Five psychometric blueprint.';
  const url = `https://personality-test.ysamphy.com/badge?arch=${archId}&o=${o}&c=${c}&e=${e}&a=${a}&n=${n}`;
  const ogImageUrl = `https://personality-test.ysamphy.com/api/og?arch=${archId}&o=${o}&c=${c}&e=${e}&a=${a}&n=${n}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BadgePage({ searchParams }: BadgeProps) {
  // Await searchParams in Next.js 15
  const sp = await searchParams;
  const archId = (sp.arch as string) || '';
  const o = parseInt((sp.o as string) || '50', 10);
  const c = parseInt((sp.c as string) || '50', 10);
  const e = parseInt((sp.e as string) || '50', 10);
  const a = parseInt((sp.a as string) || '50', 10);
  const n = parseInt((sp.n as string) || '50', 10);

  const archetypesList = Object.values(ARCHETYPES);
  const archetype = archetypesList.find((item) => item.id === archId);

  const scores = { openness: o, conscientiousness: c, extraversion: e, agreeableness: a, reactivity: n };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className={`p-8 sm:p-12 text-white bg-gradient-to-br ${archetype ? archetype.colorTheme : 'from-slate-800 to-slate-900'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl border border-white/30">
              <span className="text-3xl font-serif font-bold text-white shadow-sm">y</span>
            </div>
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-white/80 mb-3 block">
              Certified Psychometric Blueprint
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
              {archetype ? archetype.name : 'Personality Blueprint'}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-medium max-w-lg leading-relaxed">
              {archetype ? archetype.tagline : 'A comprehensive Big Five assessment.'}
            </p>
          </div>
        </div>

        {/* Traits Section */}
        <div className="p-8 sm:p-12 bg-white">
          <div className="mb-10 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">The Five-Factor Profile</h2>
            <div className="w-12 h-1 bg-brand-500 rounded mx-auto"></div>
          </div>

          <div className="space-y-6">
            {(Object.entries(scores) as [keyof typeof TRAIT_DEFINITIONS, number][]).map(([key, score]) => {
              const def = TRAIT_DEFINITIONS[key];
              if (!def) return null;
              
              return (
                <div key={key} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-800 text-sm">{def.label}</span>
                    <span className="font-mono font-bold text-slate-500 text-sm">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${score}%`, backgroundColor: def.color }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 px-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">{def.lowLabel}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{def.highLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 sm:p-10 bg-slate-50 border-t border-slate-100 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-3">Discover Your Own Blueprint</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Take the scientifically validated 30-question assessment to decode your dominant archetype and unlock your personalized growth roadmap.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
          >
            Take the Free Test Now
          </Link>
        </div>

      </div>
    </div>
  );
}
