// ImageViewer — componenta fullscreen pentru vizualizarea imaginilor cu pinch zoom si pan.
// Suporta gesturi native (pinch to zoom, drag to pan) si butoane +/- pentru zoom.

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ZoomIn, ZoomOut } from 'lucide-react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface ImageViewerProps {
  uri: string | null;
  onClose: () => void;
}

export function ImageViewer({ uri, onClose }: ImageViewerProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetTransform = () => {
    'worklet';
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * e.scale, 6));
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetTransform();
      } else {
        savedScale.value = scale.value;
      }
    });

  const clampTranslate = () => {
    'worklet';
    const maxX = (SCREEN_W * (scale.value - 1)) / 2;
    const maxY = (SCREEN_H * 0.75 * (scale.value - 1)) / 2;
    translateX.value = withSpring(
      Math.max(-maxX, Math.min(maxX, translateX.value)),
      { damping: 20, stiffness: 200 },
    );
    translateY.value = withSpring(
      Math.max(-maxY, Math.min(maxY, translateY.value)),
      { damping: 20, stiffness: 200 },
    );
    savedTranslateX.value = Math.max(-maxX, Math.min(maxX, translateX.value));
    savedTranslateY.value = Math.max(-maxY, Math.min(maxY, translateY.value));
  };

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      if (scale.value <= 1) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        resetTransform();
      } else {
        clampTranslate();
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        resetTransform();
      } else {
        scale.value = withSpring(3);
        savedScale.value = 3;
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleZoomIn = () => {
    const next = Math.min(savedScale.value + 0.5, 6);
    scale.value = withSpring(next);
    savedScale.value = next;
  };

  const handleZoomOut = () => {
    const next = Math.max(savedScale.value - 0.5, 1);
    scale.value = withSpring(next);
    savedScale.value = next;
    if (next <= 1) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  };

  const handleClose = () => {
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    onClose();
  };

  return (
    <Modal visible={!!uri} transparent animationType="fade" statusBarTranslucent onRequestClose={handleClose}>
      <GestureHandlerRootView style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <GestureDetector gesture={composed}>
          <Animated.Image
            source={{ uri: uri ?? '' }}
            style={[styles.image, animatedStyle]}
            resizeMode="contain"
          />
        </GestureDetector>

        <View style={styles.zoomButtons}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn} activeOpacity={0.7}>
            <ZoomIn size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut} activeOpacity={0.7}>
            <ZoomOut size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.75,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  zoomButtons: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    gap: 12,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
