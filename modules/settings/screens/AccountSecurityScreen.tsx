// AccountSecurityScreen — ecranul de securitate al contului.
// Optiuni: schimba parola si dezactivare cont.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Eye, EyeOff, ChevronRight, KeyRound, UserX } from 'lucide-react-native';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { changePassword as apiChangePassword, deactivateAccount } from '../../auth/repository/authRepository';
import { useTranslation } from '../../../shared/i18n';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

type Screen = 'menu' | 'change-password';

export function AccountSecurityScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const t = useTranslation();

  const [screen, setScreen] = useState<Screen>('menu');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentError, setCurrentError] = useState<string | undefined>();
  const [newError, setNewError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  // Deactivate modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  function handleGoBack() {
    if (screen === 'change-password') {
      setScreen('menu');
      resetPasswordForm();
    } else {
      router.back();
    }
  }

  function resetPasswordForm() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentError(undefined);
    setNewError(undefined);
    setConfirmError(undefined);
    setSuccessMessage(undefined);
  }

  async function handleChangePassword() {
    setCurrentError(undefined);
    setNewError(undefined);
    setConfirmError(undefined);
    setSuccessMessage(undefined);
    let valid = true;

    if (!currentPassword) {
      setCurrentError(t.account.security.currentPasswordRequired);
      valid = false;
    }

    if (!newPassword) {
      setNewError(t.account.security.newPasswordRequired);
      valid = false;
    } else if (newPassword.length < 6) {
      setNewError(t.account.security.newPasswordMinLength);
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError(t.account.security.confirmPasswordRequired);
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmError(t.account.security.passwordsMismatch);
      valid = false;
    }

    if (!valid) return;

    try {
      await apiChangePassword(currentPassword, newPassword);
      setSuccessMessage(t.account.security.passwordChanged);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setCurrentError(t.account.security.currentPasswordIncorrect);
    }
  }

  async function handleDeactivate() {
    setShowDeactivateModal(false);
    try {
      await deactivateAccount();
    } catch {
      // Continue with logout even if API fails
    }
    logout();
  }

  if (screen === 'change-password') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.account.security.changePassword}</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {successMessage && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          <Text style={styles.fieldLabel}>{t.account.security.currentPassword}</Text>
          <View style={[styles.inputWrapper, currentError ? styles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.security.currentPassword}
              placeholderTextColor={colors.placeholderText}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowCurrent(!showCurrent)} activeOpacity={0.7}>
              {showCurrent ? <Eye size={18} color={colors.textSecondary} /> : <EyeOff size={18} color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {currentError && <Text style={styles.fieldError}>{currentError}</Text>}

          <Text style={styles.fieldLabel}>{t.account.security.newPassword}</Text>
          <View style={[styles.inputWrapper, newError ? styles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.security.newPassword}
              placeholderTextColor={colors.placeholderText}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowNew(!showNew)} activeOpacity={0.7}>
              {showNew ? <Eye size={18} color={colors.textSecondary} /> : <EyeOff size={18} color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {newError && <Text style={styles.fieldError}>{newError}</Text>}

          <Text style={styles.fieldLabel}>{t.account.security.confirmPassword}</Text>
          <View style={[styles.inputWrapper, confirmError ? styles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.security.confirmPassword}
              placeholderTextColor={colors.placeholderText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirm(!showConfirm)} activeOpacity={0.7}>
              {showConfirm ? <Eye size={18} color={colors.textSecondary} /> : <EyeOff size={18} color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {confirmError && <Text style={styles.fieldError}>{confirmError}</Text>}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleChangePassword}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>{t.account.security.savePassword}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.account.security.title}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setScreen('change-password')}
            activeOpacity={0.6}
          >
            <View style={styles.menuIcon}>
              <KeyRound size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{t.account.security.changePassword}</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowDeactivateModal(true)}
            activeOpacity={0.6}
          >
            <View style={styles.menuIcon}>
              <UserX size={20} color={colors.error} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.error }]}>{t.account.security.deactivateAccount}</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showDeactivateModal}
        title={t.account.security.deactivateTitle}
        message={t.account.security.deactivateMessage}
        confirmLabel={t.account.security.deactivateConfirm}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={handleDeactivate}
        onCancel={() => setShowDeactivateModal(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },

  // Menu
  menuContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 28 + spacing.md,
  },

  // Change password form
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
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
  successBox: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  successText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
  },
});
