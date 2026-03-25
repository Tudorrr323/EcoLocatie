import React from 'react';
import { View, Text, Image } from 'react-native';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Button } from '../../../shared/components/Button';
import { useImagePicker } from '../hooks/useImagePicker';
import { sightingsStyles } from '../styles/sightings.styles';
import { colors } from '../../../shared/styles/theme';

interface PhotoCaptureProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export function PhotoCapture({ imageUri, onImageSelected }: PhotoCaptureProps) {
  const { takePhoto, pickFromGallery } = useImagePicker();

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      onImageSelected(uri);
    }
  };

  const handlePickFromGallery = async () => {
    const uri = await pickFromGallery();
    if (uri) {
      onImageSelected(uri);
    }
  };

  return (
    <View style={sightingsStyles.photoCaptureContainer}>
      {imageUri ? (
        <View style={sightingsStyles.photoPreviewWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={sightingsStyles.photoPreview}
            resizeMode="cover"
            accessibilityLabel="Previzualizare imagine selectata"
          />
        </View>
      ) : (
        <View style={sightingsStyles.noImagePlaceholder}>
          <ImageIcon size={48} color={colors.textSecondary} />
          <Text style={sightingsStyles.noImageText}>Nicio imagine selectata</Text>
        </View>
      )}

      <View style={sightingsStyles.photoButtonRow}>
        <View style={sightingsStyles.photoButtonFlex}>
          <Button
            title="Fotografiaza"
            onPress={handleTakePhoto}
            variant="primary"
          />
        </View>
        <View style={sightingsStyles.photoButtonFlex}>
          <Button
            title="Alege din galerie"
            onPress={handlePickFromGallery}
            variant="ghost"
          />
        </View>
      </View>
    </View>
  );
}
