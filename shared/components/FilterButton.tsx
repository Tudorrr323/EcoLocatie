// FilterButton — buton patrat cu icon de filtre (SlidersHorizontal).
// Deschide panoul de filtre pe harta. Inaltime fixa 44px, aliniata cu SearchBar.

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../styles/theme';

interface FilterButtonProps {
  onPress: () => void;
}

export function FilterButton({ onPress }: FilterButtonProps) {
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

const styles = StyleSheet.create({
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
