// EditProfileScreen — ecranul de editare profil utilizator.
// Afiseaza avatar cu buton de schimbare poza, campuri editabile (nume, telefon, data nasterii),
// email read-only. Salveaza modificarile in AuthContext.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Pencil, Phone, Calendar, User, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { uploadProfileImage, deleteProfileImage } from '../../auth/repository/authRepository';
import { useTranslation } from '../../../shared/i18n';
import { DatePickerModal } from '../../../shared/components/DatePickerModal';
import { Snackbar } from '../../../shared/components/Snackbar';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

export function EditProfileScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user, updateUser } = useAuthContext();
  const t = useTranslation();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [birthDate, setBirthDate] = useState(user?.birth_date ?? '');
  const [profileImage, setProfileImage] = useState(user?.profile_image ?? '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const displayName = firstName || lastName
    ? `${firstName} ${lastName}`.trim()
    : user?.username ?? '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }

  async function handleDeleteImage() {
    try {
      await deleteProfileImage();
    } catch {
      // ignore — backend may not have an image to delete
    }
    setProfileImage('');
  }

  function formatDateForDisplay(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  }

  async function handleSave() {
    // Upload image to backend if changed (local file URI, not already an http URL)
    let finalProfileImage = profileImage;
    if (profileImage && !profileImage.startsWith('http')) {
      try {
        const updatedUser = await uploadProfileImage(profileImage);
        finalProfileImage = updatedUser.profile_image ?? profileImage;
      } catch {
        // Silently fail — keep local URI as fallback
      }
    }

    await updateUser({
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      phone: phone.trim() || undefined,
      birth_date: birthDate || undefined,
      profile_image: finalProfileImage || undefined,
    });
    setSnackbarVisible(true);
    setTimeout(() => router.back(), 1500);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.account.profile.title}</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar cu buton de editare și ștergere */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Pencil size={14} color={colors.textLight} />
              </View>
            </TouchableOpacity>
            {profileImage ? (
              <TouchableOpacity onPress={handleDeleteImage} activeOpacity={0.7} style={styles.deleteBadge}>
                <Trash2 size={14} color={colors.textLight} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Nume complet */}
          <Text style={styles.fieldLabel}>{t.account.profile.fullName}</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.profile.firstName}
              placeholderTextColor={colors.placeholderText}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>
          <View style={[styles.inputWrapper, { marginBottom: spacing.lg }]}>
            <User size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.profile.lastName}
              placeholderTextColor={colors.placeholderText}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          {/* Email (read-only) */}
          <Text style={styles.fieldLabel}>{t.account.profile.email}</Text>
          <View style={[styles.inputWrapper, styles.inputReadonly]}>
            <Mail size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <Text style={styles.readonlyText}>{user?.email ?? ''}</Text>
          </View>

          {/* Telefon */}
          <Text style={styles.fieldLabel}>{t.account.profile.phone}</Text>
          <View style={styles.inputWrapper}>
            <Phone size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder={t.account.profile.phonePlaceholder}
              placeholderTextColor={colors.placeholderText}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Data nasterii */}
          <Text style={styles.fieldLabel}>{t.account.profile.birthDate}</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Calendar size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <Text style={birthDate ? styles.dateText : styles.datePlaceholder}>
              {birthDate ? formatDateForDisplay(birthDate) : t.account.profile.birthDatePlaceholder}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Buton salvare fix la bottom */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>{t.account.profile.save}</Text>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        value={birthDate ? new Date(birthDate) : undefined}
        maxDate={new Date()}
        onConfirm={(date) => {
          setBirthDate(date.toISOString());
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <Snackbar
        visible={snackbarVisible}
        message={t.shared.snackbar.profileSaved}
        onDismiss={() => setSnackbarVisible(false)}
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textLight,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.logoTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  deleteBadge: {
    position: 'absolute',
    top: 0,
    right: '25%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  // Campuri
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
  inputReadonly: {
    opacity: 0.6,
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
  readonlyText: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    paddingVertical: spacing.sm + 2,
  },
  dateText: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    paddingVertical: spacing.sm + 2,
  },
  datePlaceholder: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    color: colors.placeholderText,
    paddingVertical: spacing.sm + 2,
  },

  // Buton salvare
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
  },
});
