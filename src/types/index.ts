export type HabitStatus = 'active' | 'graduated';

export interface Habit {
  id: string;
  name: string;
  tinyVersion: string | null;
  anchorCue: string;
  createdAt: string; // ISO datetime
  status: HabitStatus;
  graduatedAt: string | null; // ISO datetime
  graduationNote: string | null;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface AppState {
  habits: Habit[];
  completions: Completion[];
  onboardingComplete: boolean;
}

export const MAX_ACTIVE_HABITS = 5;
