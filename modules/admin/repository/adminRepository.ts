import {
  getPlants,
  getUsers,
  getPOIs,
} from '../../../shared/repository/dataProvider';
import type { User, PointOfInterest } from '../../../shared/types/plant.types';
import type { AdminStats, ModerationAction } from '../types/admin.types';

// Local mutable copies to allow in-memory mutations
let localUsers: User[] = getUsers().map((u) => ({ ...u }));
let localPOIs: PointOfInterest[] = getPOIs().map((p) => ({ ...p }));

export function getAdminStats(): AdminStats {
  const plants = getPlants();
  const totalUsers = localUsers.length;
  const activeUsers = localUsers.filter((u) => u.is_active).length;
  const totalPOIs = localPOIs.length;
  const approvedPOIs = localPOIs.filter((p) => p.is_approved).length;
  const pendingPOIs = localPOIs.filter((p) => !p.is_approved).length;
  const totalPlants = plants.length;

  return {
    totalUsers,
    activeUsers,
    totalPOIs,
    approvedPOIs,
    pendingPOIs,
    totalPlants,
  };
}

export function getAllUsers(): User[] {
  return localUsers;
}

export function toggleUserStatus(userId: number): User[] {
  localUsers = localUsers.map((u) =>
    u.id === userId ? { ...u, is_active: !u.is_active } : u,
  );
  return localUsers;
}

export function moderatePOI(
  poiId: number,
  action: ModerationAction,
): PointOfInterest[] {
  localPOIs = localPOIs.map((p) =>
    p.id === poiId ? { ...p, is_approved: action === 'approve' } : p,
  );
  return localPOIs;
}

export function getPendingPOIsAdmin(): PointOfInterest[] {
  return localPOIs.filter((p) => !p.is_approved);
}

export function resetLocalData(): void {
  localUsers = getUsers().map((u) => ({ ...u }));
  localPOIs = getPOIs().map((p) => ({ ...p }));
}
