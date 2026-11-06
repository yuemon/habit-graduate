import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TodayScreen } from '../screens/TodayScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import {
  CalendarIcon,
  LeafSproutIcon,
  PlusCircleIcon,
} from '../components/icons/Icons';
import { colors } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from './types';
import { useHabits } from '../context/HabitContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

function AddTabPlaceholder() {
  return null;
}

function TabIcon({
  focused,
  label,
  icon,
}: {
  focused: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={styles.tabItem}>
      {icon}
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? colors.accent : colors.textMuted },
        ]}
      >
        {label}
      </Text>
      {focused ? <View style={styles.underline} /> : <View style={styles.underlineSpacer} />}
    </View>
  );
}

export function MainTabs() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { canAddHabit } = useHabits();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 8,
          paddingBottom: 8,
          height: 72,
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              label="Today"
              icon={
                <CalendarIcon
                  size={22}
                  color={focused ? colors.accent : color || colors.textMuted}
                />
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          tabBarAccessibilityLabel: 'Established',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              label="Established"
              icon={
                <LeafSproutIcon
                  size={22}
                  color={focused ? colors.accent : color || colors.textMuted}
                />
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTabPlaceholder}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // At capacity, open the explanatory disabled form instead of a dead tab.
            navigation.navigate('AddHabit');
          },
        }}
        options={{
          tabBarAccessibilityLabel: canAddHabit
            ? 'Add habit'
            : 'All 5 slots in use',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={false}
              label="Add"
              icon={
                <PlusCircleIcon
                  size={22}
                  color={
                    canAddHabit
                      ? focused
                        ? colors.accent
                        : color || colors.textMuted
                      : colors.textMuted
                  }
                />
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  underline: {
    marginTop: 3,
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.accent,
  },
  underlineSpacer: {
    marginTop: 3,
    height: 2,
  },
});
