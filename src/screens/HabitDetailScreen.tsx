import React, { useState } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppBrandHeader } from '../components/AppBrandHeader';
import { DayGrid } from '../components/DayGrid';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressRing } from '../components/ProgressRing';
import {
  ChevronLeftIcon,
  GraduationCapIcon,
  InfoIcon,
  LeafSproutIcon,
} from '../components/icons/Icons';
import { useHabits } from '../context/HabitContext';
import { getConsistency, isCompletedOn } from '../utils/consistency';
import { formatDisplayDate } from '../utils/dates';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';
import { CircularCheckbox } from '../components/CircularCheckbox';

type Route = RouteProp<RootStackParamList, 'HabitDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HabitDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { getHabit, completions, toggleToday, graduateHabit, today } = useHabits();
  const habit = getHabit(params.habitId);
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <AppBrandHeader />
        <View style={styles.missing}>
          <Text style={styles.missingText}>Habit not found.</Text>
          <PrimaryButton label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const { percent, completed, tracked } = getConsistency(habit, completions);
  const doneToday =
    habit.status === 'active' && isCompletedOn(habit.id, today, completions);
  const isActive = habit.status === 'active';
  const anchorLabel = habit.anchorCue
    ? habit.anchorCue.toLowerCase().startsWith('after')
      ? habit.anchorCue
      : `After I ${habit.anchorCue}`
    : null;

  const onGraduate = () => {
    graduateHabit(habit.id, note);
    setConfirming(false);
    navigation.popTo('Main', { screen: 'Archive' });
  };

  const askGraduate = () => {
    setNote('');
    setConfirming(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppBrandHeader />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.screenTitle}>Habit Detail</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topCard}>
          <View style={styles.identityRow}>
            <View style={styles.leafCircle}>
              <LeafSproutIcon size={24} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{habit.name}</Text>
              {anchorLabel ? (
                <Text style={styles.cue}>Anchor: {anchorLabel}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.consistencyRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.consistencyLabelRow}>
                <Text style={styles.consistencyLabel}>CONSISTENCY</Text>
                <InfoIcon size={13} color={colors.textMuted} />
              </View>
              <Text style={styles.percent}>{percent}%</Text>
              <Text style={styles.last30}>since starting · {completed} of {tracked} days</Text>
            </View>
            <ProgressRing percent={percent} size={92} strokeWidth={7} />
          </View>
        </View>

        {isActive ? (
          <View style={styles.checkRow}>
            <CircularCheckbox
              checked={doneToday}
              onPress={() => toggleToday(habit.id)}
              size={36}
              accessibilityLabel={`Mark ${habit.name} complete for today`}
            />
            <Text style={styles.checkLabel}>
              {doneToday ? 'Done for today' : 'Mark complete for today'}
            </Text>
          </View>
        ) : null}

        {habit.tinyVersion?.trim() ? <View style={styles.gridCard}>
          <Text style={styles.noteLabel}>Tiny version</Text>
          <Text style={styles.confirmBody}>{habit.tinyVersion}</Text>
        </View> : null}

        <View style={styles.gridCard}>
          <DayGrid habit={habit} completions={completions} days={30} />
        </View>

        {isActive && !confirming ? (
          <Pressable
            onPress={askGraduate}
            style={({ pressed }) => [
              styles.graduatePill,
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Graduate this habit"
          >
            <GraduationCapIcon size={18} color={colors.accent} />
            <Text style={styles.graduateText}>Graduate this habit</Text>
          </Pressable>
        ) : null}

        <Modal
          visible={isActive && confirming}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirming(false)}
        >
          <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
                <View style={styles.confirmBox} role="dialog" accessibilityLabel="Graduate this habit?" accessibilityViewIsModal>
                  <AppBrandHeader />
                  <Text style={styles.confirmTitle} accessibilityRole="header">Graduate this habit?</Text>
                  <Text style={styles.confirmBody}>
                    This will move the habit to Established Habits and free a slot.
                    That is progress — you made room for what comes next.
                  </Text>
                  <Text style={styles.noteLabel}>Optional reflection</Text>
                  <TextInput
                    accessibilityLabel="Optional reflection"
                    autoFocus
                    maxLength={2000}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>



        {!isActive ? (
          <View style={styles.archivedBanner}>
            <LeafSproutIcon size={18} color={colors.accent} />
            <Text style={styles.archivedText}>
              Established{habit.graduatedAt ? ` · Graduated ${formatDisplayDate(habit.graduatedOn ?? habit.graduatedAt)}` : ''} — this habit lives in your archive.
              {habit.graduationNote ? `\n\nReflection: ${habit.graduationNote}` : ''}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  screenTitle: {
    ...typography.titleSerif,
    fontSize: 24,
    color: colors.text,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leafCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.leafBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.habitNameSerif,
    color: colors.text,
  },
  cue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  consistencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consistencyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  consistencyLabel: {
    ...typography.labelCaps,
    color: colors.textMuted,
  },
  percent: {
    ...typography.percent,
    color: colors.accent,
  },
  last30: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },
  checkLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  gridCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
  },
  graduatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.graduatePillBg,
    borderWidth: 1,
    borderColor: colors.graduatePillBorder,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  graduateText: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: 22,
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
    borderRadius: 14,
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
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  archivedText: {
    ...typography.body,
    color: colors.accent,
    flex: 1,
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
