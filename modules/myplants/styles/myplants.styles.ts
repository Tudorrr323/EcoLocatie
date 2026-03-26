// myplants.styles — stilurile modulului myplants.
import { StyleSheet, Dimensions } from 'react-native';
import { spacing, borderRadius, fonts } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createMyPlantsStyles = (colors: ThemeColors) => StyleSheet.create({
  // ── Screen ─────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },

  // ── Segmented Tabs ─────────────────────────────────────
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  segmentedTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  segmentedTabActive: {
    backgroundColor: colors.primary,
  },
  segmentedTabText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  segmentedTabTextActive: {
    color: colors.textLight,
  },

  // ── MyPlant Card (horizontal) ──────────────────────────
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  plantCardImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  plantCardInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  plantCardName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  plantCardLatin: {
    fontSize: fonts.sizes.sm,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 2,
  },
  plantCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  plantColorDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  plantCardCount: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  plantCardChevron: {
    marginLeft: spacing.sm,
  },

  // ── History Section ────────────────────────────────────
  dateSectionHeader: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  historyCardInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  historyCardName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  historyCardLatin: {
    fontSize: fonts.sizes.sm,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyCardFamily: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
    color: colors.primary,
    marginTop: spacing.xs,
  },

  // ── FAB ────────────────────────────────────────────────
  fabContainer: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    alignItems: 'flex-end',
  },
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  fabMenu: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  fabMenuText: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.text,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Detail Screen ──────────────────────────────────────
  detailContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailHeroImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  detailBackButton: {
    position: 'absolute',
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    zIndex: 10,
  },
  detailMenuButton: {
    position: 'absolute',
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    zIndex: 10,
  },
  detailInfoSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  detailPlantName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailInfoRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailInfoLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    width: 130,
  },
  detailInfoValue: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    flex: 1,
  },
  detailContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  // ── Timeline ───────────────────────────────────────────
  timelineContainer: {
    paddingLeft: spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    minHeight: 60,
  },
  timelineLineContainer: {
    width: 24,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.primary,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    zIndex: 1,
  },
  timelineCard: {
    flex: 1,
    marginLeft: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  timelineDate: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timelineComment: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  timelineImage: {
    width: 80,
    height: 60,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  timelineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },

  // ── Section Cards (Plant Info tab) ─────────────────────
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

  // ── Menu Modal ─────────────────────────────────────────
  menuModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-start',
  },
  menuModalContent: {
    position: 'absolute',
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 220,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  menuItemText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  menuItemTextDanger: {
    color: colors.error,
  },
});
