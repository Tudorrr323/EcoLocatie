// CreatePOIForm — formularul complet pentru crearea unei observatii noi (POI).
// Integreaza captura foto, rezultatele AI, selectia locatiei GPS si comentariul utilizatorului.

import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { SearchBar } from '../../../shared/components/SearchBar';
import { sightingGuard } from '../../../shared/utils/sightingGuard';
import { PhotoCapture } from './PhotoCapture';
import { CameraScreen } from './CameraScreen';
import { AIResultsPreview } from './AIResultsPreview';
import { PlantSelector } from '../../plants/components/PlantSelector';
import LocationPicker from '../../map/components/LocationPicker';
import type { Coordinates } from '../../map/components/LocationPicker';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useMockIdentify } from '../hooks/useMockIdentify';
import { useLocation } from '../../../shared/hooks/useLocation';
import type { SightingDraft, AIResult } from '../types/sightings.types';
import type { Plant } from '../../../shared/types/plant.types';
import { createSightingsStyles } from '../styles/sightings.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { getPlants } from '../../../shared/repository/dataProvider';

type Step = 1 | 2 | 3 | 4;

interface StepIndicatorProps {
  currentStep: Step;
  maxStepReached: Step;
  onStepPress: (step: Step) => void;
}

function StepIndicator({ currentStep, maxStepReached, onStepPress }: StepIndicatorProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);
  const stepLabels = [t.sightings.steps.photo, t.sightings.steps.identify, t.sightings.steps.location, t.sightings.steps.details];

  return (
    <View style={sightingsStyles.stepIndicatorContainer}>
      {stepLabels.map((label, index) => {
        const stepNum = (index + 1) as Step;
        const isActive = stepNum === currentStep;
        const isDone = stepNum <= maxStepReached && stepNum !== currentStep;
        const canTap = stepNum <= maxStepReached && stepNum !== currentStep;

        return (
          <React.Fragment key={stepNum}>
            {index > 0 && (
              <View
                style={[
                  sightingsStyles.stepConnector,
                  stepNum <= maxStepReached && sightingsStyles.stepConnectorActive,
                ]}
              />
            )}
            <TouchableOpacity
              style={sightingsStyles.stepItem}
              onPress={() => canTap && onStepPress(stepNum)}
              activeOpacity={canTap ? 0.6 : 1}
              disabled={!canTap}
            >
              <View
                style={[
                  sightingsStyles.stepCircle,
                  isActive && sightingsStyles.stepCircleActive,
                  isDone && sightingsStyles.stepCircleDone,
                ]}
              >
                <Text
                  style={[
                    sightingsStyles.stepNumber,
                    (isActive || isDone) && sightingsStyles.stepNumberActive,
                  ]}
                >
                  {isDone ? '✓' : String(stepNum)}
                </Text>
              </View>
              <Text
                style={[
                  sightingsStyles.stepLabel,
                  isActive && sightingsStyles.stepLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

export interface CreatePOIFormRef {
  reset: () => void;
}

interface CreatePOIFormProps {
  onSubmit: (draft: SightingDraft) => void;
}

const EMPTY_DRAFT: SightingDraft = {
  imageUri: null,
  plantId: null,
  location: null,
  description: '',
  habitat: '',
  harvestPeriod: '',
  benefits: '',
  contraindications: '',
  comment: '',
  aiResults: [],
};

export const CreatePOIForm = forwardRef<CreatePOIFormRef, CreatePOIFormProps>(function CreatePOIForm({ onSubmit }, ref) {
  const colors = useThemeColors();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);
  const [step, setStep] = useState<Step>(1);
  const [maxStepReached, setMaxStepReached] = useState<Step>(1);
  const [draft, setDraft] = useState<SightingDraft>(EMPTY_DRAFT);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [manualQuery, setManualQuery] = useState('');

  const goToStep = useCallback((s: Step) => {
    setStep(s);
    setMaxStepReached((prev) => Math.max(prev, s) as Step);
  }, []);

  const { results: aiResults, loading: aiLoading, identify, reset: resetAI } = useMockIdentify();
  const { location, loading: locationLoading, error: locationError, getLocation } = useLocation();

  useEffect(() => {
    sightingGuard.hasProgress = step > 1 || draft.imageUri !== null;
  }, [step, draft.imageUri]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setStep(1);
      setMaxStepReached(1);
      setDraft({ ...EMPTY_DRAFT, aiResults: [] });
      setShowManualSelector(false);
      setShowCamera(false);
      setShowMapPicker(false);
      setManualQuery('');
      resetAI();
      sightingGuard.hasProgress = false;
    },
  }));

  // ── Helpers ────────────────────────────────────────────────────────────────

  const selectedPlantName = useCallback((): string => {
    if (!draft.plantId) return '';
    const plant = getPlants().find((p) => p.id === draft.plantId);
    return plant ? plant.name_ro : '';
  }, [draft.plantId]);

  // ── Step 1: Photo ──────────────────────────────────────────────────────────

  const handleCameraCapture = useCallback((uri: string) => {
    setDraft((prev) => ({ ...prev, imageUri: uri }));
    setShowCamera(false);
  }, []);

  const handleNextFromPhoto = async () => {
    if (!draft.imageUri) return;
    goToStep(2);
    const results = await identify(draft.imageUri);
    setDraft((prev) => ({ ...prev, aiResults: results }));
  };

  // ── Step 2: Identification ─────────────────────────────────────────────────

  const handleAISelect = (result: AIResult) => {
    setDraft((prev) => ({ ...prev, plantId: result.plantId }));
    setShowManualSelector(false);
    goToStep(3);
  };

  const handleManualSelect = () => {
    setShowManualSelector(true);
  };

  const handlePlantSelectorSelect = (plant: Plant) => {
    setDraft((prev) => ({ ...prev, plantId: plant.id }));
    setShowManualSelector(false);
    setManualQuery('');
    goToStep(3);
  };

  // ── Step 3: Location ───────────────────────────────────────────────────────

  const handleUseCurrentLocation = async () => {
    const coords = await getLocation();
    if (coords) {
      setDraft((prev) => ({ ...prev, location: coords }));
    }
  };

  const handleOpenMapPicker = async () => {
    if (!location && !draft.location) {
      await getLocation();
    }
    setShowMapPicker(true);
  };

  const handleMapPickerConfirm = (coords: Coordinates) => {
    setDraft((prev) => ({ ...prev, location: coords }));
    setShowMapPicker(false);
  };

  // ── Step 4: Details + Submit ───────────────────────────────────────────────

  const handleFieldChange = (field: 'description' | 'habitat' | 'harvestPeriod' | 'benefits' | 'contraindications' | 'comment', text: string) => {
    setDraft((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = () => {
    const finalDraft: SightingDraft = {
      ...draft,
      location: draft.location ?? location,
    };
    onSubmit(finalDraft);
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goBack = () => {
    if (step > 1) {
      goToStep((step - 1) as Step);
      if (step === 2) {
        resetAI();
        setShowManualSelector(false);
        setManualQuery('');
      }
    }
  };

  // ── Render step content ────────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>{t.sightings.photo.title}</Text>
            <PhotoCapture
              imageUri={draft.imageUri}
              onOpenCamera={() => setShowCamera(true)}
              onClear={() => setDraft((prev) => ({ ...prev, imageUri: null }))}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>
              {showManualSelector ? t.sightings.ai.selectPlant : t.sightings.ai.title}
            </Text>

            {showManualSelector ? (
              <View style={{ minHeight: 300 }}>
                <PlantSelector onSelect={handlePlantSelectorSelect} searchQuery={manualQuery} />
                <Button
                  title={t.sightings.ai.backToResults}
                  onPress={() => { setShowManualSelector(false); setManualQuery(''); }}
                  variant="ghost"
                  style={{ marginTop: 8 }}
                />
              </View>
            ) : (
              <AIResultsPreview
                results={aiResults.length > 0 ? aiResults : draft.aiResults}
                loading={aiLoading}
                onSelect={handleAISelect}
                onManualSelect={handleManualSelect}
              />
            )}
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>{t.sightings.location.title}</Text>
            <View style={sightingsStyles.locationContainer}>
              {(draft.location ?? location) ? (
                <View style={sightingsStyles.locationCard}>
                  <View style={sightingsStyles.locationCoordRow}>
                    <Text style={sightingsStyles.locationLabel}>{t.sightings.location.latitude}</Text>
                    <Text style={sightingsStyles.locationValue}>
                      {((draft.location ?? location)!.latitude).toFixed(6)}
                    </Text>
                  </View>
                  <View style={sightingsStyles.locationCoordRow}>
                    <Text style={sightingsStyles.locationLabel}>{t.sightings.location.longitude}</Text>
                    <Text style={sightingsStyles.locationValue}>
                      {((draft.location ?? location)!.longitude).toFixed(6)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={sightingsStyles.locationNoDataText}>
                  {t.sightings.location.noLocation}
                </Text>
              )}

              {locationError ? (
                <Text style={sightingsStyles.locationErrorText}>{locationError}</Text>
              ) : null}

              <View style={sightingsStyles.locationButtonsRow}>
                <View style={{ flex: 1 }}>
                  <Button
                    title={t.sightings.location.useGPS}
                    onPress={handleUseCurrentLocation}
                    loading={locationLoading}
                    variant="primary"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title={t.sightings.location.chooseOnMap}
                    onPress={handleOpenMapPicker}
                    variant="secondary"
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>{t.sightings.details.title}</Text>

            {draft.plantId ? (
              <View style={sightingsStyles.selectedPlantCard}>
                <Text style={sightingsStyles.selectedPlantLabel}>{t.sightings.details.selectedPlant}</Text>
                <Text style={sightingsStyles.selectedPlantName}>{selectedPlantName()}</Text>
              </View>
            ) : null}

            <Input
              label={t.sightings.details.description}
              placeholder={t.sightings.details.descriptionPlaceholder}
              value={draft.description}
              onChangeText={(v) => handleFieldChange('description', v)}
              multiline
              numberOfLines={3}
            />

            <Input
              label={t.sightings.details.habitat}
              placeholder={t.sightings.details.habitatPlaceholder}
              value={draft.habitat}
              onChangeText={(v) => handleFieldChange('habitat', v)}
              multiline
              numberOfLines={2}
            />

            <Input
              label={t.sightings.details.harvestPeriod}
              placeholder={t.sightings.details.harvestPeriodPlaceholder}
              value={draft.harvestPeriod}
              onChangeText={(v) => handleFieldChange('harvestPeriod', v)}
            />

            <Input
              label={t.sightings.details.benefits}
              placeholder={t.sightings.details.benefitsPlaceholder}
              value={draft.benefits}
              onChangeText={(v) => handleFieldChange('benefits', v)}
              multiline
              numberOfLines={3}
            />

            <Input
              label={t.sightings.details.contraindications}
              placeholder={t.sightings.details.contraindicationsPlaceholder}
              value={draft.contraindications}
              onChangeText={(v) => handleFieldChange('contraindications', v)}
              multiline
              numberOfLines={2}
            />

            <Input
              label={t.sightings.details.comment}
              placeholder={t.sightings.details.commentPlaceholder}
              value={draft.comment}
              onChangeText={(v) => handleFieldChange('comment', v)}
              multiline
              numberOfLines={2}
            />
          </View>
        );
    }
  };

  const renderNavButtons = () => {
    switch (step) {
      case 1:
        return (
          <View style={sightingsStyles.navRow}>
            <View style={sightingsStyles.navButtonFlex}>
              <Button
                title={t.sightings.nav.next}
                onPress={handleNextFromPhoto}
                disabled={!draft.imageUri}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={sightingsStyles.navRow}>
            <View style={sightingsStyles.navButtonFlex}>
              <Button title={t.sightings.nav.back} onPress={goBack} variant="ghost" />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={sightingsStyles.navRow}>
            <View style={sightingsStyles.navButtonFlex}>
              <Button title={t.sightings.nav.back} onPress={goBack} variant="ghost" />
            </View>
            <View style={sightingsStyles.navButtonFlex}>
              <Button
                title={t.sightings.nav.next}
                onPress={() => goToStep(4)}
                disabled={!(draft.location ?? location)}
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={sightingsStyles.navRow}>
            <View style={sightingsStyles.navButtonFlex}>
              <Button title={t.sightings.nav.back} onPress={goBack} variant="ghost" />
            </View>
            <View style={sightingsStyles.navButtonFlex}>
              <Button
                title={t.sightings.details.submit}
                onPress={handleSubmit}
                disabled={!draft.plantId || !(draft.location ?? location)}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <StepIndicator currentStep={step} maxStepReached={maxStepReached} onStepPress={goToStep} />

      {step === 2 && showManualSelector && (
        <View style={sightingsStyles.manualSelectorSearchBar}>
          <SearchBar
            placeholder={t.sightings.ai.searchPlaceholder}
            onSearch={setManualQuery}
            debounceMs={200}
          />
        </View>
      )}

      <ScrollView
        style={sightingsStyles.formScroll}
        contentContainerStyle={sightingsStyles.formScrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {renderStepContent()}
      </ScrollView>
      <View style={sightingsStyles.navFooter}>
        {renderNavButtons()}
      </View>
      <CameraScreen
        visible={showCamera}
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
      <LocationPicker
        visible={showMapPicker}
        initialCoordinates={(draft.location ?? location) ?? undefined}
        userLocation={location ?? undefined}
        onConfirm={handleMapPickerConfirm}
        onClose={() => setShowMapPicker(false)}
      />
    </KeyboardAvoidingView>
  );
});
