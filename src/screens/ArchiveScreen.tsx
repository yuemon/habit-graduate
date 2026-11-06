import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppBrandHeader } from '../components/AppBrandHeader';
import { EmptyState } from '../components/EmptyState';
import { LeafSproutIcon, CheckIcon, ChevronRightIcon } from '../components/icons/Icons';
import { useHabits } from '../context/HabitContext';
import { formatDisplayDate } from '../utils/dates';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ArchiveScreen() {
  const { graduatedHabits } = useHabits();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <AppBrandHeader />
      <View style={styles.header}>
        <Text style={styles.title}>Established Habits</Text>
      </View>

      {graduatedHabits.length === 0 ? (
        <EmptyState
          title="No habits graduated yet. Keep building."
          subtitle="When a habit feels reliable, graduate it to free a slot for the next one."
        />
      ) : (
        <FlatList
          data={graduatedHabits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              <Text style={styles.sectionLabel}>ESTABLISHED ARCHIVE</Text>
              <View style={styles.introCard}>
                <View style={styles.leafCircle}>
                  <LeafSproutIcon size={22} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introTitle}>Established Habits</Text>
                  <Text style={styles.introBody}>
                    Habits you have formed appear here.
                  </Text>
                </View>
              </View>
              <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
                COMPLETED HABITS
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`View established habit ${item.name}`}
              onPress={() =>
                navigation.navigate('HabitDetail', { habitId: item.id })
              }
            >
              <View style={styles.leafCircle}>
                <LeafSproutIcon size={20} color={colors.accent} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.gradRow}>
                  <CheckIcon size={12} color={colors.accent} />
                  <Text style={styles.date}>
                    Graduated on{' '}
                    {item.graduatedAt
                      ? formatDisplayDate(item.graduatedOn ?? item.graduatedAt)
                      : '—'}
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={18} color={colors.textMuted} />
            </Pressable>
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
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 24,
    lineHeight: 30,
    color: colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  sectionLabel: {
    ...typography.labelCaps,
    color: colors.accent,
    marginBottom: 10,
    opacity: 0.85,
  },
  introCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 4,
  },
  introTitle: {
    ...typography.titleSerif,
    color: colors.text,
    fontSize: 18,
  },
  introBody: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  leafCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.leafBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.habitNameSerif,
    fontSize: 18,
    color: colors.text,
  },
  gradRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
