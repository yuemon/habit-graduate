import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { LeafSproutIcon } from '../components/icons/Icons';
import { useHabits } from '../context/HabitContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const POINTS = [
  { title: 'Track ≤5', body: 'Keep at most five active habits so focus stays sharp.' },
  { title: 'Graduate when ready', body: 'When a habit feels solid, graduate it and free a slot.' },
  { title: 'Start a new one', body: 'Use that open slot for the next habit you want to build.' },
];

export function OnboardingScreen() {
  const { completeOnboarding } = useHabits();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leafCircle}>
            <LeafSproutIcon size={28} color={colors.accent} />
          </View>
          <Text style={styles.name}>Habit Graduate</Text>
          <Text style={styles.motto}>Build it. Master it. Move on.</Text>
        </View>

        <View style={styles.points}>
          {POINTS.map((p) => (
            <View key={p.title} style={styles.point}>
              <Text style={styles.pointTitle}>{p.title}</Text>
              <Text style={styles.pointBody}>{p.body}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton label="Get started" onPress={completeOnboarding} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  leafCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.leafBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    ...typography.hero,
    color: colors.text,
    textAlign: 'center',
  },
  motto: {
    ...typography.body,
    color: colors.accent,
    textAlign: 'center',
  },
  points: {
    gap: 14,
  },
  point: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
  },
  pointTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: 6,
  },
  pointBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
