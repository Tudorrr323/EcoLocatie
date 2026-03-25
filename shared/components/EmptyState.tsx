// EmptyState — placeholder cu icon si mesaj afisat cand o lista este goala.
// Exemplu: "Nu sunt observatii in aceasta zona" sau "Niciun rezultat gasit".

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { fonts, spacing } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {icon || <Inbox size={48} color={colors.textSecondary} />}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  text: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
