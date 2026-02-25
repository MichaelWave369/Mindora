import { describe, it, expect } from 'vitest';
import { demoReflection } from '@/lib/ai/demo';

describe('demo reflection format', () => {
  it('includes required sections', () => {
    const out = demoReflection('I had a rough day', 'Gentle');
    ['Warm opening', "What I'm hearing", 'Gentle reflection questions', 'Tiny next step', 'Grounding exercise suggestion', 'Reminder'].forEach((s) => expect(out).toContain(s));
  });
});
