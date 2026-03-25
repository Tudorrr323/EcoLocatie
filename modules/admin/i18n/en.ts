import type { adminRo } from './ro';

export const adminEn: typeof adminRo = {
  header: 'Administration',
  sections: {
    stats: 'Statistics',
    users: 'Users',
    moderation: 'Moderation',
  },
  stats: {
    totalUsers: 'Total users',
    activeUsers: 'Active users',
    totalPOIs: 'Total observations',
    approvedPOIs: 'Approved observations',
    pendingPOIs: 'Pending',
    totalPlants: 'Plant species',
  },
  moderation: {
    approve: 'Approve',
    reject: 'Reject',
    emptyState: 'No pending observations. Everything is up to date!',
    confidence: 'AI Confidence',
    by: 'by',
    coordinates: 'Coordinates',
    date: 'Date',
    comment: 'Comment',
  },
  users: {
    active: 'Active',
    inactive: 'Inactive',
    admin: 'admin',
    user: 'user',
    registered: 'Registered',
  },
};
