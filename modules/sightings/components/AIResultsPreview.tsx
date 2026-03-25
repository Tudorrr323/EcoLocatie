import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../../../shared/components/Button';
import type { AIResult } from '../types/sightings.types';
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';

interface AIResultsPreviewProps {
  results: AIResult[];
  loading: boolean;
  onSelect: (result: AIResult) => void;
  onManualSelect: () => void;
}

function getConfidenceColor(confidence: number): string {
  if (confidence > 0.9) return colors.success;
  if (confidence >= 0.8) return colors.warning;
  return '#FF8F00';
}

export function AIResultsPreview({ results, loading, onSelect, onManualSelect }: AIResultsPreviewProps) {
  if (loading) {
    return (
      <View style={sightingsStyles.aiLoadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={sightingsStyles.aiLoadingText}>Se identifica planta...</Text>
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
              style={[sightingsStyles.aiSelectButton, { backgroundColor: confidenceColor }]}
              onPress={() => onSelect(result)}
              activeOpacity={0.7}
            >
              <Text style={sightingsStyles.aiSelectButtonText}>Selecteaza</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Button
        title="Alege manual"
        onPress={onManualSelect}
        variant="ghost"
        style={sightingsStyles.aiManualButton}
      />
    </View>
  );
}
