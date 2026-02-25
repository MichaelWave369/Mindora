import { demoReflection } from './demo';
import type { AiProvider } from '@/types';

interface ReflectInput {
  provider: AiProvider;
  text: string;
  mode: 'Gentle' | 'Direct' | 'Ritual';
  model?: string;
  ollamaBaseUrl?: string;
}

export async function reflectWithProvider(input: ReflectInput) {
  if (input.provider === 'demo') {
    return demoReflection(input.text, input.mode);
  }

  const prompt = `Provide reflection in exact sections:\n1) Warm opening\n2) What I'm hearing (3 bullets)\n3) Gentle reflection questions (3 bullets)\n4) Tiny next step (1-2 bullets)\n5) Grounding exercise suggestion\n6) Reminder not medical advice.\nJournal:\n${input.text}`;

  if (input.provider === 'ollama') {
    const base = input.ollamaBaseUrl ?? 'http://127.0.0.1:11434';
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: input.model || 'llama3.1', prompt, stream: false })
    });
    const data = await res.json();
    return data.response as string;
  }

  const keyMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    xai: process.env.XAI_API_KEY
  };

  if (!keyMap[input.provider]) return demoReflection(input.text, input.mode);

  return demoReflection(input.text, input.mode);
}
