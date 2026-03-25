import { useState, useMemo, useCallback } from 'react';
import { getPlants } from '../../../shared/repository/dataProvider';
import { getFilteredMarkers } from '../repository/mapRepository';
import type { MapFilter, MarkerData } from '../types/map.types';
import type { Plant } from '../../../shared/types/plant.types';

const DEFAULT_FILTER: MapFilter = {
  selectedPlantIds: [],
  showOnlyApproved: true,
};

interface UseMapFiltersResult {
  filters: MapFilter;
  setFilters: (filters: MapFilter) => void;
  filteredMarkers: MarkerData[];
  allPlants: Plant[];
  resetFilters: () => void;
}

export function useMapFilters(): UseMapFiltersResult {
  const [filters, setFilters] = useState<MapFilter>(DEFAULT_FILTER);

  const allPlants = useMemo(() => getPlants(), []);

  const filteredMarkers = useMemo(
    () => getFilteredMarkers(filters),
    [filters]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  return {
    filters,
    setFilters,
    filteredMarkers,
    allPlants,
    resetFilters,
  };
}
