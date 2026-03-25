// PlantMarker — componenta vizuala pentru un marker de planta pe harta.
// Afiseaza un pin colorat cu numele plantei. Folosit ca legenda sau marker nativ.

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import type { MarkerData } from '../types/map.types';
import { createMapStyles } from '../styles/map.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface PlantMarkerProps {
  marker: MarkerData;
}

const PlantMarker: React.FC<PlantMarkerProps> = ({ marker }) => {
  const colors = useThemeColors();
  const mapStyles = useMemo(() => createMapStyles(colors), [colors]);
  const { plant } = marker;

  return (
    <View style={mapStyles.markerContainer}>
      <View
        style={[
          mapStyles.markerPin,
          { backgroundColor: plant.icon_color || '#4CAF50' },
        ]}
      />
      <Text
        style={mapStyles.markerLabel}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {plant.name_ro}
      </Text>
    </View>
  );
};

export default PlantMarker;
