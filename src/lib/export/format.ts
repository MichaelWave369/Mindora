import type { JournalEntry } from '@/types';

export function entryToMarkdown(entry: JournalEntry) {
  return `# ${entry.title || 'Journal Entry'}\n\n- Date: ${new Date(entry.createdAt).toLocaleString()}\n- Mood: ${entry.mood}/10\n- Tags: ${entry.tags.join(', ')}\n\n## Entry\n${entry.text}\n\n## Reflection\n${entry.reflection || 'N/A'}\n\n> Not medical advice. Not a substitute for a licensed professional.`;
}

export function downloadText(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
