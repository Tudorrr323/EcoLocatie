// ModerationCard — card pentru o observatie in asteptare de aprobare.
// Afiseaza detaliile POI-ului cu butoane Aproba/Respinge pentru admin.

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { formatDate } from '../../../shared/utils/formatDate';
import { getPlantById } from '../../../shared/repository/dataProvider';
import {
  fonts,
  spacing,
  borderRadius,
} from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { PointOfInterest } from '../../../shared/types/plant.types';
import type { ModerationAction } from '../types/admin.types';

interface ModerationCardProps {
  poi: PointOfInterest;
  onModerate: (poiId: number, action: ModerationAction) => void;
}

export function ModerationCard({ poi, onModerate }: ModerationCardProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createModerationCardStyles(colors), [colors]);
  const plant = getPlantById(poi.plant_id);
  const confidencePercent = Math.round(poi.ai_confidence * 100);

  const confidenceColor =
    poi.ai_confidence >= 0.85
      ? colors.success
      : poi.ai_confidence >= 0.6
        ? colors.warning
        : colors.error;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.plantName}>
          {plant ? plant.name_ro : `Planta #${poi.plant_id}`}
        </Text>
        {plant && (
          <Text style={styles.plantLatin}>{plant.name_latin}</Text>
        )}
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.admin.moderation.coordinates}</Text>
          <Text style={styles.detailValue}>
            {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.admin.moderation.date}</Text>
          <Text style={styles.detailValue}>{formatDate(poi.created_at)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.admin.moderation.confidence}</Text>
          <View style={styles.confidenceBadge}>
            <View
              style={[
                styles.confidenceDot,
                { backgroundColor: confidenceColor },
              ]}
            />
            <Text style={[styles.confidenceText, { color: confidenceColor }]}>
              {confidencePercent}%
            </Text>
          </View>
        </View>
      </View>

      {poi.comment ? (
        <View style={styles.commentBox}>
          <Text style={styles.detailLabel}>{t.admin.moderation.comment}</Text>
          <Text style={styles.commentText}>{poi.comment}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          title={t.admin.moderation.approve}
          variant="primary"
          onPress={() => onModerate(poi.id, 'approve')}
          style={styles.approveButton}
        />
        <Button
          title={t.admin.moderation.reject}
          variant="danger"
          onPress={() => onModerate(poi.id, 'reject')}
          style={styles.rejectButton}
        />
      </View>
    </Card>
  );
}

const createModerationCardStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  plantName: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  plantLatin: {
    fontSize: fonts.sizes.md,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsGrid: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  confidenceText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
  },
  commentBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  commentText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  approveButton: {
    flex: 1,
    backgroundColor: colors.success,
  },
  rejectButton: {
    flex: 1,
  },
});
