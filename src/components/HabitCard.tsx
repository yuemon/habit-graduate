import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { CircularCheckbox } from './CircularCheckbox';
import { useHabits } from '../context/HabitContext';
import { getConsistency, isCompletedOn } from '../utils/consistency';
import { toDateKey } from '../utils/dates';

interface Props {
  habit: Habit;
  onPress: () => void;
}

export function HabitCard({ habit, onPress }: Props) {
  const { completions, toggleToday } = useHabits();
  const today = toDateKey();
  const doneToday = isCompletedOn(habit.id, today, completions);
  const { percent } = getConsistency(habit, completions);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        doneToday && styles.cardDone,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${percent} percent consistency`}
    >
      <View style={styles.row}>
        <CircularCheckbox
          checked={doneToday}
          onPress={() => toggleToday(habit.id)}
          accessibilityLabel={`Mark ${habit.name} complete for today`}
        />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {habit.name}
          </Text>
          {habit.anchorCue ? (
            <Text style={styles.cue} numberOfLines={1}>
              After I {habit.anchorCue}
            </Text>
          ) : null}
        </View>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 12,
  },
  cardDone: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  cue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percent: {
    ...typography.bodyMedium,
    color: colors.accent,
    minWidth: 48,
    textAlign: 'right',
  },
});
