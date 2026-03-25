import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SearchBar } from '../../../shared/components/SearchBar';
import type { Plant } from '../../../shared/types/plant.types';
import { getAllPlants } from '../repository/plantsRepository';
import { plantsStyles } from '../styles/plants.styles';

interface PlantSelectorProps {
  onSelect: (plant: Plant) => void;
}

export function PlantSelector({ onSelect }: PlantSelectorProps) {
  const [query, setQuery] = useState('');

  const allPlants = useMemo(() => getAllPlants(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allPlants;
    const lower = query.toLowerCase();
    return allPlants.filter(
      (p) =>
        p.name_ro.toLowerCase().includes(lower) ||
        p.name_latin.toLowerCase().includes(lower) ||
        p.family.toLowerCase().includes(lower),
    );
  }, [query, allPlants]);

  return (
    <View style={plantsStyles.selectorContainer}>
      <View style={plantsStyles.selectorSearchWrapper}>
        <SearchBar
          placeholder="Cauta o planta..."
          onSearch={setQuery}
          debounceMs={200}
        />
      </View>

      {filtered.length === 0 ? (
        <Text style={plantsStyles.selectorEmpty}>
          Nu au fost gasite plante.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={plantsStyles.selectorItem}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <View
                style={[plantsStyles.selectorDot, { backgroundColor: item.icon_color }]}
              />
              <View>
                <Text style={plantsStyles.selectorNameRo}>{item.name_ro}</Text>
                <Text style={plantsStyles.selectorNameLatin}>{item.name_latin}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
