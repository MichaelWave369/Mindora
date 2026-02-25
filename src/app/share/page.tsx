'use client';

import { useEffect, useState } from 'react';
import { db, getSettings } from '@/lib/db/client';
import { redactPII } from '@/lib/privacy/redact';

export default function SharePage() {
  const [enabled, setEnabled] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    db.journalEntries.toArray().then(setEntries);
    getSettings().then((s) => setEnabled(s.enableAnonymousShare));
  }, []);

  const generateCapsule = () => {
    const entry = entries.find((e) => e.id === selected);
    if (!entry) return;
    const stripped = redactPII(entry.text);
    setPreview(JSON.stringify({ createdAt: entry.createdAt, mood: entry.mood, tags: entry.tags, text: stripped }, null, 2));
  };

  const download = () => {
    const blob = new Blob([preview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindora-share-capsule.json';
    a.click();
  };

  if (!enabled) return <div className="card">Feature disabled in settings.</div>;

  return (
    <section className="card space-y-2">
      <h2 className="font-semibold">Share to CoEvo (manual capsule)</h2>
      <select className="border rounded p-2" onChange={(e) => setSelected(Number(e.target.value))}>
        <option>Select entry</option>
        {entries.map((e) => <option key={e.id} value={e.id}>{e.title || 'Untitled'} · {new Date(e.createdAt).toLocaleDateString()}</option>)}
      </select>
      <button className="btn" onClick={generateCapsule}>Generate redacted capsule</button>
      {preview && <><pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">{preview}</pre><button className="btn-secondary" onClick={download}>Download capsule</button></>}
    </section>
  );
}
