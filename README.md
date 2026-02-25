# Mindora

**Tagline:** Your private pocket therapist & journal.

**Core promise:** Everything you need to feel better stays on your computer.

## Privacy promise
- Local-first storage via IndexedDB (Dexie)
- No telemetry, no analytics, no automatic cloud upload
- Optional AI reflection providers can be enabled in settings
- PII redaction runs before cloud providers

## Safety disclaimer
Mindora is not medical advice and is not a substitute for a licensed professional.
If you're in danger, call local emergency services immediately.

## Features
- Journal with mood + tags + optional reflection
- Mood patterns (deterministic)
- Breathing exercises with local stats
- Crisis resources manager + local PDF library
- Wellness Packet export (JSON/Markdown/print)
- Local backup/restore with optional PBKDF2 + AES-GCM encryption

## AI providers
- Default: Demo mode and Ollama
- Optional: OpenAI / Anthropic / xAI (configure environment keys)
- Provider status endpoint: `/api/providers/status`

## Run
```bash
pnpm install
pnpm dev
```

## Test
```bash
pnpm test
pnpm test:e2e
```

## Notes
- Demo mode works offline
- No keys are committed
