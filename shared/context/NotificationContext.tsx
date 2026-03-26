// NotificationContext — context global pentru notificarile in-app.
// Polling periodic pentru unread count + fetch lista la deschiderea panelului.

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import type { AppNotification } from '../../modules/notifications/types/notifications.types';
import {
  getNotifications,
  getUnreadCount,
  markAsRead as repoMarkAsRead,
  markAllAsRead as repoMarkAllAsRead,
} from '../../modules/notifications/repository/notificationsRepository';
import { useAuthContext } from './AuthContext';

const POLL_INTERVAL = 30_000; // 30 secunde

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const result = await getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id: number) => {
    await repoMarkAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await repoMarkAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  // Polling pentru unread count
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refreshUnreadCount();

    intervalRef.current = setInterval(refreshUnreadCount, POLL_INTERVAL);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshUnreadCount();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, [isAuthenticated, refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, refreshUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications trebuie folosit in interiorul NotificationProvider');
  return ctx;
}
