import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CONTENT_KEYS, getContent } from '@/lib/content';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GotXRing | Competition Machine Inc',
  description:
    'Premium precision rifle builds by Competition Machine Inc. Explore custom builds, champions, technical insights, and order your rifle.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let leadTime: string = CONTENT_KEYS.lead_time;
  try {
    leadTime = await getContent('lead_time');
  } catch {
    // fallback for environments without DATABASE_URL (e.g. local build)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter leadTime={leadTime} />
        </div>
      </body>
    </html>
  );
}
