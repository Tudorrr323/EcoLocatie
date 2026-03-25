// (tabs)/my-plants — ruta tab-ului pentru plantele salvate de utilizator.
// Afiseaza un ecran placeholder; functionalitatea completa urmeaza a fi implementata.
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';
import { useTranslation } from '../../shared/i18n';
import { fonts, spacing } from '../../shared/styles/theme';
import { useThemeColors } from '../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../shared/styles/theme';

export default function MyPlantsScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Leaf size={64} color={colors.textSecondary} />
        <Text style={styles.title}>{t.account.myPlants.title}</Text>
        <Text style={styles.subtitle}>
          {t.account.myPlants.subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
