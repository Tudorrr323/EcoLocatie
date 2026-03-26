// usePlantSearch — hook pentru cautarea si filtrarea plantelor dupa nume (roman sau latin) si familie.
// Returneaza lista filtrata async, functia de setare a query-ului si filtrele active pe familii.

import { useState, useEffect } from 'react';
import type { Plant } from '../../../shared/types/plant.types';
import { searchPlants } from '../repository/plantsRepository';
import { useSettings } from '../../../shared/context/SettingsContext';

interface UsePlantSearchResult {
  query: string;
  setQuery: (q: string) => void;
  selectedPlantIds: number[];
  setSelectedPlantIds: (ids: number[]) => void;
  plants: Plant[];
  loading: boolean;
}

export function usePlantSearch(): UsePlantSearchResult {
  const { language } = useSettings();
  const [query, setQuery] = useState('');
  const [selectedPlantIds, setSelectedPlantIds] = useState<number[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchPlants(query, selectedPlantIds)
      .then((result) => {
        if (!cancelled) {
          setPlants(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [query, selectedPlantIds, language]);

  return { query, setQuery, selectedPlantIds, setSelectedPlantIds, plants, loading };
}
