// AddSightingScreen — ecranul pentru adaugarea unei observatii noi de planta medicinala.
// Orchestreaza flow-ul: fotografie → identificare AI → locatie GPS → comentariu → salvare.
// Intercepteaza gestul de back (Android) si afiseaza ConfirmModal daca observatia are progres.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useNavigation } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { CreatePOIForm, CreatePOIFormRef } from '../components/CreatePOIForm';
import { saveSighting } from '../repository/sightingsRepository';
import type { SightingDraft } from '../types/sightings.types';
import { createSightingsStyles } from '../styles/sightings.styles';
import { AppHeader } from '../../../shared/components/AppHeader';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { sightingGuard } from '../../../shared/utils/sightingGuard';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useTranslation } from '../../../shared/i18n';
import { Snackbar } from '../../../shared/components/Snackbar';
import type { ThemeColors } from '../../../shared/styles/theme';

export function AddSightingScreen() {
  const colors = useThemeColors();
  const { user } = useAuthContext();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);
  const formRef = useRef<CreatePOIFormRef>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const pendingActionRef = useRef<any>(null);

  useEffect(() => {
    sightingGuard.reset = () => formRef.current?.reset();
    return () => {
      sightingGuard.hasProgress = false;
      sightingGuard.reset = () => {};
    };
  }, []);

  // iOS: intercepteaza swipe-back la nivelul Stack-ului parinte
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    const unsubscribe = parent.addListener('beforeRemove' as any, (e: any) => {
      if (!sightingGuard.hasProgress) return;
      e.preventDefault();
      pendingActionRef.current = e.data.action;
      setExitModalVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  // Android: intercepteaza butonul/gestul hardware de back
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (sightingGuard.hasProgress) {
          pendingActionRef.current = null;
          setExitModalVisible(true);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, []),
  );

  const handleConfirmExit = useCallback(() => {
    setExitModalVisible(false);
    formRef.current?.reset();
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) {
      navigation.getParent()?.dispatch(action);
    } else {
      router.navigate('/(tabs)');
    }
  }, [navigation, router]);

  const handleSubmit = useCallback(async (draft: SightingDraft) => {
    try {
      const saved = await saveSighting(draft, user?.id ?? 0);

      if (saved) {
        formRef.current?.reset();
        setSnackbarVisible(true);
        setTimeout(() => {
          router.navigate('/(tabs)');
        }, 1500);
      } else {
        Alert.alert(
          t.sightings.alerts.errorTitle,
          t.sightings.alerts.errorNoPlant,
          [{ text: t.sightings.alerts.ok }],
        );
      }
    } catch {
      Alert.alert(
        t.sightings.alerts.errorTitle,
        t.sightings.alerts.errorNetwork,
        [{ text: t.sightings.alerts.ok }],
      );
    }
  }, [router, user]);

  return (
    <SafeAreaView style={sightingsStyles.screen} edges={['top']}>
      <AppHeader />
      <CreatePOIForm ref={formRef} onSubmit={handleSubmit} />

      <ConfirmModal
        visible={exitModalVisible}
        title={t.sightings.exitModal.title}
        message={t.sightings.exitModal.message}
        confirmLabel={t.sightings.exitModal.confirm}
        cancelLabel={t.sightings.exitModal.cancel}
        confirmDestructive
        icon={<LogOut size={36} color={colors.error} />}
        onConfirm={handleConfirmExit}
        onCancel={() => setExitModalVisible(false)}
      />

      <Snackbar
        visible={snackbarVisible}
        message={t.shared.snackbar.observationSaved}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}
