// usePlantSearch — hook pentru cautarea si filtrarea plantelor dupa nume (roman sau latin) si familie.
// Returneaza lista filtrata, functia de setare a query-ului si filtrele active pe familii.

import { useState, useMemo } from 'react';
import type { Plant } from '../../../shared/types/plant.types';
import { searchPlants } from '../repository/plantsRepository';

interface UsePlantSearchResult {
  query: string;
  setQuery: (q: string) => void;
  selectedPlantIds: number[];
  setSelectedPlantIds: (ids: number[]) => void;
  plants: Plant[];
}

export function usePlantSearch(): UsePlantSearchResult {
  const [query, setQuery] = useState('');
  const [selectedPlantIds, setSelectedPlantIds] = useState<number[]>([]);

  const plants = useMemo(
    () => searchPlants(query, selectedPlantIds),
    [query, selectedPlantIds],
  );

  return { query, setQuery, selectedPlantIds, setSelectedPlantIds, plants };
}
