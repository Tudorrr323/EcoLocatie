// MyPlantDetailScreen — ecranul de detalii al unei plante din colectia utilizatorului.
// Afiseaza fotografia, informatii, observatiile proprii si detalii despre planta.

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  MapPin,
  Calendar,
  FlaskConical,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { HorizontalTabs } from '../../../shared/components/HorizontalTabs';
import { Badge } from '../../../shared/components/Badge';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ImageViewer } from '../../../shared/components/ImageViewer';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useTranslation } from '../../../shared/i18n';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { TranslatableText } from '../../../shared/components/TranslatableText';
import { CommentSection } from '../../../shared/components/CommentSection';
import { spacing } from '../../../shared/styles/theme';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { getMyPlantById } from '../repository/myPlantsRepository';
import type { PointOfInterest } from '../../../shared/types/plant.types';

export function MyPlantDetailScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  const [activeTab, setActiveTab] = useState('observations');
  const [menuVisible, setMenuVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [myPlant, setMyPlant] = useState<Awaited<ReturnType<typeof getMyPlantById>>>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyPlantById(user.id, Number(id)).then((result) => {
      if (!cancelled) setMyPlant(result);
    });
    return () => { cancelled = true; };
  }, [user, id]);

  const handleRemove = useCallback(() => {
    setRemoveModalVisible(false);
    setSuccessModalVisible(true);
  }, []);

  const handleSuccessDismiss = useCallback(() => {
    setSuccessModalVisible(false);
    router.back();
  }, [router]);

  if (!myPlant) {
    return <LoadingSpinner />;
  }

  const { plant, observations } = myPlant;

  const formatObservationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderObservationsTab = () => {
    if (observations.length === 0) {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionText}>{t.myPlants.detail.noObservations}</Text>
        </View>
      );
    }

    return (
      <View style={styles.timelineContainer}>
        {observations.map((obs: PointOfInterest, index: number) => (
          <View key={obs.id} style={styles.timelineItem}>
            {/* Timeline line + dot */}
            <View style={styles.timelineLineContainer}>
              {index < observations.length - 1 && <View style={styles.timelineLine} />}
              <View style={[styles.timelineDot, { position: 'absolute', top: 6 }]} />
            </View>

            {/* Content card */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineDate}>
                {formatObservationDate(obs.created_at)}
              </Text>

              {obs.comment && (
                <TranslatableText text={obs.comment} style={styles.timelineComment} />
              )}

              {obs.image_url && (
                <TouchableOpacity onPress={() => setFullscreenImage(obs.image_url!)}>
                  <Image
                    source={{ uri: obs.image_url }}
                    style={styles.timelineImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              <View style={styles.timelineStatusRow}>
                {obs.status === 'approved' ? (
                  <Badge text={t.myPlants.detail.approved} color={colors.success} />
                ) : obs.status === 'rejected' ? (
                  <Badge text={t.myPlants.detail.rejected} color={colors.error} />
                ) : (
                  <Badge text={t.myPlants.detail.pending} color={colors.warning} />
                )}
                {obs.ai_confidence != null && (
                  <Text style={styles.timelineDate}>
                    {t.myPlants.detail.confidence}: {Math.round(obs.ai_confidence * 100)}%
                  </Text>
                )}
              </View>

              {/* Comments section per observation */}
              <CommentSection poiId={obs.id} compact />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPlantInfoTab = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.description}</Text>
        <Text style={styles.sectionText}>{plant.description}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.partsUsed}</Text>
        {plant.parts_used.map((part: string, i: number) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>{part}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.benefits}</Text>
        {plant.benefits.map((benefit: string, i: number) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {plant.contraindications.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.error, borderBottomColor: colors.error }]}>
            {t.myPlants.detail.contraindications}
          </Text>
          {plant.contraindications.map((contra: string, i: number) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, styles.bulletWarning]} />
              <Text style={[styles.bulletText, styles.bulletTextWarning]}>{contra}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.habitat}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <MapPin size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{plant.habitat}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.harvestPeriod}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <Calendar size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{plant.harvest_period}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.preparation}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <FlaskConical size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{plant.preparation}</Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.detailContainer}>
      {/* Hero Image */}
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setFullscreenImage(plant.image_url)}>
          <Image
            source={{ uri: plant.image_url }}
            style={styles.detailHeroImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.detailBackButton, { top: insets.top + spacing.sm }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.detailMenuButton, { top: insets.top + spacing.sm }]}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.8}
        >
          <MoreVertical size={22} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Plant Info */}
      <View style={styles.detailInfoSection}>
        <Text style={styles.detailPlantName}>{getPlantName(plant)}</Text>
        <View style={styles.detailInfoRow}>
          <Text style={styles.detailInfoLabel}>{t.myPlants.detail.family}</Text>
          <Text style={styles.detailInfoValue}>:   {plant.family}</Text>
        </View>
        <View style={styles.detailInfoRow}>
          <Text style={styles.detailInfoLabel}>{t.myPlants.detail.scientificName}</Text>
          <Text style={styles.detailInfoValue}>:   {plant.name_latin}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ marginTop: spacing.sm }}>
        <HorizontalTabs
          tabs={[
            { key: 'observations', label: t.myPlants.detail.tabs.observations, content: null },
            { key: 'plantInfo', label: t.myPlants.detail.tabs.plantInfo, content: null },
          ]}
          activeKey={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Tab Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'observations' ? renderObservationsTab() : renderPlantInfoTab()}
      </ScrollView>

      {/* Three-dot Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={styles.menuModalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuModalContent, { top: insets.top + spacing.sm + 44 }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setRemoveModalVisible(true);
              }}
            >
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                {t.myPlants.menu.remove}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Remove Confirmation */}
      <ConfirmModal
        visible={removeModalVisible}
        title={t.myPlants.detail.removeTitle}
        message={t.myPlants.detail.removeMessage}
        confirmLabel={t.myPlants.detail.removeConfirm}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={handleRemove}
        onCancel={() => setRemoveModalVisible(false)}
      />

      {/* Success Modal */}
      <ConfirmModal
        visible={successModalVisible}
        title={t.myPlants.detail.removedSuccess}
        cancelLabel={t.shared.common.close}
        icon={<CheckCircle2 size={48} color={colors.primary} />}
        onCancel={handleSuccessDismiss}
      />

      <ImageViewer uri={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </View>
  );
}
