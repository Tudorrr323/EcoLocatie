export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPOIs: number;
  approvedPOIs: number;
  pendingPOIs: number;
  totalPlants: number;
}

export type ModerationAction = 'approve' | 'reject';
