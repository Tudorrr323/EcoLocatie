// useMyPlants — hook pentru gestionarea starii modulului myplants.
// Gestioneaza tab-ul activ, lista de plante, istoric si stergerea plantelor.
// Datele sunt incarcate async de la API.

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { getUserHistory } from '../repository/myPlantsRepository';
import { getPlants } from '../../../shared/repository/dataProvider';
import { useFavorites } from '../../../shared/hooks/useFavorites';
import type { Plant } from '../../../shared/types/plant.types';
import type { MyPlantsTab, HistoryGroup, HistoryEntry } from '../types/myplants.types';
import { useTranslation } from '../../../shared/i18n';

function groupHistoryByDate(entries: HistoryEntry[], t: ReturnType<typeof useTranslation>): HistoryGroup[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

  const groups = new Map<string, HistoryEntry[]>();

  entries.forEach((entry) => {
    const dateKey = entry.poi.created_at.split('T')[0];
    const existing = groups.get(dateKey) || [];
    existing.push(entry);
    groups.set(dateKey, existing);
  });

  return Array.from(groups.entries()).map(([dateKey, items]) => {
    let dateLabel: string;
    if (dateKey === today) {
      dateLabel = t.myPlants.dateToday;
    } else if (dateKey === yesterday) {
      dateLabel = t.myPlants.dateYesterday;
    } else {
      const date = new Date(dateKey + 'T00:00:00');
      dateLabel = date.toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    return { dateLabel, entries: items };
  });
}

export function useMyPlants() {
  const { user } = useAuthContext();
  const t = useTranslation();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<MyPlantsTab>('plants');
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [allHistory, setAllHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAllPlants([]);
      setAllHistory([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([getPlants(), getUserHistory(user.id)])
      .then(([plants, history]) => {
        if (!cancelled) {
          setAllPlants(plants);
          setAllHistory(history);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  // Plants tab = favorite plants
  const favoritePlants = useMemo(() => {
    return allPlants.filter((p) => favoriteIds.includes(p.id));
  }, [allPlants, favoriteIds]);

  // History tab = user's own observations (unchanged)
  const history = useMemo(() => {
    return groupHistoryByDate(allHistory, t);
  }, [allHistory, t]);

  const plantCount = favoritePlants.length;
  const historyCount = allHistory.length;

  return {
    activeTab,
    setActiveTab,
    favoritePlants,
    history,
    plantCount,
    historyCount,
    isFavorite,
    toggleFavorite,
    loading,
  };
}
