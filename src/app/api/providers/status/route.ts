import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    xaiConfigured: Boolean(process.env.XAI_API_KEY),
    ollamaConfigured: true
  });
}
