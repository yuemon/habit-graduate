/** Local calendar date as YYYY-MM-DD */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Inclusive day count from start (ISO or YYYY-MM-DD) to endDate (Date or key). */
export function daysTracked(createdAt: string, end: Date = new Date()): number {
  const start = new Date(createdAt);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diff = Math.floor((endDay.getTime() - startDay.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export function formatDisplayDate(isoOrKey: string): string {
  const d = isoOrKey.includes('T') ? new Date(isoOrKey) : parseDateKey(isoOrKey);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Compact started date for habit cards, e.g. "May 1" (year if not current). */
export function formatStartedDate(isoOrKey: string, now: Date = new Date()): string {
  const d = isoOrKey.includes('T') ? new Date(isoOrKey) : parseDateKey(isoOrKey);
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** e.g. "May 21, 2025 • Wednesday" */
export function formatTodayHeader(date: Date = new Date()): string {
  const left = date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  return `${left} • ${weekday}`;
}

/** e.g. "Apr 21 – May 20, 2024" */
export function formatShortRange(startKey: string, endKey: string): string {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  const sameYear = start.getFullYear() === end.getFullYear();
  const left = start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const right = end.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${left} – ${right}`;
}

/** Last N calendar days ending today, oldest → newest */
export function lastNDays(n: number, end: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys;
}
