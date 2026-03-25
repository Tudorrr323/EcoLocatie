// useMapFilters — hook pentru gestionarea filtrelor si markerelor hartii.
// Incarca plantele si POI-urile, aplica filtrele active si returneaza markere filtrate.

import { useState, useMemo, useCallback } from 'react';
import { getPlants } from '../../../shared/repository/dataProvider';
import { getFilteredMarkers } from '../repository/mapRepository';
import type { MapFilter, MarkerData } from '../types/map.types';
import type { Plant } from '../../../shared/types/plant.types';

const DEFAULT_FILTER: MapFilter = {
  selectedPlantIds: [],
  showOnlyApproved: false,
};

interface UseMapFiltersResult {
  filters: MapFilter;
  setFilters: (filters: MapFilter) => void;
  filteredMarkers: MarkerData[];
  allPlants: Plant[];
  resetFilters: () => void;
  refreshMarkers: () => void;
}

export function useMapFilters(): UseMapFiltersResult {
  const [filters, setFilters] = useState<MapFilter>(DEFAULT_FILTER);
  const [refreshKey, setRefreshKey] = useState(0);

  const allPlants = useMemo(() => getPlants(), []);

  const filteredMarkers = useMemo(
    () => getFilteredMarkers(filters),
    [filters, refreshKey]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  const refreshMarkers = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    filters,
    setFilters,
    filteredMarkers,
    allPlants,
    resetFilters,
    refreshMarkers,
  };
}
