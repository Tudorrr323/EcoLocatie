// HistoryCard — card orizontal pentru o observatie din istoricul utilizatorului.
// Afiseaza imaginea POI-ului, numele plantei, numele latin si familia.

import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { getPlantName } from '../../../shared/context/SettingsContext';
import type { HistoryEntry } from '../types/myplants.types';

interface HistoryCardProps {
  entry: HistoryEntry;
}

export function HistoryCard({ entry }: HistoryCardProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const router = useRouter();

  const { poi, plant } = entry;

  return (
    <TouchableOpacity
      style={styles.historyCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/my-plant/${plant.id}`)}
    >
      <Image
        source={{ uri: poi.image_url || plant.image_url }}
        style={styles.historyCardImage}
        resizeMode="cover"
      />
      <View style={styles.historyCardInfo}>
        <Text style={styles.historyCardName} numberOfLines={1}>{getPlantName(plant)}</Text>
        <Text style={styles.historyCardLatin} numberOfLines={1}>{plant.name_latin}</Text>
        <Text style={styles.historyCardFamily}>{plant.family}</Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
