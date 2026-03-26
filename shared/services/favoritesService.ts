// favoritesService — gestionează plantele favorite ale utilizatorului.
// Persistă pe backend via API. Fallback pe AsyncStorage dacă API-ul eșuează.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost, apiDelete } from './apiClient';

const STORAGE_KEY = '@ecolocatie_favorites';

function getUserKey(userId: number): string {
  return `${STORAGE_KEY}_${userId}`;
}

async function getLocalFavorites(userId: number): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(getUserKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalFavorites(userId: number, favs: number[]): Promise<void> {
  await AsyncStorage.setItem(getUserKey(userId), JSON.stringify(favs));
}

export async function getFavorites(userId: number): Promise<number[]> {
  try {
    const response = await apiGet<{ data: number[] }>('/api/favorites', true);
    const favs = response.data ?? [];
    // Sync local cache
    await saveLocalFavorites(userId, favs);
    return favs;
  } catch {
    return getLocalFavorites(userId);
  }
}

export async function addFavorite(userId: number, plantId: number): Promise<number[]> {
  try {
    await apiPost<unknown>(`/api/favorites/${plantId}`, {}, true);
    return getFavorites(userId);
  } catch {
    // Fallback to local
    const favs = await getLocalFavorites(userId);
    if (!favs.includes(plantId)) {
      favs.push(plantId);
      await saveLocalFavorites(userId, favs);
    }
    return favs;
  }
}

export async function removeFavorite(userId: number, plantId: number): Promise<number[]> {
  try {
    await apiDelete<unknown>(`/api/favorites/${plantId}`, true);
    return getFavorites(userId);
  } catch {
    // Fallback to local
    let favs = await getLocalFavorites(userId);
    favs = favs.filter((id) => id !== plantId);
    await saveLocalFavorites(userId, favs);
    return favs;
  }
}

export async function toggleFavorite(userId: number, plantId: number): Promise<{ favorites: number[]; isFavorite: boolean }> {
  const favs = await getFavorites(userId);
  if (favs.includes(plantId)) {
    const updated = await removeFavorite(userId, plantId);
    return { favorites: updated, isFavorite: false };
  } else {
    const updated = await addFavorite(userId, plantId);
    return { favorites: updated, isFavorite: true };
  }
}
