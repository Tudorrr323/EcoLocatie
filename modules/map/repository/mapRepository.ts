// mapRepository — stratul de acces la date pentru modulul de harta.
// Transforma POI-urile in obiecte MarkerData imbogatite cu datele plantei si aplica filtrele.

import {
  getApprovedPOIs,
  getPOIs,
  getPlantById,
} from '../../../shared/repository/dataProvider';
import type { MarkerData, MapFilter } from '../types/map.types';

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
