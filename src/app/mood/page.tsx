'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db/client';
import { detectMoodInsights } from '@/lib/analytics/patterns';
import type { MoodLog } from '@/types';
import Link from 'next/link';

export default function MoodPage() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [range, setRange] = useState(30);

  useEffect(() => {
    db.moodLogs.toArray().then(setLogs);
  }, []);

  const recent = useMemo(() => logs.filter((l) => new Date(l.date).getTime() >= Date.now() - range * 86400000), [logs, range]);
  const insights = useMemo(() => detectMoodInsights(recent), [recent]);
  const avg = recent.length ? (recent.reduce((a, b) => a + b.mood, 0) / recent.length).toFixed(2) : 'N/A';

  return (
    <section data-testid="mood-page" className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Mood Dashboard</h2>
        <div className="flex gap-2 mt-2">{[7, 30, 90].map((r) => <button key={r} className={range === r ? 'btn' : 'btn-secondary'} onClick={() => setRange(r)}>{r}d</button>)}</div>
        <p className="mt-2 text-sm">Average mood: <strong>{avg}</strong></p>
        <div className="mt-3 h-28 flex items-end gap-1 border p-2 rounded">
          {recent.slice(-40).map((l, idx) => <div key={idx} title={l.date} className="bg-blue-400 w-3" style={{ height: `${l.mood * 10}%` }} />)}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold">Patterns (deterministic)</h3>
        <ul className="list-disc pl-5 text-sm mt-2">{insights.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
      <Link href="/packet" className="btn inline-block">Open Wellness Packet</Link>
    </section>
  );
}
