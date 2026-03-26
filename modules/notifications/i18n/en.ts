import type { notificationsRo } from './ro';

export const notificationsEn: typeof notificationsRo = {
  title: 'Notifications',
  empty: 'No new notifications.',
  markAllRead: 'Mark all as read',
  timeAgo: {
    justNow: 'Just now',
    minutesAgo: '{{count}} min ago',
    hoursAgo: '{{count}} hours ago',
    daysAgo: '{{count}} days ago',
  },
  types: {
    poi_created: {
      title: 'New observation',
      message: '{{userName}} added a new observation for {{plantName}}.',
    },
    poi_approved: {
      title: 'Observation approved',
      message: 'Your observation for {{plantName}} has been approved.',
    },
    poi_rejected: {
      title: 'Observation rejected',
      message: 'Your observation for {{plantName}} has been rejected.',
      reason: 'Reason: {{reason}}',
    },
    poi_pending: {
      title: 'Observation pending',
      message: 'Your observation for {{plantName}} is being reviewed.',
    },
    poi_edited: {
      title: 'Observation edited',
      message: '{{userName}} edited an observation for {{plantName}}. Needs re-review.',
    },
    poi_commented: {
      title: 'New comment',
      message: '{{userName}} commented on your observation for {{plantName}}.',
    },
  },
};
