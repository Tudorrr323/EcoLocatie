// AdminScreen — ecranul principal de administrare, vizibil doar pentru rolul admin.
// Afiseaza statistici, lista utilizatori cu toggle activ/inactiv si observatii de moderat.

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, MapPin, Leaf, CheckCircle, Clock, UserCheck } from 'lucide-react-native';
import { EmptyState } from '../../../shared/components/EmptyState';
import { UserRow } from '../components/UserRow';
import { ModerationCard } from '../components/ModerationCard';
import { useModeration } from '../hooks/useModeration';
import { createAdminStyles } from '../styles/admin.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';
import type { AdminStats } from '../types/admin.types';
import { useTranslation, type Translations } from '../../../shared/i18n';

interface StatCardData {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueStyle?: object;
}

function StatCard({ label, value, icon, valueStyle, adminStyles }: StatCardData & { adminStyles: ReturnType<typeof createAdminStyles> }) {
  return (
    <View style={adminStyles.statCard}>
      <View style={adminStyles.statIconWrapper}>{icon}</View>
      <Text style={[adminStyles.statValue, valueStyle]}>{value}</Text>
      <Text style={adminStyles.statLabel}>{label}</Text>
    </View>
  );
}

function buildStatCards(stats: AdminStats, colors: ThemeColors, adminStyles: ReturnType<typeof createAdminStyles>, t: Translations): StatCardData[] {
  return [
    {
      label: t.admin.stats.totalUsers,
      value: stats.totalUsers,
      icon: <Users size={20} color={colors.primary} />,
    },
    {
      label: t.admin.stats.activeUsers,
      value: stats.activeUsers,
      icon: <UserCheck size={20} color={colors.success} />,
      valueStyle: adminStyles.statValueSuccess,
    },
    {
      label: t.admin.stats.totalPOIs,
      value: stats.totalPOIs,
      icon: <MapPin size={20} color={colors.primary} />,
    },
    {
      label: t.admin.stats.approvedPOIs,
      value: stats.approvedPOIs,
      icon: <CheckCircle size={20} color={colors.success} />,
      valueStyle: adminStyles.statValueSuccess,
    },
    {
      label: t.admin.stats.pendingPOIs,
      value: stats.pendingPOIs,
      icon: <Clock size={20} color={colors.warning} />,
      valueStyle:
        stats.pendingPOIs > 0 ? adminStyles.statValueWarning : undefined,
    },
    {
      label: t.admin.stats.totalPlants,
      value: stats.totalPlants,
      icon: <Leaf size={20} color={colors.primaryLight} />,
    },
  ];
}

export function AdminScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const adminStyles = useMemo(() => createAdminStyles(colors), [colors]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { stats, users, pendingPOIs, toggleUser, moderatePOI } =
    useModeration();

  const statCards = buildStatCards(stats, colors, adminStyles, t);

  return (
    <SafeAreaView style={adminStyles.screen}>
      {/* Header */}
      <View style={adminStyles.header}>
        <Text style={adminStyles.headerTitle}>{t.admin.header}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={adminStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats ── */}
        <View style={adminStyles.section}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>{t.admin.sections.stats}</Text>
          </View>
          <View style={adminStyles.statsGrid}>
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} adminStyles={adminStyles} />
            ))}
          </View>
        </View>

        {/* ── Utilizatori ── */}
        <View style={adminStyles.section}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>{t.admin.sections.users}</Text>
            <View style={adminStyles.sectionBadge}>
              <Text style={adminStyles.sectionBadgeText}>{users.length}</Text>
            </View>
          </View>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onToggle={toggleUser} />
          ))}
        </View>

        {/* ── Moderare ── */}
        <View style={adminStyles.section}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>{t.admin.sections.moderation}</Text>
            {pendingPOIs.length > 0 && (
              <View
                style={[
                  adminStyles.sectionBadge,
                  styles.pendingBadge,
                ]}
              >
                <Text style={adminStyles.sectionBadgeText}>
                  {pendingPOIs.length}
                </Text>
              </View>
            )}
          </View>

          {pendingPOIs.length > 0 ? (
            pendingPOIs.map((poi) => (
              <ModerationCard
                key={poi.id}
                poi={poi}
                onModerate={moderatePOI}
              />
            ))
          ) : (
            <EmptyState message={t.admin.moderation.emptyState} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: colors.warning,
  },
});
