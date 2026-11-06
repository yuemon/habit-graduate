import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { toDateKey } from './dates';

/** Refresh views on local midnight and after resuming a suspended native app. */
export function useLocalDay(): string {
  const [day, setDay] = useState(toDateKey());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      setDay(toDateKey());
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 50);
    };
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, []);
  return day;
}
