// ForgotPasswordScreen — flow de resetare parola in 3 pasi.
// Pas 1: email (verificare existenta), Pas 2: parola noua + confirmare, Pas 3: succes.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { checkEmailExists } from '../repository/authRepository';
import { useTranslation } from '../../../shared/i18n';
import { createAuthStyles } from '../styles/auth.styles';
import { spacing, fonts, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

type Step = 'email' | 'password' | 'success';

export function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const authStyles = useMemo(() => createAuthStyles(colors), [colors]);
  const router = useRouter();
  const t = useTranslation();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();

  function handleEmailSubmit() {
    setEmailError(undefined);

    if (!email.trim()) {
      setEmailError(t.auth.validation.emailRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t.auth.validation.emailInvalid);
      return;
    }
    if (!checkEmailExists(email)) {
      setEmailError(t.auth.validation.emailNotFound);
      return;
    }

    setStep('password');
  }

  function handlePasswordSubmit() {
    setPasswordError(undefined);
    setConfirmError(undefined);
    let valid = true;

    if (!password) {
      setPasswordError(t.auth.validation.passwordRequired);
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(t.auth.validation.passwordMinLength);
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError(t.auth.validation.confirmPasswordRequired);
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError(t.auth.validation.passwordsMismatch);
      valid = false;
    }

    if (!valid) return;

    setStep('success');
  }

  function handleGoBack() {
    if (step === 'password') {
      setStep('email');
    } else {
      router.back();
    }
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={authStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
          }}>
            <CheckCircle size={40} color={colors.textLight} />
          </View>
          <Text style={{
            fontSize: fonts.sizes.xxl,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.sm,
          }}>
            {t.auth.forgotPassword.successTitle}
          </Text>
          <Text style={{
            fontSize: fonts.sizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            {t.auth.forgotPassword.successMessage}
          </Text>
        </View>
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}>
          <TouchableOpacity
            style={authStyles.submitButton}
            onPress={() => router.replace('/login')}
            activeOpacity={0.85}
          >
            <Text style={authStyles.submitButtonText}>{t.auth.forgotPassword.goToLogin}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={authStyles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          {step === 'email' && (
            <>
              <View style={authStyles.titleSection}>
                <Text style={authStyles.title}>{t.auth.forgotPassword.title}</Text>
                <Text style={authStyles.subtitle}>
                  {t.auth.forgotPassword.subtitle}
                </Text>
              </View>

              <Text style={authStyles.fieldLabel}>{t.auth.forgotPassword.email}</Text>
              <View style={[authStyles.inputWrapper, emailError ? authStyles.inputWrapperError : null]}>
                <Mail size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.textInput}
                  placeholder={t.auth.forgotPassword.emailPlaceholder}
                  placeholderTextColor={colors.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError && <Text style={authStyles.fieldError}>{emailError}</Text>}

              <TouchableOpacity
                style={[authStyles.submitButton, { marginTop: spacing.lg }]}
                onPress={handleEmailSubmit}
                activeOpacity={0.85}
              >
                <Text style={authStyles.submitButtonText}>{t.auth.forgotPassword.continue}</Text>
              </TouchableOpacity>

              <View style={authStyles.switchRow}>
                <Text style={authStyles.switchText}>{t.auth.forgotPassword.rememberPassword}</Text>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                  <Text style={authStyles.switchLink}>{t.auth.forgotPassword.login}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'password' && (
            <>
              <View style={authStyles.titleSection}>
                <Text style={authStyles.title}>{t.auth.forgotPassword.secureTitle}</Text>
                <Text style={authStyles.subtitle}>
                  {t.auth.forgotPassword.secureSubtitle}
                </Text>
              </View>

              <Text style={authStyles.fieldLabel}>{t.auth.forgotPassword.newPassword}</Text>
              <View style={[authStyles.inputWrapper, passwordError ? authStyles.inputWrapperError : null]}>
                <Lock size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.textInput}
                  placeholder={t.auth.forgotPassword.newPasswordPlaceholder}
                  placeholderTextColor={colors.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword
                    ? <Eye size={18} color={colors.textSecondary} />
                    : <EyeOff size={18} color={colors.textSecondary} />
                  }
                </TouchableOpacity>
              </View>
              {passwordError && <Text style={authStyles.fieldError}>{passwordError}</Text>}

              <Text style={authStyles.fieldLabel}>{t.auth.forgotPassword.confirmPassword}</Text>
              <View style={[authStyles.inputWrapper, confirmError ? authStyles.inputWrapperError : null]}>
                <Lock size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.textInput}
                  placeholder={t.auth.forgotPassword.confirmPasswordPlaceholder}
                  placeholderTextColor={colors.placeholderText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  {showConfirmPassword
                    ? <Eye size={18} color={colors.textSecondary} />
                    : <EyeOff size={18} color={colors.textSecondary} />
                  }
                </TouchableOpacity>
              </View>
              {confirmError && <Text style={authStyles.fieldError}>{confirmError}</Text>}

              <TouchableOpacity
                style={[authStyles.submitButton, { marginTop: spacing.lg }]}
                onPress={handlePasswordSubmit}
                activeOpacity={0.85}
              >
                <Text style={authStyles.submitButtonText}>{t.auth.forgotPassword.savePassword}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
