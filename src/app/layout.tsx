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
  title: 'OCEANInsight - Big Five Personality Assessment',
  description: 'Understand your unique psychological blueprint using the scientifically validated Big Five (OCEAN) personality model. Free, instant, and private.',
  keywords: ['Big Five', 'OCEAN Personality', 'Psychology Test', 'Personality Assessment', 'IPIP-50', 'Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
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
