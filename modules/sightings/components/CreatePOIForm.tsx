// CreatePOIForm — formularul complet pentru crearea unei observatii noi (POI).
// Integreaza captura foto, rezultatele AI, selectia locatiei GPS si comentariul utilizatorului.

import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
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
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';
import { getPlants } from '../../../shared/repository/dataProvider';

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ['Foto', 'Identificare', 'Locatie', 'Detalii'];

interface StepIndicatorProps {
  currentStep: Step;
  maxStepReached: Step;
  onStepPress: (step: Step) => void;
}

function StepIndicator({ currentStep, maxStepReached, onStepPress }: StepIndicatorProps) {
  return (
    <View style={sightingsStyles.stepIndicatorContainer}>
      {STEP_LABELS.map((label, index) => {
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
  const [step, setStep] = useState<Step>(1);
  const [maxStepReached, setMaxStepReached] = useState<Step>(1);
  const [draft, setDraft] = useState<SightingDraft>(EMPTY_DRAFT);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const goToStep = useCallback((s: Step) => {
    setStep(s);
    setMaxStepReached((prev) => Math.max(prev, s) as Step);
  }, []);

  const { results: aiResults, loading: aiLoading, identify, reset: resetAI } = useMockIdentify();
  const { location, loading: locationLoading, error: locationError, getLocation } = useLocation();

  useImperativeHandle(ref, () => ({
    reset: () => {
      setStep(1);
      setMaxStepReached(1);
      setDraft({ ...EMPTY_DRAFT, aiResults: [] });
      setShowManualSelector(false);
      setShowCamera(false);
      setShowMapPicker(false);
      resetAI();
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
      }
    }
  };

  // ── Render step content ────────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>Adauga o fotografie</Text>
            <PhotoCapture
              imageUri={draft.imageUri}
              onOpenCamera={() => setShowCamera(true)}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>
              {showManualSelector ? 'Alege planta' : 'Rezultate identificare AI'}
            </Text>

            {showManualSelector ? (
              <View style={{ minHeight: 300 }}>
                <PlantSelector onSelect={handlePlantSelectorSelect} />
                <Button
                  title="Inapoi la rezultate AI"
                  onPress={() => setShowManualSelector(false)}
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
            <Text style={sightingsStyles.stepTitle}>Locatia observatiei</Text>
            <View style={sightingsStyles.locationContainer}>
              {(draft.location ?? location) ? (
                <View style={sightingsStyles.locationCard}>
                  <View style={sightingsStyles.locationCoordRow}>
                    <Text style={sightingsStyles.locationLabel}>Latitudine</Text>
                    <Text style={sightingsStyles.locationValue}>
                      {((draft.location ?? location)!.latitude).toFixed(6)}
                    </Text>
                  </View>
                  <View style={sightingsStyles.locationCoordRow}>
                    <Text style={sightingsStyles.locationLabel}>Longitudine</Text>
                    <Text style={sightingsStyles.locationValue}>
                      {((draft.location ?? location)!.longitude).toFixed(6)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={sightingsStyles.locationNoDataText}>
                  Locatia nu a fost obtinuta inca.
                </Text>
              )}

              {locationError ? (
                <Text style={sightingsStyles.locationErrorText}>{locationError}</Text>
              ) : null}

              <View style={sightingsStyles.locationButtonsRow}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Locatia curenta"
                    onPress={handleUseCurrentLocation}
                    loading={locationLoading}
                    variant="primary"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Alege pe harta"
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
            <Text style={sightingsStyles.stepTitle}>Detalii observatie</Text>

            {draft.plantId ? (
              <View style={sightingsStyles.selectedPlantCard}>
                <Text style={sightingsStyles.selectedPlantLabel}>Planta selectata</Text>
                <Text style={sightingsStyles.selectedPlantName}>{selectedPlantName()}</Text>
              </View>
            ) : null}

            <Input
              label="Descriere"
              placeholder="Descrie pe scurt ce ai observat..."
              value={draft.description}
              onChangeText={(t) => handleFieldChange('description', t)}
              multiline
              numberOfLines={3}
            />

            <Input
              label="Habitat"
              placeholder="Zona, tipul de sol, expunerea la soare..."
              value={draft.habitat}
              onChangeText={(t) => handleFieldChange('habitat', t)}
              multiline
              numberOfLines={2}
            />

            <Input
              label="Perioada de recoltare"
              placeholder="Ex: Mai - August"
              value={draft.harvestPeriod}
              onChangeText={(t) => handleFieldChange('harvestPeriod', t)}
            />

            <Input
              label="Beneficii"
              placeholder="Beneficiile plantei, separate prin virgula..."
              value={draft.benefits}
              onChangeText={(t) => handleFieldChange('benefits', t)}
              multiline
              numberOfLines={3}
            />

            <Input
              label="Contraindicatii"
              placeholder="Contraindicatii cunoscute, separate prin virgula..."
              value={draft.contraindications}
              onChangeText={(t) => handleFieldChange('contraindications', t)}
              multiline
              numberOfLines={2}
            />

            <Input
              label="Comentariu (optional)"
              placeholder="Alte observatii sau detalii..."
              value={draft.comment}
              onChangeText={(t) => handleFieldChange('comment', t)}
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
                title="Urmatorul"
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
              <Button title="Inapoi" onPress={goBack} variant="ghost" />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={sightingsStyles.navRow}>
            <View style={sightingsStyles.navButtonFlex}>
              <Button title="Inapoi" onPress={goBack} variant="ghost" />
            </View>
            <View style={sightingsStyles.navButtonFlex}>
              <Button
                title="Urmatorul"
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
              <Button title="Inapoi" onPress={goBack} variant="ghost" />
            </View>
            <View style={sightingsStyles.navButtonFlex}>
              <Button
                title="Salveaza"
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
