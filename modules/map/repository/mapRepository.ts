// mapRepository — stratul de acces la date pentru modulul de harta.
// Transforma POI-urile in obiecte MarkerData imbogatite cu datele plantei si aplica filtrele.

import {
  getApprovedPOIs,
  getPOIs,
  getPlants,
} from '../../../shared/repository/dataProvider';
import type { Plant } from '../../../shared/types/plant.types';
import type { MarkerData, MapFilter } from '../types/map.types';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import { getPlantName } from '../../../shared/context/SettingsContext';

export async function getMapMarkers(): Promise<MarkerData[]> {
  const [pois, plants] = await Promise.all([getApprovedPOIs(), getPlants()]);
  const plantMap = new Map<number, Plant>();
  for (const plant of plants) {
    plantMap.set(plant.id, plant);
  }

  const markers: MarkerData[] = [];
  for (const poi of pois) {
    const plant = plantMap.get(poi.plant_id);
    if (plant) {
      markers.push({ ...poi, plant });
    }
  }

  return markers;
}

export function searchMarkers(markers: MarkerData[], query: string): MarkerData[] {
  if (!query.trim()) return markers;
  const normalizedQuery = removeDiacritics(query.trim().toLowerCase());
  return markers.filter(
    (m) =>
      removeDiacritics(getPlantName(m.plant).toLowerCase()).includes(normalizedQuery) ||
      removeDiacritics(m.plant.name_latin.toLowerCase()).includes(normalizedQuery),
  );
}

export function getSearchSuggestions(markers: MarkerData[], query: string, limit = 3): MarkerData[] {
  if (!query.trim()) return [];
  const normalizedQuery = removeDiacritics(query.trim().toLowerCase());
  const seen = new Set<number>();
  const results: MarkerData[] = [];
  for (const m of markers) {
    if (seen.has(m.plant.id)) continue;
    if (
      removeDiacritics(getPlantName(m.plant).toLowerCase()).includes(normalizedQuery) ||
      removeDiacritics(m.plant.name_latin.toLowerCase()).includes(normalizedQuery)
    ) {
      seen.add(m.plant.id);
      results.push(m);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export async function getFilteredMarkers(filter: MapFilter): Promise<MarkerData[]> {
  const [pois, allPois, plants] = await Promise.all([
    getApprovedPOIs(),
    filter.showOnlyApproved ? Promise.resolve([]) : getPOIs(),
    getPlants(),
  ]);

  const sourcePois = filter.showOnlyApproved ? pois : allPois;

  const plantMap = new Map<number, Plant>();
  for (const plant of plants) {
    plantMap.set(plant.id, plant);
  }

  const markers: MarkerData[] = [];
  for (const poi of sourcePois) {
    if (
      filter.selectedPlantIds.length > 0 &&
      !filter.selectedPlantIds.includes(poi.plant_id)
    ) {
      continue;
    }

    const plant = plantMap.get(poi.plant_id);
    if (plant) {
      markers.push({ ...poi, plant });
    }
  }

  return markers;
}
