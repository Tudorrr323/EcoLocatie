// POIFavoritesContext — context global pentru observațiile favorite (per POI).
// Separat de FavoritesContext (care e per plantă, pentru enciclopedie).
// Persistă local în AsyncStorage. Tab-ul Plante din MyPlants folosește acest context.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from './AuthContext';

const STORAGE_KEY = '@ecolocatie_poi_favorites';

function getUserKey(userId: number): string {
  return `${STORAGE_KEY}_${userId}`;
}

interface POIFavoritesContextType {
  favoritePoiIds: number[];
  isPoiFavorite: (poiId: number) => boolean;
  togglePoiFavorite: (poiId: number) => void;
  lastAction: 'added' | 'removed' | null;
  clearLastAction: () => void;
}

const POIFavoritesContext = createContext<POIFavoritesContextType | null>(null);

export function POIFavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [favoritePoiIds, setFavoritePoiIds] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState<'added' | 'removed' | null>(null);

  useEffect(() => {
    if (!user) { setFavoritePoiIds([]); return; }
    AsyncStorage.getItem(getUserKey(user.id))
      .then((raw) => setFavoritePoiIds(raw ? JSON.parse(raw) : []))
      .catch(() => setFavoritePoiIds([]));
  }, [user]);

  const persist = useCallback(async (ids: number[]) => {
    if (!user) return;
    await AsyncStorage.setItem(getUserKey(user.id), JSON.stringify(ids));
  }, [user]);

  const isPoiFavorite = useCallback(
    (poiId: number) => favoritePoiIds.includes(poiId),
    [favoritePoiIds],
  );

  const togglePoiFavorite = useCallback((poiId: number) => {
    setFavoritePoiIds((prev) => {
      const exists = prev.includes(poiId);
      const next = exists ? prev.filter((id) => id !== poiId) : [...prev, poiId];
      persist(next);
      setLastAction(exists ? 'removed' : 'added');
      return next;
    });
  }, [persist]);

  const clearLastAction = useCallback(() => setLastAction(null), []);

  return (
    <POIFavoritesContext.Provider value={{ favoritePoiIds, isPoiFavorite, togglePoiFavorite, lastAction, clearLastAction }}>
      {children}
    </POIFavoritesContext.Provider>
  );
}

export function usePOIFavorites(): POIFavoritesContextType {
  const ctx = useContext(POIFavoritesContext);
  if (!ctx) throw new Error('usePOIFavorites trebuie folosit in interiorul POIFavoritesProvider');
  return ctx;
}
