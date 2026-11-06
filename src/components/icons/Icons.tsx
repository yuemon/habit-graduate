import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

type IconProps = {
  size?: number;
  color?: string;
};

export function LeafSproutIcon({ size = 22, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21V10"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M12 13.5C8.8 13.2 6.4 11 5.5 8c3.6-.2 5.9 1.8 6.5 5.5z"
        fill={color}
        opacity={0.95}
      />
      <Path
        d="M12 11.5c3-.5 5.2-2.4 6.2-5.2-3.5 0-5.6 1.9-6.2 5.2z"
        fill={color}
        opacity={0.75}
      />
    </Svg>
  );
}

export function CalendarIcon({ size = 22, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.5}
        y={5}
        width={17}
        height={15}
        rx={2.5}
        stroke={color}
        strokeWidth={1.6}
      />
      <Path d="M8 3.5V7" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M16 3.5V7" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M3.5 10H20.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={8} cy={14} r={1} fill={color} />
      <Circle cx={12} cy={14} r={1} fill={color} />
      <Circle cx={16} cy={14} r={1} fill={color} />
    </Svg>
  );
}

export function PlusCircleIcon({ size = 22, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.25} stroke={color} strokeWidth={1.6} />
      <Path d="M12 8.5V15.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M8.5 12H15.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color = colors.white }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12.5L10 17.5L19 7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 20, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5L8 12L15 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 18, color = colors.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5L16 12L9 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AnchorIcon({ size = 12, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5.5} r={2.2} stroke={color} strokeWidth={1.6} />
      <Path d="M12 7.7V20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path
        d="M6 14H9.5C9.5 17 10.5 19 12 20c1.5-1 2.5-3 2.5-6H18"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GraduationCapIcon({ size = 18, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 9.5L12 4.5L21.5 9.5L12 14.5L2.5 9.5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 11.5V16C6.5 16 8.5 18.5 12 18.5C15.5 18.5 17.5 16 17.5 16V11.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M21.5 9.5V15" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function InfoIcon({ size = 14, color = colors.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Path d="M12 10.5V16.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={12} cy={7.5} r={1} fill={color} />
    </Svg>
  );
}
