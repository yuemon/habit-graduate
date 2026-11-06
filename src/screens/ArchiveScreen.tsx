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
import { EmptyState } from '../components/EmptyState';
import { useHabits } from '../context/HabitContext';
import { getConsistency } from '../utils/consistency';
import { formatDisplayDate } from '../utils/dates';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ArchiveScreen() {
  const { graduatedHabits, completions } = useHabits();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Graduated</Text>
        <Text style={styles.subtitle}>Habits you mastered and moved on from.</Text>
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
          renderItem={({ item }) => {
            const { percent } = getConsistency(item, completions);
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() =>
                  navigation.navigate('HabitDetail', { habitId: item.id })
                }
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>
                      Graduated{' '}
                      {item.graduatedAt
                        ? formatDisplayDate(item.graduatedAt)
                        : '—'}
                    </Text>
                    {item.graduationNote ? (
                      <Text style={styles.note} numberOfLines={2}>
                        {item.graduationNote}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.percent}>{percent}%</Text>
                </View>
              </Pressable>
            );
          }}
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
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
  percent: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
});
