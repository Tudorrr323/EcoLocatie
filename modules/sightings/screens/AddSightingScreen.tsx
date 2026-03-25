// AddSightingScreen — ecranul pentru adaugarea unei observatii noi de planta medicinala.
// Orchestreaza flow-ul: fotografie → identificare AI → locatie GPS → comentariu → salvare.
// Intercepteaza gestul de back (Android) si afiseaza ConfirmModal daca observatia are progres.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
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
import type { ThemeColors } from '../../../shared/styles/theme';

// Demo user ID — replace with actual auth context when available
const DEMO_USER_ID = 1;

export function AddSightingScreen() {
  const colors = useThemeColors();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);
  const formRef = useRef<CreatePOIFormRef>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [exitModalVisible, setExitModalVisible] = useState(false);
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

  const handleSubmit = useCallback((draft: SightingDraft) => {
    const saved = saveSighting(draft, DEMO_USER_ID);

    if (saved) {
      Alert.alert(
        'Succes!',
        'Observatia ta a fost salvata si va fi verificata curand.',
        [{
          text: 'OK',
          onPress: () => {
            formRef.current?.reset();
            router.navigate('/(tabs)');
          },
        }],
      );
    } else {
      Alert.alert(
        'Eroare',
        'Nu s-a putut salva observatia. Asigura-te ca ai selectat o planta si o locatie.',
        [{ text: 'OK' }],
      );
    }
  }, [router]);

  return (
    <SafeAreaView style={sightingsStyles.screen} edges={['top']}>
      <AppHeader />
      <CreatePOIForm ref={formRef} onSubmit={handleSubmit} />

      <ConfirmModal
        visible={exitModalVisible}
        title="Parasesti observatia?"
        message="Daca iesi acum, progresul observatiei va fi pierdut si nu poate fi recuperat."
        confirmLabel="Ies"
        cancelLabel="Raman"
        confirmDestructive
        icon={<LogOut size={36} color={colors.error} />}
        onConfirm={handleConfirmExit}
        onCancel={() => setExitModalVisible(false)}
      />
    </SafeAreaView>
  );
}
