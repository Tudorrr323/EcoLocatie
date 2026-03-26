// PhotoCapture — componenta pentru previzualizarea fotografiei capturate.
// Afiseaza un placeholder cu icon camera sau previzualizarea imaginii.
// La apasare, deschide camera in-app prin callback-ul onOpenCamera.

import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera, Trash2 } from 'lucide-react-native';
import { createSightingsStyles } from '../styles/sightings.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';

interface PhotoCaptureProps {
  imageUri: string | null;
  onOpenCamera: () => void;
  onClear: () => void;
}

export function PhotoCapture({ imageUri, onOpenCamera, onClear }: PhotoCaptureProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const sightingsStyles = useMemo(() => createSightingsStyles(colors), [colors]);

  return (
    <View style={sightingsStyles.photoCaptureContainer}>
      <TouchableOpacity onPress={onOpenCamera} activeOpacity={0.7}>
        {imageUri ? (
          <View style={sightingsStyles.photoPreviewWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={sightingsStyles.photoPreview}
              resizeMode="cover"
              accessibilityLabel={t.sightings.photo.previewAlt}
            />
            <View style={sightingsStyles.photoRetakeOverlay}>
              <Camera size={24} color={colors.textLight} />
              <Text style={sightingsStyles.photoRetakeText}>{t.sightings.photo.retake}</Text>
            </View>
            <TouchableOpacity
              style={sightingsStyles.photoClearBtn}
              onPress={onClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.8}
            >
              <Trash2 size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={sightingsStyles.noImagePlaceholder}>
            <Camera size={48} color={colors.textSecondary} />
            <Text style={sightingsStyles.noImageText}>{t.sightings.photo.noImage}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
