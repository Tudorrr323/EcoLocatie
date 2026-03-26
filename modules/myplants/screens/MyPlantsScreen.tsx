// MyPlantsScreen — ecranul principal al modulului myplants.
// Afiseaza doua tab-uri (Plante / Istoric) cu liste de plante observate si istoric observatii.

import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Leaf, FileText } from 'lucide-react-native';
import { AppHeader } from '../../../shared/components/AppHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { useMyPlants } from '../hooks/useMyPlants';
import { HistoryCard } from '../components/HistoryCard';
import { MyPlantFAB } from '../components/MyPlantFAB';
import type { Plant } from '../../../shared/types/plant.types';
import type { HistoryGroup, HistoryEntry } from '../types/myplants.types';

export function MyPlantsScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const {
    activeTab,
    setActiveTab,
    favoritePlants,
    history,
    plantCount,
    historyCount,
    isFavorite,
    toggleFavorite,
  } = useMyPlants();

  const router = require('expo-router').useRouter();

  const renderFavoritePlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.plantCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/plant/${item.id}`)}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.plantCardImage}
        resizeMode="cover"
      />
      <View style={styles.plantCardInfo}>
        <Text style={styles.plantCardName} numberOfLines={1}>{getPlantName(item)}</Text>
        <Text style={styles.plantCardLatin} numberOfLines={1}>{item.name_latin}</Text>
        <View style={styles.plantCardMeta}>
          <View style={[styles.plantColorDot, { backgroundColor: item.icon_color }]} />
          <Text style={styles.plantCardCount}>{item.family}</Text>
        </View>
      </View>
      <FavoriteButton isFavorite={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
    </TouchableOpacity>
  );

  const renderHistorySection = () => {
    if (history.length === 0) {
      return (
        <EmptyState
          message={t.myPlants.empty.historyMessage}
          icon={<FileText size={64} color={colors.primary} />}
        />
      );
    }

    return (
      <FlatList
        data={history}
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
      />
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
        favoritePlants.length === 0 ? (
          <EmptyState
            message={t.myPlants.empty.plantsMessage}
            icon={<Heart size={64} color={colors.error} />}
          />
        ) : (
          <FlatList
            data={favoritePlants}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderFavoritePlant}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        renderHistorySection()
      )}

      <MyPlantFAB />
    </SafeAreaView>
  );
}
