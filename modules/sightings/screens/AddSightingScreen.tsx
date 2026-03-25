// AddSightingScreen — ecranul pentru adaugarea unei observatii noi de planta medicinala.
// Orchestreaza flow-ul: fotografie → identificare AI → locatie GPS → comentariu → salvare.

import React, { useCallback, useRef } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreatePOIForm, CreatePOIFormRef } from '../components/CreatePOIForm';
import { saveSighting } from '../repository/sightingsRepository';
import type { SightingDraft } from '../types/sightings.types';
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';
import { NotificationButton } from '../../../shared/components/NotificationButton';

// Demo user ID — replace with actual auth context when available
const DEMO_USER_ID = 1;

export function AddSightingScreen() {
  const formRef = useRef<CreatePOIFormRef>(null);
  const router = useRouter();

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
    <SafeAreaView style={sightingsStyles.screen} edges={['top', 'left', 'right']}>
      <View style={sightingsStyles.header}>
        <Image source={require('../../../assets/SmallLogoEcoLocation.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
        <Text style={sightingsStyles.headerTitleBrand}>
          <Text style={{ color: colors.logoGreen }}>Eco</Text>
          <Text style={{ color: colors.logoTeal }}>Location</Text>
        </Text>
        <View style={sightingsStyles.headerActions}>
          <NotificationButton />
        </View>
      </View>
      <CreatePOIForm ref={formRef} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}
