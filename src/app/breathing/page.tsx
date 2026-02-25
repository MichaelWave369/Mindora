'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db/client';

const exercises = {
  box: { id: 'box', label: 'Box breathing 4-4-4-4', phases: ['Inhale 4', 'Hold 4', 'Exhale 4', 'Hold 4'], cycleMs: 16000 },
  '478': { id: '478', label: '4-7-8', phases: ['Inhale 4', 'Hold 7', 'Exhale 8'], cycleMs: 19000 },
  coherent: { id: 'coherent', label: 'Coherent 5.5 in / 5.5 out', phases: ['Inhale 5.5', 'Exhale 5.5'], cycleMs: 11000 }
} as const;

export default function BreathingPage() {
  const [selected, setSelected] = useState<keyof typeof exercises>('box');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const phase = useMemo(() => {
    const ex = exercises[selected];
    const ms = (seconds * 1000) % ex.cycleMs;
    const chunk = ex.cycleMs / ex.phases.length;
    return ex.phases[Math.floor(ms / chunk)];
  }, [seconds, selected]);

  const complete = async () => {
    await db.breathingLogs.add({ timestamp: new Date().toISOString(), exerciseId: selected, duration: seconds });
    setRunning(false);
    setSeconds(0);
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Guided Breathing</h2>
        <div className="mt-2 flex flex-wrap gap-2">{Object.values(exercises).map((e) => <button key={e.id} className={selected === e.id ? 'btn' : 'btn-secondary'} onClick={() => setSelected(e.id)}>{e.label}</button>)}</div>
        <div className="mt-4 text-center">
          <div className="mx-auto h-36 w-36 rounded-full bg-sky-200 flex items-center justify-center animate-pulse">{phase}</div>
          <p className="mt-2">{seconds}s</p>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn" onClick={() => setRunning((v) => !v)}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn-secondary" onClick={complete}>Save completion</button>
        </div>
        <label className="mt-2 text-sm flex items-center gap-2"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Optional sound</label>
      </div>
    </section>
  );
}
