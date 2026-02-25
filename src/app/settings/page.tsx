'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { db, defaultSettings } from '@/lib/db/client';
import { decryptBackup, encryptBackup } from '@/lib/backup/crypto';
import { exportAllData, importAllData, wipeAllData } from '@/lib/db/export';
import type { AppSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [password, setPassword] = useState('');

  useEffect(() => {
    db.settings.get('singleton').then((s) => s && setSettings(s));
  }, []);

  const save = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await db.settings.put(next);
  };

  const backup = async (encrypted: boolean) => {
    const payload = JSON.stringify(await exportAllData());
    const content = encrypted && password ? JSON.stringify(await encryptBackup(payload, password)) : payload;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = encrypted ? 'mindora-backup.enc.json' : 'mindora-backup.json';
    a.click();
  };

  const restore = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let parsed: any = JSON.parse(text);
    if (file.name.includes('.enc') && password) {
      parsed = JSON.parse(await decryptBackup(parsed, password));
    }
    await importAllData(parsed);
    alert('Backup restored. Refreshing.');
    location.reload();
  };

  return (
    <section className="space-y-4">
      <div className="card space-y-2">
        <h2 className="font-semibold">Provider settings</h2>
        <select className="border rounded p-2" value={settings.provider} onChange={(e) => save({ provider: e.target.value as any })}>{['demo', 'ollama', 'openai', 'anthropic', 'xai'].map((p) => <option key={p} value={p}>{p}</option>)}</select>
        <input className="border rounded p-2 w-full" placeholder="Model" value={settings.model} onChange={(e) => save({ model: e.target.value })} />
        <input className="border rounded p-2 w-full" placeholder="Ollama base URL" value={settings.ollamaBaseUrl} onChange={(e) => save({ ollamaBaseUrl: e.target.value })} />
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Privacy controls</h2>
        <label className="text-sm block"><input type="checkbox" checked={settings.allowAiReflections} onChange={(e) => save({ allowAiReflections: e.target.checked })} /> Allow AI reflections</label>
        <label className="text-sm block"><input type="checkbox" checked={settings.stripPiiBeforeAi} onChange={(e) => save({ stripPiiBeforeAi: e.target.checked })} /> Strip PII before AI</label>
        <label className="text-sm block"><input type="checkbox" checked={settings.enableAnonymousShare} onChange={(e) => save({ enableAnonymousShare: e.target.checked })} /> Enable optional anonymous share to CoEvo</label>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Backup / restore</h2>
        <input type="password" className="border rounded p-2" placeholder="Password for encryption" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" onClick={() => backup(false)}>Export JSON</button>
          <button className="btn-secondary" onClick={() => backup(true)}>Export encrypted</button>
          <input type="file" onChange={restore} />
        </div>
      </div>

      <button className="btn bg-red-700 hover:bg-red-600" onClick={wipeAllData}>Delete all data</button>
    </section>
  );
}
