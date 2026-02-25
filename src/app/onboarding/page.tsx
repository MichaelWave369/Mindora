'use client';

import { useState } from 'react';
import { db, getSettings } from '@/lib/db/client';
import { useRouter } from 'next/navigation';
import type { AiProvider } from '@/types';

export default function OnboardingPage() {
  const [provider, setProvider] = useState<AiProvider>('demo');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hotline, setHotline] = useState('988');
  const router = useRouter();

  const finish = async () => {
    const settings = await getSettings();
    await db.settings.put({ ...settings, provider, emergencyContactName: name, emergencyContactPhone: phone });
    await db.resources.add({ type: 'hotline', label: 'Preferred hotline', value: hotline, notes: 'Added in onboarding' });
    localStorage.setItem('mindora_onboarded', '1');
    router.push('/journal');
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Onboarding</h2>
        <label className="block text-sm mt-3">Choose AI Provider</label>
        <select className="mt-1 border rounded p-2" value={provider} onChange={(e) => setProvider(e.target.value as AiProvider)}>
          {['demo', 'ollama', 'openai', 'anthropic', 'xai'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <p className="text-sm mt-3">Privacy defaults: local-first storage, no analytics, optional AI reflections only.</p>
        <h3 className="font-medium mt-3">My Crisis Plan</h3>
        <input className="mt-1 w-full border rounded p-2" placeholder="Emergency contact name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="mt-2 w-full border rounded p-2" placeholder="Emergency contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="mt-2 w-full border rounded p-2" placeholder="Preferred hotline" value={hotline} onChange={(e) => setHotline(e.target.value)} />
        <button className="btn mt-3" onClick={finish}>Finish</button>
      </div>
    </section>
  );
}
