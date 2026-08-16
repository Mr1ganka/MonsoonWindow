import type { Metadata, Viewport } from 'next';
import { Inter, Rozha_One, Cinzel, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const rozhaOne = Rozha_One({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-rozha',
  display: 'swap',
  fallback: ['serif'],
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  fallback: ['serif'],
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['monospace'],
});

export const viewport: Viewport = {
  themeColor: '#0c0a09',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Monsoon Window — Somewhere between the rain and the radio',
  description:
    'An atmospheric 24-hour Indian monsoon window. Listen to curated 90s retro cassettes, Ghazals and acoustic melodies on Monsoon FM (98.7) with dynamic rain physics and live time-based city atmosphere.',
  keywords: [
    'monsoon window',
    'monsoon radio',
    'indian monsoon rain sounds',
    'deluxe saloon',
    'jammu matador radio',
    '90s bollywood retro songs',
    'ghazal radio',
    'jagjit singh',
    'rain sound lofi',
    'ambient rain simulator',
    'मानसून विंडो',
    'बारिश के गाने',
  ],
  authors: [{ name: 'Monsoon Window Project' }],
  openGraph: {
    title: 'Monsoon Window — Somewhere between the rain and the radio',
    description:
      'An atmospheric 24-hour Indian monsoon window. Live rain on glass and nostalgic cassette melodies on 98.7 FM.',
    url: 'https://monsoonwindow.space',
    siteName: 'Monsoon Window',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monsoon Window — Somewhere between the rain and the radio',
    description:
      'An atmospheric 24-hour Indian monsoon sanctuary. Dynamic rain on glass and 98.7 Monsoon FM.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${rozhaOne.variable} ${cinzel.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#0c0a09] text-white selection:bg-amber-500/30 selection:text-amber-300 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
