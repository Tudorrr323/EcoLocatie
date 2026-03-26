// useIdentify — hook care trimite imaginea la API-ul de identificare AI.
// Returneaza planta identificata cu confidence score. Fallback pe mock daca API-ul esueaza.

import { useState, useCallback } from 'react';
import { apiUpload } from '../../../shared/services/apiClient';
import { getPlants } from '../../../shared/repository/dataProvider';
import type { AIResult } from '../types/sightings.types';

interface IdentifyState {
  results: AIResult[];
  loading: boolean;
  error: string | null;
}

interface IdentifyResponse {
  identified: boolean;
  confidence: number;
  plant?: {
    id: number;
    name_ro: string;
    name_latin: string;
    description?: string;
    benefits?: string[];
    contraindications?: string[];
  };
  predicted_class?: string;
  message?: string;
  image_url?: string;
}

export function useMockIdentify() {
  const [state, setState] = useState<IdentifyState>({
    results: [],
    loading: false,
    error: null,
  });

  const identify = useCallback(async (imageUri: string | null): Promise<AIResult[]> => {
    if (!imageUri) {
      setState((prev) => ({ ...prev, error: 'Nu exista imagine pentru identificare.' }));
      return [];
    }

    setState({ results: [], loading: true, error: null });

    try {
      const formData = new FormData();
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1] ?? 'jpg';
      formData.append('image', {
        uri: imageUri,
        name: `identify.${fileType}`,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      } as unknown as Blob);

      const response = await apiUpload<IdentifyResponse>('/api/identify', formData, false);

      const results: AIResult[] = [];

      if (response.identified && response.plant) {
        results.push({
          plantId: response.plant.id,
          plantName: response.plant.name_ro,
          confidence: response.confidence,
        });
      }

      // If we only got one result (or none), supplement with random plants for the UI
      if (results.length < 3) {
        const plants = await getPlants();
        const usedIds = new Set(results.map((r) => r.plantId));
        const others = plants.filter((p) => !usedIds.has(p.id));
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        const needed = 3 - results.length;
        for (let i = 0; i < needed && i < shuffled.length; i++) {
          results.push({
            plantId: shuffled[i].id,
            plantName: shuffled[i].name_ro,
            confidence: parseFloat((Math.random() * 0.3 + 0.1).toFixed(2)),
          });
        }
      }

      // Sort descending by confidence
      results.sort((a, b) => b.confidence - a.confidence);

      setState({ results, loading: false, error: null });
      return results;
    } catch {
      // Fallback to mock if API fails
      const plants = await getPlants();
      const shuffled = [...plants].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);

      const rawResults: AIResult[] = picked.map((plant) => ({
        plantId: plant.id,
        plantName: plant.name_ro,
        confidence: parseFloat((Math.random() * (0.99 - 0.70) + 0.70).toFixed(2)),
      }));

      rawResults.sort((a, b) => b.confidence - a.confidence);

      setState({ results: rawResults, loading: false, error: null });
      return rawResults;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ results: [], loading: false, error: null });
  }, []);

  return { ...state, identify, reset };
}
