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
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { useHabits } from '../context/HabitContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { MAX_ACTIVE_HABITS } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function TodayScreen() {
  const { activeHabits, activeCount, canAddHabit } = useHabits();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.motto}>Build it. Master it. Move on.</Text>
        </View>
        <Text style={styles.slots}>
          {activeCount} of {MAX_ACTIVE_HABITS} slots
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
          ListFooterComponent={
            <View style={styles.footer}>
              <PrimaryButton
                label={canAddHabit ? 'Add habit' : 'All 5 slots in use'}
                onPress={() => navigation.navigate('AddHabit')}
                disabled={!canAddHabit}
                variant={canAddHabit ? 'secondary' : 'ghost'}
              />
            </View>
          }
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
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  motto: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  slots: {
    ...typography.caption,
    color: colors.accent,
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  footer: {
    marginTop: 8,
  },
});
