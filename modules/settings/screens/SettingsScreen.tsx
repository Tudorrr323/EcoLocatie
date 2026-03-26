// SettingsScreen — pagina de setari a aplicatiei.
// Design: background alb (inclusiv statusbar), profil complet, lista itemi cu chevron, logout.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Shield,
  FileText,
  Info,
  ChevronRight,
  LogOut,
  Mail,
  Sun,
  Moon,
  Smartphone,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTranslation } from '../../../shared/i18n';
import { useSettings } from '../../../shared/context/SettingsContext';
import type { Language, ThemePreference } from '../../../shared/context/SettingsContext';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

export function SettingsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const t = useTranslation();

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username ?? '';

  const avatarLetter = displayName.charAt(0).toUpperCase();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { language, setLanguage, themePreference, setThemePreference } = useSettings();

  const languageLabels: Record<Language, string> = { ro: t.account.settings.languageRo, en: t.account.settings.languageEn };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Titlu pagina */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/SmallLogoEcoLocation.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>{t.account.settings.title}</Text>
        <View style={styles.headerLogo} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card profil */}
        {user && (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.7}
          >
            {user.profile_image ? (
              <Image source={{ uri: user.profile_image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Setari principale */}
        <Text style={styles.sectionLabel}>{t.account.settings.general}</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<Bell size={20} color={colors.primary} />}
            label={t.account.settings.notifications}
            onPress={() => {}}
            styles={styles}
            colors={colors}
          />
          <MenuDivider styles={styles} />
          <MenuItem
            icon={<Shield size={20} color={colors.primary} />}
            label={t.account.settings.security}
            onPress={() => router.push('/account-security')}
            styles={styles}
            colors={colors}
          />
          <MenuDivider styles={styles} />
          <MenuItem
            icon={<Mail size={20} color={colors.primary} />}
            label={t.account.settings.contact}
            onPress={() => {}}
            styles={styles}
            colors={colors}
          />
          {user?.role === 'admin' && (
            <>
              <MenuDivider styles={styles} />
              <MenuItem
                icon={<Shield size={20} color={colors.secondary} />}
                label={t.account.settings.adminPanel}
                onPress={() => router.navigate('/(tabs)/admin' as any)}
                styles={styles}
                colors={colors}
              />
            </>
          )}
        </View>

        {/* Limba */}
        <Text style={styles.sectionLabel}>{t.account.settings.language}</Text>
        <View style={styles.langCard}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>{language === 'ro' ? '🇷🇴' : '🇬🇧'}</Text>
            <Text style={styles.langText}>{languageLabels[language]}</Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Aspect */}
        <Text style={styles.sectionLabel}>{t.account.settings.appearance}</Text>
        <View style={styles.themeCard}>
          {([
            { key: 'light' as ThemePreference, label: t.account.settings.themeLight, icon: Sun },
            { key: 'dark' as ThemePreference, label: t.account.settings.themeDark, icon: Moon },
            { key: 'system' as ThemePreference, label: t.account.settings.themeSystem, icon: Smartphone },
          ]).map((opt) => {
            const isActive = themePreference === opt.key;
            const Icon = opt.icon;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.themeButton, isActive && styles.themeButtonActive]}
                onPress={() => setThemePreference(opt.key)}
                activeOpacity={0.7}
              >
                <Icon size={22} color={isActive ? colors.textLight : colors.textSecondary} />
                <Text style={[styles.themeButtonText, isActive && styles.themeButtonTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Despre aplicatie */}
        <Text style={styles.sectionLabel}>{t.account.settings.about}</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<Info size={20} color={colors.primary} />}
            label={t.account.settings.aboutEcoLocation}
            onPress={() => router.push('/about')}
            styles={styles}
            colors={colors}
          />
        </View>

        {/* Legal */}
        <Text style={styles.sectionLabel}>{t.account.settings.legal}</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<FileText size={20} color={colors.primary} />}
            label={t.account.settings.privacyPolicy}
            onPress={() => router.push('/privacy-policy')}
            styles={styles}
            colors={colors}
          />
          <MenuDivider styles={styles} />
          <MenuItem
            icon={<FileText size={20} color={colors.primary} />}
            label={t.account.settings.termsAndConditions}
            onPress={() => router.push('/terms')}
            styles={styles}
            colors={colors}
          />
        </View>

        {/* Deconectare */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>{t.account.settings.logout}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal limba */}
      <ConfirmModal
        visible={showLanguageModal}
        title={t.account.settings.selectLanguage}
        cancelLabel={t.shared.common.close}
        onCancel={() => setShowLanguageModal(false)}
      >
        {(['ro', 'en'] as Language[]).map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.optionRow}
            onPress={() => { setLanguage(lang); setShowLanguageModal(false); }}
            activeOpacity={0.6}
          >
            <Text style={styles.optionFlag}>{lang === 'ro' ? '🇷🇴' : '🇬🇧'}</Text>
            <Text style={styles.optionText}>{languageLabels[lang]}</Text>
            {language === lang && <Check size={20} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </ConfirmModal>

      <ConfirmModal
        visible={showLogoutModal}
        title={t.account.settings.logoutTitle}
        message={t.account.settings.logoutMessage}
        confirmLabel={t.account.settings.logoutConfirm}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  styles,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  colors: ThemeColors;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function MenuDivider({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.divider} />;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  sectionLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },

  // Profil
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.textLight,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  displayName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  // Lista itemi
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
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

  // Limba — pill selector centrat in card
  langCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md + spacing.xs,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  langFlag: {
    fontSize: 18,
  },
  langText: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.text,
  },

  // Aspect — 3 butoane toggle inline
  themeCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  themeButtonActive: {
    backgroundColor: colors.primary,
  },
  themeButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  themeButtonTextActive: {
    color: colors.textLight,
  },

  // Optiuni in modal limba
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  optionFlag: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },

  // Logout
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  logoutText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.error,
  },
});
