// CameraScreen — ecran full-screen cu camera in-app pentru capturarea plantelor.
// Afiseaza viewfinder cu colturi animate, bara de progres si butoane de control (galerie, captura, flip).

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { X, ImageIcon, SwitchCamera, Zap, ZapOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, spacing } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const VF_WIDTH = SCREEN_W * 0.84;
const VF_HEIGHT = SCREEN_H * 0.36;
const CORNER_LEN = 48;
const CORNER_W = 3.5;
const SCAN_DURATION = 2500;

// Constante culori specifice UI-ului de camera (nu depind de tema)
const CAM_BTN_BG = 'rgba(255,255,255,0.15)';
const CAM_PROGRESS_BG = 'rgba(255,255,255,0.25)';
const CAM_SHUTTER_FILL = 'rgba(255,255,255,0.9)';
const CAM_TEXT_DIM = 'rgba(255,255,255,0.7)';

interface CameraScreenProps {
  visible: boolean;
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraScreen({ visible, onCapture, onClose }: CameraScreenProps) {
  const colors = useThemeColors();
  const ACCENT = colors.logoTeal;
  const CAM_WHITE = colors.textLight;
  const cs = useMemo(() => createCameraStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'torch'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const capturedUriRef = useRef<string | null>(null);

  // Animated value for the scanning line
  const scanLineY = useRef(new Animated.Value(0)).current;
  const scanAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setCapturedUri(null);
      capturedUriRef.current = null;
      setIsScanning(false);
      setScanProgress(0);
      scanLineY.setValue(0);
    }
  }, [visible]);

  // Scanning animation + progress counter
  useEffect(() => {
    if (!isScanning) return;

    // Bounce scan line up and down
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: VF_HEIGHT - 4,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    scanAnimRef.current = anim;
    anim.start();

    // Progress counter
    let p = 0;
    const stepMs = SCAN_DURATION / 50;
    const interval = setInterval(() => {
      p += 2;
      if (p > 100) p = 100;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        scanLineY.stopAnimation();
        setTimeout(() => {
          if (capturedUriRef.current) {
            onCapture(capturedUriRef.current);
          }
        }, 350);
      }
    }, stepMs);

    return () => {
      clearInterval(interval);
      scanLineY.stopAnimation();
      scanAnimRef.current = null;
    };
  }, [isScanning, onCapture]);

  const startScan = useCallback((uri: string) => {
    setCapturedUri(uri);
    capturedUriRef.current = uri;
    setScanProgress(0);
    setIsScanning(true);
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isScanning) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        startScan(photo.uri);
      }
    } catch {
      // Camera capture failed silently
    }
  }, [isScanning, startScan]);

  const handleFlip = useCallback(() => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, []);

const handleGallery = useCallback(async () => {
    if (isScanning) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      startScan(result.assets[0].uri);
    }
  }, [isScanning, startScan]);

  // ── Permission: loading ───────────────────────────────────────
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <View style={cs.permissionWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      </Modal>
    );
  }

  // ── Permission: not granted ───────────────────────────────────
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <View style={cs.permissionWrap}>
          <Text style={cs.permissionText}>
            Permite accesul la camera pentru a identifica plantele.
          </Text>
          <TouchableOpacity style={cs.permissionBtn} onPress={requestPermission}>
            <Text style={cs.permissionBtnText}>Permite accesul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.md }}>
            <Text style={[cs.permissionText, { fontSize: fonts.sizes.md, marginBottom: 0 }]}>
              Inchide
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // ── Main camera UI ────────────────────────────────────────────
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={cs.root}>
        {/* Camera preview or captured photo */}
        {capturedUri ? (
          <Image
            source={{ uri: capturedUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={flash === 'torch' ? 'off' : flash}
            enableTorch={flash === 'torch'}
          />
        )}

        {/* Overlay layer */}
        <View style={cs.overlayLayer}>
          {/* ── Top bar ── */}
          <View style={[cs.topBar, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              disabled={isScanning}
              style={{ opacity: isScanning ? 0.4 : 1 }}
            >
              <X color={CAM_WHITE} size={26} />
            </TouchableOpacity>
            <Text style={cs.topTitle}>Identificare</Text>
            <TouchableOpacity
              onPress={() => setFlash((f) => f === 'off' ? 'on' : f === 'on' ? 'torch' : 'off')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              disabled={isScanning || facing === 'front'}
              style={{ opacity: (isScanning || facing === 'front') ? 0.4 : 1 }}
            >
              {flash === 'on' && <Zap color={ACCENT} size={26} fill={ACCENT} />}
              {flash === 'torch' && <Zap color={colors.flashTorch} size={26} fill={colors.flashTorch} />}
              {flash === 'off' && <ZapOff color={CAM_WHITE} size={26} />}
            </TouchableOpacity>
          </View>

          {/* ── Viewfinder ── */}
          <View style={cs.vfContainer}>
            <View style={cs.vfFrame}>
              <View style={[cs.corner, cs.cTL]} />
              <View style={[cs.corner, cs.cTR]} />
              <View style={[cs.corner, cs.cBL]} />
              <View style={[cs.corner, cs.cBR]} />

              {isScanning && (
                <Animated.View
                  style={[cs.scanLine, { transform: [{ translateY: scanLineY }] }]}
                />
              )}
            </View>
          </View>

          {/* ── Bottom section ── */}
          <View style={[cs.bottom, { paddingBottom: insets.bottom + 24 }]}>
            {isScanning ? (
              <View style={cs.progressWrap}>
                <View style={cs.progBarBg}>
                  <View style={[cs.progBarFill, { width: `${scanProgress}%` }]} />
                </View>
                <Text style={cs.progPct}>{scanProgress}%</Text>
                <Text style={cs.progLabel}>Se identifica planta...</Text>
              </View>
            ) : (
              <View style={{ height: 80 }} />
            )}

            <View style={cs.controls}>
              <TouchableOpacity
                style={[cs.sideBtn, isScanning && cs.disabledBtn]}
                onPress={handleGallery}
                disabled={isScanning}
              >
                <ImageIcon color={CAM_WHITE} size={22} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[cs.shutter, isScanning && cs.disabledBtn]}
                onPress={handleCapture}
                disabled={isScanning}
                activeOpacity={0.7}
              >
                <View style={cs.shutterInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[cs.sideBtn, isScanning && cs.disabledBtn]}
                onPress={handleFlip}
                disabled={isScanning}
              >
                <SwitchCamera color={CAM_WHITE} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Styles ──────────────────────────────────────────────────────
const createCameraStyles = (colors: ThemeColors) => {
  const accent = colors.logoTeal;
  const camWhite = colors.textLight;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.black,
    },
    overlayLayer: {
      flex: 1,
    },

    // Top bar
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    topTitle: {
      color: camWhite,
      fontSize: fonts.sizes.xl,
      fontWeight: '700',
    },

    // Viewfinder
    vfContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    vfFrame: {
      width: VF_WIDTH,
      height: VF_HEIGHT,
    },
    corner: {
      position: 'absolute',
      width: CORNER_LEN,
      height: CORNER_LEN,
    },
    cTL: {
      top: 0,
      left: 0,
      borderTopWidth: CORNER_W,
      borderLeftWidth: CORNER_W,
      borderTopColor: accent,
      borderLeftColor: accent,
      borderTopLeftRadius: 6,
    },
    cTR: {
      top: 0,
      right: 0,
      borderTopWidth: CORNER_W,
      borderRightWidth: CORNER_W,
      borderTopColor: accent,
      borderRightColor: accent,
      borderTopRightRadius: 6,
    },
    cBL: {
      bottom: 0,
      left: 0,
      borderBottomWidth: CORNER_W,
      borderLeftWidth: CORNER_W,
      borderBottomColor: accent,
      borderLeftColor: accent,
      borderBottomLeftRadius: 6,
    },
    cBR: {
      bottom: 0,
      right: 0,
      borderBottomWidth: CORNER_W,
      borderRightWidth: CORNER_W,
      borderBottomColor: accent,
      borderRightColor: accent,
      borderBottomRightRadius: 6,
    },
    scanLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: accent,
      shadowColor: accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 5,
    },

    // Bottom
    bottom: {
      paddingHorizontal: spacing.lg,
    },
    progressWrap: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    progBarBg: {
      width: '70%',
      height: 6,
      backgroundColor: CAM_PROGRESS_BG,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progBarFill: {
      height: '100%',
      backgroundColor: accent,
      borderRadius: 3,
    },
    progPct: {
      color: camWhite,
      fontSize: fonts.sizes.xxl,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    progLabel: {
      color: CAM_TEXT_DIM,
      fontSize: fonts.sizes.md,
    },

    // Controls
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 36,
    },
    sideBtn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: CAM_BTN_BG,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shutter: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 4,
      borderColor: accent,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    shutterInner: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: CAM_SHUTTER_FILL,
    },
    disabledBtn: {
      opacity: 0.4,
    },

    // Permission screens
    permissionWrap: {
      flex: 1,
      backgroundColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    permissionText: {
      color: camWhite,
      fontSize: fonts.sizes.lg,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    permissionBtn: {
      backgroundColor: accent,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.xl,
      borderRadius: 12,
    },
    permissionBtnText: {
      color: camWhite,
      fontSize: fonts.sizes.lg,
      fontWeight: '600',
    },
  });
};
