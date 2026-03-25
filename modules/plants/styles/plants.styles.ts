import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../../../shared/styles/theme';

export const plantsStyles = StyleSheet.create({
  // ── Screens ─────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  // ── Plant Card ───────────────────────────────────────────
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardNameRo: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardNameLatin: {
    fontSize: fonts.sizes.md,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  // ── Plant Detail ─────────────────────────────────────────
  detailScroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailHeroImage: {
    width: '100%',
    height: 280,
  },
  detailBackButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    zIndex: 10,
  },
  detailHeaderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  detailNameRo: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  detailNameLatin: {
    fontSize: fonts.sizes.lg,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.sm,
  },
  detailContent: {
    padding: spacing.md,
  },

  // ── Section ──────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
    paddingBottom: spacing.xs,
  },
  sectionText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },

  // ── Bullet lists ─────────────────────────────────────────
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    marginTop: 7,
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  bulletWarning: {
    backgroundColor: colors.error,
  },
  bulletText: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  bulletTextWarning: {
    color: colors.error,
  },

  // ── Info rows (habitat, harvest, preparation) ────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },

  // ── PlantSelector ────────────────────────────────────────
  selectorContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  selectorSearchWrapper: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  selectorNameRo: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  selectorNameLatin: {
    fontSize: fonts.sizes.sm,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  selectorEmpty: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
  },
});
