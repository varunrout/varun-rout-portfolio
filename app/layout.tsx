import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteHeader } from '@/components/chrome/site-header';
import { SiteFooter } from '@/components/chrome/site-footer';
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
  metadataBase: new URL('https://varunrout.dev'),
  openGraph: {
    title: 'Varun Rout — Applied Data Science',
    description: 'Forecasting, causal ML, and models that earn their claims.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-bg text-txt antialiased`}>
        <TooltipProvider delay={200}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
