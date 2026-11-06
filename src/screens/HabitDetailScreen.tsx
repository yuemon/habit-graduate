import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DayGrid } from '../components/DayGrid';
import { PrimaryButton } from '../components/PrimaryButton';
import { CircularCheckbox } from '../components/CircularCheckbox';
import { useHabits } from '../context/HabitContext';
import { getConsistency, isCompletedOn } from '../utils/consistency';
import { toDateKey } from '../utils/dates';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

type Route = RouteProp<RootStackParamList, 'HabitDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HabitDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { getHabit, completions, toggleToday, graduateHabit } = useHabits();
  const habit = getHabit(params.habitId);
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Habit not found.</Text>
          <PrimaryButton label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const { percent, completed, tracked } = getConsistency(habit, completions);
  const today = toDateKey();
  const doneToday =
    habit.status === 'active' && isCompletedOn(habit.id, today, completions);
  const isActive = habit.status === 'active';

  const onGraduate = () => {
    graduateHabit(habit.id, note);
    navigation.navigate('Main', { screen: 'Archive' });
  };

  const askGraduate = () => {
    Alert.alert(
      'Graduate this habit?',
      'This will move the habit to your archive and free a slot.',
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: 'Graduate',
          onPress: () => setConfirming(true),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{habit.name}</Text>
        {habit.anchorCue ? (
          <Text style={styles.cue}>After I {habit.anchorCue}</Text>
        ) : null}
        {habit.tinyVersion ? (
          <Text style={styles.tiny}>Tiny version: {habit.tinyVersion}</Text>
        ) : null}

        <View style={styles.percentBlock}>
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.percentLabel}>consistency</Text>
          <Text style={styles.stats}>
            {completed} completed · {tracked} days tracked
          </Text>
        </View>

        {isActive ? (
          <View style={styles.checkRow}>
            <CircularCheckbox
              checked={doneToday}
              onPress={() => toggleToday(habit.id)}
              size={40}
              accessibilityLabel={`Mark ${habit.name} complete for today`}
            />
            <Text style={styles.checkLabel}>
              {doneToday ? 'Done for today' : 'Mark complete for today'}
            </Text>
          </View>
        ) : null}

        <View style={styles.gridBlock}>
          <DayGrid habit={habit} completions={completions} days={30} />
        </View>

        {isActive && !confirming ? (
          <PrimaryButton
            label="Graduate this habit"
            onPress={askGraduate}
            variant="secondary"
          />
        ) : null}

        {isActive && confirming ? (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Ready to graduate</Text>
            <Text style={styles.confirmBody}>
              This will move the habit to your archive and free a slot. That is
              progress — you made room for what comes next.
            </Text>
            <Text style={styles.noteLabel}>Optional reflection</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="What helped this stick?"
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <PrimaryButton label="Graduate" onPress={onGraduate} />
            <View style={{ height: 8 }} />
            <PrimaryButton
              label="Keep building"
              onPress={() => setConfirming(false)}
              variant="ghost"
            />
          </View>
        ) : null}

        {!isActive ? (
          <View style={styles.archivedBanner}>
            <Text style={styles.archivedText}>
              Graduated — this habit lives in your archive.
            </Text>
          </View>
        ) : null}

        <View style={{ height: 16 }} />
        <PrimaryButton
          label="Back"
          onPress={() => navigation.goBack()}
          variant="ghost"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  name: {
    ...typography.title,
    color: colors.text,
  },
  cue: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 6,
  },
  tiny: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  percentBlock: {
    marginTop: 28,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  percent: {
    ...typography.percent,
    color: colors.accent,
  },
  percentLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stats: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  checkLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  gridBlock: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  confirmBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  confirmTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: 8,
  },
  confirmBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  noteLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    color: colors.text,
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 16,
    ...typography.body,
  },
  archivedBanner: {
    backgroundColor: colors.accentDim,
    borderRadius: 12,
    padding: 14,
  },
  archivedText: {
    ...typography.body,
    color: colors.accent,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  missingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
