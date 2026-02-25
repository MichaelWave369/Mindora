export type AiProvider = 'demo' | 'ollama' | 'openai' | 'anthropic' | 'xai';

export interface JournalEntry {
  id?: number;
  createdAt: string;
  title?: string;
  text: string;
  mood: number;
  tags: string[];
  reflection?: string;
  providerUsed?: AiProvider;
  piiRedacted?: boolean;
  attachments?: string[];
}

export interface MoodLog {
  id?: number;
  date: string;
  mood: number;
  tags: string[];
}

export interface BreathingLog {
  id?: number;
  timestamp: string;
  exerciseId: 'box' | '478' | 'coherent';
  duration: number;
}

export interface ResourceItem {
  id?: number;
  type: 'hotline' | 'url' | 'note';
  label: string;
  value: string;
  notes?: string;
}

export interface PdfAsset {
  id?: number;
  filename: string;
  mime: string;
  blob: Blob;
  createdAt: string;
}

export interface AppSettings {
  id: 'singleton';
  provider: AiProvider;
  model: string;
  ollamaBaseUrl: string;
  allowAiReflections: boolean;
  stripPiiBeforeAi: boolean;
  enableAnonymousShare: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
