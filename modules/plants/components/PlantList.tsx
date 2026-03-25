// PlantList — lista scrollabila de PlantCard-uri randata cu FlatList.
// Primeste lista de plante filtrate si afiseaza EmptyState daca nu sunt rezultate.

import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import type { Plant } from '../../../shared/types/plant.types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PlantCard } from './PlantCard';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface PlantListProps {
  plants: Plant[];
  listFooter?: React.ReactElement | null;
}

export function PlantList({ plants, listFooter }: PlantListProps) {
  const colors = useThemeColors();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  if (plants.length === 0) {
    return <EmptyState message="Nu au fost gasite plante pentru cautarea ta." />;
  }

  return (
    <FlatList
      data={plants}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PlantCard plant={item} />}
      numColumns={1}
      contentContainerStyle={plantsStyles.listContent}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={listFooter}
    />
  );
}
