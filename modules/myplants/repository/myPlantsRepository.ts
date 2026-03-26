// myPlantsRepository — acces la datele specifice modulului myplants.
// Filtreaza POI-urile utilizatorului curent si grupeaza pe plante, folosind API-ul.

import { getPlants, getUserPOIs, getApprovedPOIs } from '../../../shared/repository/dataProvider';
import { apiPut, apiDelete } from '../../../shared/services/apiClient';
import type { Plant, PointOfInterest } from '../../../shared/types/plant.types';
import type { MyPlant, HistoryEntry } from '../types/myplants.types';

export async function getUserMyPlants(userId: number): Promise<MyPlant[]> {
  const [userPOIs, allPlants] = await Promise.all([getUserPOIs(userId), getPlants()]);

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
  const [userPOIs, allPlants] = await Promise.all([getUserPOIs(userId), getPlants()]);

  const plantsById = new Map<number, Plant>();
  allPlants.forEach((p) => plantsById.set(p.id, p));

  return userPOIs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((poi) => ({
      poi,
      plant: plantsById.get(poi.plant_id)!,
    }))
    .filter((entry) => entry.plant != null);
}

export async function getFavoritePOIEntries(poiIds: number[]): Promise<HistoryEntry[]> {
  if (poiIds.length === 0) return [];
  const [allPOIs, allPlants] = await Promise.all([getApprovedPOIs(), getPlants()]);
  const plantsById = new Map<number, Plant>();
  allPlants.forEach((p) => plantsById.set(p.id, p));
  const poiIdSet = new Set(poiIds);
  return allPOIs
    .filter((poi) => poiIdSet.has(poi.id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((poi) => ({ poi, plant: plantsById.get(poi.plant_id)! }))
    .filter((entry) => entry.plant != null);
}

export async function getPlantsByIds(ids: number[]): Promise<Plant[]> {
  if (ids.length === 0) return [];
  const allPlants = await getPlants();
  const idSet = new Set(ids);
  return allPlants.filter((p) => idSet.has(p.id));
}

export async function getMyPlantById(userId: number, plantId: number): Promise<MyPlant | null> {
  const plants = await getUserMyPlants(userId);
  return plants.find((mp) => mp.plant.id === plantId) || null;
}

export async function updateObservation(
  poiId: number,
  updates: Record<string, unknown>,
): Promise<void> {
  await apiPut<unknown>(`/api/pois/${poiId}`, updates, true);
}

export async function deleteObservation(poiId: number): Promise<void> {
  await apiDelete<unknown>(`/api/pois/${poiId}`, true);
}

export async function deleteAllObservationsForPlant(
  userId: number,
  plantId: number,
): Promise<void> {
  const myPlant = await getMyPlantById(userId, plantId);
  if (!myPlant) return;
  await Promise.all(
    myPlant.observations.map((obs) => apiDelete<unknown>(`/api/pois/${obs.id}`, true)),
  );
}
