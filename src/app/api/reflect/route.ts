import { NextRequest, NextResponse } from 'next/server';
import { detectCrisis, crisisMessage } from '@/lib/safety/crisis';
import { reflectWithProvider } from '@/lib/ai/providers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const crisis = detectCrisis(body.text || '');
  if (crisis.isCrisis) {
    return NextResponse.json({ type: 'crisis_response', message: crisisMessage(), matched: crisis.matched });
  }

  const reflection = await reflectWithProvider({
    provider: body.provider || 'demo',
    text: body.text,
    mode: body.mode || 'Gentle',
    model: body.model,
    ollamaBaseUrl: body.ollamaBaseUrl
  });

  return NextResponse.json({ type: 'reflection', reflection });
}
