// sightings.types — tipuri TypeScript specifice modulului de observatii.
// Defineste AIResult (rezultat identificare), NewSightingData si SightingStep (pasi flow).

export interface AIResult {
  plantId: number;
  plantName: string;
  confidence: number;
}

export interface SightingDraft {
  imageUri: string | null;
  plantId: number | null;
  location: { latitude: number; longitude: number } | null;
  description: string;
  habitat: string;
  harvestPeriod: string;
  benefits: string;
  contraindications: string;
  comment: string;
  description_en: string;
  habitat_en: string;
  harvestPeriod_en: string;
  benefits_en: string;
  contraindications_en: string;
  comment_en: string;
  aiResults: AIResult[];
}
