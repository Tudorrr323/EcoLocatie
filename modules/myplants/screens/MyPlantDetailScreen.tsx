// MyPlantDetailScreen — ecranul de detalii al unei plante din colectia utilizatorului.
// Afiseaza fotografia, informatii, observatiile proprii si detalii despre planta in tab-uri multiple.
// Meniul three-dot permite editarea observatiei si eliminarea din lista.

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  Pencil,
  MapPin,
  Calendar,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react-native';
import { HorizontalTabs } from '../../../shared/components/HorizontalTabs';
import { Input } from '../../../shared/components/Input';
import { Badge } from '../../../shared/components/Badge';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ImageViewer } from '../../../shared/components/ImageViewer';
import { Snackbar } from '../../../shared/components/Snackbar';
import { TranslatableText } from '../../../shared/components/TranslatableText';
import { CommentSection } from '../../../shared/components/CommentSection';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useTranslation } from '../../../shared/i18n';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { spacing, fonts, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { getMyPlantById, updateObservation, deleteAllObservationsForPlant } from '../repository/myPlantsRepository';
import { getPlantById } from '../../../shared/repository/dataProvider';
import { favoriteTarget } from '../../../shared/utils/favoriteTarget';
import type { Plant, PointOfInterest } from '../../../shared/types/plant.types';

export function MyPlantDetailScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const editStyles = useMemo(() => createEditStyles(colors), [colors]);
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

  // Edit state
  const [editingObs, setEditingObs] = useState<PointOfInterest | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHabitat, setEditHabitat] = useState('');
  const [editHarvestPeriod, setEditHarvestPeriod] = useState('');
  const [editBenefits, setEditBenefits] = useState('');
  const [editContraindications, setEditContraindications] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Read target POI from the mutable singleton (set by MyPlantsScreen before navigation)
  const [targetPoi] = useState(() => {
    const val = favoriteTarget.poi;
    favoriteTarget.poi = null; // consume it
    return val;
  });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const result = await getMyPlantById(user.id, Number(id));

      if (cancelled) return;
      if (!result) {
        // No user observations — build a minimal MyPlant from the favorite POI
        if (targetPoi) {
          const fullPlant = await getPlantById(Number(id));
          if (!cancelled && fullPlant) {
            setMyPlant({
              plant: fullPlant,
              observations: [targetPoi],
              observationCount: 1,
              lastObservationDate: targetPoi.created_at,
            });
          }
        } else {
          setMyPlant(result);
        }
        return;
      }
      // Fetch planta completă (cu parts_used, benefits, contraindications)
      const fullPlant = await getPlantById(result.plant.id);
      if (!cancelled) {
        // Put the targeted favorite POI first in the list (so latestObs picks it up)
        let observations = result.observations;
        if (targetPoi) {
          observations = [targetPoi, ...observations.filter((o) => o.id !== targetPoi.id)];
        }
        setMyPlant(fullPlant
          ? { ...result, plant: fullPlant, observations, observationCount: observations.length }
          : { ...result, observations, observationCount: observations.length },
        );
      }
    })();
    return () => { cancelled = true; };
  }, [user, id, targetPoi]);

  const handleRemove = useCallback(async () => {
    setRemoveModalVisible(false);
    if (user) {
      try {
        await deleteAllObservationsForPlant(user.id, Number(id));
      } catch {
        // continue even if API fails
      }
    }
    setSuccessModalVisible(true);
  }, [id, user]);

  const handleSuccessDismiss = useCallback(() => {
    setSuccessModalVisible(false);
    router.back();
  }, [router]);

  const openEditForObservation = useCallback((obs: PointOfInterest) => {
    setEditingObs(obs);
    setEditComment(obs.comment ?? '');
    setEditDescription(obs.description ?? '');
    setEditHabitat(obs.habitat ?? '');
    setEditHarvestPeriod(obs.harvest_period ?? '');
    setEditBenefits(obs.benefits ?? '');
    setEditContraindications(obs.contraindications ?? '');
    setMenuVisible(false);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingObs) return;
    setEditSaving(true);
    try {
      await updateObservation(editingObs.id, {
        comment: editComment,
        description: editDescription,
        habitat: editHabitat,
        harvest_period: editHarvestPeriod,
        benefits: editBenefits,
        contraindications: editContraindications,
      });
      // Update local state
      setMyPlant((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          observations: prev.observations.map((o) =>
            o.id === editingObs.id
              ? {
                  ...o,
                  comment: editComment,
                  description: editDescription,
                  habitat: editHabitat,
                  harvest_period: editHarvestPeriod,
                  benefits: editBenefits,
                  contraindications: editContraindications,
                  status: 'pending' as const,
                }
              : o,
          ),
        };
      });
      setEditingObs(null);
      setSnackbarVisible(true);
    } catch {
      // silently fail
    } finally {
      setEditSaving(false);
    }
  }, [editingObs, editComment, editDescription, editHabitat, editHarvestPeriod, editBenefits, editContraindications]);

  if (!myPlant) {
    return <LoadingSpinner />;
  }

  const { plant, observations } = myPlant;
  const latestObs = observations.length > 0 ? observations[0] : null;

  const formatObservationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // ── Tab: Observatii ──────────────────────────────────────────────

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
            <View style={styles.timelineLineContainer}>
              {index < observations.length - 1 && <View style={styles.timelineLine} />}
              <View style={[styles.timelineDot, { position: 'absolute', top: 6 }]} />
            </View>

            <View style={styles.timelineCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.timelineDate}>
                  {formatObservationDate(obs.created_at)}
                </Text>
                <TouchableOpacity
                  onPress={() => openEditForObservation(obs)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Pencil size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

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

              <CommentSection poiId={obs.id} compact />
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ── Datele efective: preferă observația (POI), fallback pe enciclopedie (plant) ──
  const sourceObs = latestObs;

  const effectiveDescription = sourceObs?.description || plant.description || '—';
  const effectiveHabitat = sourceObs?.habitat || plant.habitat || '—';
  const effectiveHarvestPeriod = sourceObs?.harvest_period || plant.harvest_period || '—';

  // ── Tab: Prezentare ──────────────────────────────────────────────

  const renderOverviewTab = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.description}</Text>
        <Text style={styles.sectionText}>{effectiveDescription}</Text>
      </View>

      {sourceObs?.comment ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t.sightings?.details?.comment ?? 'Comentariu'}</Text>
          <Text style={styles.sectionText}>{sourceObs.comment}</Text>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.partsUsed}</Text>
        {(plant.parts_used ?? []).length > 0 ? (
          plant.parts_used.map((part: string, i: number) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{part}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionText}>—</Text>
        )}
      </View>
    </>
  );

  // ── Tab: Beneficii — acelasi format ca pe harta (bullet points) ──

  const renderBenefitsTab = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{t.myPlants.detail.benefits}</Text>
      {sourceObs?.benefits ? (
        <Text style={styles.sectionText}>{sourceObs.benefits}</Text>
      ) : (plant.benefits ?? []).length > 0 ? (
        plant.benefits.map((b: string, i: number) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>{b}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.sectionText}>—</Text>
      )}
    </View>
  );

  // ── Tab: Contraindicatii — acelasi format ca pe harta (bullet points) ──

  const renderContraindicationsTab = () => (
    <View style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.error, borderBottomColor: colors.error }]}>
        {t.myPlants.detail.contraindications}
      </Text>
      {sourceObs?.contraindications ? (
        <Text style={[styles.sectionText, styles.bulletTextWarning]}>{sourceObs.contraindications}</Text>
      ) : (plant.contraindications ?? []).length > 0 ? (
        plant.contraindications.map((c: string, i: number) => (
          <View key={i} style={styles.bulletRow}>
            <View style={[styles.bullet, styles.bulletWarning]} />
            <Text style={[styles.bulletText, styles.bulletTextWarning]}>{c}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.sectionText}>—</Text>
      )}
    </View>
  );

  // ── Tab: Detalii ────────────────────────────────────────────────

  const renderDetailsTab = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.habitat}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <MapPin size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{effectiveHabitat}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.harvestPeriod}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <Calendar size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{effectiveHarvestPeriod}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t.myPlants.detail.preparation}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <FlaskConical size={18} color={colors.primaryLight} style={{ marginTop: 2 }} />
          <Text style={[styles.sectionText, { flex: 1 }]}>{plant.preparation || '—'}</Text>
        </View>
      </View>
    </>
  );

  // ── Render active tab ────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'observations': return renderObservationsTab();
      case 'overview': return renderOverviewTab();
      case 'benefits': return renderBenefitsTab();
      case 'contraindications': return renderContraindicationsTab();
      case 'details': return renderDetailsTab();
      default: return null;
    }
  };

  // ── Edit modal ───────────────────────────────────────────────────

  const renderEditModal = () => (
    <Modal visible={!!editingObs} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={() => setEditingObs(null)}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
      <View style={[editStyles.container, { paddingTop: insets.top }]}>
        <View style={editStyles.header}>
          <TouchableOpacity onPress={() => setEditingObs(null)} activeOpacity={0.7}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={editStyles.headerTitle}>{t.myPlants.edit.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={[editStyles.form, { paddingBottom: insets.bottom + spacing.xl * 2 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            <Input
              label={t.sightings.details.comment}
              value={editComment}
              onChangeText={setEditComment}
              multiline
              numberOfLines={2}
            />
            <Input
              label={t.myPlants.detail.description}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              numberOfLines={3}
            />
            <Input
              label={t.myPlants.detail.habitat}
              value={editHabitat}
              onChangeText={setEditHabitat}
              multiline
              numberOfLines={2}
            />
            <Input
              label={t.myPlants.detail.harvestPeriod}
              value={editHarvestPeriod}
              onChangeText={setEditHarvestPeriod}
            />
            <Input
              label={t.myPlants.detail.benefits}
              value={editBenefits}
              onChangeText={setEditBenefits}
              multiline
              numberOfLines={3}
            />
            <Input
              label={t.myPlants.detail.contraindications}
              value={editContraindications}
              onChangeText={setEditContraindications}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              style={[editStyles.saveButton, editSaving && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              activeOpacity={0.85}
              disabled={editSaving}
            >
              <Text style={editStyles.saveButtonText}>{t.myPlants.edit.save}</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.detailContainer}>
      {/* Hero Image */}
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setFullscreenImage(latestObs?.image_url || plant.image_url)}>
          <Image
            source={{ uri: latestObs?.image_url || plant.image_url }}
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
            { key: 'overview', label: t.myPlants.detail.tabs.overview, content: null },
            { key: 'benefits', label: t.myPlants.detail.tabs.benefits, content: null },
            { key: 'contraindications', label: t.myPlants.detail.tabs.contraindications, content: null },
            { key: 'details', label: t.myPlants.detail.tabs.details, content: null },
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
        {renderTabContent()}
      </ScrollView>

      {/* Three-dot Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={styles.menuModalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuModalContent, { top: insets.top + spacing.sm + 44 }]}>
            {latestObs && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => openEditForObservation(latestObs)}
                >
                  <Pencil size={20} color={colors.primary} />
                  <Text style={styles.menuItemText}>{t.myPlants.menu.edit}</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.xs }} />
              </>
            )}
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

      {renderEditModal()}

      <Snackbar
        visible={snackbarVisible}
        message={t.myPlants.edit.saved}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
}

const createEditStyles = (colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.text,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
    marginTop: spacing.xl,
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
  },
});
