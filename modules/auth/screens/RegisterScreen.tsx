// RegisterScreen — ecranul de creare cont cu campuri complete.
// First/last name, email, parola x2, data nasterii din calendar, telefon, loading overlay modal.

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
import { Mail, Lock, Eye, EyeOff, User, Calendar, Phone } from 'lucide-react-native';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useTranslation } from '../../../shared/i18n';
import { DatePickerModal } from '../../../shared/components/DatePickerModal';
import { createAuthStyles } from '../styles/auth.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';
import type { ThemeColors } from '../../../shared/styles/theme';

const MONTHS_RO = [
  'ian', 'feb', 'mar', 'apr', 'mai', 'iun',
  'iul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

function formatDateRO(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = MONTHS_RO[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function RegisterScreen() {
  const colors = useThemeColors();
  const authStyles = useMemo(() => createAuthStyles(colors), [colors]);
  const router = useRouter();
  const { register } = useAuthContext();
  const t = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();

  function validate(): boolean {
    let valid = true;
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);

    if (!firstName.trim()) {
      setFirstNameError(t.auth.validation.firstNameRequired);
      valid = false;
    }

    if (!lastName.trim()) {
      setLastNameError(t.auth.validation.lastNameRequired);
      valid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError(t.auth.validation.passwordMinLength);
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t.auth.validation.confirmPasswordRequired);
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t.auth.validation.passwordsMismatch);
      valid = false;
    }

    return valid;
  }

  async function handleRegister() {
    if (!validate()) return;
    setError(null);
    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        birthDate: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
      });
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.validation.genericError);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  const minAllowedDate = new Date(today.getFullYear() - 120, 0, 1);

  return (
    <SafeAreaView style={authStyles.container}>
      <Modal visible={loading} transparent animationType="fade">
        <View style={authStyles.loadingOverlay}>
          <View style={authStyles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={authStyles.loadingText}>{t.auth.register.loading}</Text>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={showDatePicker}
        value={birthDate}
        maxDate={today}
        minDate={minAllowedDate}
        onConfirm={(date) => {
          setBirthDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

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
            <Text style={[authStyles.title, { textAlign: 'center' }]}>{t.auth.register.title}</Text>
            <Text style={[authStyles.subtitle, { textAlign: 'center' }]}>{t.auth.register.subtitle}</Text>
          </View>

          {error && (
            <View style={authStyles.errorBox}>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          )}

          {/* Prenume + Nume pe aceeasi linie */}
          <View style={authStyles.nameRow}>
            <View style={authStyles.nameField}>
              <Text style={authStyles.fieldLabel}>{t.auth.register.firstName}</Text>
              <View style={[authStyles.inputWrapper, firstNameError ? authStyles.inputWrapperError : null]}>
                <User size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.textInput}
                  placeholder={t.auth.register.firstNamePlaceholder}
                  placeholderTextColor={colors.placeholderText}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {firstNameError && <Text style={authStyles.fieldError}>{firstNameError}</Text>}
            </View>

            <View style={authStyles.nameField}>
              <Text style={authStyles.fieldLabel}>{t.auth.register.lastName}</Text>
              <View style={[authStyles.inputWrapper, lastNameError ? authStyles.inputWrapperError : null]}>
                <User size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.textInput}
                  placeholder={t.auth.register.lastNamePlaceholder}
                  placeholderTextColor={colors.placeholderText}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {lastNameError && <Text style={authStyles.fieldError}>{lastNameError}</Text>}
            </View>
          </View>

          <Text style={authStyles.fieldLabel}>{t.auth.register.email}</Text>
          <View style={[authStyles.inputWrapper, emailError ? authStyles.inputWrapperError : null]}>
            <Mail size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder={t.auth.register.emailPlaceholder}
              placeholderTextColor={colors.placeholderText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError && <Text style={authStyles.fieldError}>{emailError}</Text>}

          <Text style={authStyles.fieldLabel}>{t.auth.register.password}</Text>
          <View style={[authStyles.inputWrapper, passwordError ? authStyles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder={t.auth.register.passwordPlaceholder}
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

          <Text style={authStyles.fieldLabel}>{t.auth.register.confirmPassword}</Text>
          <View style={[authStyles.inputWrapper, confirmPasswordError ? authStyles.inputWrapperError : null]}>
            <Lock size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder={t.auth.register.confirmPasswordPlaceholder}
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
          {confirmPasswordError && <Text style={authStyles.fieldError}>{confirmPasswordError}</Text>}

          {/* Data nasterii — deschide calendarultabel */}
          <Text style={authStyles.fieldLabel}>{t.auth.register.birthDate}</Text>
          <TouchableOpacity
            style={authStyles.inputWrapper}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Calendar size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <Text style={[authStyles.textInput, !birthDate && authStyles.placeholderText]}>
              {birthDate ? formatDateRO(birthDate) : t.auth.register.birthDatePlaceholder}
            </Text>
          </TouchableOpacity>

          {/* Telefon */}
          <Text style={authStyles.fieldLabel}>{t.auth.register.phone}</Text>
          <View style={authStyles.inputWrapper}>
            <Phone size={18} color={colors.textSecondary} style={authStyles.inputIcon} />
            <TextInput
              style={authStyles.textInput}
              placeholder="+40 7XX XXX XXX"
              placeholderTextColor={colors.placeholderText}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={authStyles.submitButton}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={authStyles.submitButtonText}>{t.auth.register.submit}</Text>
          </TouchableOpacity>

          <View style={authStyles.switchRow}>
            <Text style={authStyles.switchText}>{t.auth.register.hasAccount}</Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={authStyles.switchLink}>{t.auth.register.login}</Text>
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
