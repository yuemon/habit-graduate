import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Habit, Completion } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { lastNDays } from '../utils/dates';
import { dayInHabitRange, isCompletedOn } from '../utils/consistency';

interface Props {
  habit: Habit;
  completions: Completion[];
  days?: number;
}

export function DayGrid({ habit, completions, days = 30 }: Props) {
  const keys = lastNDays(days);

  return (
    <View>
      <Text style={styles.label}>Last {days} days</Text>
      <View style={styles.grid}>
        {keys.map((key) => {
          const inRange = dayInHabitRange(habit, key);
          const done = inRange && isCompletedOn(habit.id, key, completions);
          return (
            <View
              key={key}
              style={[
                styles.dot,
                done && styles.dotFilled,
                !inRange && styles.dotOutOfRange,
                inRange && !done && styles.dotEmpty,
              ]}
              accessibilityLabel={`${key}${done ? ' completed' : inRange ? ' not completed' : ' before habit started'}`}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotFilled: {
    backgroundColor: colors.accent,
  },
  dotEmpty: {
    backgroundColor: colors.border,
  },
  dotOutOfRange: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.4,
  },
});
