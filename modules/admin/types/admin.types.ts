// admin.types — tipuri TypeScript specifice modulului admin.

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPOIs: number;
  approvedPOIs: number;
  pendingPOIs: number;
  rejectedPOIs: number;
  totalPlants: number;
}

export type ModerationAction = 'approve' | 'reject';

export type POIStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export type AdminTab = 'dashboard' | 'observations' | 'users';

export type UserStatusFilter = 'all' | 'active' | 'inactive';

export interface ChartBar {
  label: string;
  value: number;
  color: string;
}
