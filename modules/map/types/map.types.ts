// map.types — tipuri TypeScript specifice modulului de harta.
// Defineste MapFilter (criterii filtrare) si MarkerData (POI imbogatit cu date planta).

import type { PointOfInterest, Plant } from '../../../shared/types/plant.types';

export interface MapFilter {
  selectedPlantIds: number[];
  showOnlyApproved: boolean;
}

export interface MarkerData extends PointOfInterest {
  plant: Plant;
}
