// AppHeader — header-ul brand al aplicatiei, comun tuturor ecranelor principale.
// Afiseaza logo-ul, numele "EcoLocation" si un slot optional pentru actiuni dreapta.
// Implicit arata NotificationButton in dreapta.

import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NotificationButton } from './NotificationButton';
import { fonts, spacing } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface AppHeaderProps {
  rightContent?: React.ReactNode;
}

export function AppHeader({ rightContent }: AppHeaderProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <Image
        source={require('../../assets/SmallLogoEcoLocation.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        <Text style={{ color: colors.logoGreen }}>Eco</Text>
        <Text style={{ color: colors.logoTeal }}>Location</Text>
      </Text>
      <View style={styles.actions}>
        {rightContent !== undefined ? rightContent : <NotificationButton />}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  logo: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
