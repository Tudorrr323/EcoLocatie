import { StyleSheet, Platform } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../../../shared/styles/theme';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? spacing.xl + spacing.lg : spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerIconText: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    opacity: 0.85,
    marginTop: spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    fontSize: fonts.sizes.sm,
    color: colors.error,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  switchText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  switchLink: {
    fontSize: fonts.sizes.md,
    color: colors.primaryLight,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
