// NotificationCard — card individual de notificare cu icon per tip, titlu, mesaj si timp relativ.

import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { CheckCircle2, XCircle, Clock, Plus, Edit3, MessageCircle } from 'lucide-react-native';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { createNotificationCardStyles } from '../styles/notifications.styles';
import type { AppNotification, NotificationType } from '../types/notifications.types';

interface NotificationCardProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
}

function getTimeAgo(dateString: string, t: ReturnType<typeof useTranslation>): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t.notifications.timeAgo.justNow;
  if (diffMin < 60) return t.notifications.timeAgo.minutesAgo.replace('{{count}}', String(diffMin));
  if (diffHours < 24) return t.notifications.timeAgo.hoursAgo.replace('{{count}}', String(diffHours));
  return t.notifications.timeAgo.daysAgo.replace('{{count}}', String(diffDays));
}

function getIcon(type: NotificationType, colors: ReturnType<typeof useThemeColors>) {
  const size = 20;
  switch (type) {
    case 'poi_approved':
      return <CheckCircle2 size={size} color={colors.success} />;
    case 'poi_rejected':
      return <XCircle size={size} color={colors.error} />;
    case 'poi_pending':
      return <Clock size={size} color={colors.warning} />;
    case 'poi_created':
      return <Plus size={size} color={colors.primary} />;
    case 'poi_edited':
      return <Edit3 size={size} color={colors.secondary} />;
    case 'poi_commented':
      return <MessageCircle size={size} color={colors.logoTeal} />;
  }
}

function getIconStyle(type: NotificationType, styles: ReturnType<typeof createNotificationCardStyles>) {
  switch (type) {
    case 'poi_approved': return styles.iconApproved;
    case 'poi_rejected': return styles.iconRejected;
    case 'poi_pending': return styles.iconPending;
    case 'poi_created': return styles.iconCreated;
    case 'poi_edited': return styles.iconEdited;
    case 'poi_commented': return styles.iconCreated;
  }
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createNotificationCardStyles(colors), [colors]);

  const timeAgo = getTimeAgo(notification.created_at, t);

  return (
    <TouchableOpacity
      style={[styles.card, !notification.is_read && styles.cardUnread]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, getIconStyle(notification.type, styles)]}>
        {getIcon(notification.type, colors)}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
          {!notification.is_read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        {notification.reason && notification.type === 'poi_rejected' && (
          <Text style={styles.reason} numberOfLines={2}>
            {t.notifications.types.poi_rejected.reason.replace('{{reason}}', notification.reason)}
          </Text>
        )}
        <Text style={[styles.time, { marginTop: 4 }]}>{timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}
