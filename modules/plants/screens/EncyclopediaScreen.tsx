import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { SearchBar } from '../../../shared/components/SearchBar';
import { usePlantSearch } from '../hooks/usePlantSearch';
import { PlantList } from '../components/PlantList';
import { plantsStyles } from '../styles/plants.styles';

export function EncyclopediaScreen() {
  const { plants, setQuery } = usePlantSearch();

  return (
    <SafeAreaView style={plantsStyles.screen}>
      <View style={plantsStyles.headerContainer}>
        <Text style={plantsStyles.headerTitle}>Enciclopedia Plantelor</Text>
        <SearchBar
          placeholder="Cauta dupa nume sau familie..."
          onSearch={setQuery}
        />
      </View>
      <PlantList plants={plants} />
    </SafeAreaView>
  );
}
