import React from 'react';
import { FlatList, View } from 'react-native';
import type { Plant } from '../../../shared/types/plant.types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PlantCard } from './PlantCard';
import { plantsStyles } from '../styles/plants.styles';

interface PlantListProps {
  plants: Plant[];
}

export function PlantList({ plants }: PlantListProps) {
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
    />
  );
}
