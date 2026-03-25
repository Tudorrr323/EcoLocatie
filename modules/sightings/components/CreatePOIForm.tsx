import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { PhotoCapture } from './PhotoCapture';
import { AIResultsPreview } from './AIResultsPreview';
import { PlantSelector } from '../../plants/components/PlantSelector';
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
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <View style={sightingsStyles.stepIndicatorContainer}>
      {STEP_LABELS.map((label, index) => {
        const stepNum = (index + 1) as Step;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            {index > 0 && (
              <View
                style={[
                  sightingsStyles.stepConnector,
                  isDone && sightingsStyles.stepConnectorActive,
                ]}
              />
            )}
            <View style={sightingsStyles.stepItem}>
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
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

interface CreatePOIFormProps {
  onSubmit: (draft: SightingDraft) => void;
}

const EMPTY_DRAFT: SightingDraft = {
  imageUri: null,
  plantId: null,
  location: null,
  comment: '',
  aiResults: [],
};

export function CreatePOIForm({ onSubmit }: CreatePOIFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<SightingDraft>(EMPTY_DRAFT);
  const [showManualSelector, setShowManualSelector] = useState(false);

  const { results: aiResults, loading: aiLoading, identify, reset: resetAI } = useMockIdentify();
  const { location, loading: locationLoading, error: locationError, getLocation } = useLocation();

  // ── Helpers ────────────────────────────────────────────────────────────────

  const selectedPlantName = useCallback((): string => {
    if (!draft.plantId) return '';
    const plant = getPlants().find((p) => p.id === draft.plantId);
    return plant ? plant.name_ro : '';
  }, [draft.plantId]);

  // ── Step 1: Photo ──────────────────────────────────────────────────────────

  const handleImageSelected = (uri: string) => {
    setDraft((prev) => ({ ...prev, imageUri: uri }));
  };

  const handleNextFromPhoto = async () => {
    if (!draft.imageUri) return;
    setStep(2);
    const results = await identify(draft.imageUri);
    setDraft((prev) => ({ ...prev, aiResults: results }));
  };

  // ── Step 2: Identification ─────────────────────────────────────────────────

  const handleAISelect = (result: AIResult) => {
    setDraft((prev) => ({ ...prev, plantId: result.plantId }));
    setShowManualSelector(false);
    setStep(3);
  };

  const handleManualSelect = () => {
    setShowManualSelector(true);
  };

  const handlePlantSelectorSelect = (plant: Plant) => {
    setDraft((prev) => ({ ...prev, plantId: plant.id }));
    setShowManualSelector(false);
    setStep(3);
  };

  // ── Step 3: Location ───────────────────────────────────────────────────────

  const handleUseCurrentLocation = async () => {
    const coords = await getLocation();
    if (coords) {
      setDraft((prev) => ({ ...prev, location: coords }));
    }
  };

  // ── Step 4: Details + Submit ───────────────────────────────────────────────

  const handleCommentChange = (text: string) => {
    setDraft((prev) => ({ ...prev, comment: text }));
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
      setStep((prev) => (prev - 1) as Step);
      if (step === 2) {
        resetAI();
        setShowManualSelector(false);
      }
    }
  };

  // ── Render step content ────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={sightingsStyles.stepTitle}>Adauga o fotografie</Text>
            <PhotoCapture
              imageUri={draft.imageUri}
              onImageSelected={handleImageSelected}
            />
            <View style={sightingsStyles.navRow}>
              <View style={sightingsStyles.navButtonFlex}>
                <Button
                  title="Urmatorul"
                  onPress={handleNextFromPhoto}
                  disabled={!draft.imageUri}
                />
              </View>
            </View>
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

            <View style={sightingsStyles.navRow}>
              <View style={sightingsStyles.navButtonFlex}>
                <Button title="Inapoi" onPress={goBack} variant="ghost" />
              </View>
            </View>
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

              <Button
                title="Foloseste locatia curenta"
                onPress={handleUseCurrentLocation}
                loading={locationLoading}
                variant="primary"
              />
            </View>

            <View style={sightingsStyles.navRow}>
              <View style={sightingsStyles.navButtonFlex}>
                <Button title="Inapoi" onPress={goBack} variant="ghost" />
              </View>
              <View style={sightingsStyles.navButtonFlex}>
                <Button
                  title="Urmatorul"
                  onPress={() => setStep(4)}
                  disabled={!(draft.location ?? location)}
                />
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
              label="Comentariu (optional)"
              placeholder="Adauga un comentariu despre observatie..."
              value={draft.comment}
              onChangeText={handleCommentChange}
              multiline
              numberOfLines={4}
            />

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
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StepIndicator currentStep={step} />
      <ScrollView
        style={sightingsStyles.formScroll}
        contentContainerStyle={sightingsStyles.formScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </View>
  );
}
