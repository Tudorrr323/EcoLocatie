// (tabs)/my-plants — ruta tab-ului pentru plantele salvate de utilizator.
// Afiseaza un ecran placeholder; functionalitatea completa urmeaza a fi implementata.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';
import { colors, fonts, spacing } from '../../shared/styles/theme';

export default function MyPlantsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Leaf size={64} color={colors.textSecondary} />
        <Text style={styles.title}>Plantele mele</Text>
        <Text style={styles.subtitle}>
          Aceasta sectiune va fi disponibila in curand
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
