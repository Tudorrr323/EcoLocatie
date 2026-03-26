// useMapFilters — hook pentru gestionarea filtrelor si markerelor hartii.
// Incarca plantele si POI-urile async de la API, aplica filtrele active si returneaza markere filtrate.

import { useState, useMemo, useCallback, useEffect } from 'react';
import { getPlants } from '../../../shared/repository/dataProvider';
import { getFilteredMarkers, searchMarkers, getSearchSuggestions } from '../repository/mapRepository';
import type { MapFilter, MarkerData } from '../types/map.types';
import type { Plant } from '../../../shared/types/plant.types';
import { useSettings } from '../../../shared/context/SettingsContext';

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
  loading: boolean;
}

export function useMapFilters(): UseMapFiltersResult {
  const { language } = useSettings();
  const [filters, setFilters] = useState<MapFilter>(DEFAULT_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load plants — refetch when language changes
  useEffect(() => {
    getPlants().then(setAllPlants).catch(() => {});
  }, [language]);

  // Load filtered markers when filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFilteredMarkers(filters)
      .then((markers) => {
        if (!cancelled) {
          setFilteredMarkers(markers);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [filters, refreshKey, language]);

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
    loading,
  };
}
