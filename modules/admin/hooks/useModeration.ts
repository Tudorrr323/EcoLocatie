// useModeration — hook pentru logica de administrare.
// Gestionează statistici, utilizatori, toate observațiile cu search/filter, și moderare.

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { User, PointOfInterest } from '../../../shared/types/plant.types';
import type { AdminStats, ModerationAction, POIStatusFilter, UserStatusFilter } from '../types/admin.types';
import {
  getAdminStats,
  getAllUsers,
  getPendingPOIsAdmin,
  getAllPOIsAdmin,
  toggleUserStatus as repoToggleUser,
  moderatePOI as repoModeratePOI,
} from '../repository/adminRepository';
import { getPlants } from '../../../shared/repository/dataProvider';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import type { Plant } from '../../../shared/types/plant.types';
import { useSettings, getPlantName as getPlantDisplayName } from '../../../shared/context/SettingsContext';

interface UseModerationResult {
  stats: AdminStats;
  users: User[];
  filteredUsers: User[];
  allPOIs: PointOfInterest[];
  filteredPOIs: PointOfInterest[];
  pendingPOIs: PointOfInterest[];
  plants: Plant[];
  loading: boolean;
  statusFilter: POIStatusFilter;
  searchQuery: string;
  userSearchQuery: string;
  userStatusFilter: UserStatusFilter;
  setStatusFilter: (filter: POIStatusFilter) => void;
  setSearchQuery: (query: string) => void;
  setUserSearchQuery: (query: string) => void;
  setUserStatusFilter: (filter: UserStatusFilter) => void;
  toggleUser: (userId: number, reason?: string) => void;
  moderatePOI: (poiId: number, action: ModerationAction, reason?: string) => void;
  refreshData: () => void;
  getPlantName: (plantId: number) => string;
  getUserName: (userId: number) => string;
}

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalPOIs: 0,
  approvedPOIs: 0,
  pendingPOIs: 0,
  rejectedPOIs: 0,
  totalPlants: 0,
};

export function useModeration(): UseModerationResult {
  const { language } = useSettings();
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS);
  const [users, setUsers] = useState<User[]>([]);
  const [allPOIs, setAllPOIs] = useState<PointOfInterest[]>([]);
  const [pendingPOIs, setPendingPOIs] = useState<PointOfInterest[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<POIStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>('all');

  const plantMap = useMemo(() => {
    const map = new Map<number, Plant>();
    for (const p of plants) map.set(p.id, p);
    return map;
  }, [plants]);

  const userMap = useMemo(() => {
    const map = new Map<number, User>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const getPlantName = useCallback((plantId: number): string => {
    const plant = plantMap.get(plantId);
    return plant ? getPlantDisplayName(plant) : '';
  }, [plantMap]);

  const getUserName = useCallback((userId: number): string => {
    const u = userMap.get(userId);
    if (!u) return '';
    if (u.first_name || u.last_name) return `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
    return u.username;
  }, [userMap]);

  const filteredPOIs = useMemo(() => {
    let filtered = allPOIs;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = removeDiacritics(searchQuery.trim().toLowerCase());
      filtered = filtered.filter((poi) => {
        const plantName = removeDiacritics(getPlantName(poi.plant_id).toLowerCase());
        const userName = removeDiacritics(getUserName(poi.user_id).toLowerCase());
        const comment = removeDiacritics((poi.comment ?? '').toLowerCase());
        return plantName.includes(q) || userName.includes(q) || comment.includes(q);
      });
    }
    return filtered;
  }, [allPOIs, statusFilter, searchQuery, getPlantName, getUserName]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (userStatusFilter === 'active') {
      filtered = filtered.filter((u) => u.is_active);
    } else if (userStatusFilter === 'inactive') {
      filtered = filtered.filter((u) => !u.is_active);
    }
    if (userSearchQuery.trim()) {
      const q = removeDiacritics(userSearchQuery.trim().toLowerCase());
      filtered = filtered.filter((u) => {
        const name = removeDiacritics(`${u.first_name ?? ''} ${u.last_name ?? ''} ${u.username} ${u.email}`.toLowerCase());
        return name.includes(q);
      });
    }
    return filtered;
  }, [users, userSearchQuery, userStatusFilter]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u, p, pl] = await Promise.all([
        getAdminStats().catch(() => EMPTY_STATS),
        getAllUsers().catch(() => [] as User[]),
        getPendingPOIsAdmin().catch(() => [] as PointOfInterest[]),
        getPlants().catch(() => [] as Plant[]),
      ]);
      setUsers(u);
      setPendingPOIs(p);
      setPlants(pl);
      // Fetch approved POIs and merge with already-fetched pending
      const all = await getAllPOIsAdmin(p).catch(() => [...p]);
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAllPOIs(all);
      // Fix stats with actual counts from POI list
      const rejected = all.filter((poi) => poi.status === 'rejected').length;
      const approved = all.filter((poi) => poi.status === 'approved').length;
      const activeUsers = u.filter((usr) => usr.is_active).length;
      setStats({ ...s, rejectedPOIs: rejected, approvedPOIs: approved, activeUsers });
    } catch (err) {
      console.error('[Admin] refreshData error:', err);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleUser = useCallback(async (userId: number, reason?: string) => {
    try {
      const updatedUsers = await repoToggleUser(userId, reason);
      setUsers([...updatedUsers]);
      const newStats = await getAdminStats();
      setStats(newStats);
    } catch {
      // keep current state
    }
  }, []);

  const moderatePOI = useCallback(
    async (poiId: number, action: ModerationAction, reason?: string) => {
      try {
        const updatedPending = await repoModeratePOI(poiId, action, reason);
        setPendingPOIs(updatedPending);
        // Refresh all POIs and stats — pass updated pending to merge
        const [newStats, newAll] = await Promise.all([getAdminStats(), getAllPOIsAdmin(updatedPending)]);
        const rejected = newAll.filter((p) => p.status === 'rejected').length;
        const approved = newAll.filter((p) => p.status === 'approved').length;
        setStats({ ...newStats, rejectedPOIs: rejected, approvedPOIs: approved });
        setAllPOIs(newAll);
      } catch {
        // keep current state
      }
    },
    [],
  );

  return {
    stats,
    users,
    filteredUsers,
    allPOIs,
    filteredPOIs,
    pendingPOIs,
    plants,
    loading,
    statusFilter,
    searchQuery,
    userSearchQuery,
    userStatusFilter,
    setStatusFilter,
    setSearchQuery,
    setUserSearchQuery,
    setUserStatusFilter,
    toggleUser,
    moderatePOI,
    refreshData,
    getPlantName,
    getUserName,
  };
}
