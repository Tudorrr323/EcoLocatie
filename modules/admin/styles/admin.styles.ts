// admin.styles — stilurile pentru ecranul și componentele modulului admin.

import { StyleSheet } from 'react-native';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';

export const createAdminStyles = (colors: ThemeColors) => StyleSheet.create({
  // ── Screen ───────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Scroll content ───────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  // ── Section ──────────────────────────────────────────────
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  sectionBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textLight,
  },

  // ── Stats grid ───────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: '48%',
  },
  statValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statValueWarning: {
    color: colors.warning,
  },
  statValueSuccess: {
    color: colors.success,
  },
  statValueError: {
    color: colors.error,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  // ── Legacy header (unused now, kept for compat) ──────────
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.text,
  },
});
