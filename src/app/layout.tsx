import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://personality-test.ysamphy.com'),
  title: {
    default: 'OCEANInsight • Big Five Personality Assessment',
    template: '%s • OCEANInsight',
  },
  description: 'Decode your unique psychological blueprint using the scientifically validated Big Five (OCEAN) personality model. Free, instant, and private.',
  keywords: ['Big Five', 'OCEAN Personality', 'Psychology Test', 'Personality Assessment', 'IPIP-50', 'Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://personality-test.ysamphy.com',
    siteName: 'OCEANInsight by YSAMPHY LLC',
    title: 'Big Five (OCEAN) Personality Assessment • YSAMPHY LLC',
    description: 'Discover where you stand across the 5 universal pillars of human psychology with an instant interactive radar chart and 3-page downloadable report.',
    images: [
      {
        url: '/api/og?mode=home',
        width: 1200,
        height: 630,
        alt: 'Big Five Personality Assessment by YSAMPHY LLC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Five (OCEAN) Personality Assessment • YSAMPHY LLC',
    description: 'Discover your dominant psychological archetype and interactive radar map in under 3 minutes.',
    images: ['/api/og?mode=home'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
