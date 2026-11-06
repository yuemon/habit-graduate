import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const APP_NAME = 'Habit Graduate';
export const APP_MOTTO = 'Build it. Master it. Move on.';

interface Props {
  /** Larger branding for onboarding; default is a compact top-of-page header. */
  size?: 'compact' | 'hero';
}

/**
 * Shared app name + motto shown at the top of every screen.
 * Screen titles (Today, Established Habits, …) stay below this.
 */
export function AppBrandHeader({ size = 'compact' }: Props) {
  const isHero = size === 'hero';

  return (
    <View
      style={[styles.wrap, isHero && styles.wrapHero]}
      accessibilityRole="header"
    >
      <Text style={[styles.name, isHero && styles.nameHero]}>{APP_NAME}</Text>
      <Text style={[styles.motto, isHero && styles.mottoHero]}>{APP_MOTTO}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  wrapHero: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 10,
  },
  name: {
    fontFamily: typography.titleSerif.fontFamily,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: colors.text,
    textAlign: 'center',
  },
  nameHero: {
    ...typography.hero,
    color: colors.text,
  },
  motto: {
    ...typography.small,
    color: colors.accent,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.95,
  },
  mottoHero: {
    ...typography.body,
    color: colors.accent,
    marginTop: 0,
    opacity: 1,
  },
});
