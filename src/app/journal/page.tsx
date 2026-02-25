'use client';

import { useEffect, useMemo, useState } from 'react';
import { db, getSettings } from '@/lib/db/client';
import { redactPII } from '@/lib/privacy/redact';
import { detectCrisis } from '@/lib/safety/crisis';
import { downloadText, entryToMarkdown } from '@/lib/export/format';
import { DangerPanel } from '@/components/DangerPanel';
import Link from 'next/link';
import type { JournalEntry } from '@/types';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mood, setMood] = useState(5);
  const [tags, setTags] = useState('');
  const [mode, setMode] = useState<'Gentle' | 'Direct' | 'Ritual'>('Gentle');
  const [reflection, setReflection] = useState('');
  const [search, setSearch] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  async function refresh() {
    const list = await db.journalEntries.orderBy('createdAt').reverse().toArray();
    setEntries(list);
  }

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => entries.filter((e) => `${e.title || ''} ${e.text}`.toLowerCase().includes(search.toLowerCase())), [entries, search]);

  const saveEntry = async () => {
    if (!text.trim()) return;
    const row: JournalEntry = { createdAt: new Date().toISOString(), title, text, mood, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), reflection, providerUsed: 'demo', piiRedacted: true, attachments: [] };
    await db.journalEntries.add(row);
    await db.moodLogs.add({ date: row.createdAt, mood, tags: row.tags });
    setTitle(''); setText(''); setTags(''); setReflection('');
    refresh();
  };

  const reflect = async () => {
    const crisisResult = detectCrisis(text);
    setCrisis(crisisResult.isCrisis);
    const settings = await getSettings();
    const redacted = settings.stripPiiBeforeAi ? redactPII(text, { knownName: settings.emergencyContactName }) : text;
    const res = await fetch('/api/reflect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: redacted, provider: settings.provider, mode, model: settings.model, ollamaBaseUrl: settings.ollamaBaseUrl }) });
    const data = await res.json();
    setReflection(data.reflection || data.message || 'No response');
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => setText((prev) => `${prev} ${event.results[0][0].transcript}`.trim());
    recognition.start();
  };

  return (
    <section className="space-y-4">
      {crisis && <DangerPanel />}
      <div className="card space-y-2">
        <h2 className="font-semibold">Daily Journal</h2>
        <input className="w-full border rounded p-2" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2 h-40" placeholder="Write your entry..." value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex gap-2 items-center text-sm">
          <label>Mood {mood}</label><input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} />
          <input className="border rounded p-1" placeholder="tags comma-separated" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['Gentle', 'Direct', 'Ritual'].map((m) => <button key={m} onClick={() => setMode(m as any)} className={mode === m ? 'btn' : 'btn-secondary'}>{m}</button>)}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn" onClick={saveEntry}>Save Entry</button>
          <button className="btn-secondary" onClick={reflect}>Reflect</button>
          <button className="btn-secondary" onClick={() => downloadText(`mindora-entry-${Date.now()}.md`, entryToMarkdown({ createdAt: new Date().toISOString(), title, text, mood, tags: tags.split(',').filter(Boolean), reflection }))}>Export Entry (Markdown)</button>
          <Link className="btn-secondary" href="/print/entry">Export Entry (PDF)</Link>
        </div>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} /> Voice-to-text (Web Speech API)</label>
        {voiceEnabled && <button className="btn-secondary" onClick={startVoice}>Start dictation</button>}
        <label className="text-sm flex items-center gap-2"><input type="checkbox" disabled /> Advanced local Whisper (coming soon)</label>
        <p className="text-xs text-slate-500">We removed obvious personal identifiers before reflection.</p>
        {reflection && <pre className="bg-slate-100 p-3 rounded text-sm whitespace-pre-wrap">{reflection}</pre>}
      </div>

      <div className="card">
        <h3 className="font-semibold">History</h3>
        <input className="mt-2 border rounded p-2 w-full" placeholder="Search entries" value={search} onChange={(e) => setSearch(e.target.value)} />
        <ul className="mt-2 space-y-2 text-sm">
          {filtered.map((e) => <li key={e.id} className="border rounded p-2"><strong>{e.title || 'Untitled'}</strong> · mood {e.mood}/10<br />{e.text.slice(0, 160)}</li>)}
        </ul>
      </div>
    </section>
  );
}
