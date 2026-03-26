// LoginScreen — ecranul de autentificare cu design modern.
// Email + parola, checkbox "Tine-ma minte", loading overlay modal, redirect la tabs dupa login.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useTranslation } from '../../../shared/i18n';
import { createAuthStyles } from '../styles/auth.styles';
import { spacing } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';
import type { ThemeColors } from '../../../shared/styles/theme';

export function LoginScreen() {
  const colors = useThemeColors();
  const authStyles = useMemo(() => createAuthStyles(colors), [colors]);
  const router = useRouter();
  const { login } = useAuthContext();
  const t = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  function validate(): boolean {
    let valid = true;
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email.trim()) {
      setEmailError(t.auth.validation.emailRequired);
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t.auth.validation.emailInvalid);
      valid = false;
    }

    if (!password) {
      setPasswordError(t.auth.validation.passwordRequired);
      valid = false;
    }

    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.validation.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <Modal visible={loading} transparent animationType="fade">
        <View style={authStyles.loadingOverlay}>
          <View style={authStyles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={authStyles.loadingText}>{t.auth.login.loading}</Text>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[authStyles.scrollContent, { justifyContent: 'center' }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageSwitcher />

          <View style={[authStyles.titleSection, { alignItems: 'center' }]}>
            <Text style={[authStyles.title, { textAlign: 'center' }]}>{t.auth.login.title}</Text>
            <Text style={[authStyles.subtitle, { textAlign: 'center' }]}>{t.auth.login.subtitle}</Text>
          </View>

          {error && (
            <View style={authStyles.errorBox}>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={authStyles.fieldLabel}>{t.auth.login.email}</Text>
          <View style={[authStyles.inputWrapper, emailError ? authStyles.inputWrapperError : null]}>
            <Mail size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder={t.auth.login.emailPlaceholder}
              placeholderTextColor={colors.placeholderText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError && <Text style={authStyles.fieldError}>{emailError}</Text>}

          <Text style={authStyles.fieldLabel}>{t.auth.login.password}</Text>
          <View style={[authStyles.inputWrapper, passwordError ? authStyles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder={t.auth.login.passwordPlaceholder}
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

          <TouchableOpacity onPress={() => router.push('/forgot-password')} activeOpacity={0.7} style={{ alignSelf: 'flex-end', marginBottom: spacing.md }}>
            <Text style={authStyles.forgotText}>{t.auth.login.forgotPassword}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.submitButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={authStyles.submitButtonText}>{t.auth.login.submit}</Text>
          </TouchableOpacity>

          <View style={authStyles.switchRow}>
            <Text style={authStyles.switchText}>{t.auth.login.noAccount}</Text>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
              <Text style={authStyles.switchLink}>{t.auth.login.register}</Text>
            </TouchableOpacity>
          </View>

          <View style={authStyles.legalSection}>
            <TouchableOpacity onPress={() => router.push('/privacy-policy')} activeOpacity={0.7}>
              <Text style={authStyles.legalLink}>{t.auth.login.privacyPolicy}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/terms')} activeOpacity={0.7}>
              <Text style={authStyles.legalLink}>{t.auth.login.terms}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
