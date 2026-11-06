import { AppState } from '../types';

export const DEFAULT_STATE: AppState = { habits: [], completions: [], onboardingComplete: false };

/** Keep v1 fields and records intact. Never replace unreadable storage with empty data. */
export function decodeState(raw: string | null): AppState {
  if (raw === null) return { ...DEFAULT_STATE, habits: [], completions: [] };
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid saved state');
  const habits = parsed.habits ?? [];
  const completions = parsed.completions ?? [];
  if (!Array.isArray(habits) || !Array.isArray(completions)) throw new Error('Invalid saved records');
  if (habits.some(h => !h || typeof h.id !== 'string' || typeof h.name !== 'string' ||
      typeof h.anchorCue !== 'string' || !Number.isFinite(Date.parse(h.createdAt)) ||
      !['active', 'graduated'].includes(h.status) ||
      (h.graduatedAt != null && !Number.isFinite(Date.parse(h.graduatedAt))))) throw new Error('Invalid habit');
  if (completions.some(c => !c || typeof c.id !== 'string' || typeof c.habitId !== 'string' ||
      typeof c.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) ||
      typeof c.completed !== 'boolean')) throw new Error('Invalid completion');
  if (parsed.onboardingComplete != null && typeof parsed.onboardingComplete !== 'boolean') throw new Error('Invalid onboarding');
  return { ...parsed, habits, completions, onboardingComplete: parsed.onboardingComplete ?? false };
}

/** Serialize writes so a slower earlier write cannot overwrite newer state. */
export function createSaveQueue(write: (value: string) => Promise<void>) {
  let pending = Promise.resolve();
  return (state: AppState): Promise<void> => {
    const value = JSON.stringify(state);
    const next = pending.catch(() => {}).then(() => write(value));
    pending = next;
    return next;
  };
}
