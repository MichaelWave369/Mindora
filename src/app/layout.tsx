import './globals.css';
import type { Metadata } from 'next';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Nav } from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Mindora',
  description: 'Your private pocket therapist & journal'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DisclaimerBanner />
        <main className="max-w-5xl mx-auto px-4 pb-10">
          <header className="pt-4">
            <h1 className="text-2xl font-bold">Mindora</h1>
            <p className="text-sm text-slate-600">Your private pocket therapist & journal</p>
            <p className="text-xs text-slate-500">Everything you need to feel better stays on your computer.</p>
            <Nav />
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
