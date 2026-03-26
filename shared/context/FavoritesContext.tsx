// FavoritesContext — context global pentru plantele favorite.
// Starea e partajata intre toate ecranele, asa ca un toggle in Enciclopedie
// se reflecta imediat in MyPlants si vice-versa.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { getFavorites, toggleFavorite as toggleFav } from '../services/favoritesService';

interface FavoritesContextType {
  favoriteIds: number[];
  isFavorite: (plantId: number) => boolean;
  toggleFavorite: (plantId: number) => Promise<void>;
  refreshFavorites: () => void;
  lastAction: 'added' | 'removed' | null;
  clearLastAction: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState<'added' | 'removed' | null>(null);

  const refreshFavorites = useCallback(() => {
    if (user) {
      getFavorites(user.id).then(setFavoriteIds).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getFavorites(user.id).then(setFavoriteIds).catch(() => {});
    } else {
      setFavoriteIds([]);
    }
  }, [user]);

  const isFavorite = useCallback(
    (plantId: number) => favoriteIds.includes(plantId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(async (plantId: number) => {
    if (!user) return;
    const result = await toggleFav(user.id, plantId);
    setFavoriteIds(result.favorites);
    setLastAction(result.isFavorite ? 'added' : 'removed');
  }, [user]);

  const clearLastAction = useCallback(() => setLastAction(null), []);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, refreshFavorites, lastAction, clearLastAction }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext trebuie folosit in interiorul FavoritesProvider');
  return ctx;
}
