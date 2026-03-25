// PlantDetailScreen — ecranul de detalii complet al unei plante medicinale.
// Afiseaza descrierea, partile utilizabile, beneficiile, contraindicatiile,
// habitatul, perioada de recoltare si modul de preparare.
import React, { useMemo, useState } from 'react';
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
import { spacing } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';
import { getPlantById } from '../repository/plantsRepository';
import { createPlantsStyles } from '../styles/plants.styles';
import { useTranslation } from '../../../shared/i18n';

export function PlantDetailScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('prezentare');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const plant = getPlantById(Number(id));

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
            accessibilityLabel={plant.name_ro}
          />
        </TouchableOpacity>

        {/* Back button — pozitionat sub status bar */}
        <TouchableOpacity
          style={[plantsStyles.detailBackButton, { top: insets.top + spacing.sm }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityLabel="Inapoi"
        >
          <ArrowLeft size={22} color={colors.textLight} />
        </TouchableOpacity>

        {/* Name overlay */}
        <View style={plantsStyles.detailHeaderOverlay}>
          <Text style={plantsStyles.detailNameRo}>{plant.name_ro}</Text>
          <Text style={plantsStyles.detailNameLatin}>{plant.name_latin}</Text>
          <Badge text={plant.family} color={plant.icon_color} />
        </View>
      </View>

      {/* Tabs — spatiu fata de imagine */}
      <View style={{ marginTop: spacing.md }}>
        <HorizontalTabs
          tabs={[
            { key: 'prezentare', label: t.map.tabs.overview, content: null },
            { key: 'beneficii', label: t.plants.sections.benefits, content: null },
            { key: 'contraindicatii', label: t.plants.sections.contraindications, content: null },
            { key: 'detalii', label: t.map.tabs.details, content: null },
          ]}
          activeKey={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={plantsStyles.detailContent}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>

      <ImageViewer uri={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </View>
  );
}
