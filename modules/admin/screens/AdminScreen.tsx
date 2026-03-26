// AdminScreen — dashboard de administrare cu 3 tab-uri: Dashboard, Observații, Utilizatori.

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Animated, Pressable, Dimensions, StyleSheet as RNStyleSheet, PanResponder } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Menu, Users, MapPin, CheckCircle, Clock, UserCheck, XCircle, LayoutDashboard, FileSearch, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../../../shared/components/SearchBar';
import { FilterButton } from '../../../shared/components/FilterButton';
import { BottomPanel } from '../../../shared/components/BottomPanel';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Pagination } from '../../../shared/components/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { UserRow } from '../components/UserRow';
import { ObservationCard } from '../components/ObservationCard';
import { StatChart } from '../components/StatChart';
import { useModeration } from '../hooks/useModeration';
import { createAdminStyles } from '../styles/admin.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { AdminStats, POIStatusFilter, UserStatusFilter, ChartBar } from '../types/admin.types';
import { useTranslation, type Translations } from '../../../shared/i18n';

// ── Stat Card ────────────────────────────────────────────────

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
    { label: t.admin.stats.totalUsers, value: stats.totalUsers, icon: <Users size={20} color={colors.primary} /> },
    { label: t.admin.stats.activeUsers, value: stats.activeUsers, icon: <UserCheck size={20} color={colors.success} />, valueStyle: adminStyles.statValueSuccess },
    { label: t.admin.stats.totalPOIs, value: stats.totalPOIs, icon: <MapPin size={20} color={colors.primary} /> },
    { label: t.admin.stats.approvedPOIs, value: stats.approvedPOIs, icon: <CheckCircle size={20} color={colors.success} />, valueStyle: adminStyles.statValueSuccess },
    { label: t.admin.stats.pendingPOIs, value: stats.pendingPOIs, icon: <Clock size={20} color={colors.warning} />, valueStyle: stats.pendingPOIs > 0 ? adminStyles.statValueWarning : undefined },
    { label: t.admin.stats.rejectedPOIs, value: stats.rejectedPOIs, icon: <XCircle size={20} color={colors.error} />, valueStyle: stats.rejectedPOIs > 0 ? adminStyles.statValueError : undefined },
  ];
}

// ── Status Filter Chips ──────────────────────────────────────

const STATUS_FILTERS: POIStatusFilter[] = ['all', 'pending', 'approved', 'rejected'];

function StatusFilterChips({
  active,
  onChange,
  counts,
  colors,
  t,
}: {
  active: POIStatusFilter;
  onChange: (f: POIStatusFilter) => void;
  counts: Record<POIStatusFilter, number>;
  colors: ThemeColors;
  t: Translations;
}) {
  const labels: Record<POIStatusFilter, string> = {
    all: t.admin.observations.filterAll,
    pending: t.admin.observations.filterPending,
    approved: t.admin.observations.filterApproved,
    rejected: t.admin.observations.filterRejected,
  };
  const chipColors: Record<POIStatusFilter, string> = {
    all: colors.primary,
    pending: colors.warning,
    approved: colors.success,
    rejected: colors.error,
  };

  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm, flexWrap: 'wrap' }}>
      {STATUS_FILTERS.map((f) => {
        const isActive = f === active;
        const chipColor = chipColors[f];
        return (
          <TouchableOpacity
            key={f}
            onPress={() => onChange(f)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs + 2,
              borderRadius: borderRadius.full,
              backgroundColor: isActive ? chipColor : colors.background,
              borderWidth: 1,
              borderColor: isActive ? chipColor : colors.border,
            }}
          >
            <Text style={{
              fontSize: fonts.sizes.sm,
              fontWeight: '600',
              color: isActive ? colors.textLight : colors.textSecondary,
            }}>
              {labels[f]} ({counts[f]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── User Filter Panel (same style as PlantFilterPanel) ───────

function UserFilterPanel({
  visible, activeFilter, users, onApply, onClose, colors, t,
}: {
  visible: boolean;
  activeFilter: UserStatusFilter;
  users: import('../../../shared/types/plant.types').User[];
  onApply: (f: UserStatusFilter) => void;
  onClose: () => void;
  colors: ThemeColors;
  t: Translations;
}) {
  const filters: { key: UserStatusFilter; label: string; color: string; count: number }[] = [
    { key: 'all', label: t.admin.observations.filterAll, color: colors.primary, count: users.length },
    { key: 'active', label: t.admin.users.active, color: colors.success, count: users.filter((u) => u.is_active).length },
    { key: 'inactive', label: t.admin.users.inactive, color: colors.error, count: users.filter((u) => !u.is_active).length },
  ];

  return (
    <BottomPanel visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.md, paddingVertical: spacing.md,
        borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: fonts.sizes.lg, fontWeight: '700', color: colors.text }}>
          {t.admin.sections.users}
        </Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <X size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter items */}
      <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.md }}>
        {filters.map((f, index) => {
          const isSelected = f.key === activeFilter;
          const isLast = index === filters.length - 1;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => onApply(f.key)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
                paddingVertical: spacing.md,
                borderBottomWidth: isLast ? 0 : 1, borderBottomColor: colors.border,
              }}
            >
              <View style={{
                width: 14, height: 14, borderRadius: 7,
                backgroundColor: f.color, borderWidth: 1, borderColor: colors.border,
              }} />
              <Text style={{ flex: 1, fontSize: fonts.sizes.md, color: colors.text }}>
                {f.label} ({f.count})
              </Text>
              <View style={{
                width: 20, height: 20, borderRadius: 4,
                borderWidth: 2, borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected && <Text style={{ color: colors.textLight, fontSize: fonts.sizes.sm, fontWeight: '700', lineHeight: 14 }}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{
        flexDirection: 'row', gap: spacing.sm,
        paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg,
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={() => onApply('all')}
          activeOpacity={0.7}
          style={{
            flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md,
            alignItems: 'center', backgroundColor: colors.background,
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: fonts.sizes.md, fontWeight: '600', color: colors.text }}>
            {t.shared.plantFilter.resetFilters}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={{
            flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md,
            alignItems: 'center', backgroundColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: fonts.sizes.md, fontWeight: '700', color: colors.textLight }}>
            {t.shared.plantFilter.apply}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomPanel>
  );
}

// ── Admin Drawer (slide from left, green background) ─────────

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

function AdminDrawer({
  visible, onClose, menuItems, activeTab, onSelectTab, onBack, colors, t,
}: {
  visible: boolean;
  onClose: () => void;
  menuItems: { key: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onSelectTab: (key: string) => void;
  onBack: () => void;
  colors: ThemeColors;
  t: Translations;
}) {
  const insets = useSafeAreaInsets();
  const slideX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible && !isOpen.current) {
      isOpen.current = true;
      slideX.setValue(-DRAWER_WIDTH);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.spring(slideX, { toValue: 0, useNativeDriver: false, damping: 22, stiffness: 180 }),
      ]).start();
    } else if (!visible && isOpen.current) {
      isOpen.current = false;
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: false }),
        Animated.timing(slideX, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: false }),
      ]).start();
    }
  }, [visible]);

  // Swipe gesture on drawer panel
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        // Only allow swipe left (negative dx) to close
        if (gesture.dx < 0) {
          slideX.setValue(Math.max(gesture.dx, -DRAWER_WIDTH));
          overlayOpacity.setValue(Math.max(0, 1 + gesture.dx / DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -DRAWER_WIDTH * 0.3 || gesture.vx < -0.5) {
          // Swipe far enough or fast enough — close
          Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(slideX, { toValue: -DRAWER_WIDTH, duration: 200, useNativeDriver: false }),
          ]).start(() => onCloseRef.current());
        } else {
          // Snap back open
          Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 1, duration: 150, useNativeDriver: false }),
            Animated.spring(slideX, { toValue: 0, useNativeDriver: false, damping: 22, stiffness: 180 }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={[RNStyleSheet.absoluteFill, { zIndex: 30 }]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      {/* Overlay */}
      <Animated.View
        style={[RNStyleSheet.absoluteFillObject, { backgroundColor: colors.overlay, opacity: overlayOpacity }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={RNStyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer panel — swipeable */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: DRAWER_WIDTH,
          backgroundColor: colors.drawerBackground,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
          transform: [{ translateX: slideX }],
        }}
      >
        {/* Back button — top */}
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
            paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
          }}
        >
          <ArrowLeft size={20} color={colors.drawerTextMuted} />
          <Text style={{ fontSize: fonts.sizes.md, fontWeight: '500', color: colors.drawerTextMuted }}>
            {t.shared.common.back}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: colors.drawerSeparator, marginHorizontal: spacing.lg, marginBottom: spacing.md }} />

        {/* Title */}
        <Text style={{
          fontSize: fonts.sizes.title, fontWeight: '700', color: colors.drawerText,
          paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
        }}>
          {t.admin.header}
        </Text>

        {/* Menu items */}
        {menuItems.map((item) => {
          const isActive = item.key === activeTab;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onSelectTab(item.key)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: spacing.md,
                paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
                backgroundColor: isActive ? colors.drawerActiveItem : 'transparent',
              }}
            >
              <View style={{ opacity: isActive ? 1 : 0.7 }}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { color: colors.drawerText })}
              </View>
              <Text style={{
                flex: 1, fontSize: fonts.sizes.lg,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? colors.drawerText : colors.drawerTextMuted,
              }}>
                {item.label}
              </Text>
              {isActive && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.drawerText }} />
              )}
            </TouchableOpacity>
          );
        })}

      </Animated.View>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────

export function AdminScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const router = useRouter();
  const adminStyles = useMemo(() => createAdminStyles(colors), [colors]);
  const localStyles = useMemo(() => createLocalStyles(colors), [colors]);

  const {
    stats, users, filteredUsers, allPOIs, filteredPOIs, pendingPOIs, plants, loading,
    statusFilter, searchQuery, userSearchQuery, userStatusFilter,
    setStatusFilter, setSearchQuery, setUserSearchQuery, setUserStatusFilter,
    toggleUser, moderatePOI, getPlantName, getUserName,
  } = useModeration();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const [obsFilterModalVisible, setObsFilterModalVisible] = useState(false);
  const [userFilterModalVisible, setUserFilterModalVisible] = useState(false);

  const menuItems = [
    { key: 'dashboard', label: t.admin.tabs.dashboard, icon: <LayoutDashboard size={20} color={colors.primary} /> },
    { key: 'observations', label: t.admin.tabs.observations, icon: <FileSearch size={20} color={colors.primary} /> },
    { key: 'users', label: t.admin.tabs.users, icon: <Users size={20} color={colors.primary} /> },
  ];

  const activeTabLabel = menuItems.find((m) => m.key === activeTab)?.label ?? t.admin.header;

  const {
    currentPage, totalPages, paginatedItems: paginatedPOIs,
    onPageChange, pageSize, onPageSizeChange,
  } = usePagination(filteredPOIs, 10);

  const {
    currentPage: userPage, totalPages: userTotalPages, paginatedItems: paginatedUsers,
    onPageChange: onUserPageChange, pageSize: userPageSize, onPageSizeChange: onUserPageSizeChange,
  } = usePagination(filteredUsers, 10);

  // Chart data
  const statusChartBars: ChartBar[] = useMemo(() => [
    { label: t.admin.charts.approved, value: stats.approvedPOIs, color: colors.success },
    { label: t.admin.charts.pending, value: stats.pendingPOIs, color: colors.warning },
    { label: t.admin.charts.rejected, value: stats.rejectedPOIs, color: colors.error },
  ], [stats, colors, t]);

  const topPlantsChartBars: ChartBar[] = useMemo(() => {
    const plantCounts = new Map<number, number>();
    for (const poi of allPOIs) {
      plantCounts.set(poi.plant_id, (plantCounts.get(poi.plant_id) ?? 0) + 1);
    }
    return Array.from(plantCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([plantId, count]) => ({
        label: getPlantName(plantId) || `#${plantId}`,
        value: count,
        color: colors.primary,
      }));
  }, [allPOIs, getPlantName, colors]);

  const statusCounts: Record<POIStatusFilter, number> = useMemo(() => ({
    all: allPOIs.length,
    pending: allPOIs.filter((p) => p.status === 'pending').length,
    approved: allPOIs.filter((p) => p.status === 'approved').length,
    rejected: allPOIs.filter((p) => p.status === 'rejected').length,
  }), [allPOIs]);

  const statCards = buildStatCards(stats, colors, adminStyles, t);

  if (loading) {
    return (
      <SafeAreaView style={adminStyles.screen} edges={['top']}>
        <View style={localStyles.header}>
          <TouchableOpacity style={localStyles.menuBtn} onPress={() => setMenuVisible(true)} activeOpacity={0.7}>
            <Menu size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={localStyles.headerTitle}>{t.admin.header}</Text>
          <View style={localStyles.menuBtn} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={adminStyles.screen} edges={['top']}>
      {/* Header with hamburger menu */}
      <View style={localStyles.header}>
        <TouchableOpacity style={localStyles.menuBtn} onPress={() => setMenuVisible(true)} activeOpacity={0.7}>
          <Menu size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>{activeTabLabel}</Text>
        <View style={localStyles.menuBtn} />
      </View>

      {/* ── Tab: Dashboard ── */}
      {activeTab === 'dashboard' && (
        <ScrollView
          contentContainerStyle={adminStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pending quick access — top of dashboard if any */}
          {pendingPOIs.length > 0 && (
            <TouchableOpacity
              style={localStyles.pendingBanner}
              onPress={() => { setActiveTab('observations'); setStatusFilter('pending'); }}
              activeOpacity={0.7}
            >
              <View style={localStyles.pendingBannerIcon}>
                <Clock size={20} color={colors.textLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={localStyles.pendingBannerTitle}>
                  {pendingPOIs.length} {t.admin.stats.pendingPOIs.toLowerCase()}
                </Text>
                <Text style={localStyles.pendingBannerSubtitle}>{t.admin.sections.moderation}</Text>
              </View>
              <ArrowLeft size={18} color={colors.textLight} style={{ transform: [{ rotate: '180deg' }], opacity: 0.7 }} />
            </TouchableOpacity>
          )}

          {/* Stats grid — 2 per row */}
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>{t.admin.sections.stats}</Text>
          </View>
          <View style={adminStyles.statsGrid}>
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} adminStyles={adminStyles} />
            ))}
          </View>

          {/* Charts */}
          <View style={{ marginTop: spacing.lg }}>
            <StatChart title={t.admin.charts.byStatus} bars={statusChartBars} />
            {topPlantsChartBars.length > 0 && (
              <StatChart title={t.admin.charts.topPlants} bars={topPlantsChartBars} />
            )}
          </View>
        </ScrollView>
      )}

      {/* ── Tab: Observations ── */}
      {activeTab === 'observations' && (
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <SearchBar
                  placeholder={t.admin.observations.searchPlaceholder}
                  onSearch={setSearchQuery}
                  debounceMs={300}
                />
              </View>
              <FilterButton onPress={() => setObsFilterModalVisible(true)} />
            </View>
          </View>

          {filteredPOIs.length === 0 ? (
            <EmptyState message={t.admin.observations.emptyState} />
          ) : (
            <FlatList
              data={paginatedPOIs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ObservationCard
                  poi={item}
                  plantName={getPlantName(item.plant_id)}
                  userName={getUserName(item.user_id)}
                  onModerate={moderatePOI}
                />
              )}
              contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                totalPages > 0 ? (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    pageSize={pageSize}
                    onPageSizeChange={onPageSizeChange}
                  />
                ) : null
              }
            />
          )}
          {/* Observations filter panel */}
          <BottomPanel visible={obsFilterModalVisible} onClose={() => setObsFilterModalVisible(false)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: fonts.sizes.lg, fontWeight: '700', color: colors.text }}>{t.admin.observations.title}</Text>
              <TouchableOpacity onPress={() => setObsFilterModalVisible(false)} activeOpacity={0.7}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
              {([
                { key: 'all' as POIStatusFilter, label: t.admin.observations.filterAll, color: colors.primary, count: statusCounts.all },
                { key: 'pending' as POIStatusFilter, label: t.admin.observations.filterPending, color: colors.warning, count: statusCounts.pending },
                { key: 'approved' as POIStatusFilter, label: t.admin.observations.filterApproved, color: colors.success, count: statusCounts.approved },
                { key: 'rejected' as POIStatusFilter, label: t.admin.observations.filterRejected, color: colors.error, count: statusCounts.rejected },
              ]).map((f, index) => {
                const isSelected = f.key === statusFilter;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => { setStatusFilter(f.key); setObsFilterModalVisible(false); }}
                    activeOpacity={0.7}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm, borderBottomWidth: index === 3 ? 0 : 1, borderBottomColor: colors.border }}
                  >
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: f.color, borderWidth: 1, borderColor: colors.border }} />
                    <Text style={{ flex: 1, fontSize: fonts.sizes.md, color: colors.text }}>{f.label} ({f.count})</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Text style={{ color: colors.textLight, fontSize: fonts.sizes.sm, fontWeight: '700', lineHeight: 14 }}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
              <TouchableOpacity onPress={() => { setStatusFilter('all'); setObsFilterModalVisible(false); }} activeOpacity={0.7} style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: fonts.sizes.md, fontWeight: '600', color: colors.text }}>{t.shared.plantFilter.resetFilters}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setObsFilterModalVisible(false)} activeOpacity={0.7} style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.primary }}>
                <Text style={{ fontSize: fonts.sizes.md, fontWeight: '700', color: colors.textLight }}>{t.shared.plantFilter.apply}</Text>
              </TouchableOpacity>
            </View>
          </BottomPanel>
        </View>
      )}

      {/* ── Tab: Users ── */}
      {activeTab === 'users' && (
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <SearchBar
                  placeholder={t.admin.users.searchPlaceholder}
                  onSearch={setUserSearchQuery}
                  debounceMs={300}
                />
              </View>
              <FilterButton onPress={() => setUserFilterModalVisible(true)} />
            </View>
          </View>

          {filteredUsers.length === 0 ? (
            <EmptyState message={t.admin.users.emptyState} />
          ) : (
            <FlatList
              data={paginatedUsers}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <UserRow user={item} onToggle={toggleUser} />
              )}
              contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                userTotalPages > 0 ? (
                  <Pagination
                    currentPage={userPage}
                    totalPages={userTotalPages}
                    onPageChange={onUserPageChange}
                    pageSize={userPageSize}
                    onPageSizeChange={onUserPageSizeChange}
                  />
                ) : null
              }
            />
          )}

          {/* User filter panel — same layout as PlantFilterPanel */}
          <BottomPanel visible={userFilterModalVisible} onClose={() => setUserFilterModalVisible(false)}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: fonts.sizes.lg, fontWeight: '700', color: colors.text }}>{t.admin.sections.users}</Text>
              <TouchableOpacity onPress={() => setUserFilterModalVisible(false)} activeOpacity={0.7}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Filter list */}
            <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
              {([
                { key: 'all' as UserStatusFilter, label: t.admin.observations.filterAll, color: colors.primary, count: users.length },
                { key: 'active' as UserStatusFilter, label: t.admin.users.active, color: colors.success, count: users.filter((u) => u.is_active).length },
                { key: 'inactive' as UserStatusFilter, label: t.admin.users.inactive, color: colors.error, count: users.filter((u) => !u.is_active).length },
              ]).map((f, index) => {
                const isSelected = f.key === userStatusFilter;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => { setUserStatusFilter(f.key); setUserFilterModalVisible(false); }}
                    activeOpacity={0.7}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm, borderBottomWidth: index === 2 ? 0 : 1, borderBottomColor: colors.border }}
                  >
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: f.color, borderWidth: 1, borderColor: colors.border }} />
                    <Text style={{ flex: 1, fontSize: fonts.sizes.md, color: colors.text }}>{f.label} ({f.count})</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Text style={{ color: colors.textLight, fontSize: fonts.sizes.sm, fontWeight: '700', lineHeight: 14 }}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer — same as PlantFilterPanel */}
            <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
              <TouchableOpacity
                onPress={() => { setUserStatusFilter('all'); setUserFilterModalVisible(false); }}
                activeOpacity={0.7}
                style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ fontSize: fonts.sizes.md, fontWeight: '600', color: colors.text }}>{t.shared.plantFilter.resetFilters}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUserFilterModalVisible(false)}
                activeOpacity={0.7}
                style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.primary }}
              >
                <Text style={{ fontSize: fonts.sizes.md, fontWeight: '700', color: colors.textLight }}>{t.shared.plantFilter.apply}</Text>
              </TouchableOpacity>
            </View>
          </BottomPanel>
        </View>
      )}
      {/* Side drawer menu */}
      <AdminDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        menuItems={menuItems}
        activeTab={activeTab}
        onSelectTab={(key) => { setActiveTab(key); setMenuVisible(false); }}
        onBack={() => { setMenuVisible(false); router.navigate('/(tabs)/settings' as any); }}
        colors={colors}
        t={t}
      />
    </SafeAreaView>
  );
}

const createLocalStyles = (colors: ThemeColors) => ({
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700' as const,
    color: colors.text,
  },
  pendingBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.warning,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pendingBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  pendingBannerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700' as const,
    color: colors.textLight,
  },
  pendingBannerSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    opacity: 0.85,
  },
});
