// MapScreen — ecranul principal al aplicatiei cu harta interactiva.
// Integreaza harta Leaflet, bara de cautare cu buton filtre si butonul GPS pentru localizare in timp real.

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Crosshair } from 'lucide-react-native';
import { Image } from 'react-native';
import { ImageViewer } from '../../../shared/components/ImageViewer';
import { HorizontalTabs } from '../../../shared/components/HorizontalTabs';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import { useLocation } from '../../../shared/hooks/useLocation';
import { useMapFilters } from '../hooks/useMapFilters';
import { SearchBar } from '../../../shared/components/SearchBar';
import { FilterButton } from '../../../shared/components/FilterButton';
import { NotificationButton } from '../../../shared/components/NotificationButton';
import { SwipeableBottomSheet } from '../../../shared/components/SwipeableBottomSheet';
import InteractiveMap, { MapRef } from '../components/InteractiveMap';
import FilterPanel from '../components/FilterPanel';
import { mapStyles } from '../styles/map.styles';
import { colors, fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { MarkerData } from '../types/map.types';

const MapScreen: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [centeredOnUser, setCenteredOnUser] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imgPressed, setImgPressed] = useState(false);
  const [activeTab, setActiveTab] = useState('prezentare');

  const { filters, setFilters, filteredMarkers, allPlants, refreshMarkers } = useMapFilters();

  useFocusEffect(useCallback(() => {
    refreshMarkers();
  }, [refreshMarkers]));
  const { location, getLocation, loading: locationLoading, watching, startWatching } = useLocation();

  const displayedMarkers = useMemo(() => {
    if (!searchQuery.trim()) return filteredMarkers;
    const q = removeDiacritics(searchQuery.toLowerCase());
    return filteredMarkers.filter(
      (m) =>
        removeDiacritics(m.plant.name_ro.toLowerCase()).includes(q) ||
        removeDiacritics(m.plant.name_latin.toLowerCase()).includes(q)
    );
  }, [filteredMarkers, searchQuery]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = removeDiacritics(searchQuery.toLowerCase());
    const seen = new Set<number>();
    const results: typeof filteredMarkers = [];
    for (const m of filteredMarkers) {
      if (seen.has(m.plant.id)) continue;
      if (
        removeDiacritics(m.plant.name_ro.toLowerCase()).includes(q) ||
        removeDiacritics(m.plant.name_latin.toLowerCase()).includes(q)
      ) {
        seen.add(m.plant.id);
        results.push(m);
        if (results.length >= 3) break;
      }
    }
    return results;
  }, [filteredMarkers, searchQuery]);

  const handleSuggestionPress = useCallback((marker: MarkerData) => {
    setSearchQuery('');
    mapRef.current?.flyTo(marker.latitude, marker.longitude, 16);
    setSelectedMarker(marker);
    setActiveTab('prezentare');
  }, []);

  const handleGPS = useCallback(async () => {
    // Daca avem deja locatia, centreaza imediat
    if (location) {
      mapRef.current?.flyTo(location.latitude, location.longitude, 16);
      setCenteredOnUser(true);
    }
    if (!watching) {
      await startWatching();
      // Daca nu aveam locatie, obtinem acum
      if (!location) {
        const coords = await getLocation();
        if (coords) {
          mapRef.current?.flyTo(coords.latitude, coords.longitude, 16);
          setCenteredOnUser(true);
        }
      }
    }
  }, [watching, startWatching, getLocation, location]);

  const handleUserDrag = useCallback(() => {
    setCenteredOnUser(false);
  }, []);

  const handleMarkerTap = useCallback((markerId: number) => {
    const marker = displayedMarkers.find((m) => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setActiveTab('prezentare');
    }
  }, [displayedMarkers]);

  const handleMapTap = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const hasInitiallyLocated = useRef(false);

  useEffect(() => {
    if (!hasInitiallyLocated.current) {
      hasInitiallyLocated.current = true;
      handleGPS();
    }
  }, [handleGPS]);

  useEffect(() => {
    if (location) {
      mapRef.current?.updateUserLocation(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <SafeAreaView style={mapStyles.container}>
      <View style={mapStyles.header}>
        <Image source={require('../../../assets/SmallLogoEcoLocation.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
        <Text style={mapStyles.headerTitle}>
          <Text style={{ color: colors.logoGreen }}>Eco</Text>
          <Text style={{ color: colors.logoTeal }}>Location</Text>
        </Text>
        <View style={mapStyles.headerActions}>
          <NotificationButton />
        </View>
      </View>

      <View style={[mapStyles.searchContainer, { zIndex: 10 }]}>
        <View style={mapStyles.searchRow}>
          <View style={mapStyles.searchBarWrapper}>
            <SearchBar placeholder="Cauta plante..." onSearch={setSearchQuery} />
          </View>
          <FilterButton onPress={() => setFilterPanelVisible(true)} />
        </View>

        {suggestions.length > 0 && (
          <View style={suggestionStyles.container}>
            {suggestions.map((marker, index) => (
              <TouchableOpacity
                key={marker.id}
                style={[
                  suggestionStyles.item,
                  index === suggestions.length - 1 && suggestionStyles.itemLast,
                ]}
                onPress={() => handleSuggestionPress(marker)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: marker.plant.image_url }}
                  style={suggestionStyles.image}
                  resizeMode="cover"
                />
                <View style={suggestionStyles.info}>
                  <Text style={suggestionStyles.name} numberOfLines={1}>
                    {marker.plant.name_ro}
                  </Text>
                  <Text style={suggestionStyles.latin} numberOfLines={1}>
                    {marker.plant.name_latin}
                  </Text>
                  <Text style={suggestionStyles.family} numberOfLines={1}>
                    {marker.plant.family}
                  </Text>
                </View>
                <View style={[suggestionStyles.dot, { backgroundColor: marker.plant.icon_color }]} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={mapStyles.mapWrapper}>
        <InteractiveMap
          ref={mapRef}
          markers={displayedMarkers}
          onUserDrag={handleUserDrag}
          onMarkerTap={handleMarkerTap}
          onMapTap={handleMapTap}
          onMapReady={() => {
            if (location) {
              setTimeout(() => {
                mapRef.current?.updateUserLocation(location.latitude, location.longitude);
              }, 300);
            }
          }}
        />

        <TouchableOpacity
          style={mapStyles.gpsButton}
          onPress={handleGPS}
          activeOpacity={0.8}
          disabled={locationLoading}
        >
          <Crosshair
            size={24}
            color={centeredOnUser ? colors.primary : colors.text}
            fill={centeredOnUser ? colors.primary : 'none'}
          />
        </TouchableOpacity>
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

      <SwipeableBottomSheet
        visible={!!selectedMarker}
        peekHeight={240}
        onClose={() => setSelectedMarker(null)}
        header={selectedMarker ? (
          <View style={poiStyles.headerDrag}>
            <View style={poiStyles.headerRow}>
              <View
                onTouchStart={() => setImgPressed(true)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setImgPressed(false);
                  setFullscreenImage(selectedMarker.image_url || selectedMarker.plant.image_url);
                }}
                onTouchCancel={() => setImgPressed(false)}
                style={poiStyles.headerImageTouchable}
              >
                <Image
                  source={{ uri: selectedMarker.image_url || selectedMarker.plant.image_url }}
                  style={[poiStyles.headerImage, imgPressed && { opacity: 0.6 }]}
                  resizeMode="cover"
                />
              </View>
              <View style={poiStyles.headerInfo}>
                <Text style={poiStyles.nameRo}>{selectedMarker.plant.name_ro}</Text>
                <Text style={poiStyles.nameLatin}>{selectedMarker.plant.name_latin}</Text>
                <View style={poiStyles.metaRow}>
                  <View style={[poiStyles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={poiStyles.badgeText}>
                      {Math.round(selectedMarker.ai_confidence * 100)}%
                    </Text>
                  </View>
                  <Text style={poiStyles.date}>
                    {new Date(selectedMarker.created_at).toLocaleDateString('ro-RO')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={poiStyles.separator} />
          </View>
        ) : undefined}
      >
        {selectedMarker ? (
          <View style={{ flex: 1 }}>
            <HorizontalTabs
              tabs={[
                { key: 'prezentare', label: 'Prezentare', content: null },
                { key: 'beneficii', label: 'Beneficii', content: null },
                { key: 'contraindicatii', label: 'Contraindicatii', content: null },
                { key: 'detalii', label: 'Detalii', content: null },
              ]}
              activeKey={activeTab}
              onTabChange={setActiveTab}
            />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={poiStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {activeTab === 'prezentare' && (
                <>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.description || selectedMarker.plant.description}
                  </Text>
                  {selectedMarker.comment ? (
                    <>
                      <Text style={poiStyles.sectionTitle}>Comentariu</Text>
                      <Text style={poiStyles.sectionText}>{selectedMarker.comment}</Text>
                    </>
                  ) : null}
                </>
              )}

              {activeTab === 'beneficii' && (
                <>
                  {selectedMarker.benefits ? (
                    <Text style={poiStyles.sectionText}>{selectedMarker.benefits}</Text>
                  ) : (
                    selectedMarker.plant.benefits.map((b, i) => (
                      <Text key={i} style={poiStyles.bulletItem}>• {b}</Text>
                    ))
                  )}
                  {selectedMarker.plant.parts_used.length > 0 && (
                    <>
                      <Text style={[poiStyles.sectionTitle, { marginTop: spacing.md }]}>Parti utilizabile</Text>
                      {selectedMarker.plant.parts_used.map((p, i) => (
                        <Text key={i} style={poiStyles.bulletItem}>• {p}</Text>
                      ))}
                    </>
                  )}
                </>
              )}

              {activeTab === 'contraindicatii' && (
                <>
                  {selectedMarker.contraindications ? (
                    <Text style={[poiStyles.sectionText, { color: colors.error }]}>{selectedMarker.contraindications}</Text>
                  ) : (
                    selectedMarker.plant.contraindications.map((c, i) => (
                      <Text key={i} style={[poiStyles.bulletItem, { color: colors.error }]}>• {c}</Text>
                    ))
                  )}
                </>
              )}

              {activeTab === 'detalii' && (
                <>
                  <Text style={poiStyles.sectionTitle}>Habitat</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.habitat || selectedMarker.plant.habitat}
                  </Text>

                  <Text style={poiStyles.sectionTitle}>Perioada de recoltare</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.harvest_period || selectedMarker.plant.harvest_period}
                  </Text>

                  <Text style={poiStyles.sectionTitle}>Mod de preparare</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.plant.preparation}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        ) : null}
      </SwipeableBottomSheet>

      <ImageViewer uri={fullscreenImage} onClose={() => setFullscreenImage(null)} />

    </SafeAreaView>
  );
};

const poiStyles = StyleSheet.create({
  headerDrag: {
    paddingHorizontal: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerImageTouchable: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  nameRo: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  nameLatin: {
    fontSize: fonts.sizes.md,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textLight,
  },
  date: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  bulletItem: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
});

const suggestionStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.text,
  },
  latin: {
    fontSize: fonts.sizes.sm,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  family: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default MapScreen;
