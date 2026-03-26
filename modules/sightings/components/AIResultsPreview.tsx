// AIResultsPreview — afiseaza top 3 rezultate de la identificarea AI a plantei.
// Animatia de progres e legata de starea reala a API-ului: se umple lent catre ~90%,
// iar cand API-ul raspunde sare la 100% si afiseaza instant rezultatele.

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Scan, AlertTriangle } from 'lucide-react-native';
import { Button } from '../../../shared/components/Button';
import type { AIResult } from '../types/sightings.types';
import { createSightingsStyles } from '../styles/sightings.styles';
import { spacing, borderRadius, fonts } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
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
  const progressStyles = useMemo(() => createProgressStyles(colors), [colors]);

  // Animation state
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [displayPercent, setDisplayPercent] = useState(0);
  const [showResults, setShowResults] = useState(!loading && results.length > 0);
  const hasReceivedResults = useRef(false);

  // Slow fill to ~90% while loading
  useEffect(() => {
    if (loading) {
      hasReceivedResults.current = false;
      setShowResults(false);
      setDisplayPercent(0);
      progressAnim.setValue(0);

      // Animate slowly to 90% over ~8 seconds
      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 8000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [loading, progressAnim]);

  // When results arrive, jump to 100% then show results
  useEffect(() => {
    if (!loading && results.length > 0 && !hasReceivedResults.current) {
      hasReceivedResults.current = true;

      // Stop slow animation, jump to 100%
      progressAnim.stopAnimation(() => {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          // Brief pause at 100% then show results
          setTimeout(() => setShowResults(true), 200);
        });
      });
    }
  }, [loading, results, progressAnim]);

  // Track animated value for display percentage
  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      setDisplayPercent(Math.round(value * 100));
    });
    return () => progressAnim.removeListener(id);
  }, [progressAnim]);

  // If component renders with results already available (e.g. navigating back)
  useEffect(() => {
    if (!loading && results.length > 0 && !hasReceivedResults.current) {
      setShowResults(true);
      hasReceivedResults.current = true;
    }
  }, [loading, results]);

  function getConfidenceColor(confidence: number): string {
    if (confidence > 0.9) return colors.success;
    if (confidence >= 0.8) return colors.warning;
    return colors.secondary;
  }

  // Loading screen with real progress bar
  if (loading || (!showResults && !hasReceivedResults.current)) {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={progressStyles.container}>
        <View style={progressStyles.iconContainer}>
          <Scan size={48} color={colors.primary} />
        </View>

        <Text style={progressStyles.title}>{t.sightings.ai.analyzing}</Text>
        <Text style={progressStyles.subtitle}>{t.sightings.ai.analyzingHint}</Text>

        <View style={progressStyles.barContainer}>
          <View style={progressStyles.barBackground}>
            <Animated.View
              style={[
                progressStyles.barFill,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={progressStyles.percentText}>{displayPercent}%</Text>
        </View>
      </View>
    );
  }

  const maxConfidence = results.length > 0
    ? Math.max(...results.map((r) => r.confidence))
    : 0;
  const isLowConfidence = maxConfidence < 0.6;

  // Results list
  return (
    <View style={sightingsStyles.aiResultsContainer}>
      {isLowConfidence && (
        <View style={progressStyles.warningBanner}>
          <AlertTriangle size={20} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={progressStyles.warningTitle}>{t.sightings.ai.lowConfidenceTitle}</Text>
            <Text style={progressStyles.warningMessage}>{t.sightings.ai.lowConfidenceMessage}</Text>
          </View>
        </View>
      )}

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

const createProgressStyles = (colors: ThemeColors) => ({
  container: {
    alignItems: 'center' as const,
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: spacing.xl,
  },
  barContainer: {
    width: '100%' as const,
    alignItems: 'center' as const,
  },
  barBackground: {
    width: '100%' as const,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden' as const,
  },
  barFill: {
    height: '100%' as const,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  percentText: {
    marginTop: spacing.sm,
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  warningBanner: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: spacing.sm,
    backgroundColor: colors.warning + '15',
    borderWidth: 1,
    borderColor: colors.warning + '40',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  warningTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    color: colors.warning,
    marginBottom: 2,
  },
  warningMessage: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
