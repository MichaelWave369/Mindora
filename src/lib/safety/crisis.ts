const CRISIS_TERMS = [
  'kill myself',
  'suicide',
  'end my life',
  'hurt myself',
  'self harm',
  'overdose',
  'not worth living'
];

export function detectCrisis(text: string) {
  const normalized = text.toLowerCase();
  const matched = CRISIS_TERMS.filter((term) => normalized.includes(term));
  return {
    isCrisis: matched.length > 0,
    matched
  };
}

export function crisisMessage() {
  return `I'm really glad you reached out. I can't provide crisis counseling, but you deserve immediate support right now. If you're in danger, call local emergency services now. You can also open Mindora Resources for hotlines and trusted contacts. Not medical advice.`;
}
