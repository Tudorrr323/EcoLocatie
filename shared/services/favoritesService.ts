// favoritesService — gestionează plantele favorite ale utilizatorului.
// Persistă în AsyncStorage ca array de plant IDs per user.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ecolocatie_favorites';

function getUserKey(userId: number): string {
  return `${STORAGE_KEY}_${userId}`;
}

export async function getFavorites(userId: number): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(getUserKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addFavorite(userId: number, plantId: number): Promise<number[]> {
  const favs = await getFavorites(userId);
  if (!favs.includes(plantId)) {
    favs.push(plantId);
    await AsyncStorage.setItem(getUserKey(userId), JSON.stringify(favs));
  }
  return favs;
}

export async function removeFavorite(userId: number, plantId: number): Promise<number[]> {
  let favs = await getFavorites(userId);
  favs = favs.filter((id) => id !== plantId);
  await AsyncStorage.setItem(getUserKey(userId), JSON.stringify(favs));
  return favs;
}

export async function toggleFavorite(userId: number, plantId: number): Promise<{ favorites: number[]; isFavorite: boolean }> {
  const favs = await getFavorites(userId);
  if (favs.includes(plantId)) {
    const updated = favs.filter((id) => id !== plantId);
    await AsyncStorage.setItem(getUserKey(userId), JSON.stringify(updated));
    return { favorites: updated, isFavorite: false };
  } else {
    favs.push(plantId);
    await AsyncStorage.setItem(getUserKey(userId), JSON.stringify(favs));
    return { favorites: favs, isFavorite: true };
  }
}
