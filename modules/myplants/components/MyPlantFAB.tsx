// MyPlantFAB — buton flotant cu meniu expandabil.
// La deschidere, masoara pozitia FAB-ului si pune totul in Modal folosind top/left directe.
// Butonul + se roteste 45° (devine X) la deschidere si revine la inchidere.

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Modal, StyleSheet, Animated } from 'react-native';
import { Plus, Camera, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { spacing } from '../../../shared/styles/theme';

export function MyPlantFAB() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fabPos, setFabPos] = useState({ x: 0, y: 0 });
  const fabRef = useRef<View>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: open ? 1 : 0,
      damping: 15,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleOpen = useCallback(() => {
    fabRef.current?.measureInWindow((x, y) => {
      setFabPos({ x, y });
      setOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleAddObservation = useCallback(() => {
    setOpen(false);
    router.push('/(tabs)/add-sighting');
  }, [router]);

  const handleSearchPlants = useCallback(() => {
    setOpen(false);
    router.push('/(tabs)/encyclopedia');
  }, [router]);

  return (
    <>
      {/* Buton + cu rotatie — ascuns vizual cand modal-ul e deschis */}
      <View style={[styles.fabContainer, open && { opacity: 0 }]} pointerEvents={open ? 'none' : 'auto'}>
        <View ref={fabRef} collapsable={false}>
          <TouchableOpacity
            style={styles.fabButton}
            activeOpacity={0.8}
            onPress={handleOpen}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Plus size={28} color={colors.textLight} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal cu overlay + meniu + buton X rotit */}
      <Modal transparent visible={open} animationType="none" onRequestClose={handleClose}>
        {/* Overlay */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
        </Pressable>

        {/* Buton + rotit 45° (devine X) — pozitionat exact pe locul FAB-ului */}
        <TouchableOpacity
          style={[styles.fabButton, { position: 'absolute', left: fabPos.x, top: fabPos.y }]}
          activeOpacity={0.8}
          onPress={handleClose}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Plus size={28} color={colors.textLight} />
          </Animated.View>
        </TouchableOpacity>

        {/* Meniu — aliniat dreapta, deasupra butonului */}
        <View
          style={{
            position: 'absolute',
            right: spacing.md,
            top: fabPos.y - spacing.sm,
            transform: [{ translateY: -100 }],
            alignItems: 'flex-end',
          }}
          pointerEvents="box-none"
        >
          <View style={styles.fabMenu}>
            <TouchableOpacity style={styles.fabMenuItem} onPress={handleAddObservation}>
              <Camera size={20} color={colors.text} />
              <Text style={styles.fabMenuText}>{t.myPlants.fab.addObservation}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabMenuItem} onPress={handleSearchPlants}>
              <Search size={20} color={colors.text} />
              <Text style={styles.fabMenuText}>{t.myPlants.fab.searchPlants}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
