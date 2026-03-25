// map.styles — stilurile StyleSheet pentru toate componentele modulului de harta.
// Include stiluri pentru header, search, harta, buton GPS, filtre, callout, markere, location picker.

import { StyleSheet, Platform } from 'react-native';
import { spacing, borderRadius, fonts } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';

export const createMapStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  map: {
    flex: 1,
  },

searchContainer: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  searchBarWrapper: {
    flex: 1,
  },

  mapWrapper: {
    flex: 1,
  },

  gpsButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Floating action buttons
  floatingButtonsContainer: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    gap: spacing.sm,
    alignItems: 'flex-end',
  },

  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  floatingButtonPrimary: {
    backgroundColor: colors.primary,
  },

  floatingButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.text,
  },

  floatingButtonTextPrimary: {
    color: colors.textLight,
  },

  // Filter panel
  filterPanelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },

  filterPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  filterPanelHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  filterPanelTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },

  filterToggleAllButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },

  filterToggleAllText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
    color: colors.primary,
  },

  filterList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  filterItemLast: {
    borderBottomWidth: 0,
  },

  filterColorDot: {
    width: 14,
    height: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  filterItemLabel: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },

  filterCheckbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterCheckboxTick: {
    color: colors.textLight,
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    lineHeight: 14,
  },

  filterPanelFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  filterApplyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },

  filterApplyButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.textLight,
  },

  filterCloseButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterCloseButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },

  // Callout
  calloutContainer: {
    width: 200,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },

  calloutPlantName: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },

  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  calloutLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  calloutValue: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },

  calloutComment: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
    lineHeight: 16,
  },

  // Custom marker
  markerContainer: {
    alignItems: 'center',
  },

  markerPin: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 2.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  markerLabel: {
    marginTop: 2,
    fontSize: fonts.sizes.xs - 1,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    maxWidth: 64,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },

  // Location picker
  locationPickerContainer: {
    flex: 1,
  },

  locationPickerMap: {
    flex: 1,
  },

  crosshairContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },

  crosshairHorizontal: {
    position: 'absolute',
    width: 32,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  crosshairDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  locationPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: spacing.xl,
      },
    }),
  },

  locationPickerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationPickerCoordsBox: {
    flex: 1,
    alignItems: 'center',
  },

  locationPickerCoordsLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },

  locationPickerCoordsValue: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '700',
  },

  // Center pin
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -52 }],
    width: 40,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'none',
  },

  centerPinShadow: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  locationPickerFooter: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  locationPickerConfirmButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  locationPickerConfirmButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.textLight,
  },
});
