// EncyclopediaScreen — ecranul principal al enciclopediei de plante medicinale.
// Afiseaza o lista de carduri cu plante, bara de cautare si navigare la pagina de detalii.

import React, { useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../../shared/components/SearchBar';
import { FilterButton } from '../../../shared/components/FilterButton';
import { Pagination } from '../../../shared/components/Pagination';
import { AppHeader } from '../../../shared/components/AppHeader';
import { usePlantSearch } from '../hooks/usePlantSearch';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PlantList } from '../components/PlantList';
import PlantFilterPanel from '../../../shared/components/PlantFilterPanel';
import { getAllPlants } from '../repository/plantsRepository';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { useSettings } from '../../../shared/context/SettingsContext';
import { useFavorites } from '../../../shared/hooks/useFavorites';
import { Snackbar } from '../../../shared/components/Snackbar';
import type { Plant } from '../../../shared/types/plant.types';

export function EncyclopediaScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { language } = useSettings();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const { plants, setQuery, selectedPlantIds, setSelectedPlantIds } = usePlantSearch();
  const { isFavorite, toggleFavorite, lastAction, clearLastAction } = useFavorites();
  const [filterVisible, setFilterVisible] = useState(false);
  const [allPlants, setAllPlants] = useState<Plant[]>([]);

  useEffect(() => {
    getAllPlants().then(setAllPlants).catch(() => {});
  }, [language]);

  const { currentPage, pageSize, totalPages, paginatedItems, onPageChange, onPageSizeChange } =
    usePagination(plants);

  return (
    <SafeAreaView style={plantsStyles.screen} edges={['top']}>
      <AppHeader />
      <View style={plantsStyles.searchContainer}>
        <View style={plantsStyles.searchRow}>
          <View style={plantsStyles.searchBarWrapper}>
            <SearchBar placeholder={t.plants.searchPlaceholder} onSearch={setQuery} />
          </View>
          <FilterButton onPress={() => setFilterVisible(true)} />
        </View>
      </View>
      <PlantList
        plants={paginatedItems}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        listFooter={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        }
      />
      <PlantFilterPanel
        visible={filterVisible}
        allPlants={allPlants}
        selectedPlantIds={selectedPlantIds}
        onApply={setSelectedPlantIds}
        onClose={() => setFilterVisible(false)}
      />
      <Snackbar
        visible={lastAction !== null}
        message={lastAction === 'added' ? t.shared.snackbar.addedToFavorites : t.shared.snackbar.removedFromFavorites}
        onDismiss={clearLastAction}
      />
    </SafeAreaView>
  );
}
