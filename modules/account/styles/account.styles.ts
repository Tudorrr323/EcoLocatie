// account.styles — stilurile modulului de cont al utilizatorului.
// Defineste layout-ul pentru avatar, sectiunile de informatii, elementele de meniu si butonul de deconectare.
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../../../shared/styles/theme';

export const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.textLight,
  },
  username: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  infoText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  menuItemText: {
    fontSize: fonts.sizes.lg,
    color: colors.text,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.error,
  },
});
