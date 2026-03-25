// LoadingSpinner — indicator de incarcare centrat pe ecran.
// Folosit in orice ecran care asteapta date de la repository sau operatii asincrone.

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

export function LoadingSpinner() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
