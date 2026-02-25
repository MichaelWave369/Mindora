'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db/client';
import { detectMoodInsights } from '@/lib/analytics/patterns';
import { downloadText } from '@/lib/export/format';
import Link from 'next/link';

export default function PacketPage() {
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<any[]>([]);
  const [moods, setMoods] = useState<any[]>([]);
  const [breaths, setBreaths] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [pdfs, setPdfs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([db.journalEntries.toArray(), db.moodLogs.toArray(), db.breathingLogs.toArray(), db.resources.toArray(), db.pdfLibrary.toArray()]).then(([e, m, b, r, p]) => {
      setEntries(e); setMoods(m); setBreaths(b); setResources(r); setPdfs(p);
    });
  }, []);

  const within = (d: string) => d >= from && d <= to;
  const selectedEntries = entries.filter((e) => within(e.createdAt.slice(0, 10)));
  const selectedMoods = moods.filter((m) => within(m.date.slice(0, 10)));
  const insights = useMemo(() => detectMoodInsights(selectedMoods), [selectedMoods]);
  const tags = selectedEntries.flatMap((e) => e.tags).reduce((a: Record<string, number>, t: string) => ((a[t] = (a[t] ?? 0) + 1), a), {});

  const packetJson = { from, to, entries: selectedEntries, moodInsights: insights, breathingCompletions: breaths.length, crisisPlan: resources.filter((r) => r.type === 'hotline'), attachedPdfs: pdfs.map((p) => p.filename) };
  const packetMd = `# Wellness Packet\n\nRange: ${from} to ${to}\n\n## Entries\n${selectedEntries.map((e) => `- ${e.title || 'Untitled'}: ${e.text.slice(0, 120)}`).join('\n')}\n\n## Mood insights\n${insights.map((i) => `- ${i}`).join('\n')}\n\n## Top tags\n${Object.entries(tags).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n## Breathing completions\n- ${breaths.length}\n\n## Crisis plan\n${resources.filter((r) => r.type === 'hotline').map((r) => `- ${r.label}: ${r.value}`).join('\n')}\n\n> Not medical advice. Not a substitute for a licensed professional.`;

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Wellness Packet</h2>
        <div className="flex gap-2 mt-2"><input type="date" className="border rounded p-2" value={from} onChange={(e) => setFrom(e.target.value)} /><input type="date" className="border rounded p-2" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button className="btn" onClick={() => downloadText('mindora-packet.json', JSON.stringify(packetJson, null, 2), 'application/json')}>Export JSON</button>
          <button className="btn-secondary" onClick={() => downloadText('mindora-packet.md', packetMd, 'text/markdown')}>Export Markdown</button>
          <Link href="/print/packet" className="btn-secondary">Print Wellness Packet</Link>
        </div>
      </div>
      <div className="card text-sm">
        <h3 className="font-semibold">Preview</h3>
        <p>Entries: {selectedEntries.length}</p>
        <p>Breathing completions: {breaths.length}</p>
        <ul className="list-disc pl-5 mt-2">{insights.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    </section>
  );
}
