import { AppState, Habit, MAX_ACTIVE_HABITS } from '../types';
import { toDateKey } from '../utils/dates';
import { dayInHabitRange, isCompletedOn } from '../utils/consistency';

export interface HabitInput { name: string; anchorCue: string; tinyVersion?: string }
export type AddResult = { ok: true; state: AppState; habit: Habit } | { ok: false; reason: string };

/** Validate at the state boundary, not just the form. Call against the latest state. */
export function addHabitToState(state: AppState, input: HabitInput, id: string, now = new Date()): AddResult {
  const name = input.name.trim();
  const anchorCue = input.anchorCue.trim();
  if (!name) return { ok: false, reason: 'Name is required.' };
  if (!anchorCue) return { ok: false, reason: 'An anchor cue is required.' };
  if (state.habits.filter(h => h.status === 'active').length >= MAX_ACTIVE_HABITS) {
    return { ok: false, reason: 'You already have 5 active habits. Graduate one to free a slot.' };
  }
  if (state.habits.some(h => h.id === id)) return { ok: false, reason: 'Please try creating the habit again.' };
  const habit: Habit = {
    id, name, anchorCue, tinyVersion: input.tinyVersion?.trim() || null,
    createdAt: now.toISOString(), startedOn: toDateKey(now), status: 'active',
    graduatedAt: null, graduationNote: null,
  };
  return { ok: true, habit, state: { ...state, habits: [...state.habits, habit] } };
}

export function toggleHabitToday(state: AppState, habitId: string, completionId: string, now = new Date()): AppState {
  const habit = state.habits.find(h => h.id === habitId);
  const date = toDateKey(now);
  if (!habit || habit.status !== 'active' || !dayInHabitRange(habit, date, now)) return state;
  const existing = state.completions.find(c => c.habitId === habitId && c.date === date);
  const completed = !isCompletedOn(habitId, date, state.completions);
  // A legacy duplicate is interpreted as one day; toggling canonicalizes only that day.
  const completions = state.completions.filter(c => c.habitId !== habitId || c.date !== date);
  completions.push({ id: existing?.id ?? completionId, habitId, date, completed });
  return { ...state, completions };
}

export function graduateHabitInState(state: AppState, habitId: string, note?: string, now = new Date()): AppState {
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit || habit.status !== 'active') return state;
  return { ...state, habits: state.habits.map(h => h.id === habitId ? {
    ...h, status: 'graduated', graduatedAt: now.toISOString(), graduatedOn: toDateKey(now),
    graduationNote: note?.trim() || null,
  } : h) };
}
