'use client';

import Dexie, { type Table } from 'dexie';
import type { AppSettings, BreathingLog, JournalEntry, MoodLog, PdfAsset, ResourceItem } from '@/types';

export class MindoraDB extends Dexie {
  journalEntries!: Table<JournalEntry, number>;
  moodLogs!: Table<MoodLog, number>;
  breathingLogs!: Table<BreathingLog, number>;
  resources!: Table<ResourceItem, number>;
  pdfLibrary!: Table<PdfAsset, number>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('mindoraDB');
    this.version(1).stores({
      journalEntries: '++id, createdAt, mood, *tags',
      moodLogs: '++id, date, mood, *tags',
      breathingLogs: '++id, timestamp, exerciseId',
      resources: '++id, type, label',
      pdfLibrary: '++id, filename, createdAt',
      settings: 'id'
    });

    this.version(2)
      .stores({
        journalEntries: '++id, createdAt, mood, *tags, providerUsed',
        moodLogs: '++id, date, mood, *tags',
        breathingLogs: '++id, timestamp, exerciseId',
        resources: '++id, type, label',
        pdfLibrary: '++id, filename, createdAt',
        settings: 'id'
      })
      .upgrade((tx) => tx.table('settings').toCollection().modify((s: any) => {
        if (s.stripPiiBeforeAi === undefined) s.stripPiiBeforeAi = true;
      }));
  }
}

export const db = new MindoraDB();

export const defaultSettings: AppSettings = {
  id: 'singleton',
  provider: 'demo',
  model: 'demo-reflector-v1',
  ollamaBaseUrl: 'http://127.0.0.1:11434',
  allowAiReflections: true,
  stripPiiBeforeAi: true,
  enableAnonymousShare: false
};

export async function getSettings() {
  const settings = await db.settings.get('singleton');
  if (!settings) {
    await db.settings.put(defaultSettings);
    return defaultSettings;
  }
  return settings;
}
