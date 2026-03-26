// MyPlantCard — card orizontal pentru o planta din lista utilizatorului.
// Afiseaza imaginea, numele, numele latin, dot colorat si numarul de observatii.

import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import type { MyPlant } from '../types/myplants.types';

interface MyPlantCardProps {
  myPlant: MyPlant;
}

export function MyPlantCard({ myPlant }: MyPlantCardProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const router = useRouter();

  const { plant, observationCount } = myPlant;
  const countLabel = observationCount === 1 ? t.myPlants.observation : t.myPlants.observations;

  return (
    <TouchableOpacity
      style={styles.plantCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/my-plant/${plant.id}`)}
    >
      <Image
        source={{ uri: plant.image_url }}
        style={styles.plantCardImage}
        resizeMode="cover"
      />
      <View style={styles.plantCardInfo}>
        <Text style={styles.plantCardName} numberOfLines={1}>{getPlantName(plant)}</Text>
        <Text style={styles.plantCardLatin} numberOfLines={1}>{plant.name_latin}</Text>
        <View style={styles.plantCardMeta}>
          <View style={[styles.plantColorDot, { backgroundColor: plant.icon_color }]} />
          <Text style={styles.plantCardCount}>{observationCount} {countLabel}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} style={styles.plantCardChevron} />
    </TouchableOpacity>
  );
}
