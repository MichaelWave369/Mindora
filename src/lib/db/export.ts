'use client';

import { db } from './client';

export async function exportAllData() {
  return {
    journalEntries: await db.journalEntries.toArray(),
    moodLogs: await db.moodLogs.toArray(),
    breathingLogs: await db.breathingLogs.toArray(),
    resources: await db.resources.toArray(),
    pdfLibrary: await db.pdfLibrary.toArray(),
    settings: await db.settings.toArray()
  };
}

export async function importAllData(payload: any) {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    if (payload.journalEntries?.length) await db.journalEntries.bulkAdd(payload.journalEntries);
    if (payload.moodLogs?.length) await db.moodLogs.bulkAdd(payload.moodLogs);
    if (payload.breathingLogs?.length) await db.breathingLogs.bulkAdd(payload.breathingLogs);
    if (payload.resources?.length) await db.resources.bulkAdd(payload.resources);
    if (payload.pdfLibrary?.length) await db.pdfLibrary.bulkAdd(payload.pdfLibrary);
    if (payload.settings?.length) await db.settings.bulkAdd(payload.settings);
  });
}

export async function wipeAllData() {
  await db.delete();
  location.reload();
}
