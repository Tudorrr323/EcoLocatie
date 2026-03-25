// FullScreenPanel — panou full-screen reutilizabil cu overlay static intunecat si continut care gliseaza de jos.
// Overlay-ul apare cu fade, continutul cu slide. Overlay-ul NU se misca la swipe.
// slideAnim foloseste useNativeDriver: false intentionat — zona de touch ramane la pozitia din layout
// si nu urmareste animatia vizuala, evitand rata primului tap imediat dupa deschidere.

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface FullScreenPanelProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FullScreenPanel({ visible, onClose, children }: FullScreenPanelProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [alive, setAlive] = useState(false);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      setAlive(true);
      slideAnim.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
            damping: 22,
            stiffness: 160,
          }),
        ]).start();
      });
    } else if (!visible && prevVisible.current) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(() => setAlive(false));
    }
    prevVisible.current = visible;
  }, [visible]);

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 20 }]}
      pointerEvents={alive ? 'box-none' : 'none'}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: 40,
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
});
