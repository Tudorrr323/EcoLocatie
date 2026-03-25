// POICallout — tooltip/callout afisat la tap pe un marker de pe harta.
// Arata numele plantei, data observatiei, nivelul de siguranta AI si comentariul.

import React from 'react';
import { View, Text } from 'react-native';
import { formatDate } from '../../../shared/utils/formatDate';
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';

interface POICalloutProps {
  plantName: string;
  username: string;
  createdAt: string;
  confidence: number;
  comment: string;
}

function getConfidenceColor(confidence: number): string {
  if (confidence > 0.9) return colors.success;
  if (confidence >= 0.8) return colors.warning;
  return '#FF8F00';
}

export function POICallout({ plantName, username, createdAt, confidence, comment }: POICalloutProps) {
  const pct = Math.round(confidence * 100);
  const confidenceColor = getConfidenceColor(confidence);
  const formattedDate = formatDate(createdAt);
  const commentSnippet = comment.length > 80 ? comment.slice(0, 77) + '...' : comment;

  return (
    <View style={sightingsStyles.calloutContainer}>
      <Text style={sightingsStyles.calloutPlantName}>{plantName}</Text>

      <View style={sightingsStyles.calloutRow}>
        <Text style={sightingsStyles.calloutLabel}>Utilizator:</Text>
        <Text style={sightingsStyles.calloutValue}>{username}</Text>
      </View>

      <View style={sightingsStyles.calloutRow}>
        <Text style={sightingsStyles.calloutLabel}>Data:</Text>
        <Text style={sightingsStyles.calloutValue}>{formattedDate}</Text>
      </View>

      <View
        style={[
          sightingsStyles.calloutConfidenceBadge,
          { backgroundColor: confidenceColor },
        ]}
      >
        <Text style={sightingsStyles.calloutConfidenceText}>AI: {pct}% incredere</Text>
      </View>

      {commentSnippet ? (
        <Text style={sightingsStyles.calloutComment}>"{commentSnippet}"</Text>
      ) : null}
    </View>
  );
}
