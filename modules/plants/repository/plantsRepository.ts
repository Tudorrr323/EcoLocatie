// plantsRepository — stratul de acces la date pentru modulul enciclopedie.
// Expune functii pentru obtinerea listei de plante si detaliile unei plante dupa ID.

import { getPlants, getPlantById as getPlantByIdBase } from '../../../shared/repository/dataProvider';
import type { Plant } from '../../../shared/types/plant.types';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';

export function getAllPlants(): Plant[] {
  return getPlants();
}

export function getPlantById(id: number): Plant | undefined {
  return getPlantByIdBase(id);
}

export function searchPlants(query: string, selectedPlantIds: number[] = []): Plant[] {
  let plants = getPlants();
  if (query.trim()) {
    plants = plants.filter(
      (p) =>
        removeDiacritics(p.name_ro.toLowerCase()).includes(query) ||
        removeDiacritics(p.name_latin.toLowerCase()).includes(query) ||
        removeDiacritics(p.family.toLowerCase()).includes(query),
    );
  }
  if (selectedPlantIds.length > 0) {
    plants = plants.filter((p) => selectedPlantIds.includes(p.id));
  }
  return plants;
}

export function getPlantFamilies(): string[] {
  const plants = getPlants();
  const families = plants.map((p) => p.family);
  return Array.from(new Set(families)).sort();
}
