import { describe, it, expect } from 'vitest';
import { detectCrisis } from '@/lib/safety/crisis';

describe('crisis detection', () => {
  it('detects harmful intent keywords', () => {
    const out = detectCrisis('I want to kill myself tonight');
    expect(out.isCrisis).toBe(true);
  });
});
