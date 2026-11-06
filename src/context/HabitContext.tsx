import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState, Completion, Habit, MAX_ACTIVE_HABITS } from '../types';
import { DEFAULT_STATE, loadState, saveState } from '../storage/persistence';
import { toDateKey } from '../utils/dates';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface HabitContextValue {
  ready: boolean;
  habits: Habit[];
  completions: Completion[];
  onboardingComplete: boolean;
  activeHabits: Habit[];
  graduatedHabits: Habit[];
  activeCount: number;
  canAddHabit: boolean;
  completeOnboarding: () => void;
  addHabit: (input: {
    name: string;
    tinyVersion?: string;
    anchorCue: string;
  }) => { ok: true; habit: Habit } | { ok: false; reason: string };
  toggleToday: (habitId: string) => void;
  graduateHabit: (habitId: string, note?: string) => void;
  getHabit: (id: string) => Habit | undefined;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = await loadState();
      if (mounted) {
        setState(loaded);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state).catch(() => {});
  }, [state, ready]);

  const activeHabits = useMemo(
    () =>
      state.habits
        .filter((h) => h.status === 'active')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [state.habits],
  );

  const graduatedHabits = useMemo(
    () =>
      state.habits
        .filter((h) => h.status === 'graduated')
        .sort((a, b) => (b.graduatedAt ?? '').localeCompare(a.graduatedAt ?? '')),
    [state.habits],
  );

  const activeCount = activeHabits.length;
  const canAddHabit = activeCount < MAX_ACTIVE_HABITS;

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, onboardingComplete: true }));
  }, []);

  const addHabit = useCallback(
    (input: { name: string; tinyVersion?: string; anchorCue: string }) => {
      const name = input.name.trim();
      if (!name) return { ok: false as const, reason: 'Name is required.' };
      if (activeCount >= MAX_ACTIVE_HABITS) {
        return {
          ok: false as const,
          reason: 'You already have 5 active habits. Graduate one to free a slot.',
        };
      }
      const habit: Habit = {
        id: makeId('habit'),
        name,
        tinyVersion: input.tinyVersion?.trim() || null,
        anchorCue: input.anchorCue.trim(),
        createdAt: new Date().toISOString(),
        status: 'active',
        graduatedAt: null,
        graduationNote: null,
      };
      setState((s) => ({ ...s, habits: [...s.habits, habit] }));
      return { ok: true as const, habit };
    },
    [activeCount],
  );

  const toggleToday = useCallback((habitId: string) => {
    const today = toDateKey();
    setState((s) => {
      const habit = s.habits.find((h) => h.id === habitId);
      if (!habit || habit.status !== 'active') return s;

      const existing = s.completions.find(
        (c) => c.habitId === habitId && c.date === today,
      );
      let completions: Completion[];
      if (existing) {
        completions = s.completions.map((c) =>
          c.id === existing.id ? { ...c, completed: !c.completed } : c,
        );
      } else {
        completions = [
          ...s.completions,
          {
            id: makeId('comp'),
            habitId,
            date: today,
            completed: true,
          },
        ];
      }
      return { ...s, completions };
    });
  }, []);

  const graduateHabit = useCallback((habitId: string, note?: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.id === habitId && h.status === 'active'
          ? {
              ...h,
              status: 'graduated' as const,
              graduatedAt: new Date().toISOString(),
              graduationNote: note?.trim() || null,
            }
          : h,
      ),
    }));
  }, []);

  const getHabit = useCallback(
    (id: string) => state.habits.find((h) => h.id === id),
    [state.habits],
  );

  const value: HabitContextValue = {
    ready,
    habits: state.habits,
    completions: state.completions,
    onboardingComplete: state.onboardingComplete,
    activeHabits,
    graduatedHabits,
    activeCount,
    canAddHabit,
    completeOnboarding,
    addHabit,
    toggleToday,
    graduateHabit,
    getHabit,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
