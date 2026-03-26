// PlantDetailScreen — ecranul de detalii complet al unei plante medicinale.
// Afiseaza descrierea, partile utilizabile, beneficiile, contraindicatiile,
// habitatul, perioada de recoltare, modul de preparare, observatii cu comentarii si buton favorit.
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, FlaskConical } from 'lucide-react-native';
import { Badge } from '../../../shared/components/Badge';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { HorizontalTabs } from '../../../shared/components/HorizontalTabs';
import { ImageViewer } from '../../../shared/components/ImageViewer';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import { Snackbar } from '../../../shared/components/Snackbar';
import { CommentSection } from '../../../shared/components/CommentSection';
import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing, fonts, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useFavorites } from '../../../shared/hooks/useFavorites';
import type { Plant, PointOfInterest } from '../../../shared/types/plant.types';
import { getPlantById } from '../repository/plantsRepository';
import { getApprovedPOIs } from '../../../shared/repository/dataProvider';
import { createPlantsStyles } from '../styles/plants.styles';
import { useTranslation } from '../../../shared/i18n';
import { useSettings, getPlantName } from '../../../shared/context/SettingsContext';

export function PlantDetailScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { language } = useSettings();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('prezentare');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantPOIs, setPlantPOIs] = useState<PointOfInterest[]>([]);
  const { isFavorite, toggleFavorite, lastAction, clearLastAction } = useFavorites();
  const plantId = Number(id);

  useEffect(() => {
    let cancelled = false;
    getPlantById(plantId).then((result) => {
      if (!cancelled && result) setPlant(result);
    });
    getApprovedPOIs().then((pois) => {
      if (!cancelled) setPlantPOIs(pois.filter((p) => p.plant_id === plantId));
    });
    return () => { cancelled = true; };
  }, [plantId, language]);

  if (!plant) {
    return <LoadingSpinner />;
  }

  return (
    <View style={plantsStyles.detailScroll}>
      {/* Hero image */}
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setFullscreenImage(plant.image_url)}>
          <Image
            source={{ uri: plant.image_url }}
            style={plantsStyles.detailHeroImage}
            resizeMode="cover"
            accessibilityLabel={getPlantName(plant)}
          />
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
          style={[plantsStyles.detailBackButton, { top: insets.top + spacing.sm }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={colors.textLight} />
        </TouchableOpacity>

        {/* Favorite button */}
        <View style={{
          position: 'absolute', top: insets.top + spacing.sm, right: spacing.md,
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
        }}>
          <FavoriteButton
            isFavorite={isFavorite(plantId)}
            onToggle={() => toggleFavorite(plantId)}
            size={20}
          />
        </View>

        {/* Name overlay */}
        <View style={plantsStyles.detailHeaderOverlay}>
          <Text style={plantsStyles.detailNameRo}>{getPlantName(plant)}</Text>
          <Text style={plantsStyles.detailNameLatin}>{plant.name_latin}</Text>
          <Badge text={plant.family} color={plant.icon_color} />
        </View>
      </View>

      {/* Tabs */}
      <View style={{ marginTop: spacing.md }}>
        <HorizontalTabs
          tabs={[
            { key: 'prezentare', label: t.map.tabs.overview, content: null },
            { key: 'beneficii', label: t.plants.sections.benefits, content: null },
            { key: 'contraindicatii', label: t.plants.sections.contraindications, content: null },
            { key: 'detalii', label: t.map.tabs.details, content: null },
            { key: 'comentarii', label: t.plants.tabs.comments, content: null },
          ]}
          activeKey={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={plantsStyles.detailContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'prezentare' && (
          <>
            <View style={plantsStyles.sectionCard}>
              <Text style={plantsStyles.sectionTitle}>{t.plants.sections.description}</Text>
              <Text style={plantsStyles.sectionText}>{plant.description}</Text>
            </View>

            <View style={plantsStyles.sectionCard}>
              <Text style={plantsStyles.sectionTitle}>{t.plants.sections.partsUsed}</Text>
              {plant.parts_used.map((part: string, index: number) => (
                <View key={index} style={plantsStyles.bulletRow}>
                  <View style={plantsStyles.bullet} />
                  <Text style={plantsStyles.bulletText}>{part}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'beneficii' && (
          <View style={plantsStyles.sectionCard}>
            <Text style={plantsStyles.sectionTitle}>{t.plants.sections.benefits}</Text>
            {plant.benefits.map((benefit: string, index: number) => (
              <View key={index} style={plantsStyles.bulletRow}>
                <View style={plantsStyles.bullet} />
                <Text style={plantsStyles.bulletText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'contraindicatii' && (
          <View style={plantsStyles.sectionCard}>
            <Text style={[plantsStyles.sectionTitle, { color: colors.error, borderBottomColor: colors.error }]}>
              {t.plants.sections.contraindications}
            </Text>
            {plant.contraindications.length > 0 ? (
              plant.contraindications.map((contra: string, index: number) => (
                <View key={index} style={plantsStyles.bulletRow}>
                  <View style={[plantsStyles.bullet, plantsStyles.bulletWarning]} />
                  <Text style={[plantsStyles.bulletText, plantsStyles.bulletTextWarning]}>
                    {contra}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={plantsStyles.sectionText}>{t.plants.noContraindications}</Text>
            )}
          </View>
        )}

        {activeTab === 'detalii' && (
          <>
            <View style={plantsStyles.sectionCard}>
              <Text style={plantsStyles.sectionTitle}>{t.plants.sections.habitat}</Text>
              <View style={plantsStyles.infoRow}>
                <MapPin size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
                <Text style={plantsStyles.infoText}>{plant.habitat}</Text>
              </View>
            </View>

            <View style={plantsStyles.sectionCard}>
              <Text style={plantsStyles.sectionTitle}>{t.plants.sections.harvestPeriod}</Text>
              <View style={plantsStyles.infoRow}>
                <Calendar size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
                <Text style={plantsStyles.infoText}>{plant.harvest_period}</Text>
              </View>
            </View>

            <View style={plantsStyles.sectionCard}>
              <Text style={plantsStyles.sectionTitle}>{t.plants.sections.preparation}</Text>
              <View style={plantsStyles.infoRow}>
                <FlaskConical size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
                <Text style={plantsStyles.infoText}>{plant.preparation}</Text>
              </View>
            </View>
          </>
        )}

        {activeTab === 'comentarii' && (
          <>
            {plantPOIs.length === 0 ? (
              <EmptyState message={t.plants.observations.noObservations} />
            ) : (
              plantPOIs.map((poi) => (
                <View key={poi.id} style={{
                  backgroundColor: colors.surface, borderRadius: borderRadius.lg,
                  padding: spacing.md, marginBottom: spacing.md,
                  borderLeftWidth: 3, borderLeftColor: plant.icon_color,
                }}>
                  <Text style={{ fontSize: fonts.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>
                    {new Date(poi.created_at).toLocaleDateString('ro-RO')}
                  </Text>
                  {poi.comment ? (
                    <Text style={{ fontSize: fonts.sizes.md, color: colors.text, marginBottom: spacing.sm, lineHeight: 20 }}>
                      "{poi.comment}"
                    </Text>
                  ) : null}
                  <CommentSection poiId={poi.id} compact />
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <ImageViewer uri={fullscreenImage} onClose={() => setFullscreenImage(null)} />

      <Snackbar
        visible={lastAction !== null}
        message={lastAction === 'added' ? t.shared.snackbar.addedToFavorites : t.shared.snackbar.removedFromFavorites}
        onDismiss={clearLastAction}
      />
    </View>
  );
}
