import Link from 'next/link';

const cards = [
  { href: '/journal', label: 'Start Journal' },
  { href: '/mood', label: 'Mood' },
  { href: '/breathing', label: 'Breathing' },
  { href: '/resources', label: 'Resources' },
  { href: '/settings', label: 'Settings' }
];

export default function HomePage() {
  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Private, local-first emotional support</h2>
        <p className="mt-2 text-sm text-slate-700">Mindora helps you journal, track mood, breathe, and keep crisis resources handy. Data is stored locally with no telemetry or automatic cloud upload.</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card hover:border-slate-400">
            <p className="font-semibold">{c.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
