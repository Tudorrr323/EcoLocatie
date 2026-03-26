// BottomPanel — panou reutilizabil care glisează de jos în sus cu overlay.
// Dimensiune dinamică — se adaptează la conținut, maxim 85% din ecran.
// IMPORTANT: useNativeDriver: false pe TOATE animațiile — previne flicker-ul.

import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface BottomPanelProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomPanel({ visible, onClose, children }: BottomPanelProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [alive, setAlive] = useState(false);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      overlayOpacity.setValue(0);
      slideAnim.setValue(SCREEN_HEIGHT);
      setAlive(true);
    }
    prevVisible.current = visible;
  }, [visible, slideAnim, overlayOpacity]);

  useEffect(() => {
    if (visible && alive) {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: false, damping: 22, stiffness: 160 }),
      ]).start();
    } else if (!visible && alive) {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: false }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: false }),
      ]).start(() => setAlive(false));
    }
  }, [visible, alive, slideAnim, overlayOpacity]);

  const handleOverlayPress = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!alive) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 20 }]} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleOverlayPress} />
      </Animated.View>

      <Animated.View
        style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle}>
          <View style={styles.handleBar} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
});
