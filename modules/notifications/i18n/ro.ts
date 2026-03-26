export const notificationsRo = {
  title: 'Notificari',
  empty: 'Nu ai notificari noi.',
  markAllRead: 'Marcheaza toate ca citite',
  timeAgo: {
    justNow: 'Chiar acum',
    minutesAgo: 'acum {{count}} min',
    hoursAgo: 'acum {{count}} ore',
    daysAgo: 'acum {{count}} zile',
  },
  types: {
    poi_created: {
      title: 'Observatie noua',
      message: '{{userName}} a adaugat o observatie noua pentru {{plantName}}.',
    },
    poi_approved: {
      title: 'Observatie aprobata',
      message: 'Observatia ta pentru {{plantName}} a fost aprobata.',
    },
    poi_rejected: {
      title: 'Observatie refuzata',
      message: 'Observatia ta pentru {{plantName}} a fost refuzata.',
      reason: 'Motiv: {{reason}}',
    },
    poi_pending: {
      title: 'Observatie in asteptare',
      message: 'Observatia ta pentru {{plantName}} este in curs de verificare.',
    },
    poi_edited: {
      title: 'Observatie editata',
      message: '{{userName}} a editat o observatie pentru {{plantName}}. Necesita re-verificare.',
    },
    poi_commented: {
      title: 'Comentariu nou',
      message: '{{userName}} a comentat la observatia ta pentru {{plantName}}.',
    },
  },
};
