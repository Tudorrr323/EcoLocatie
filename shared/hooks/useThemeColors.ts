// useThemeColors — hook care returneaza paleta de culori corecta (light/dark).
// Foloseste-l in ORICE componenta React in loc de importul static `colors` din theme.ts.

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import type { ThemeColors } from '../styles/theme';

export function useThemeColors(): ThemeColors {
  return useSettings().colors;
}

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
): T {
  const { colors } = useSettings();
  return useMemo(() => factory(colors), [colors]);
}
