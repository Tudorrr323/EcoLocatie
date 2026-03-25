import { getPlants, getPlantById as getPlantByIdBase } from '../../../shared/repository/dataProvider';
import type { Plant } from '../../../shared/types/plant.types';

export function getAllPlants(): Plant[] {
  return getPlants();
}

export function getPlantById(id: number): Plant | undefined {
  return getPlantByIdBase(id);
}

export function searchPlants(query: string): Plant[] {
  const plants = getPlants();
  if (!query.trim()) return plants;
  const lower = query.toLowerCase();
  return plants.filter(
    (p) =>
      p.name_ro.toLowerCase().includes(lower) ||
      p.name_latin.toLowerCase().includes(lower) ||
      p.family.toLowerCase().includes(lower),
  );
}

export function getPlantFamilies(): string[] {
  const plants = getPlants();
  const families = plants.map((p) => p.family);
  return Array.from(new Set(families)).sort();
}
