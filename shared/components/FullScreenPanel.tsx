// FullScreenPanel — panou full-screen reutilizabil cu overlay static intunecat si continut care gliseaza de jos.
// Overlay-ul apare cu fade, continutul cu slide. Overlay-ul NU se misca la swipe.

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { colors, borderRadius } from '../styles/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface FullScreenPanelProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FullScreenPanel({ visible, onClose, children }: FullScreenPanelProps) {
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
            useNativeDriver: true,
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
          useNativeDriver: true,
        }),
      ]).start(() => setAlive(false));
    }
    prevVisible.current = visible;
  }, [visible]);

  if (!alive) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay static — nu se misca */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Continut care gliseaza de jos */}
      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
