import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';
import { createSaveQueue, decodeState } from './codec';

// Keep the original key: existing installed apps continue to read their own data.
const STORAGE_KEY = '@habit_graduate/v1';

export async function loadState(): Promise<AppState> {
  return decodeState(await AsyncStorage.getItem(STORAGE_KEY));
}

export const saveState = createSaveQueue(value => AsyncStorage.setItem(STORAGE_KEY, value));
export { DEFAULT_STATE } from './codec';
