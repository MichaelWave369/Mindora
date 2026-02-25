export interface RedactOptions {
  knownName?: string;
}

export function redactPII(input: string, options: RedactOptions = {}) {
  let redacted = input;
  redacted = redacted.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]');
  redacted = redacted.replace(/(?:\+?\d{1,2}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g, '[REDACTED_PHONE]');
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  redacted = redacted.replace(/\b\d{1,6}\s+[A-Za-z0-9.\s]+\s(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Blvd|Boulevard)\b/gi, '[REDACTED_ADDRESS]');

  if (options.knownName) {
    const escaped = options.knownName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    redacted = redacted.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '[REDACTED_NAME]');
  }

  return redacted;
}
