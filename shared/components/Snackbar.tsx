// Snackbar — mesaj temporar afișat jos pe ecran.
// Apare cu slide up, dispare automat după duration ms.
// Folosit pentru feedback rapid: favorite toggle, save profil, save observație etc.

import React, { useEffect, useRef, useMemo } from 'react';
import { Text, Animated, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface SnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  /** Durata în ms (default: 2500) */
  duration?: number;
}

export function Snackbar({ visible, message, onDismiss, duration = 2500 }: SnackbarProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (visible) {
      translateY.setValue(100);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onDismissRef.current());
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, spacing.md) + 60, transform: [{ translateY }], opacity },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  message: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.surface,
    textAlign: 'center',
  },
});
