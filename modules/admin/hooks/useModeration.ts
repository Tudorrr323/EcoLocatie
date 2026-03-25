import { useState, useCallback } from 'react';
import type { User, PointOfInterest } from '../../../shared/types/plant.types';
import type { AdminStats, ModerationAction } from '../types/admin.types';
import {
  getAdminStats,
  getAllUsers,
  getPendingPOIsAdmin,
  toggleUserStatus as repoToggleUser,
  moderatePOI as repoModeratePOI,
} from '../repository/adminRepository';

interface UseModerationResult {
  stats: AdminStats;
  users: User[];
  pendingPOIs: PointOfInterest[];
  toggleUser: (userId: number) => void;
  moderatePOI: (poiId: number, action: ModerationAction) => void;
  refreshData: () => void;
}

export function useModeration(): UseModerationResult {
  const [stats, setStats] = useState<AdminStats>(() => getAdminStats());
  const [users, setUsers] = useState<User[]>(() => getAllUsers());
  const [pendingPOIs, setPendingPOIs] = useState<PointOfInterest[]>(
    () => getPendingPOIsAdmin(),
  );

  const refreshData = useCallback(() => {
    setStats(getAdminStats());
    setUsers(getAllUsers());
    setPendingPOIs(getPendingPOIsAdmin());
  }, []);

  const toggleUser = useCallback((userId: number) => {
    const updatedUsers = repoToggleUser(userId);
    setUsers([...updatedUsers]);
    setStats(getAdminStats());
  }, []);

  const moderatePOI = useCallback(
    (poiId: number, action: ModerationAction) => {
      repoModeratePOI(poiId, action);
      setPendingPOIs(getPendingPOIsAdmin());
      setStats(getAdminStats());
    },
    [],
  );

  return {
    stats,
    users,
    pendingPOIs,
    toggleUser,
    moderatePOI,
    refreshData,
  };
}
