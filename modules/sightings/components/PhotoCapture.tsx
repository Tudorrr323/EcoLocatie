// PhotoCapture — componenta pentru previzualizarea fotografiei capturate.
// Afiseaza un placeholder cu icon camera sau previzualizarea imaginii.
// La apasare, deschide camera in-app prin callback-ul onOpenCamera.

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';

interface PhotoCaptureProps {
  imageUri: string | null;
  onOpenCamera: () => void;
}

export function PhotoCapture({ imageUri, onOpenCamera }: PhotoCaptureProps) {
  return (
    <View style={sightingsStyles.photoCaptureContainer}>
      <TouchableOpacity onPress={onOpenCamera} activeOpacity={0.7}>
        {imageUri ? (
          <View style={sightingsStyles.photoPreviewWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={sightingsStyles.photoPreview}
              resizeMode="cover"
              accessibilityLabel="Previzualizare imagine capturata"
            />
            <View style={sightingsStyles.photoRetakeOverlay}>
              <Camera size={24} color="#FFF" />
              <Text style={sightingsStyles.photoRetakeText}>Refotografiaza</Text>
            </View>
          </View>
        ) : (
          <View style={sightingsStyles.noImagePlaceholder}>
            <Camera size={48} color={colors.textSecondary} />
            <Text style={sightingsStyles.noImageText}>Apasa pentru a fotografia</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
