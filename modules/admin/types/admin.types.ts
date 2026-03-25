// admin.types — tipuri TypeScript specifice modulului admin.
// Defineste AdminStats (statistici dashboard) si ModerationAction (aprobare/respingere).

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPOIs: number;
  approvedPOIs: number;
  pendingPOIs: number;
  totalPlants: number;
}

export type ModerationAction = 'approve' | 'reject';
