import React, { useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreatePOIForm } from '../components/CreatePOIForm';
import { saveSighting } from '../repository/sightingsRepository';
import type { SightingDraft } from '../types/sightings.types';
import { sightingsStyles } from '../styles/sightings.styles';

// Demo user ID — replace with actual auth context when available
const DEMO_USER_ID = 1;

export function AddSightingScreen() {
  const handleSubmit = useCallback((draft: SightingDraft) => {
    const saved = saveSighting(draft, DEMO_USER_ID);

    if (saved) {
      Alert.alert(
        'Succes!',
        'Observatia ta a fost salvata si va fi verificata curand.',
        [{ text: 'OK' }],
      );
    } else {
      Alert.alert(
        'Eroare',
        'Nu s-a putut salva observatia. Asigura-te ca ai selectat o planta si o locatie.',
        [{ text: 'OK' }],
      );
    }
  }, []);

  return (
    <SafeAreaView style={sightingsStyles.screen} edges={['top', 'left', 'right']}>
      <View style={sightingsStyles.headerContainer}>
        <Text style={sightingsStyles.headerTitle}>Observatie noua</Text>
      </View>
      <CreatePOIForm onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}
