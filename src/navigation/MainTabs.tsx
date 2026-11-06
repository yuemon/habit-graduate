import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TodayScreen } from '../screens/TodayScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { colors } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from './types';
import { useHabits } from '../context/HabitContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

function AddTabPlaceholder() {
  return null;
}

export function MainTabs() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { canAddHabit } = useHabits();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          paddingTop: 4,
          height: 64,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>○</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>◇</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTabPlaceholder}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (canAddHabit) {
              navigation.navigate('AddHabit');
            }
          },
        }}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => (
            <Text style={{ color: canAddHabit ? color : colors.textMuted, fontSize: 22 }}>
              +
            </Text>
          ),
          tabBarAccessibilityLabel: canAddHabit
            ? 'Add habit'
            : 'All 5 slots in use',
        }}
      />
    </Tab.Navigator>
  );
}
