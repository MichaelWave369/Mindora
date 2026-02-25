import type { MoodLog } from '@/types';

export function weekdayAverages(logs: MoodLog[]) {
  const buckets = new Map<number, { sum: number; count: number }>();
  logs.forEach((log) => {
    const day = new Date(log.date).getDay();
    const current = buckets.get(day) ?? { sum: 0, count: 0 };
    current.sum += log.mood;
    current.count += 1;
    buckets.set(day, current);
  });

  return [...buckets.entries()].map(([day, value]) => ({ day, avg: Number((value.sum / value.count).toFixed(2)) }));
}

export function detectMoodInsights(logs: MoodLog[]) {
  const weekdays = weekdayAverages(logs);
  if (!weekdays.length) return [];
  const min = weekdays.reduce((a, b) => (a.avg < b.avg ? a : b));
  const max = weekdays.reduce((a, b) => (a.avg > b.avg ? a : b));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const insights = [`Lowest average mood: ${dayNames[min.day]} (${min.avg}).`, `Highest average mood: ${dayNames[max.day]} (${max.avg}).`];

  const tags = logs.flatMap((l) => l.tags);
  const freq = tags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (top.length) insights.push(`Most common tags: ${top.map(([t, c]) => `${t} (${c})`).join(', ')}.`);
  return insights;
}
