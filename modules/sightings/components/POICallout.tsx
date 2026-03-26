// POICallout — tooltip/callout afisat la tap pe un marker de pe harta.
// Arata numele plantei, data observatiei, nivelul de siguranta AI si comentariul.

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { formatDate } from '../../../shared/utils/formatDate';
import { createSightingsStyles } from '../styles/sightings.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { TranslatableText } from '../../../shared/components/TranslatableText';

interface POICalloutProps {
  plantName: string;
  username: string;
  createdAt: string;
  confidence: number;
  comment: string;
  commentCount?: number;
}

export function POICallout({ plantName, username, createdAt, confidence, comment, commentCount }: POICalloutProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);

  function getConfidenceColor(conf: number): string {
    if (conf > 0.9) return colors.success;
    if (conf >= 0.8) return colors.warning;
    return '#FF8F00';
  }

  const pct = Math.round(confidence * 100);
  const confidenceColor = getConfidenceColor(confidence);
  const formattedDate = formatDate(createdAt);
  const commentSnippet = comment.length > 80 ? comment.slice(0, 77) + '...' : comment;

  return (
    <View style={sightingsStyles.calloutContainer}>
      <Text style={sightingsStyles.calloutPlantName}>{plantName}</Text>

      <View style={sightingsStyles.calloutRow}>
        <Text style={sightingsStyles.calloutLabel}>{t.sightings.callout.user}</Text>
        <Text style={sightingsStyles.calloutValue}>{username}</Text>
      </View>

      <View style={sightingsStyles.calloutRow}>
        <Text style={sightingsStyles.calloutLabel}>{t.sightings.callout.date}</Text>
        <Text style={sightingsStyles.calloutValue}>{formattedDate}</Text>
      </View>

      <View
        style={[
          sightingsStyles.calloutConfidenceBadge,
          { backgroundColor: confidenceColor },
        ]}
      >
        <Text style={sightingsStyles.calloutConfidenceText}>AI: {pct}% {t.sightings.callout.aiConfidence}</Text>
      </View>

      {commentSnippet ? (
        <TranslatableText text={`"${commentSnippet}"`} style={sightingsStyles.calloutComment} />
      ) : null}

      {commentCount != null && commentCount > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <MessageCircle size={12} color={colors.textSecondary} />
          <Text style={sightingsStyles.calloutLabel}>
            {commentCount === 1
              ? t.shared.comments.countOne
              : t.shared.comments.count.replace('{{count}}', String(commentCount))}
          </Text>
        </View>
      )}
    </View>
  );
}
