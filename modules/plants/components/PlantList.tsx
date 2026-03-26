// PlantList — lista scrollabilă de PlantCard-uri randată cu FlatList.

import React, { useMemo } from 'react';
import { FlatList } from 'react-native';
import type { Plant } from '../../../shared/types/plant.types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PlantCard } from './PlantCard';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface PlantListProps {
  plants: Plant[];
  listFooter?: React.ReactElement | null;
  isFavorite?: (plantId: number) => boolean;
  onToggleFavorite?: (plantId: number) => void;
}

export function PlantList({ plants, listFooter, isFavorite, onToggleFavorite }: PlantListProps) {
  const colors = useThemeColors();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  if (plants.length === 0) {
    return <EmptyState message="Nu au fost găsite plante pentru căutarea ta." />;
  }

  return (
    <FlatList
      data={plants}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PlantCard
          plant={item}
          isFavorite={isFavorite?.(item.id)}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(item.id) : undefined}
        />
      )}
      numColumns={1}
      contentContainerStyle={plantsStyles.listContent}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={listFooter}
    />
  );
}
