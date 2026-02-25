import { describe, it, expect } from 'vitest';
import { detectMoodInsights } from '@/lib/analytics/patterns';

const logs = [
  { date: '2024-08-05', mood: 2, tags: ['tired'] },
  { date: '2024-08-06', mood: 6, tags: ['calm'] },
  { date: '2024-08-12', mood: 3, tags: ['tired'] },
  { date: '2024-08-13', mood: 8, tags: ['calm'] }
] as any;

describe('mood insights', () => {
  it('returns weekday + tag insights', () => {
    const out = detectMoodInsights(logs);
    expect(out.join(' ')).toContain('Lowest average mood');
    expect(out.join(' ')).toContain('Most common tags');
  });
});
