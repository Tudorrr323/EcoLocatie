// ConfirmModal — dialog reutilizabil, modern, cu animatie.
// Accepta titlu, mesaj, icon optional si continut custom (children) intre mesaj si butoane.
// onConfirm este optional — daca lipseste, se afiseaza doar butonul de cancel (full-width).
// Varianta confirmDestructive=true coloreaza butonul principal in rosu.

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { fonts, spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDestructive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirma',
  cancelLabel = 'Anuleaza',
  confirmDestructive = false,
  icon,
  children,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.88)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          damping: 18,
          stiffness: 280,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 0.88,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={onCancel}>
          <Animated.View style={[styles.overlayBg, { opacity: overlayOpacity }]} />

          <Animated.View
            style={[
              styles.card,
              { opacity: cardOpacity, transform: [{ scale: cardScale }] },
            ]}
          >
            <Pressable>
              {icon ? (
                <View style={styles.iconWrapper}>{icon}</View>
              ) : null}

              <Text style={styles.title}>{title}</Text>

              {message ? (
                <Text style={styles.message}>{message}</Text>
              ) : null}

              {children ? (
                <View style={styles.childrenWrapper}>{children}</View>
              ) : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.cancelButton, !onConfirm && styles.cancelButtonFull]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>

                {onConfirm ? (
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      confirmDestructive
                        ? styles.confirmButtonDestructive
                        : styles.confirmButtonPrimary,
                    ]}
                    onPress={onConfirm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl + 4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  childrenWrapper: {
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelButtonFull: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonPrimary: {
    backgroundColor: colors.primary,
  },
  confirmButtonDestructive: {
    backgroundColor: colors.error,
  },
  confirmButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.textLight,
  },
});
