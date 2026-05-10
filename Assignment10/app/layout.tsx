// ============================================================
// ROOT LAYOUT — wraps every page
// Sets fonts, metadata, and the global Header
// ============================================================

import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'NestQuest — Find Your Perfect Property',
  description:
    'Browse thousands of rentals, homes for sale, luxury hotels and world-class resorts.',
  keywords: ['real estate', 'property', 'rental', 'hotel', 'resort'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="border-t border-brand-100 bg-charcoal-950 text-charcoal-400 text-sm py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-display text-brand-400 text-lg font-semibold">NestQuest</p>
            <p>© {new Date().getFullYear()} NestQuest. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
