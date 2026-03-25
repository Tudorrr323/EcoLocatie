import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../../../shared/styles/theme';

export const sightingsStyles = StyleSheet.create({
  // ── Screen ──────────────────────────────────────────────────
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
  },

  // ── Step Indicator ───────────────────────────────────────────
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepConnector: {
    flex: 0.5,
    height: 2,
    backgroundColor: colors.border,
  },
  stepConnectorActive: {
    backgroundColor: colors.primaryLight,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleDone: {
    backgroundColor: colors.primaryLight,
  },
  stepNumber: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepNumberActive: {
    color: colors.textLight,
  },
  stepLabel: {
    fontSize: fonts.sizes.sm - 1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // ── Form / Scroll ────────────────────────────────────────────
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },

  // ── Photo Capture ────────────────────────────────────────────
  photoCaptureContainer: {
    marginBottom: spacing.md,
  },
  photoPreviewWrapper: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  photoPreview: {
    width: '100%',
    height: 240,
    borderRadius: borderRadius.xl,
  },
  photoButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photoButtonFlex: {
    flex: 1,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  noImageText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // ── AI Results ───────────────────────────────────────────────
  aiResultsContainer: {
    marginBottom: spacing.md,
  },
  aiLoadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  aiLoadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  aiResultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLight,
  },
  aiResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aiResultPlantName: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  aiResultConfidenceText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
  },
  aiConfidenceBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  aiConfidenceBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  aiSelectButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  aiSelectButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  aiManualButton: {
    marginTop: spacing.sm,
  },

  // ── Location Step ────────────────────────────────────────────
  locationContainer: {
    marginBottom: spacing.md,
  },
  locationCard: {
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
  locationCoordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  locationLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '600',
  },
  locationNoDataText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  locationErrorText: {
    fontSize: fonts.sizes.sm,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  // ── Details Step ─────────────────────────────────────────────
  detailsContainer: {
    marginBottom: spacing.md,
  },
  selectedPlantCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPlantLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectedPlantName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },

  // ── Navigation ───────────────────────────────────────────────
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  navButtonFlex: {
    flex: 1,
  },

  // ── POI Callout ──────────────────────────────────────────────
  calloutContainer: {
    width: 220,
    padding: spacing.sm,
  },
  calloutPlantName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  calloutLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  calloutValue: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    fontWeight: '500',
  },
  calloutConfidenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  calloutConfidenceText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textLight,
  },
  calloutComment: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});
