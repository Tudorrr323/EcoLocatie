// AdminScreen — ecranul principal de administrare, vizibil doar pentru rolul admin.
// Afiseaza statistici, lista utilizatori cu toggle activ/inactiv si observatii de moderat.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Users, MapPin, Leaf, CheckCircle, Clock, UserCheck } from 'lucide-react-native';
import { EmptyState } from '../../../shared/components/EmptyState';
import { UserRow } from '../components/UserRow';
import { ModerationCard } from '../components/ModerationCard';
import { useModeration } from '../hooks/useModeration';
import { adminStyles } from '../styles/admin.styles';
import { colors, spacing } from '../../../shared/styles/theme';
import type { AdminStats } from '../types/admin.types';

interface StatCardData {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueStyle?: object;
}

function StatCard({ label, value, icon, valueStyle }: StatCardData) {
  return (
    <View style={adminStyles.statCard}>
      <View style={adminStyles.statIconWrapper}>{icon}</View>
      <Text style={[adminStyles.statValue, valueStyle]}>{value}</Text>
      <Text style={adminStyles.statLabel}>{label}</Text>
    </View>
  );
}

function buildStatCards(stats: AdminStats): StatCardData[] {
  return [
    {
      label: 'Total utilizatori',
      value: stats.totalUsers,
      icon: <Users size={20} color={colors.primary} />,
    },
    {
      label: 'Utilizatori activi',
      value: stats.activeUsers,
      icon: <UserCheck size={20} color={colors.success} />,
      valueStyle: adminStyles.statValueSuccess,
    },
    {
      label: 'Total observatii',
      value: stats.totalPOIs,
      icon: <MapPin size={20} color={colors.primary} />,
    },
    {
      label: 'Observatii aprobate',
      value: stats.approvedPOIs,
      icon: <CheckCircle size={20} color={colors.success} />,
      valueStyle: adminStyles.statValueSuccess,
    },
    {
      label: 'In asteptare',
      value: stats.pendingPOIs,
      icon: <Clock size={20} color={colors.warning} />,
      valueStyle:
        stats.pendingPOIs > 0 ? adminStyles.statValueWarning : undefined,
    },
    {
      label: 'Specii de plante',
      value: stats.totalPlants,
      icon: <Leaf size={20} color={colors.primaryLight} />,
    },
  ];
}

export function AdminScreen() {
  const { stats, users, pendingPOIs, toggleUser, moderatePOI } =
    useModeration();

  const statCards = buildStatCards(stats);

  return (
    <SafeAreaView style={adminStyles.screen}>
      {/* Header */}
      <View style={adminStyles.header}>
        <Text style={adminStyles.headerTitle}>Administrare</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={adminStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats ── */}
        <View style={adminStyles.section}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>Statistici</Text>
          </View>
          <View style={adminStyles.statsGrid}>
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </View>
        </View>

        {/* ── Utilizatori ── */}
        <View style={adminStyles.section}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>Utilizatori</Text>
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
            <Text style={adminStyles.sectionTitle}>Moderare</Text>
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
            <EmptyState message="Nicio observatie in asteptare. Totul este la zi!" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: colors.warning,
  },
});
