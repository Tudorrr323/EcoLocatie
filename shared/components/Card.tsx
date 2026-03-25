// Card — container reutilizabil cu shadow, border radius si padding.
// Baza vizuala pentru PlantCard, ModerationCard etc. Accepta onPress pentru navigare.

import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ children, onPress, style }: CardProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.card, style]}
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >
      {children}
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.sm,
  },
});
