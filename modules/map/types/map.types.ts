import type { PointOfInterest, Plant } from '../../../shared/types/plant.types';

export interface MapFilter {
  selectedPlantIds: number[];
  showOnlyApproved: boolean;
}

export interface MarkerData extends PointOfInterest {
  plant: Plant;
}
