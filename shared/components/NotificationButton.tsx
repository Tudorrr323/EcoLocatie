// NotificationButton — buton rotund cu icon Bell si badge unread count.
// La apasare deschide modal full-screen cu lista de notificari sau EmptyState.

import React, { useState, useMemo, useCallback } from 'react';
import { TouchableOpacity, View, Text, Modal, FlatList, StyleSheet } from 'react-native';
import { Bell, BellOff, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../i18n';
import { useNotifications } from '../context/NotificationContext';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';
import { NotificationCard } from '../../modules/notifications/components/NotificationCard';
import type { AppNotification } from '../../modules/notifications/types/notifications.types';

export function NotificationButton() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [visible, setVisible] = useState(false);

  const handleOpen = useCallback(() => {
    setVisible(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleNotificationPress = useCallback(async (notification: AppNotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  }, [markAsRead]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const renderNotification = useCallback(({ item }: { item: AppNotification }) => (
    <NotificationCard notification={item} onPress={handleNotificationPress} />
  ), [handleNotificationPress]);

  const keyExtractor = useCallback((item: AppNotification) => String(item.id), []);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Bell size={20} color={colors.text} />
        {unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.shared.notifications.title}</Text>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markAllButton}
                  onPress={handleMarkAllRead}
                  activeOpacity={0.7}
                >
                  <Text style={styles.markAllText}>{t.shared.notifications.markAllRead}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <X size={22} color={colors.text} />
              </TouchableOpacity>
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
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={keyExtractor}
              style={styles.list}
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.notificationBadge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  markAllText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
});
