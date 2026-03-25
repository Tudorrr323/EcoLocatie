import { useState, useCallback } from 'react';
import { getPlants } from '../../../shared/repository/dataProvider';
import type { AIResult } from '../types/sightings.types';

interface IdentifyState {
  results: AIResult[];
  loading: boolean;
  error: string | null;
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

    return new Promise((resolve) => {
      setTimeout(() => {
        const plants = getPlants();

        // Pick 3 unique random plants
        const shuffled = [...plants].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, 3);

        // Assign random confidence scores between 0.70 and 0.99
        const rawResults: AIResult[] = picked.map((plant) => ({
          plantId: plant.id,
          plantName: plant.name_ro,
          confidence: parseFloat((Math.random() * (0.99 - 0.70) + 0.70).toFixed(2)),
        }));

        // Sort descending by confidence
        rawResults.sort((a, b) => b.confidence - a.confidence);

        setState({ results: rawResults, loading: false, error: null });
        resolve(rawResults);
      }, 1500);
    });
  }, []);

  const reset = useCallback(() => {
    setState({ results: [], loading: false, error: null });
  }, []);

  return { ...state, identify, reset };
}
