// SwipeableBottomSheet — panou glisant de jos in sus, controlabil prin swipe.
// Header e mereu draggable. In collapsed, tap pe continut expandeaza. In expanded, ScrollView scrolleaza.

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TOP_PADDING = 50;

interface SwipeableBottomSheetProps {
  visible: boolean;
  peekHeight?: number;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function SwipeableBottomSheet({
  visible,
  peekHeight = 280,
  onClose,
  header,
  children,
}: SwipeableBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const posRef = useRef(SCREEN_HEIGHT);
  const expRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [alive, setAlive] = useState(false);

  const colY = SCREEN_HEIGHT - peekHeight;
  const colYRef = useRef(colY);
  colYRef.current = colY;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const springTo = (to: number) => {
    posRef.current = to;
    Animated.spring(translateY, { toValue: to, useNativeDriver: true, damping: 22, stiffness: 160 }).start();
  };

  const slideClosed = () => {
    posRef.current = SCREEN_HEIGHT;
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }).start(() => {
      expRef.current = false;
      setExpanded(false);
      setAlive(false);
      onCloseRef.current();
    });
  };

  const prevVisibleRef = useRef(false);

  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      // Opening
      setAlive(true);
      expRef.current = false;
      setExpanded(false);
      translateY.setValue(SCREEN_HEIGHT);
      requestAnimationFrame(() => springTo(colY));
    } else if (!visible && prevVisibleRef.current) {
      // Closing with animation
      posRef.current = SCREEN_HEIGHT;
      Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }).start(() => {
        expRef.current = false;
        setExpanded(false);
        setAlive(false);
      });
    }
    prevVisibleRef.current = visible;
  }, [visible, colY]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderMove: (_, g) => {
        const y = Math.max(TOP_PADDING, Math.min(SCREEN_HEIGHT, posRef.current + g.dy));
        translateY.setValue(y);
      },
      onPanResponderRelease: (_, g) => {
        const { dy, vy } = g;
        const cur = posRef.current + dy;
        const col = colYRef.current;
        const mid = (col + TOP_PADDING) / 2;

        if (vy > 800 / 1000) {
          if (expRef.current) {
            expRef.current = false; setExpanded(false); springTo(col);
          } else {
            slideClosed();
          }
          return;
        }
        if (vy < -800 / 1000) {
          expRef.current = true; setExpanded(true); springTo(TOP_PADDING);
          return;
        }
        if (cur < mid) {
          expRef.current = true; setExpanded(true); springTo(TOP_PADDING);
        } else if (cur > col + 40) {
          slideClosed();
        } else {
          expRef.current = false; setExpanded(false); springTo(col);
        }
      },
    })
  ).current;

  const expand = () => {
    expRef.current = true;
    setExpanded(true);
    springTo(TOP_PADDING);
  };

  if (!alive) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.sheet, { height: SCREEN_HEIGHT - TOP_PADDING, transform: [{ translateY }] }]}>
        <View {...pan.panHandlers}>
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
          {header}
        </View>
        <View style={styles.content}>
          {children}
          {!expanded && (
            <Pressable style={styles.tapOverlay} onPress={expand} />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  handleArea: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: borderRadius.full },
  content: { flex: 1, minHeight: 0 },
  tapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
