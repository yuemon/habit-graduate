import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { CircularCheckbox } from './CircularCheckbox';
import { AnchorIcon } from './icons/Icons';
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
  const anchorLabel = habit.anchorCue
    ? habit.anchorCue.toLowerCase().startsWith('after')
      ? habit.anchorCue
      : `After I ${habit.anchorCue}`
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${percent} percent consistency`}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {habit.name}
          </Text>
          {anchorLabel ? (
            <View style={styles.anchorRow}>
              <AnchorIcon size={11} color={colors.accent} />
              <Text style={styles.cue} numberOfLines={1}>
                Anchor: {anchorLabel}
              </Text>
            </View>
          ) : null}
          <Text style={styles.percent}>Consistency: {percent}%</Text>
        </View>
        <CircularCheckbox
          checked={doneToday}
          onPress={() => toggleToday(habit.id)}
          size={40}
          accessibilityLabel={`Mark ${habit.name} complete for today`}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.88,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  name: {
    ...typography.habitName,
    color: colors.text,
  },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  cue: {
    ...typography.caption,
    color: colors.accent,
    flexShrink: 1,
  },
  percent: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
