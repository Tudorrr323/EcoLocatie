// myPlantsRepository — acces la datele specifice modulului myplants.
// Filtreaza POI-urile utilizatorului curent si grupeaza pe plante, folosind API-ul.

import { getPlants, getPOIs } from '../../../shared/repository/dataProvider';
import type { Plant, PointOfInterest } from '../../../shared/types/plant.types';
import type { MyPlant, HistoryEntry } from '../types/myplants.types';

export async function getUserMyPlants(userId: number): Promise<MyPlant[]> {
  const [allPOIs, allPlants] = await Promise.all([getPOIs(), getPlants()]);

  const userPOIs = allPOIs.filter((poi) => poi.user_id === userId);

  const plantMap = new Map<number, PointOfInterest[]>();
  userPOIs.forEach((poi) => {
    const existing = plantMap.get(poi.plant_id) || [];
    existing.push(poi);
    plantMap.set(poi.plant_id, existing);
  });

  const plantsById = new Map<number, Plant>();
  allPlants.forEach((p) => plantsById.set(p.id, p));

  const result: MyPlant[] = [];
  plantMap.forEach((observations, plantId) => {
    const plant = plantsById.get(plantId);
    if (!plant) return;

    const sorted = [...observations].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    result.push({
      plant,
      observations: sorted,
      observationCount: sorted.length,
      lastObservationDate: sorted[0].created_at,
    });
  });

  return result.sort(
    (a, b) => new Date(b.lastObservationDate).getTime() - new Date(a.lastObservationDate).getTime(),
  );
}

export async function getUserHistory(userId: number): Promise<HistoryEntry[]> {
  const [allPOIs, allPlants] = await Promise.all([getPOIs(), getPlants()]);

  const plantsById = new Map<number, Plant>();
  allPlants.forEach((p) => plantsById.set(p.id, p));

  return allPOIs
    .filter((poi) => poi.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((poi) => ({
      poi,
      plant: plantsById.get(poi.plant_id)!,
    }))
    .filter((entry) => entry.plant != null);
}

export async function getMyPlantById(userId: number, plantId: number): Promise<MyPlant | null> {
  const plants = await getUserMyPlants(userId);
  return plants.find((mp) => mp.plant.id === plantId) || null;
}
