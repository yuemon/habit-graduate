import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  checked: boolean;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
}

export function CircularCheckbox({
  checked,
  onPress,
  size = 32,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel ?? 'Mark complete for today'}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
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
          },
        ]}
      >
        {checked ? (
          <View
            style={[
              styles.innerDot,
              {
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: size * 0.175,
              },
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    backgroundColor: colors.background,
  },
});
