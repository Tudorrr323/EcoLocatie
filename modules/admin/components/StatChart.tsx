// StatChart — grafic simplu cu bare orizontale pentru dashboard-ul admin.

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ChartBar } from '../types/admin.types';

interface StatChartProps {
  title: string;
  bars: ChartBar[];
}

export function StatChart({ title, bars }: StatChartProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {bars.map((bar, index) => (
        <View key={index} style={styles.barRow}>
          <View style={styles.labelWrap}>
            <Text style={styles.label} numberOfLines={1}>{bar.label}</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.max((bar.value / maxValue) * 100, 2)}%`,
                  backgroundColor: bar.color,
                },
              ]}
            />
          </View>
          <Text style={styles.value}>{bar.value}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  labelWrap: {
    width: 90,
  },
  label: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.md,
  },
  value: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.text,
    width: 36,
    textAlign: 'right',
  },
});
