import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AppBrandHeader } from '../components/AppBrandHeader';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { useHabits } from '../context/HabitContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatTodayHeader } from '../utils/dates';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function TodayScreen() {
  const { activeHabits, canAddHabit } = useHabits();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <AppBrandHeader />
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>{formatTodayHeader()}</Text>
        <Text style={styles.slots}>
          {activeHabits.length} of 5 slots used{!canAddHabit ? ' · Graduate a habit to make room' : ''}
        </Text>
      </View>

      {activeHabits.length === 0 ? (
        <EmptyState
          title="No active habits yet"
          subtitle="Add up to five habits. Keep them tiny, anchor them to a cue, and graduate when they stick."
        >
          <PrimaryButton
            label="Add habit"
            onPress={() => navigation.navigate('AddHabit')}
            disabled={!canAddHabit}
          />
        </EmptyState>
      ) : (
        <FlatList
          data={activeHabits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onPress={() =>
                navigation.navigate('HabitDetail', { habitId: item.id })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 24,
    lineHeight: 30,
    color: colors.text,
  },
  slots: {
    ...typography.caption,
    color: colors.accent,
    textAlign: 'center',
    marginTop: 7,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
});
