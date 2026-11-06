import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <HabitProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </HabitProvider>
    </SafeAreaProvider>
  );
}
