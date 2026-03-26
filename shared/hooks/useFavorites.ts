// useFavorites — hook global pentru gestionarea plantelor favorite.
// Încarcă favorites din AsyncStorage la mount și expune toggle + check.
// Returnează lastAction pentru a afișa snackbar la add/remove.

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getFavorites, toggleFavorite as toggleFav } from '../services/favoritesService';

export function useFavorites() {
  const { user } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState<'added' | 'removed' | null>(null);

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

  return { favoriteIds, isFavorite, toggleFavorite, lastAction, clearLastAction };
}
