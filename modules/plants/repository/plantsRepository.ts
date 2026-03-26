// plantsRepository — stratul de acces la date pentru modulul enciclopedie.
// Expune functii async pentru obtinerea listei de plante si detaliile unei plante dupa ID.

import { getPlants, getPlantById as getPlantByIdBase } from '../../../shared/repository/dataProvider';
import type { Plant } from '../../../shared/types/plant.types';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import { getPlantName } from '../../../shared/context/SettingsContext';

export async function getAllPlants(): Promise<Plant[]> {
  return getPlants();
}

export async function getPlantById(id: number): Promise<Plant | undefined> {
  return getPlantByIdBase(id);
}

export async function searchPlants(query: string, selectedPlantIds: number[] = []): Promise<Plant[]> {
  let plants = await getPlants();
  if (query.trim()) {
    const normalizedQuery = removeDiacritics(query.trim().toLowerCase());
    plants = plants.filter(
      (p) =>
        removeDiacritics(getPlantName(p).toLowerCase()).includes(normalizedQuery) ||
        removeDiacritics(p.name_latin.toLowerCase()).includes(normalizedQuery) ||
        removeDiacritics(p.family.toLowerCase()).includes(normalizedQuery),
    );
  }
  if (selectedPlantIds.length > 0) {
    plants = plants.filter((p) => selectedPlantIds.includes(p.id));
  }
  return plants;
}

export async function getPlantFamilies(): Promise<string[]> {
  const plants = await getPlants();
  const families = plants.map((p) => p.family);
  return Array.from(new Set(families)).sort();
}
