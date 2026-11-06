import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { CircularCheckbox } from './CircularCheckbox';
import { AnchorIcon } from './icons/Icons';
import { useHabits } from '../context/HabitContext';
import { getConsistency, habitStartKey, isCompletedOn } from '../utils/consistency';
import { formatStartedDate } from '../utils/dates';

interface Props {
  habit: Habit;
  onPress: () => void;
}

export function HabitCard({ habit, onPress }: Props) {
  const { completions, toggleToday, today } = useHabits();
  const doneToday = isCompletedOn(habit.id, today, completions);
  const { percent, tracked: totalDays } = getConsistency(habit, completions);
  const startedLabel = formatStartedDate(habitStartKey(habit));
  const anchorLabel = habit.anchorCue
    ? habit.anchorCue.toLowerCase().startsWith('after')
      ? habit.anchorCue
      : `After I ${habit.anchorCue}`
    : null;

  const dayWord = totalDays === 1 ? 'day' : 'days';
  const metaLine = `Consistency: ${percent}% · Started ${startedLabel} · ${totalDays} ${dayWord}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${percent} percent consistency, started ${startedLabel}, ${totalDays} ${dayWord}`}
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
          {habit.tinyVersion?.trim() ? (
            <Text style={styles.tiny} numberOfLines={2}>Tiny version: {habit.tinyVersion}</Text>
          ) : null}
          <Text style={styles.meta} numberOfLines={2}>
            {metaLine}
          </Text>
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
  tiny: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 3,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
});
