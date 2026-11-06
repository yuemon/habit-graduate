import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, Completion, Habit, MAX_ACTIVE_HABITS } from '../types';
import { DEFAULT_STATE, loadState, saveState } from '../storage/persistence';
import { addHabitToState, graduateHabitInState, toggleHabitToday } from '../domain/habits';
import { useLocalDay } from '../utils/useLocalDay';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface HabitContextValue {
  ready: boolean;
  storageError: string | null;
  retryStorage: () => void;
  today: string;
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
  const [storageError, setStorageError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const latest = useRef(state);
  const hydrated = useRef(false);
  const today = useLocalDay();
  // Advance the state ref synchronously: two submissions in one render cannot
  // both pass the fifth-slot check using a stale captured count.
  const commit = useCallback((next: AppState) => {
    latest.current = next;
    setState(next);
  }, []);
  const retryStorage = useCallback(() => setRetry(n => n + 1), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (hydrated.current) return;
      try {
        const loaded = await loadState();
        if (mounted) {
          commit(loaded);
          hydrated.current = true;
          setStorageError(null);
          setReady(true);
        }
      } catch {
        if (mounted) setStorageError('Stored habits could not be loaded. Your saved data has not been replaced. Please retry.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [retry, commit]);

  useEffect(() => {
    if (!ready) return;
    let current = true;
    saveState(state).then(() => {
      if (current) setStorageError(null);
    }).catch(() => {
      if (current) setStorageError('Changes could not be saved. Keep this app open and retry to avoid losing recent changes.');
    });
    return () => { current = false; };
  }, [state, ready, retry]);

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
    if (hydrated.current) commit({ ...latest.current, onboardingComplete: true });
  }, [commit]);

  const addHabit = useCallback(
    (input: { name: string; tinyVersion?: string; anchorCue: string }) => {
      if (!hydrated.current) return { ok: false as const, reason: 'Please wait for your habits to load.' };
      const result = addHabitToState(latest.current, input, makeId('habit'));
      if (result.ok) commit(result.state);
      return result;
    }, [commit],
  );

  const toggleToday = useCallback((habitId: string) => {
    if (hydrated.current) commit(toggleHabitToday(latest.current, habitId, makeId('comp')));
  }, [commit]);

  const graduateHabit = useCallback((habitId: string, note?: string) => {
    if (hydrated.current) commit(graduateHabitInState(latest.current, habitId, note));
  }, [commit]);

  const getHabit = useCallback(
    (id: string) => state.habits.find((h) => h.id === id),
    [state.habits],
  );

  const value: HabitContextValue = {
    ready,
    storageError,
    retryStorage,
    today,
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
