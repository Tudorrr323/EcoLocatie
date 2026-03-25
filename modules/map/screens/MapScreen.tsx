import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Bell, Bookmark } from 'lucide-react-native';
import { useLocation } from '../../../shared/hooks/useLocation';
import { useMapFilters } from '../hooks/useMapFilters';
import { SearchBar } from '../../../shared/components/SearchBar';
import InteractiveMap, { MapRef } from '../components/InteractiveMap';
import FilterPanel from '../components/FilterPanel';
import { mapStyles } from '../styles/map.styles';
import { colors } from '../../../shared/styles/theme';

const MapScreen: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { filters, setFilters, filteredMarkers, allPlants } = useMapFilters();
  const { getLocation, loading: locationLoading } = useLocation();

  const displayedMarkers = useMemo(() => {
    if (!searchQuery.trim()) return filteredMarkers;
    const q = searchQuery.toLowerCase();
    return filteredMarkers.filter(
      (m) =>
        m.plant.name_ro.toLowerCase().includes(q) ||
        m.plant.name_latin.toLowerCase().includes(q)
    );
  }, [filteredMarkers, searchQuery]);

  const handleMyLocation = useCallback(async () => {
    const coords = await getLocation();
    if (coords) {
      mapRef.current?.flyTo(coords.latitude, coords.longitude, 16);
    }
  }, [getLocation]);

  const handleRecenter = useCallback(() => {
    mapRef.current?.flyTo(45.4353, 28.008, 13);
  }, []);

  return (
    <SafeAreaView style={mapStyles.container}>
      <View style={mapStyles.header}>
        <Leaf size={28} color={colors.primary} />
        <Text style={mapStyles.headerTitle}>EcoLocation</Text>
        <View style={mapStyles.headerActions}>
          <TouchableOpacity style={mapStyles.headerIconButton} activeOpacity={0.7}>
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={mapStyles.headerIconButton} activeOpacity={0.7}>
            <Bookmark size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={mapStyles.searchContainer}>
        <SearchBar placeholder="Cauta plante..." onSearch={setSearchQuery} />
      </View>

      <View style={mapStyles.mapWrapper}>
        <InteractiveMap ref={mapRef} markers={displayedMarkers} />

        <View style={mapStyles.floatingButtonsContainer}>
          <TouchableOpacity
            style={[mapStyles.floatingButton, mapStyles.floatingButtonPrimary]}
            onPress={handleMyLocation}
            activeOpacity={0.8}
            disabled={locationLoading}
          >
            <Text
              style={[
                mapStyles.floatingButtonText,
                mapStyles.floatingButtonTextPrimary,
              ]}
            >
              {locationLoading ? 'Se cauta...' : 'Locatia mea'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={mapStyles.floatingButton}
            onPress={() => setFilterPanelVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={mapStyles.floatingButtonText}>Filtre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={mapStyles.floatingButton}
            onPress={handleRecenter}
            activeOpacity={0.8}
          >
            <Text style={mapStyles.floatingButtonText}>Recentreaza</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FilterPanel
        visible={filterPanelVisible}
        allPlants={allPlants}
        currentFilter={filters}
        onApply={(newFilter) => {
          setFilters(newFilter);
          setFilterPanelVisible(false);
        }}
        onClose={() => setFilterPanelVisible(false)}
      />
    </SafeAreaView>
  );
};

export default MapScreen;
