// FavoriteButton — buton inimă pentru adăugarea/eliminarea plantelor la favorite.
// Inima goală = nu e favorită, inima plină = favorită.

import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { spacing } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onToggle, size = 22 }: FavoriteButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.btn}
    >
      <Heart
        size={size}
        color={colors.error}
        fill={isFavorite ? colors.error : 'none'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: spacing.xs,
  },
});
