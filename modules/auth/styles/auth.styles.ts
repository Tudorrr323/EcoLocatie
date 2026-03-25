// auth.styles — stilurile pentru ecranele de login si register cu design modern.
// Background alb, campuri cu iconite, buton pill verde, loading overlay modal.

import { StyleSheet } from 'react-native';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';

export const createAuthStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
    marginBottom: spacing.md,
  },

  // Sectiunea titlu
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.sizes.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },

  // Eroare generala
  errorBox: {
    backgroundColor: colors.errorBackground,
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

  // Campuri de input
  fieldLabel: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    minHeight: 52,
  },
  inputWrapperError: {
    borderColor: colors.error,
    marginBottom: spacing.xs,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    paddingVertical: spacing.sm + 2,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  fieldError: {
    fontSize: fonts.sizes.sm,
    color: colors.error,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  // Rand cu doua coloane (first/last name)
  nameRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nameField: {
    flex: 1,
  },

  // Rand "Tine-ma minte" + "Ai uitat parola?"
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 15,
  },
  rememberText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  forgotText: {
    fontSize: fonts.sizes.md,
    color: colors.primary,
    fontWeight: '500',
    textDecorationLine: 'underline' as const,
  },

  // Buton submit
  submitButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
  },

  // Link comutare login/register
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
    color: colors.primary,
    fontWeight: '600',
  },

  // Text placeholder pentru campul de data nasterii (TouchableOpacity, nu TextInput)
  placeholderText: {
    color: colors.placeholderText,
  },

  // Linkuri legal (Politica / Termeni)
  legalSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
  },
  legalLink: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // Loading overlay modal
  loadingOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl + spacing.md,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginTop: spacing.md,
    fontWeight: '500',
  },
});
