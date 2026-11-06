import { Platform, TextStyle } from 'react-native';

export const fonts = {
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, "Times New Roman", Times, serif',
    default: 'serif',
  }) as string,
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'System',
  }) as string,
};

export const typography = {
  hero: {
    fontFamily: fonts.serif,
    fontSize: 34,
    fontWeight: '400' as const,
    letterSpacing: -0.4,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  titleSerif: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '400' as const,
  } satisfies TextStyle,
  heading: {
    fontFamily: fonts.sans,
    fontSize: 18,
    fontWeight: '600' as const,
  } satisfies TextStyle,
  habitName: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600' as const,
  } satisfies TextStyle,
  habitNameSerif: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '400' as const,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '400' as const,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '500' as const,
  } satisfies TextStyle,
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '400' as const,
  } satisfies TextStyle,
  small: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '400' as const,
  } satisfies TextStyle,
  labelCaps: {
    fontFamily: fonts.sans,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,
  percent: {
    fontFamily: fonts.sans,
    fontSize: 44,
    fontWeight: '600' as const,
    letterSpacing: -1,
  } satisfies TextStyle,
};
