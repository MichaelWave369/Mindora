import { describe, it, expect } from 'vitest';
import { redactPII } from '@/lib/privacy/redact';

describe('redactPII', () => {
  it('redacts email phone ssn address and name', () => {
    const input = 'Email me a@b.com or call 555-444-3333. SSN 123-45-6789. I live at 12 Main Street. I am Sam.';
    const out = redactPII(input, { knownName: 'Sam' });
    expect(out).toContain('[REDACTED_EMAIL]');
    expect(out).toContain('[REDACTED_PHONE]');
    expect(out).toContain('[REDACTED_SSN]');
    expect(out).toContain('[REDACTED_ADDRESS]');
    expect(out).toContain('[REDACTED_NAME]');
  });
});
