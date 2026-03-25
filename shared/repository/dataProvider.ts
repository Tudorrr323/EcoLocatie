import rawData from '../../data/ecolocatie_data.json';
import type { Plant, PointOfInterest, User, MapConfig, EcolocatieData } from '../types/plant.types';

const data = rawData as unknown as EcolocatieData;

export function getPlants(): Plant[] {
  return data.plants;
}

export function getPlantById(id: number): Plant | undefined {
  return data.plants.find((p) => p.id === id);
}

export function getUsers(): User[] {
  return data.users;
}

export function getUserById(id: number): User | undefined {
  return data.users.find((u) => u.id === id);
}

export function getPOIs(): PointOfInterest[] {
  return data.points_of_interest;
}

export function getApprovedPOIs(): PointOfInterest[] {
  return data.points_of_interest.filter((p) => p.is_approved);
}

export function getPendingPOIs(): PointOfInterest[] {
  return data.points_of_interest.filter((p) => !p.is_approved);
}

export function getConfig(): MapConfig {
  return data.config;
}
