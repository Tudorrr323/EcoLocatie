// notificationsRepository — acces la notificarile utilizatorului via API.

import { apiGet, apiPut } from '../../../shared/services/apiClient';
import type { AppNotification } from '../types/notifications.types';
import { MOCK_NOTIFICATIONS } from '../../../shared/mock/mockData';

interface NotificationsListResponse {
  data: AppNotification[];
  total: number;
  unread_count: number;
}

interface UnreadCountResponse {
  unread_count: number;
}

export async function getNotifications(): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
  try {
    const response = await apiGet<NotificationsListResponse>('/api/notifications?limit=50', true);
    return {
      notifications: response.data,
      unreadCount: response.unread_count,
    };
  } catch {
    // Mock fallback — returneaza notificari pentru user 2 (Tudor)
    const mock = MOCK_NOTIFICATIONS;
    const unread = mock.filter((n) => !n.is_read).length;
    return { notifications: mock, unreadCount: unread };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiGet<UnreadCountResponse>('/api/notifications/unread-count', true);
    return response.unread_count;
  } catch {
    return MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length;
  }
}

export async function markAsRead(notificationId: number): Promise<void> {
  try {
    await apiPut<void>(`/api/notifications/${notificationId}/read`, {}, true);
  } catch {
    // silently fail
  }
}

export async function markAllAsRead(): Promise<void> {
  try {
    await apiPut<void>('/api/notifications/read-all', {}, true);
  } catch {
    // silently fail
  }
}
