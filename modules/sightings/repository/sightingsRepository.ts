// sightingsRepository — stratul de acces la date pentru modulul de observatii.
// Gestioneaza crearea si salvarea observatiilor (POI) prin dataProvider.

import { getPlants, addPOI } from '../../../shared/repository/dataProvider';
import type { PointOfInterest } from '../../../shared/types/plant.types';
import type { SightingDraft } from '../types/sightings.types';

let nextId = 10000;

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
    description: draft.description,
    habitat: draft.habitat,
    harvest_period: draft.harvestPeriod,
    benefits: draft.benefits,
    contraindications: draft.contraindications,
    comment: draft.comment,
    ai_confidence: confidence,
    is_approved: false,
    created_at: new Date().toISOString(),
    image_url: draft.imageUri ?? '',
  };

  addPOI(newPOI);
  return newPOI;
}
