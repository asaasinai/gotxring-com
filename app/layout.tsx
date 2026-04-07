import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GotXRing | Competition Machine Inc',
  description:
    'Premium precision rifle builds by Competition Machine Inc. Explore custom builds, champions, technical insights, and order your rifle.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
