// useMyPlants — hook pentru gestionarea starii modulului myplants.
// Gestioneaza tab-ul activ, lista de plante, istoric si stergerea plantelor.
// Datele sunt incarcate async de la API.

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { getUserHistory, getFavoritePOIEntries, getPlantsByIds } from '../repository/myPlantsRepository';
import { usePOIFavorites } from '../../../shared/context/POIFavoritesContext';
import { useFavoritesContext } from '../../../shared/context/FavoritesContext';
import type { Plant } from '../../../shared/types/plant.types';
import type { MyPlantsTab, HistoryGroup, HistoryEntry, PlantTabItem } from '../types/myplants.types';
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
  const { favoritePoiIds, isPoiFavorite, togglePoiFavorite } = usePOIFavorites();
  const { favoriteIds: favoritePlantIds, isFavorite: isPlantFavorite, toggleFavorite: togglePlantFavorite, refreshFavorites } = useFavoritesContext();
  const [activeTab, setActiveTab] = useState<MyPlantsTab>('plants');
  const [allHistory, setAllHistory] = useState<HistoryEntry[]>([]);
  const [favoritePOIEntries, setFavoritePOIEntries] = useState<HistoryEntry[]>([]);
  const [favoritePlants, setFavoritePlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!user) {
      setAllHistory([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getUserHistory(user.id)
      .then((history) => {
        if (!cancelled) setAllHistory(history);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  // Load on mount
  useEffect(loadData, [loadData]);

  // Reload when screen gains focus (e.g. after adding a new observation or toggling favorites)
  useFocusEffect(useCallback(() => {
    loadData();
    refreshFavorites();
  }, [loadData, refreshFavorites]));

  // Load favorited POIs (observations)
  useEffect(() => {
    if (favoritePoiIds.length === 0) {
      setFavoritePOIEntries([]);
      return;
    }
    let cancelled = false;
    getFavoritePOIEntries(favoritePoiIds)
      .then((entries) => { if (!cancelled) setFavoritePOIEntries(entries); })
      .catch(() => { if (!cancelled) setFavoritePOIEntries([]); });
    return () => { cancelled = true; };
  }, [favoritePoiIds]);

  // Load favorited plants (from encyclopedia)
  useEffect(() => {
    console.log('[DEBUG useMyPlants] favoritePlantIds changed:', favoritePlantIds);
    if (favoritePlantIds.length === 0) {
      setFavoritePlants([]);
      return;
    }
    let cancelled = false;
    getPlantsByIds(favoritePlantIds)
      .then((plants) => {
        console.log('[DEBUG useMyPlants] loaded plants:', plants.length, plants.map(p => p.id));
        if (!cancelled) setFavoritePlants(plants);
      })
      .catch((err) => {
        console.log('[DEBUG useMyPlants] error loading plants:', err);
        if (!cancelled) setFavoritePlants([]);
      });
    return () => { cancelled = true; };
  }, [favoritePlantIds]);

  // Combine POI favorites + plant favorites into a single list, deduplicating by plant_id
  const plantTabItems: PlantTabItem[] = useMemo(() => {
    const items: PlantTabItem[] = [];
    const seenPlantIds = new Set<number>();

    // POI favorites first
    for (const entry of favoritePOIEntries) {
      items.push({ kind: 'poi', entry });
      seenPlantIds.add(entry.plant.id);
    }

    // Plant favorites that don't already appear via POI favorites
    for (const plant of favoritePlants) {
      if (!seenPlantIds.has(plant.id)) {
        items.push({ kind: 'plant', plant });
      }
    }

    return items;
  }, [favoritePOIEntries, favoritePlants]);

  const plantCount = plantTabItems.length;
  const historyCount = allHistory.length;

  return {
    activeTab,
    setActiveTab,
    plantTabItems,
    allHistory,
    plantCount,
    historyCount,
    isPoiFavorite,
    togglePoiFavorite,
    isPlantFavorite,
    togglePlantFavorite,
    loading,
    groupHistoryByDate: (entries: HistoryEntry[]) => groupHistoryByDate(entries, t),
  };
}
