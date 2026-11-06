import { Habit, Completion } from '../types';
import { daysTracked, parseDateKey } from './dates';

export function getCompletedCount(
  habitId: string,
  completions: Completion[],
): number {
  return completions.filter((c) => c.habitId === habitId && c.completed).length;
}

export function getConsistency(
  habit: Habit,
  completions: Completion[],
): { percent: number; completed: number; tracked: number } {
  const end =
    habit.status === 'graduated' && habit.graduatedAt
      ? new Date(habit.graduatedAt)
      : new Date();
  const tracked = daysTracked(habit.createdAt, end);
  const completed = getCompletedCount(habit.id, completions);
  const percent = Math.min(100, Math.round((completed / tracked) * 100));
  return { percent, completed, tracked };
}

export function isCompletedOn(
  habitId: string,
  dateKey: string,
  completions: Completion[],
): boolean {
  return completions.some(
    (c) => c.habitId === habitId && c.date === dateKey && c.completed,
  );
}

export function dayInHabitRange(habit: Habit, dateKey: string): boolean {
  const day = parseDateKey(dateKey);
  const created = new Date(habit.createdAt);
  const createdDay = new Date(
    created.getFullYear(),
    created.getMonth(),
    created.getDate(),
  );
  if (day < createdDay) return false;
  if (habit.graduatedAt) {
    const g = new Date(habit.graduatedAt);
    const gDay = new Date(g.getFullYear(), g.getMonth(), g.getDate());
    if (day > gDay) return false;
  }
  return true;
}
