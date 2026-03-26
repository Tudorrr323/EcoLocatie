// MyPlantsScreen — ecranul principal al modulului myplants.
// Afiseaza doua tab-uri (Plante / Istoric) cu liste de plante observate si istoric observatii.

import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, FileText } from 'lucide-react-native';
import { AppHeader } from '../../../shared/components/AppHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import { Pagination } from '../../../shared/components/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { useMyPlants } from '../hooks/useMyPlants';
import { HistoryCard } from '../components/HistoryCard';
import { MyPlantFAB } from '../components/MyPlantFAB';
import { formatDate } from '../../../shared/utils/formatDate';
import { favoriteTarget } from '../../../shared/utils/favoriteTarget';
import type { HistoryGroup, HistoryEntry, PlantTabItem } from '../types/myplants.types';

export function MyPlantsScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const {
    activeTab,
    setActiveTab,
    plantTabItems,
    allHistory,
    plantCount,
    historyCount,
    isPoiFavorite,
    togglePoiFavorite,
    isPlantFavorite,
    togglePlantFavorite,
    groupHistoryByDate,
  } = useMyPlants();

  const router = require('expo-router').useRouter();

  // Paginare tab Plante
  const plantsPagination = usePagination(plantTabItems ?? [], 10);

  // Paginare tab Istoric (paginam HistoryEntry[] flat, apoi grupam)
  const historyPagination = usePagination(allHistory, 10);
  const paginatedHistory = useMemo(
    () => groupHistoryByDate(historyPagination.paginatedItems),
    [historyPagination.paginatedItems, groupHistoryByDate],
  );

  const renderPlantTabItem = ({ item }: { item: PlantTabItem }) => {
    if (item.kind === 'poi') {
      const { poi, plant } = item.entry;
      const imageUri = poi.image_url || poi.images?.[0] || plant.image_url;

      return (
        <View style={styles.plantCard}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            activeOpacity={0.7}
            onPress={() => {
              favoriteTarget.poi = poi;
              router.push(`/my-plant/${plant.id}`);
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.plantCardImage}
              resizeMode="cover"
            />
            <View style={styles.plantCardInfo}>
              <Text style={styles.plantCardName} numberOfLines={1}>{getPlantName(plant)}</Text>
              <Text style={styles.plantCardLatin} numberOfLines={1}>{plant.name_latin}</Text>
              <View style={styles.plantCardMeta}>
                <View style={[styles.plantColorDot, { backgroundColor: plant.icon_color }]} />
                <View style={{ backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textLight }}>
                    {Math.round(poi.ai_confidence * 100)}%
                  </Text>
                </View>
                <Text style={styles.plantCardCount}>{formatDate(poi.created_at)}</Text>
              </View>
              {poi.comment ? (
                <Text style={[styles.plantCardCount, { marginTop: 2 }]} numberOfLines={1}>{poi.comment}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
          <FavoriteButton isFavorite={isPoiFavorite(poi.id)} onToggle={() => togglePoiFavorite(poi.id)} />
        </View>
      );
    }

    // Plant-only favorite (from encyclopedia)
    const { plant } = item;
    return (
      <View style={styles.plantCard}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          activeOpacity={0.7}
          onPress={() => router.push(`/plant/${plant.id}`)}
        >
          <Image
            source={{ uri: plant.image_url }}
            style={styles.plantCardImage}
            resizeMode="cover"
          />
          <View style={styles.plantCardInfo}>
            <Text style={styles.plantCardName} numberOfLines={1}>{getPlantName(plant)}</Text>
            <Text style={styles.plantCardLatin} numberOfLines={1}>{plant.name_latin}</Text>
            <View style={styles.plantCardMeta}>
              <View style={[styles.plantColorDot, { backgroundColor: plant.icon_color }]} />
              <Text style={styles.plantCardCount}>{plant.family}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <FavoriteButton isFavorite={isPlantFavorite(plant.id)} onToggle={() => togglePlantFavorite(plant.id)} />
      </View>
    );
  };

  const renderHistorySection = () => {
    if (allHistory.length === 0) {
      return (
        <EmptyState
          message={t.myPlants.empty.historyMessage}
          icon={<FileText size={64} color={colors.primary} />}
        />
      );
    }

    return (
      <>
        <FlatList
          data={paginatedHistory}
          extraData={plantTabItems.length}
          keyExtractor={(group) => group.dateLabel}
          renderItem={({ item: group }: { item: HistoryGroup }) => (
            <View>
              <Text style={styles.dateSectionHeader}>{group.dateLabel}</Text>
              {group.entries.map((entry: HistoryEntry) => (
                <HistoryCard key={entry.poi.id} entry={entry} />
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Pagination
              currentPage={historyPagination.currentPage}
              totalPages={historyPagination.totalPages}
              onPageChange={historyPagination.onPageChange}
              pageSize={historyPagination.pageSize}
              onPageSizeChange={historyPagination.onPageSizeChange}
            />
          }
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader />

      {/* Segmented Tabs */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentedTab, activeTab === 'plants' && styles.segmentedTabActive]}
          onPress={() => setActiveTab('plants')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentedTabText, activeTab === 'plants' && styles.segmentedTabTextActive]}>
            {t.myPlants.tabs.plants} ({plantCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentedTab, activeTab === 'history' && styles.segmentedTabActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentedTabText, activeTab === 'history' && styles.segmentedTabTextActive]}>
            {t.myPlants.tabs.history} ({historyCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'plants' ? (
        (plantTabItems ?? []).length === 0 ? (
          <EmptyState
            message={t.myPlants.empty.plantsMessage}
            icon={<Heart size={64} color={colors.error} />}
          />
        ) : (
          <FlatList
            data={plantsPagination.paginatedItems}
            extraData={plantTabItems.length}
            keyExtractor={(item) => item.kind === 'poi' ? `poi-${item.entry.poi.id}` : `plant-${item.plant.id}`}
            renderItem={renderPlantTabItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Pagination
                currentPage={plantsPagination.currentPage}
                totalPages={plantsPagination.totalPages}
                onPageChange={plantsPagination.onPageChange}
                pageSize={plantsPagination.pageSize}
                onPageSizeChange={plantsPagination.onPageSizeChange}
              />
            }
          />
        )
      ) : (
        renderHistorySection()
      )}

      <MyPlantFAB />
    </SafeAreaView>
  );
}
