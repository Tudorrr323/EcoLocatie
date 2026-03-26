// NotificationsScreen — ecran dedicat pentru lista de notificari.
// Accesat din SettingsScreen. Afiseaza lista notificari cu paginare, mark all read, empty state.

import React, { useMemo, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, BellOff } from 'lucide-react-native';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { useNotifications } from '../../../shared/context/NotificationContext';
import { usePagination } from '../../../shared/hooks/usePagination';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { Pagination } from '../../../shared/components/Pagination';
import { NotificationCard } from '../components/NotificationCard';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import type { AppNotification, NotificationType } from '../types/notifications.types';

function getRouteForNotification(type: NotificationType): string {
  switch (type) {
    case 'poi_created':
    case 'poi_edited':
      return '/(tabs)/admin';
    case 'poi_commented':
      return '/(tabs)';
    case 'poi_approved':
    case 'poi_rejected':
    case 'poi_pending':
    default:
      return '/(tabs)/my-plants';
  }
}

export function NotificationsScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const {
    currentPage, totalPages, paginatedItems,
    onPageChange, pageSize, onPageSizeChange,
  } = usePagination(notifications, 10);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationPress = useCallback(async (notification: AppNotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    const route = getRouteForNotification(notification.type);
    router.navigate(route as any);
  }, [markAsRead, router]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const renderNotification = useCallback(({ item }: { item: AppNotification }) => (
    <NotificationCard notification={item} onPress={handleNotificationPress} />
  ), [handleNotificationPress]);

  const keyExtractor = useCallback((item: AppNotification) => String(item.id), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.shared.notifications.title}</Text>
        <View style={styles.backBtn}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.markAllText}>{t.shared.notifications.markAllRead}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && notifications.length === 0 ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState
          message={t.shared.notifications.empty}
          icon={<BellOff size={48} color={colors.textSecondary} />}
        />
      ) : (
        <FlatList
          data={paginatedItems}
          renderItem={renderNotification}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListFooterComponent={
            totalPages > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  markAllText: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
});
