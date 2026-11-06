import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const APP_NAME = 'Habit Graduate';
export const APP_MOTTO = 'Build it. Master it. Move on.';

interface Props {
  /** Shared dominant brand hierarchy; hero adds onboarding emphasis. */
  size?: 'compact' | 'hero';
}

/**
 * Shared app name + motto shown at the top of every screen.
 * Screen titles (Today, Established Habits, …) stay below this.
 */
export function AppBrandHeader({ size = 'compact' }: Props) {
  const isHero = size === 'hero';
  const { width } = useWindowDimensions();
  const nameSize = width < 360 ? 30 : isHero ? 36 : 34;

  return (
    <View
      style={[styles.wrap, isHero && styles.wrapHero]}
      accessibilityRole="header"
    >
      <Text style={[styles.name, isHero && styles.nameHero, { fontSize: nameSize, lineHeight: nameSize * 1.2 }]}>{APP_NAME}</Text>
      <Text style={[styles.motto, isHero && styles.mottoHero]}>{APP_MOTTO}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    alignSelf: 'stretch',
  },
  wrapHero: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
    gap: 10,
  },
  name: {
    fontFamily: typography.titleSerif.fontFamily,
    fontSize: 34,
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
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
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
