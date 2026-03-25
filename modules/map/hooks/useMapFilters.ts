// useMapFilters — hook pentru gestionarea filtrelor si markerelor hartii.
// Incarca plantele si POI-urile, aplica filtrele active si returneaza markere filtrate.

import { useState, useMemo, useCallback } from 'react';
import { getPlants } from '../../../shared/repository/dataProvider';
import { getFilteredMarkers, searchMarkers, getSearchSuggestions } from '../repository/mapRepository';
import type { MapFilter, MarkerData } from '../types/map.types';
import type { Plant } from '../../../shared/types/plant.types';

const DEFAULT_FILTER: MapFilter = {
  selectedPlantIds: [],
  showOnlyApproved: false,
};

interface UseMapFiltersResult {
  filters: MapFilter;
  setFilters: (filters: MapFilter) => void;
  displayedMarkers: MarkerData[];
  suggestions: MarkerData[];
  allPlants: Plant[];
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
  refreshMarkers: () => void;
}

export function useMapFilters(): UseMapFiltersResult {
  const [filters, setFilters] = useState<MapFilter>(DEFAULT_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const allPlants = useMemo(() => getPlants(), []);

  const filteredMarkers = useMemo(
    () => getFilteredMarkers(filters),
    [filters, refreshKey],
  );

  const displayedMarkers = useMemo(
    () => searchMarkers(filteredMarkers, searchQuery),
    [filteredMarkers, searchQuery],
  );

  const suggestions = useMemo(
    () => getSearchSuggestions(filteredMarkers, searchQuery),
    [filteredMarkers, searchQuery],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTER), []);

  const refreshMarkers = useCallback(() => setRefreshKey((k) => k + 1), []);

  return {
    filters,
    setFilters,
    displayedMarkers,
    suggestions,
    allPlants,
    setSearchQuery,
    resetFilters,
    refreshMarkers,
  };
}
