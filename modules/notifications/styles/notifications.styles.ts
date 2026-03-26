import { StyleSheet } from 'react-native';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';

export const createNotificationCardStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardUnread: {
    backgroundColor: colors.notificationUnread,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconApproved: {
    backgroundColor: colors.success + '20',
  },
  iconRejected: {
    backgroundColor: colors.error + '20',
  },
  iconPending: {
    backgroundColor: colors.warning + '20',
  },
  iconCreated: {
    backgroundColor: colors.primary + '20',
  },
  iconEdited: {
    backgroundColor: colors.secondary + '20',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  time: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  message: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  reason: {
    fontSize: fonts.sizes.sm,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});

export const createNotificationListStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  markAllText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
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
});
