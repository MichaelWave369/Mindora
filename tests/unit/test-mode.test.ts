import { afterEach, describe, expect, it } from 'vitest';

import { reflectWithProvider } from '@/lib/ai/providers';

describe('test mode reflection behavior', () => {
  afterEach(() => {
    delete process.env.TEST_MODE;
    delete process.env.NEXT_PUBLIC_TEST_MODE;
  });

  it('forces deterministic demo reflection when TEST_MODE=1', async () => {
    process.env.TEST_MODE = '1';

    const output = await reflectWithProvider({
      provider: 'ollama',
      mode: 'Gentle',
      text: 'hello world',
      model: 'any'
    });

    expect(output).toContain('Warm opening');
    expect(output).toContain('Grounding exercise suggestion');
  });
});
