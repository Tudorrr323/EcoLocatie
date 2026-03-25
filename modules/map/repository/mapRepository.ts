// mapRepository — stratul de acces la date pentru modulul de harta.
// Transforma POI-urile in obiecte MarkerData imbogatite cu datele plantei si aplica filtrele.

import {
  getApprovedPOIs,
  getPOIs,
  getPlantById,
} from '../../../shared/repository/dataProvider';
import type { MarkerData, MapFilter } from '../types/map.types';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';

export function getMapMarkers(): MarkerData[] {
  const pois = getApprovedPOIs();
  const markers: MarkerData[] = [];

  for (const poi of pois) {
    const plant = getPlantById(poi.plant_id);
    if (plant) {
      markers.push({ ...poi, plant });
    }
  }

  return markers;
}

export function searchMarkers(markers: MarkerData[], query: string): MarkerData[] {
  if (!query.trim()) return markers;
  return markers.filter(
    (m) =>
      removeDiacritics(m.plant.name_ro.toLowerCase()).includes(query) ||
      removeDiacritics(m.plant.name_latin.toLowerCase()).includes(query),
  );
}

export function getSearchSuggestions(markers: MarkerData[], query: string, limit = 3): MarkerData[] {
  if (!query.trim()) return [];
  const seen = new Set<number>();
  const results: MarkerData[] = [];
  for (const m of markers) {
    if (seen.has(m.plant.id)) continue;
    if (
      removeDiacritics(m.plant.name_ro.toLowerCase()).includes(query) ||
      removeDiacritics(m.plant.name_latin.toLowerCase()).includes(query)
    ) {
      seen.add(m.plant.id);
      results.push(m);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export function getFilteredMarkers(filter: MapFilter): MarkerData[] {
  const pois = filter.showOnlyApproved ? getApprovedPOIs() : getPOIs();
  const markers: MarkerData[] = [];

  for (const poi of pois) {
    if (
      filter.selectedPlantIds.length > 0 &&
      !filter.selectedPlantIds.includes(poi.plant_id)
    ) {
      continue;
    }

    const plant = getPlantById(poi.plant_id);
    if (plant) {
      markers.push({ ...poi, plant });
    }
  }

  return markers;
}
