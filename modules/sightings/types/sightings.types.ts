export interface AIResult {
  plantId: number;
  plantName: string;
  confidence: number;
}

export interface SightingDraft {
  imageUri: string | null;
  plantId: number | null;
  location: { latitude: number; longitude: number } | null;
  comment: string;
  aiResults: AIResult[];
}
