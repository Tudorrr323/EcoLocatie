// MapScreen — ecranul principal al aplicatiei cu harta interactiva.
// Integreaza harta Leaflet, bara de cautare cu buton filtre si butonul GPS pentru localizare in timp real.

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Crosshair, MessageCircle, Navigation } from 'lucide-react-native';
import { Image } from 'react-native';
import { ImageViewer } from '../../../shared/components/ImageViewer';
import { HorizontalTabs } from '../../../shared/components/HorizontalTabs';
import { AppHeader } from '../../../shared/components/AppHeader';
import { useLocation } from '../../../shared/hooks/useLocation';
import { useMapFilters } from '../hooks/useMapFilters';
import { SearchBar, SearchBarRef } from '../../../shared/components/SearchBar';
import { FilterButton } from '../../../shared/components/FilterButton';
import { SwipeableBottomSheet } from '../../../shared/components/SwipeableBottomSheet';
import InteractiveMap, { MapRef } from '../components/InteractiveMap';
import PlantFilterPanel from '../../../shared/components/PlantFilterPanel';
import { createMapStyles } from '../styles/map.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { MarkerData } from '../types/map.types';
import { Keyboard } from 'react-native';
import { useTranslation } from '../../../shared/i18n';
import { getPlantById, getPOIById } from '../../../shared/repository/dataProvider';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { TranslatableText } from '../../../shared/components/TranslatableText';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import { usePOIFavorites } from '../../../shared/context/POIFavoritesContext';
import { Snackbar } from '../../../shared/components/Snackbar';
import { ChatScreen } from '../components/ChatScreen';
import { CommentSection } from '../../../shared/components/CommentSection';

const MapScreen: React.FC = () => {
  const colors = useThemeColors();
  const t = useTranslation();
  const mapStyles = useMemo(() => createMapStyles(colors), [colors]);
  const poiStyles = useMemo(() => createPoiStyles(colors), [colors]);
  const suggestionStyles = useMemo(() => createSuggestionStyles(colors), [colors]);
  const mapRef = useRef<MapRef>(null);
  const searchBarRef = useRef<SearchBarRef>(null);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [centeredOnUser, setCenteredOnUser] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imgPressed, setImgPressed] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const { isPoiFavorite, togglePoiFavorite, lastAction, clearLastAction } = usePOIFavorites();
  const imgTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState('prezentare');
  const [searchAreaHeight, setSearchAreaHeight] = useState(0);
  const [bearing, setBearing] = useState(0);

  const { filters, setFilters, displayedMarkers, suggestions, allPlants, setSearchQuery, refreshMarkers } = useMapFilters();

  useFocusEffect(useCallback(() => {
    refreshMarkers();
  }, [refreshMarkers]));
  const { location, getLocation, loading: locationLoading, watching, startWatching } = useLocation();

  const handleSuggestionPress = useCallback(async (marker: MarkerData) => {
    setSearchQuery('');
    searchBarRef.current?.clear();
    searchBarRef.current?.blur();
    Keyboard.dismiss();
    mapRef.current?.flyTo(marker.latitude, marker.longitude, 16);
    setSelectedMarker(marker);
    setActiveTab('prezentare');
    // Fetch full POI + plant details (list endpoint may omit user-written fields)
    const [fullPOI, fullPlant] = await Promise.all([getPOIById(marker.id), getPlantById(marker.plant.id)]);
    setSelectedMarker((prev) => {
      if (!prev || prev.id !== marker.id) return prev;
      return { ...prev, ...(fullPOI ?? {}), plant: fullPlant ?? prev.plant };
    });
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

  const handleMarkerTap = useCallback(async (markerId: number) => {
    const marker = displayedMarkers.find((m) => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setActiveTab('prezentare');
      // Fetch full POI + plant details (list endpoint may omit user-written fields)
      const [fullPOI, fullPlant] = await Promise.all([getPOIById(marker.id), getPlantById(marker.plant.id)]);
      setSelectedMarker((prev) => {
        if (!prev || prev.id !== marker.id) return prev;
        return { ...prev, ...(fullPOI ?? {}), plant: fullPlant ?? prev.plant };
      });
    }
  }, [displayedMarkers]);

  const handleMapTap = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const hasInitiallyLocated = useRef(false);
  const mapReady = useRef(false);

  useEffect(() => {
    if (location) {
      mapRef.current?.updateUserLocation(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <SafeAreaView style={mapStyles.container}>
      <AppHeader />

      <View style={{ flex: 1 }}>
        <View
          style={mapStyles.searchContainer}
          onLayout={(e) => setSearchAreaHeight(e.nativeEvent.layout.height)}
        >
          <View style={mapStyles.searchRow}>
            <View style={mapStyles.searchBarWrapper}>
              <SearchBar
                ref={searchBarRef}
                placeholder={t.map.searchPlaceholder}
                onSearch={setSearchQuery}
              />
            </View>
            <FilterButton onPress={() => setFilterPanelVisible(true)} />
          </View>
        </View>

        <View style={mapStyles.mapWrapper}>
        <InteractiveMap
          ref={mapRef}
          markers={displayedMarkers}
          onUserDrag={handleUserDrag}
          onMarkerTap={handleMarkerTap}
          onMapTap={handleMapTap}
          onBearingChange={setBearing}
          onMapReady={() => {
            mapReady.current = true;
            if (location) {
              setTimeout(() => {
                mapRef.current?.updateUserLocation(location.latitude, location.longitude);
              }, 300);
            }
            if (!hasInitiallyLocated.current) {
              hasInitiallyLocated.current = true;
              handleGPS();
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
            size={18}
            color={centeredOnUser ? colors.primary : colors.text}
            fill={centeredOnUser ? colors.primary : 'none'}
          />
        </TouchableOpacity>

        {Math.abs(bearing) > 0.5 && (
          <TouchableOpacity
            style={mapStyles.compassButton}
            onPress={() => mapRef.current?.resetBearing()}
            activeOpacity={0.8}
            accessibilityLabel={t.map.compassButton}
          >
            <Navigation
              size={18}
              color={colors.primary}
              fill={colors.primary}
              style={{ transform: [{ rotate: `${-bearing}deg` }] }}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={mapStyles.chatButton}
          onPress={() => setChatVisible(true)}
          activeOpacity={0.8}
        >
          <MessageCircle size={26} color={colors.textLight} fill={colors.textLight} />
        </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={[suggestionStyles.container, {
            position: 'absolute',
            top: searchAreaHeight + spacing.xs,
            left: spacing.md,
            right: spacing.md,
            zIndex: 20,
          }]}>
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
                    {getPlantName(marker.plant)}
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

      <PlantFilterPanel
        visible={filterPanelVisible}
        allPlants={allPlants}
        selectedPlantIds={filters.selectedPlantIds}
        onApply={(ids) => setFilters({ ...filters, selectedPlantIds: ids })}
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
                onTouchStart={(e) => {
                  imgTouchStartRef.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
                  setImgPressed(true);
                }}
                onTouchMove={(e) => {
                  if (imgTouchStartRef.current) {
                    const dx = Math.abs(e.nativeEvent.pageX - imgTouchStartRef.current.x);
                    const dy = Math.abs(e.nativeEvent.pageY - imgTouchStartRef.current.y);
                    if (dx > 10 || dy > 10) {
                      setImgPressed(false);
                      imgTouchStartRef.current = null;
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setImgPressed(false);
                  if (imgTouchStartRef.current) {
                    const dx = Math.abs(e.nativeEvent.pageX - imgTouchStartRef.current.x);
                    const dy = Math.abs(e.nativeEvent.pageY - imgTouchStartRef.current.y);
                    if (dx < 10 && dy < 10) {
                      setFullscreenImage(selectedMarker.image_url || selectedMarker.plant.image_url);
                    }
                  }
                  imgTouchStartRef.current = null;
                }}
                onTouchCancel={() => {
                  setImgPressed(false);
                  imgTouchStartRef.current = null;
                }}
                style={poiStyles.headerImageTouchable}
              >
                <Image
                  source={{ uri: selectedMarker.image_url || selectedMarker.plant.image_url }}
                  style={[poiStyles.headerImage, imgPressed && { opacity: 0.6 }]}
                  resizeMode="cover"
                />
              </View>
              <View style={poiStyles.headerInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[poiStyles.nameRo, { flex: 1 }]}>{getPlantName(selectedMarker.plant)}</Text>
                  <FavoriteButton
                    isFavorite={isPoiFavorite(selectedMarker.id)}
                    onToggle={() => togglePoiFavorite(selectedMarker.id)}
                  />
                </View>
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
                { key: 'prezentare', label: t.map.tabs.overview, content: null },
                { key: 'beneficii', label: t.map.tabs.benefits, content: null },
                { key: 'contraindicatii', label: t.map.tabs.contraindications, content: null },
                { key: 'detalii', label: t.map.tabs.details, content: null },
                { key: 'comentarii', label: t.map.tabs.comments, content: null },
              ]}
              activeKey={activeTab}
              onTabChange={setActiveTab}
            />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={poiStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {activeTab === 'prezentare' && (
                <>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.description || selectedMarker.plant.description}
                  </Text>
                  {selectedMarker.comment ? (
                    <>
                      <Text style={poiStyles.sectionTitle}>{t.map.sections.comment}</Text>
                      <TranslatableText text={selectedMarker.comment} style={poiStyles.sectionText} />
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
                      <Text style={[poiStyles.sectionTitle, { marginTop: spacing.md }]}>{t.map.sections.partsUsed}</Text>
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
                  <Text style={poiStyles.sectionTitle}>{t.map.sections.habitat}</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.habitat || selectedMarker.plant.habitat}
                  </Text>

                  <Text style={poiStyles.sectionTitle}>{t.map.sections.harvestPeriod}</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.harvest_period || selectedMarker.plant.harvest_period}
                  </Text>

                  <Text style={poiStyles.sectionTitle}>{t.map.sections.preparation}</Text>
                  <Text style={poiStyles.sectionText}>
                    {selectedMarker.plant.preparation}
                  </Text>
                </>
              )}

              {activeTab === 'comentarii' && (
                <CommentSection poiId={selectedMarker.id} />
              )}
            </ScrollView>
          </View>
        ) : null}
      </SwipeableBottomSheet>

      <ImageViewer uri={fullscreenImage} onClose={() => setFullscreenImage(null)} />

      <ChatScreen visible={chatVisible} onClose={() => setChatVisible(false)} />

      <Snackbar
        visible={lastAction !== null}
        message={lastAction === 'added' ? t.shared.snackbar.addedToFavorites : t.shared.snackbar.removedFromFavorites}
        onDismiss={clearLastAction}
      />

    </SafeAreaView>
  );
};

const createPoiStyles = (colors: ThemeColors) => StyleSheet.create({
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

const createSuggestionStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
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
