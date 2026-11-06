import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { CheckIcon } from './icons/Icons';

interface Props {
  checked: boolean;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
}

export function CircularCheckbox({
  checked,
  onPress,
  size = 36,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={(event) => { event.stopPropagation(); onPress(); }}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel ?? 'Mark complete for today'}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }]}
    >
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: checked ? colors.checkboxFilled : colors.checkboxEmpty,
            backgroundColor: checked ? colors.checkboxFilled : 'transparent',
            borderWidth: checked ? 0 : 2,
          },
        ]}
      >
        {checked ? <CheckIcon size={size * 0.48} color={colors.white} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
