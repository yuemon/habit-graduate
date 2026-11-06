import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHabits } from '../context/HabitContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AddHabitScreen } from '../screens/AddHabitScreen';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.borderSoft,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  const { ready, onboardingComplete, storageError, retryStorage } = useHabits();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {storageError ? <View style={{ padding: 24, gap: 16 }}>
          <Text accessibilityRole="alert" style={{ color: colors.text }}>{storageError}</Text>
          <PrimaryButton label="Retry loading" onPress={retryStorage} />
        </View> : <ActivityIndicator color={colors.accent} />}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {storageError ? <View style={{ backgroundColor: colors.surface, padding: 12 }}>
        <Text accessibilityRole="alert" style={{ color: colors.text }}>{storageError}</Text>
        <PrimaryButton label="Retry saving" onPress={retryStorage} />
      </View> : null}
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!onboardingComplete ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddHabit"
              component={AddHabitScreen}
              options={{ title: 'Add habit', presentation: 'modal' }}
            />
            <Stack.Screen
              name="HabitDetail"
              component={HabitDetailScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}
