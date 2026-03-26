// notifications.types — tipurile pentru sistemul de notificari in-app.

export type NotificationType =
  | 'poi_created'    // observatie noua creata (admin primeste)
  | 'poi_approved'   // observatie aprobata (user primeste)
  | 'poi_rejected'   // observatie refuzata cu motiv (user primeste)
  | 'poi_pending'    // observatie in asteptare (user primeste)
  | 'poi_edited'     // observatie editata, necesita re-review (admin primeste)
  | 'poi_commented'; // comentariu nou pe observatia ta (user primeste)

export interface AppNotification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  poi_id?: number;
  plant_name?: string;
  reason?: string;
  created_at: string;
}
