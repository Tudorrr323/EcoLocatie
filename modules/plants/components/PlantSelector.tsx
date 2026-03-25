// PlantSelector — picker pentru alegerea manuala a unei plante.
// Folosit in flow-ul de creare observatie cand identificarea AI nu returneaza rezultatul corect.

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pagination } from '../../../shared/components/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { removeDiacritics } from '../../../shared/utils/removeDiacritics';
import type { Plant } from '../../../shared/types/plant.types';
import { getAllPlants } from '../repository/plantsRepository';
import { createPlantsStyles } from '../styles/plants.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface PlantSelectorProps {
  onSelect: (plant: Plant) => void;
  /** Daca e furnizat, query-ul e controlat extern si search bar-ul intern nu se mai afiseaza */
  searchQuery?: string;
}

export function PlantSelector({ onSelect, searchQuery }: PlantSelectorProps) {
  const colors = useThemeColors();
  const plantsStyles = useMemo(() => createPlantsStyles(colors), [colors]);
  const [internalQuery] = useState('');

  const query = searchQuery !== undefined ? searchQuery : internalQuery;

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

  const { currentPage, pageSize, totalPages, paginatedItems, onPageChange, onPageSizeChange } =
    usePagination(filtered);

  return (
    <View style={plantsStyles.selectorContainer}>
      {filtered.length === 0 ? (
        <Text style={plantsStyles.selectorEmpty}>
          Nu au fost gasite plante.
        </Text>
      ) : (
        <View>
          {paginatedItems.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={plantsStyles.selectorItem}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <View style={[plantsStyles.selectorDot, { backgroundColor: item.icon_color }]} />
              <View>
                <Text style={plantsStyles.selectorNameRo}>{item.name_ro}</Text>
                <Text style={plantsStyles.selectorNameLatin}>{item.name_latin}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </View>
      )}
    </View>
  );
}
