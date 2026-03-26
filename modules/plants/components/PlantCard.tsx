// PlantCard — card vizual pentru o plantă medicinală din enciclopedie.
// Afișează imaginea, numele, familia și buton de favorite (inimă).

import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import type { Plant } from '../../../shared/types/plant.types';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { getPlantName } from '../../../shared/context/SettingsContext';

interface PlantCardProps {
  plant: Plant;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PlantCard({ plant, isFavorite, onToggleFavorite }: PlantCardProps) {
  const colors = useThemeColors();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/plant/${plant.id}`);
  };

  return (
    <Card style={plantsStyles.card} onPress={handlePress}>
      <Image
        source={{ uri: plant.image_url }}
        style={plantsStyles.cardImage}
        resizeMode="cover"
        accessibilityLabel={getPlantName(plant)}
      />
      <View style={plantsStyles.cardBody}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[plantsStyles.cardNameRo, { flex: 1 }]}>{getPlantName(plant)}</Text>
          {onToggleFavorite && (
            <FavoriteButton isFavorite={!!isFavorite} onToggle={onToggleFavorite} size={20} />
          )}
        </View>
        <Text style={plantsStyles.cardNameLatin}>{plant.name_latin}</Text>
        <Badge text={plant.family} color={plant.icon_color} />
      </View>
    </Card>
  );
}
