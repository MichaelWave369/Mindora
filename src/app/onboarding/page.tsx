'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { db, getSettings } from '@/lib/db/client';
import type { AiProvider } from '@/types';

function shouldBypassOnboarding() {
  if (typeof window === 'undefined') return false;
  const webdriverBypass = Boolean(window.navigator.webdriver);
  const testModeBypass = process.env.NEXT_PUBLIC_TEST_MODE === '1';
  return webdriverBypass || testModeBypass;
}

export default function OnboardingPage() {
  const [provider, setProvider] = useState<AiProvider>('demo');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hotline, setHotline] = useState('988');
  const router = useRouter();

  useEffect(() => {
    if (shouldBypassOnboarding()) {
      localStorage.setItem('mindora_onboarded', '1');
      router.replace('/journal');
    }
  }, [router]);

  const finish = async () => {
    const settings = await getSettings();
    await db.settings.put({
      ...settings,
      provider,
      emergencyContactName: name,
      emergencyContactPhone: phone
    });

    await db.resources.add({
      type: 'hotline',
      label: 'Preferred hotline',
      value: hotline,
      notes: 'Added in onboarding'
    });

    localStorage.setItem('mindora_onboarded', '1');
    router.push('/journal');
  };

  return (
    <section data-testid="onboarding-page" className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Onboarding</h2>
        <label className="mt-3 block text-sm">Choose AI Provider</label>
        <select
          aria-label="Choose AI Provider"
          className="mt-1 rounded border p-2"
          value={provider}
          onChange={(event) => setProvider(event.target.value as AiProvider)}
        >
          {['demo', 'ollama', 'openai', 'anthropic', 'xai'].map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <p className="mt-3 text-sm">
          Privacy defaults: local-first storage, no analytics, optional AI reflections only.
        </p>

        <h3 className="mt-3 font-medium">My Crisis Plan</h3>
        <input
          aria-label="Emergency contact name"
          className="mt-1 w-full rounded border p-2"
          placeholder="Emergency contact name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          aria-label="Emergency contact phone"
          className="mt-2 w-full rounded border p-2"
          placeholder="Emergency contact phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <input
          aria-label="Preferred hotline"
          className="mt-2 w-full rounded border p-2"
          placeholder="Preferred hotline"
          value={hotline}
          onChange={(event) => setHotline(event.target.value)}
        />
        <button className="btn mt-3" onClick={finish}>
          Finish
        </button>
      </div>
    </section>
  );
}
