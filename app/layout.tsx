import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteHeader } from '@/components/chrome/site-header';
import { SiteFooter } from '@/components/chrome/site-footer';
import { site } from '@/lib/site';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Varun Rout — Applied Data Science',
    template: '%s · Varun Rout',
  },
  description:
    'Forecasting, causal ML, and models that earn their claims. Portfolio of Varun Rout: applied data scientist in Birmingham, UK.',
  metadataBase: new URL(site.url),
  applicationName: 'Varun Rout — Portfolio',
  authors: [{ name: 'Varun Rout', url: site.url }],
  creator: 'Varun Rout',
  keywords: [
    'Varun Rout',
    'data scientist',
    'applied data science',
    'forecasting',
    'causal ML',
    'uplift modelling',
    'expected goals',
    'football analytics',
    'Birmingham',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Varun Rout — Applied Data Science',
    description: 'Forecasting, causal ML, and models that earn their claims.',
    url: site.url,
    siteName: 'Varun Rout',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Varun Rout — Applied Data Science',
    description: 'Forecasting, causal ML, and models that earn their claims.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-bg text-txt antialiased`}>
        <a
          href="#main"
          className="sr-only rounded-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-pink focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:text-txt"
        >
          Skip to content
        </a>
        <TooltipProvider delay={200}>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
