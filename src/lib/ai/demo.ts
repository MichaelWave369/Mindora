export function demoReflection(text: string, mode: 'Gentle' | 'Direct' | 'Ritual') {
  const snippet = text.slice(0, 200);
  return `Warm opening:\nThank you for sharing this. Your honesty matters.\n\nWhat I'm hearing:\n- You are carrying a lot right now.\n- ${mode} mode means you want a ${mode.toLowerCase()} tone.\n- You described: "${snippet}"\n\nGentle reflection questions:\n- What emotion feels loudest right now?\n- What felt slightly better today, even briefly?\n- What support would make tonight safer or calmer?\n\nTiny next step:\n- Drink water and take three slow breaths.\n- Write one sentence of self-kindness.\n\nGrounding exercise suggestion:\n- Try Box breathing 4-4-4-4 for 2 minutes.\n\nReminder:\nNot medical advice. Not a substitute for a licensed professional.`;
}
