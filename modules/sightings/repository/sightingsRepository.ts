// sightingsRepository — stratul de acces la date pentru modulul de observatii.
// Trimite observatia noua la API backend cu upload imagine.

import { apiUpload } from '../../../shared/services/apiClient';
import type { PointOfInterest } from '../../../shared/types/plant.types';
import type { SightingDraft } from '../types/sightings.types';
import { buildImageUrl } from '../../../shared/repository/dataProvider';

interface CreatePOIResponse {
  id: number;
  user_id: number;
  plant_id: number;
  latitude: number;
  longitude: number;
  comment: string;
  ai_confidence: number;
  status: string;
  created_at: string;
  primary_image?: string;
}

export async function saveSighting(draft: SightingDraft, userId: number): Promise<PointOfInterest | null> {
  if (draft.plantId === null || draft.location === null) {
    return null;
  }

  const formData = new FormData();
  formData.append('plant_id', String(draft.plantId));
  formData.append('latitude', String(draft.location.latitude));
  formData.append('longitude', String(draft.location.longitude));

  if (draft.comment) {
    formData.append('comment', draft.comment);
  }

  // Add image if available
  if (draft.imageUri) {
    const uriParts = draft.imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1] ?? 'jpg';
    formData.append('image', {
      uri: draft.imageUri,
      name: `sighting.${fileType}`,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
    } as unknown as Blob);
  }

  // Send confidence of the selected plant, not just the top result
  const selectedResult = draft.aiResults.find((r) => r.plantId === draft.plantId) ?? (draft.aiResults.length > 0 ? draft.aiResults[0] : null);
  if (selectedResult) {
    formData.append('ai_confidence', String(selectedResult.confidence));
  }

  const response = await apiUpload<CreatePOIResponse>('/api/pois', formData, true);

  return {
    id: response.id,
    user_id: response.user_id ?? userId,
    plant_id: response.plant_id,
    latitude: response.latitude,
    longitude: response.longitude,
    comment: response.comment ?? '',
    ai_confidence: response.ai_confidence ?? 0,
    status: (response.status as import('../../../shared/types/plant.types').POIStatus) ?? 'pending',
    created_at: response.created_at,
    image_url: buildImageUrl(response.primary_image),
  };
}
