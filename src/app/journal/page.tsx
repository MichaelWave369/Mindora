'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { DangerPanel } from '@/components/DangerPanel';
import { db, getSettings } from '@/lib/db/client';
import { downloadText, entryToMarkdown } from '@/lib/export/format';
import { redactPII } from '@/lib/privacy/redact';
import { detectCrisis } from '@/lib/safety/crisis';
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

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () =>
      entries.filter((entry) =>
        `${entry.title || ''} ${entry.text}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [entries, search]
  );

  const saveEntry = async () => {
    if (!text.trim()) return;

    const row: JournalEntry = {
      createdAt: new Date().toISOString(),
      title,
      text,
      mood,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      reflection,
      providerUsed: 'demo',
      piiRedacted: true,
      attachments: []
    };

    await db.journalEntries.add(row);
    await db.moodLogs.add({ date: row.createdAt, mood, tags: row.tags });

    setTitle('');
    setText('');
    setTags('');
    setReflection('');

    refresh();
  };

  const reflect = async () => {
    const crisisResult = detectCrisis(text);
    setCrisis(crisisResult.isCrisis);

    const settings = await getSettings();
    const redacted = settings.stripPiiBeforeAi
      ? redactPII(text, { knownName: settings.emergencyContactName })
      : text;

    const response = await fetch('/api/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: redacted,
        provider: settings.provider,
        mode,
        model: settings.model,
        ollamaBaseUrl: settings.ollamaBaseUrl
      })
    });

    const data = await response.json();
    setReflection(data.reflection || data.message || 'No response');
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) =>
      setText((prev) => `${prev} ${event.results[0][0].transcript}`.trim());
    recognition.start();
  };

  return (
    <section className="space-y-4">
      {crisis && <DangerPanel />}

      <div className="card space-y-2">
        <h2 className="font-semibold">Daily Journal</h2>

        <input
          aria-label="Journal title"
          className="w-full rounded border p-2"
          placeholder="Title (optional)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          aria-label="Journal text"
          className="h-40 w-full rounded border p-2"
          placeholder="Write your entry..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="mood-slider">Mood {mood}</label>
          <input
            id="mood-slider"
            aria-label="Mood rating"
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(event) => setMood(Number(event.target.value))}
          />

          <input
            aria-label="Emotion tags"
            className="rounded border p-1"
            placeholder="tags comma-separated"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {['Gentle', 'Direct', 'Ritual'].map((value) => (
            <button
              key={value}
              className={mode === value ? 'btn' : 'btn-secondary'}
              onClick={() => setMode(value as 'Gentle' | 'Direct' | 'Ritual')}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button aria-label="Save Entry" className="btn" onClick={saveEntry}>
            Save Entry
          </button>

          <button aria-label="Reflect" className="btn-secondary" onClick={reflect}>
            Reflect
          </button>

          <button
            aria-label="Export Entry Markdown"
            className="btn-secondary"
            onClick={() =>
              downloadText(
                `mindora-entry-${Date.now()}.md`,
                entryToMarkdown({
                  createdAt: new Date().toISOString(),
                  title,
                  text,
                  mood,
                  tags: tags.split(',').filter(Boolean),
                  reflection
                })
              )
            }
          >
            Export Entry (Markdown)
          </button>

          <Link aria-label="Export Entry PDF" className="btn-secondary" href="/print/entry">
            Export Entry (PDF)
          </Link>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            aria-label="Enable voice to text"
            type="checkbox"
            checked={voiceEnabled}
            onChange={(event) => setVoiceEnabled(event.target.checked)}
          />
          Voice-to-text (Web Speech API)
        </label>

        {voiceEnabled && (
          <button aria-label="Start dictation" className="btn-secondary" onClick={startVoice}>
            Start dictation
          </button>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input aria-label="Advanced whisper coming soon" type="checkbox" disabled />
          Advanced local Whisper (coming soon)
        </label>

        <p className="text-xs text-slate-500">
          We removed obvious personal identifiers before reflection.
        </p>

        {reflection && (
          <pre className="whitespace-pre-wrap rounded bg-slate-100 p-3 text-sm">
            {reflection}
          </pre>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold">History</h3>
        <input
          aria-label="Search entries"
          className="mt-2 w-full rounded border p-2"
          placeholder="Search entries"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <ul className="mt-2 space-y-2 text-sm">
          {filtered.map((entry) => (
            <li key={entry.id} className="rounded border p-2">
              <strong>{entry.title || 'Untitled'}</strong> · mood {entry.mood}/10
              <br />
              {entry.text.slice(0, 160)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
