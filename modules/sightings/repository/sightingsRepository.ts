import { getPlants } from '../../../shared/repository/dataProvider';
import type { PointOfInterest } from '../../../shared/types/plant.types';
import type { SightingDraft } from '../types/sightings.types';

const localSightings: PointOfInterest[] = [];
let nextId = 10000;

export function getLocalSightings(): PointOfInterest[] {
  return [...localSightings];
}

export function saveSighting(draft: SightingDraft, userId: number): PointOfInterest | null {
  if (draft.plantId === null) {
    return null;
  }

  const plants = getPlants();
  const plantExists = plants.some((p) => p.id === draft.plantId);
  if (!plantExists) {
    return null;
  }

  if (draft.location === null) {
    return null;
  }

  const topResult = draft.aiResults.length > 0 ? draft.aiResults[0] : null;
  const confidence = topResult ? topResult.confidence : 0;

  const newPOI: PointOfInterest = {
    id: nextId++,
    user_id: userId,
    plant_id: draft.plantId,
    latitude: draft.location.latitude,
    longitude: draft.location.longitude,
    comment: draft.comment,
    ai_confidence: confidence,
    is_approved: false,
    created_at: new Date().toISOString(),
    image_url: draft.imageUri ?? '',
  };

  localSightings.push(newPOI);
  return newPOI;
}
