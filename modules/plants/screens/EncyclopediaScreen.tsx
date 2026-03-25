// EncyclopediaScreen — ecranul principal al enciclopediei de plante medicinale.
// Afiseaza o lista de carduri cu plante, bara de cautare si navigare la pagina de detalii.

import React, { useState, useMemo } from 'react';
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

const ALL_PLANTS = getAllPlants();

export function EncyclopediaScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const { plants, setQuery, selectedPlantIds, setSelectedPlantIds } = usePlantSearch();
  const [filterVisible, setFilterVisible] = useState(false);

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
        allPlants={ALL_PLANTS}
        selectedPlantIds={selectedPlantIds}
        onApply={setSelectedPlantIds}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}
