// AdminUserDetailScreen — ecran detaliat pentru un utilizator din panoul admin.
// Afișează informațiile contului și buton de dezactivare/activare jos.

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { Badge } from '../../../shared/components/Badge';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { formatDate } from '../../../shared/utils/formatDate';
import { spacing, fonts, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { User } from '../../../shared/types/plant.types';
import { getAllUsers } from '../repository/adminRepository';
import { useTranslation } from '../../../shared/i18n';

export function AdminUserDetailScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = Number(id);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllUsers()
      .then((users) => {
        if (!cancelled) {
          setUser(users.find((u) => u.id === userId) ?? null);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading || !user) {
    return (
      <View style={styles.screen}>
        <LoadingSpinner />
      </View>
    );
  }

  const isAdmin = user.role === 'admin';
  const displayName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.admin.userDetail.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name card */}
        <View style={styles.profileCard}>
          {user.profile_image ? (
            <Image source={{ uri: user.profile_image }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <UserCircle size={48} color={colors.textSecondary} />
            </View>
          )}
          <Text style={styles.displayName}>{displayName}</Text>
          {user.first_name && user.last_name && (
            <Text style={styles.username}>@{user.username}</Text>
          )}
          <View style={styles.badgeRow}>
            <Badge
              text={isAdmin ? t.admin.users.admin : t.admin.users.user}
              color={isAdmin ? colors.success : colors.primary}
            />
            <View style={[
              styles.statusBadge,
              { backgroundColor: (user.is_active ? colors.success : colors.error) + '20' },
            ]}>
              {user.is_active
                ? <CheckCircle size={14} color={colors.success} />
                : <XCircle size={14} color={colors.error} />
              }
              <Text style={[styles.statusText, { color: user.is_active ? colors.success : colors.error }]}>
                {user.is_active ? t.admin.userDetail.active : t.admin.userDetail.inactive}
              </Text>
            </View>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.sectionCard}>
          <InfoRow
            icon={<Mail size={16} color={colors.primary} />}
            label={t.admin.userDetail.email}
            value={user.email}
            colors={colors}
          />
          <InfoRow
            icon={<Phone size={16} color={colors.primary} />}
            label={t.admin.userDetail.phone}
            value={user.phone || t.admin.userDetail.noPhone}
            colors={colors}
            muted={!user.phone}
          />
          <InfoRow
            icon={<Calendar size={16} color={colors.primary} />}
            label={t.admin.userDetail.birthDate}
            value={user.birth_date ? formatDate(user.birth_date) : t.admin.userDetail.noBirthDate}
            colors={colors}
            muted={!user.birth_date}
          />
          <InfoRow
            icon={<Shield size={16} color={colors.primary} />}
            label={t.admin.userDetail.role}
            value={isAdmin ? 'Admin' : 'User'}
            colors={colors}
          />
          <InfoRow
            icon={<Calendar size={16} color={colors.primary} />}
            label={t.admin.userDetail.registeredOn}
            value={formatDate(user.created_at)}
            colors={colors}
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
}

// --- InfoRow helper ---

function InfoRow({
  icon,
  label,
  value,
  colors,
  muted = false,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: ThemeColors;
  muted?: boolean;
  isLast?: boolean;
}) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: colors.border,
    }}>
      {icon}
      <Text style={{
        fontSize: fonts.sizes.sm,
        fontWeight: '600',
        color: colors.textSecondary,
        width: 100,
      }}>
        {label}
      </Text>
      <Text style={{
        flex: 1,
        fontSize: fonts.sizes.md,
        color: muted ? colors.textSecondary : colors.text,
        fontStyle: muted ? 'italic' : 'normal',
      }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

// --- Styles ---

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },

  // Profile card
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  username: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Section card
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

});
