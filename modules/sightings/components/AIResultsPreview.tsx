// AIResultsPreview — afiseaza top 3 rezultate mock de la identificarea AI a plantei.
// Fiecare rezultat are nume, confidence si buton de selectare. Include fallback la alegere manuala.

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../../../shared/components/Button';
import type { AIResult } from '../types/sightings.types';
import { createSightingsStyles } from '../styles/sightings.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';

interface AIResultsPreviewProps {
  results: AIResult[];
  loading: boolean;
  onSelect: (result: AIResult) => void;
  onManualSelect: () => void;
}

export function AIResultsPreview({ results, loading, onSelect, onManualSelect }: AIResultsPreviewProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);

  function getConfidenceColor(confidence: number): string {
    if (confidence > 0.9) return colors.success;
    if (confidence >= 0.8) return colors.warning;
    return colors.secondary;
  }

  if (loading) {
    return (
      <View style={sightingsStyles.aiLoadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={sightingsStyles.aiLoadingText}>{t.sightings.ai.analyzing}</Text>
      </View>
    );
  }

  return (
    <View style={sightingsStyles.aiResultsContainer}>
      {results.map((result) => {
        const confidenceColor = getConfidenceColor(result.confidence);
        const pct = Math.round(result.confidence * 100);

        return (
          <View key={result.plantId} style={sightingsStyles.aiResultCard}>
            <View style={sightingsStyles.aiResultHeader}>
              <Text style={sightingsStyles.aiResultPlantName}>{result.plantName}</Text>
              <Text style={[sightingsStyles.aiResultConfidenceText, { color: confidenceColor }]}>
                {pct}%
              </Text>
            </View>

            <View style={sightingsStyles.aiConfidenceBarBg}>
              <View
                style={[
                  sightingsStyles.aiConfidenceBarFill,
                  {
                    width: `${pct}%`,
                    backgroundColor: confidenceColor,
                  },
                ]}
              />
            </View>

            <TouchableOpacity
              style={sightingsStyles.aiSelectButton}
              onPress={() => onSelect(result)}
              activeOpacity={0.7}
            >
              <Text style={sightingsStyles.aiSelectButtonText}>{t.sightings.ai.select}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Button
        title={t.sightings.ai.manualSelect}
        onPress={onManualSelect}
        variant="ghost"
        style={sightingsStyles.aiManualButton}
      />
    </View>
  );
}
