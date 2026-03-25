// LoadingSpinner — indicator de incarcare centrat pe ecran.
// Folosit in orice ecran care asteapta date de la repository sau operatii asincrone.

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export function LoadingSpinner() {
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
