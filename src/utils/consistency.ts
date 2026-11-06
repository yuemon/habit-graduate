import { Habit, Completion } from '../types';
import { dateFromStored, daysTracked, toDateKey } from './dates';

export function habitStartKey(habit: Habit): string {
  return habit.startedOn ?? toDateKey(dateFromStored(habit.createdAt));
}

export function habitEndDate(habit: Habit, now = new Date()): Date {
  return habit.status === 'graduated' && habit.graduatedAt
    ? dateFromStored(habit.graduatedOn ?? habit.graduatedAt) : now;
}

export function getCompletedCount(habitId: string, completions: Completion[]): number {
  return new Set(completions.filter(c => c.habitId === habitId && c.completed).map(c => c.date)).size;
}

/** Lifetime consistency. One unique completion per tracked local calendar day. */
export function getConsistency(habit: Habit, completions: Completion[], now = new Date()) {
  const end = habitEndDate(habit, now);
  const tracked = daysTracked(habitStartKey(habit), end);
  const completed = getCompletedCount(habit.id, completions.filter(c => dayInHabitRange(habit, c.date, now)));
  const percent = Math.min(100, Math.round((completed / tracked) * 100));
  return { percent, completed, tracked };
}

export function isCompletedOn(habitId: string, dateKey: string, completions: Completion[]): boolean {
  return completions.some(c => c.habitId === habitId && c.date === dateKey && c.completed);
}

export function dayInHabitRange(habit: Habit, dateKey: string, now = new Date()): boolean {
  const endKey = toDateKey(habitEndDate(habit, now));
  return dateKey >= habitStartKey(habit) && dateKey <= endKey && dateKey <= toDateKey(now);
}
