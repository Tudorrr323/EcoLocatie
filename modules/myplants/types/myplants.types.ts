import type { Plant, PointOfInterest } from '../../../shared/types/plant.types';

export interface MyPlant {
  plant: Plant;
  observations: PointOfInterest[];
  observationCount: number;
  lastObservationDate: string;
}

export interface HistoryGroup {
  dateLabel: string;
  entries: HistoryEntry[];
}

export interface HistoryEntry {
  poi: PointOfInterest;
  plant: Plant;
}

export type MyPlantsTab = 'plants' | 'history';

export type PlantTabItem =
  | { kind: 'poi'; entry: HistoryEntry }
  | { kind: 'plant'; plant: Plant };
