import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Personality Blueprint',
  description: 'View the personalized Big Five (OCEAN) psychometric analysis and interactive dimensional radar map.',
  openGraph: {
    title: 'My Big Five Personality Blueprint • YSAMPHY LLC',
    description: 'Explore my personalized psychometric results, dominant archetype, and five-factor dimensional radar map.',
    url: 'https://personality-test.ysamphy.com/results',
    siteName: 'OCEANInsight by YSAMPHY LLC',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Personalized Big Five Report',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Big Five Personality Blueprint • YSAMPHY LLC',
    description: 'Explore my personalized psychometric results, dominant archetype, and five-factor dimensional radar map.',
    images: ['/api/og'],
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
