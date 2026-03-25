// FilterButton — buton patrat cu icon de filtre (SlidersHorizontal).
// Deschide panoul de filtre pe harta. Inaltime fixa 44px, aliniata cu SearchBar.

import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface FilterButtonProps {
  onPress: () => void;
}

export function FilterButton({ onPress }: FilterButtonProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <SlidersHorizontal size={20} color={colors.text} />
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    height: 44,
    width: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});
