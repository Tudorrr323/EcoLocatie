// PlantCard — card vizual pentru o planta medicinala din enciclopedie.
// Afiseaza imaginea, numele romanesc, numele latin si familia. La tap navigheaza la detalii.

import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import type { Plant } from '../../../shared/types/plant.types';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
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
        accessibilityLabel={plant.name_ro}
      />
      <View style={plantsStyles.cardBody}>
        <Text style={plantsStyles.cardNameRo}>{plant.name_ro}</Text>
        <Text style={plantsStyles.cardNameLatin}>{plant.name_latin}</Text>
        <Badge text={plant.family} color={plant.icon_color} />
      </View>
    </Card>
  );
}
