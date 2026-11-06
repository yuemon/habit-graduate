import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useHabits } from '../context/HabitContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { MAX_ACTIVE_HABITS } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function AddHabitScreen() {
  const { activeCount, canAddHabit, addHabit } = useHabits();
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [tinyVersion, setTinyVersion] = useState('');
  const [anchorCue, setAnchorCue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    const result = addHabit({ name, tinyVersion, anchorCue });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    navigation.goBack();
  };

  const disabled = !canAddHabit || !name.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add habit</Text>
          <Text style={styles.slots}>
            {activeCount} of {MAX_ACTIVE_HABITS} slots used
          </Text>

          {!canAddHabit ? (
            <View style={styles.limitBanner}>
              <Text style={styles.limitText}>
                All 5 slots are in use. Graduate a habit to free a slot for a new
                one.
              </Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Habit name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Morning stretch"
              placeholderTextColor={colors.textMuted}
              editable={canAddHabit}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tiny version (optional)</Text>
            <Text style={styles.helper}>
              Start with the smallest viable action — one push-up, one page, one
              glass of water.
            </Text>
            <TextInput
              style={styles.input}
              value={tinyVersion}
              onChangeText={setTinyVersion}
              placeholder="e.g. Stretch for 30 seconds"
              placeholderTextColor={colors.textMuted}
              editable={canAddHabit}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>After I…</Text>
            <Text style={styles.helper}>
              Anchor the habit to something you already do.
            </Text>
            <TextInput
              style={styles.input}
              value={anchorCue}
              onChangeText={setAnchorCue}
              placeholder="pour my morning coffee / brush my teeth"
              placeholderTextColor={colors.textMuted}
              editable={canAddHabit}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label="Create habit"
            onPress={onSubmit}
            disabled={disabled}
          />
          <View style={{ height: 12 }} />
          <PrimaryButton
            label="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: {
    ...typography.title,
    color: colors.text,
  },
  slots: {
    ...typography.caption,
    color: colors.accent,
    marginTop: 6,
    marginBottom: 20,
  },
  limitBanner: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  limitText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: 6,
  },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    ...typography.body,
  },
  error: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
});
