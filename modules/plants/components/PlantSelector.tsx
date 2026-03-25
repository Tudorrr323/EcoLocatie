// PlantSelector — picker modal pentru alegerea manuala a unei plante.
// Folosit in flow-ul de creare observatie cand identificarea AI nu returneaza rezultatul corect.

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from '../../../shared/components/SearchBar';
import { Pagination } from '../../../shared/components/Pagination';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import type { Plant } from '../../../shared/types/plant.types';
import { getAllPlants } from '../repository/plantsRepository';
import { plantsStyles } from '../styles/plants.styles';

const PAGE_SIZE = 10;

interface PlantSelectorProps {
  onSelect: (plant: Plant) => void;
}

export function PlantSelector({ onSelect }: PlantSelectorProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const allPlants = useMemo(() => getAllPlants(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allPlants;
    const normalizedQuery = removeDiacritics(query.toLowerCase());
    return allPlants.filter(
      (p) =>
        removeDiacritics(p.name_ro.toLowerCase()).includes(normalizedQuery) ||
        removeDiacritics(p.name_latin.toLowerCase()).includes(normalizedQuery) ||
        removeDiacritics(p.family.toLowerCase()).includes(normalizedQuery),
    );
  }, [query, allPlants]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  return (
    <View style={plantsStyles.selectorContainer}>
      <View style={plantsStyles.selectorSearchWrapper}>
        <SearchBar
          placeholder="Cauta o planta..."
          onSearch={handleSearch}
          debounceMs={200}
        />
      </View>

      {filtered.length === 0 ? (
        <Text style={plantsStyles.selectorEmpty}>
          Nu au fost gasite plante.
        </Text>
      ) : (
        <View>
          {pageItems.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
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
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </View>
      )}
    </View>
  );
}
