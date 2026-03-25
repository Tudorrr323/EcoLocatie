// plants.types — tipurile TypeScript specifice modulului plants.
// Defineste interfata PlantFilter folosita pentru filtrarea listei de plante.
export interface PlantFilter {
  searchQuery: string;
  selectedPlantIds: number[];
}
