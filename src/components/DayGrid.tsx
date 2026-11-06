import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Habit, Completion } from '../types';
import { useHabits } from '../context/HabitContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { lastNDays, parseDateKey, formatShortRange } from '../utils/dates';
import { dayInHabitRange, habitEndDate, isCompletedOn } from '../utils/consistency';

interface Props {
  habit: Habit;
  completions: Completion[];
  days?: number;
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Align last-N-days into Mon–Sun calendar weeks (pad leading empty cells). */
function buildCalendarCells(keys: string[]) {
  if (keys.length === 0) return [];
  const first = parseDateKey(keys[0]);
  // JS: 0=Sun … 6=Sat → Monday-first index 0..6
  const mondayIndex = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = Array(mondayIndex).fill(null);
  keys.forEach((k) => cells.push(k));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DayGrid({ habit, completions, days = 30 }: Props) {
  const { today } = useHabits();
  const keys = useMemo(() => lastNDays(days, habitEndDate(habit, parseDateKey(today))), [days, habit, today]);
  const cells = useMemo(() => buildCalendarCells(keys), [keys]);
  const rangeLabel =
    keys.length > 0 ? formatShortRange(keys[0], keys[keys.length - 1]) : '';

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.label}>30-DAY CALENDAR</Text>
        <Text style={styles.range}>{rangeLabel}</Text>
      </View>
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((key, idx) => {
          if (!key) {
            return <View key={`pad-${idx}`} style={styles.cell} />;
          }
          const dayNum = parseDateKey(key).getDate();
          const inRange = dayInHabitRange(habit, key);
          const done = inRange && isCompletedOn(habit.id, key, completions);
          return (
            <View
              key={key}
              style={styles.cell}
              accessibilityLabel={`${key}${done ? ' completed' : inRange ? ' not completed' : ' outside habit range'}`}
            >
              <View
                style={[
                  styles.dayCircle,
                  done && styles.dayFilled,
                  inRange && !done && styles.dayEmpty,
                  !inRange && styles.dayOut,
                ]}
              >
                <Text
                  style={[
                    styles.dayNum,
                    done && styles.dayNumFilled,
                    !inRange && styles.dayNumOut,
                  ]}
                >
                  {dayNum}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    ...typography.labelCaps,
    color: colors.textMuted,
  },
  range: {
    ...typography.caption,
    color: colors.accent,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    width: '14.2857%',
    textAlign: 'center',
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.2857%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayFilled: {
    backgroundColor: colors.accent,
  },
  dayEmpty: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  dayOut: {
    opacity: 0.35,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  dayNum: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dayNumFilled: {
    color: colors.background,
    fontWeight: '700',
  },
  dayNumOut: {
    color: colors.textMuted,
  },
});
