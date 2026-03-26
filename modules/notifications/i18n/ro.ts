export const notificationsRo = {
  title: 'Notificări',
  empty: 'Nu ai notificări noi.',
  markAllRead: 'Marchează toate ca citite',
  timeAgo: {
    justNow: 'Chiar acum',
    minutesAgo: 'acum {{count}} min',
    hoursAgo: 'acum {{count}} ore',
    daysAgo: 'acum {{count}} zile',
  },
  types: {
    poi_created: {
      title: 'Observație nouă',
      message: '{{userName}} a adăugat o observație nouă pentru {{plantName}}.',
    },
    poi_approved: {
      title: 'Observație aprobată',
      message: 'Observația ta pentru {{plantName}} a fost aprobată.',
    },
    poi_rejected: {
      title: 'Observație refuzată',
      message: 'Observația ta pentru {{plantName}} a fost refuzată.',
      reason: 'Motiv: {{reason}}',
    },
    poi_pending: {
      title: 'Observație în așteptare',
      message: 'Observația ta pentru {{plantName}} este în curs de verificare.',
    },
    poi_edited: {
      title: 'Observație editată',
      message: '{{userName}} a editat o observație pentru {{plantName}}. Necesită re-verificare.',
    },
    poi_commented: {
      title: 'Comentariu nou',
      message: '{{userName}} a comentat la observația ta pentru {{plantName}}.',
    },
  },
};
