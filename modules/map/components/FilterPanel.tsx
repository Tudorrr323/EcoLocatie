// FilterPanel — panou de filtrare a markerelor de pe harta.
// Permite selectarea/deselectarea plantelor individuale. Foloseste FullScreenPanel.

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { FullScreenPanel } from '../../../shared/components/FullScreenPanel';
import type { Plant } from '../../../shared/types/plant.types';
import type { MapFilter } from '../types/map.types';
import { mapStyles } from '../styles/map.styles';
import { colors } from '../../../shared/styles/theme';

interface FilterPanelProps {
  visible: boolean;
  allPlants: Plant[];
  currentFilter: MapFilter;
  onApply: (filter: MapFilter) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  allPlants,
  currentFilter,
  onApply,
  onClose,
}) => {
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(
    currentFilter.selectedPlantIds
  );

  const allSelected = localSelectedIds.length === 0;

  useEffect(() => {
    if (visible) {
      setLocalSelectedIds(currentFilter.selectedPlantIds);
    }
  }, [visible, currentFilter.selectedPlantIds]);

  const handleTogglePlant = useCallback((plantId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(plantId)) {
        return prev.filter((id) => id !== plantId);
      }
      return [...prev, plantId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setLocalSelectedIds([]);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setLocalSelectedIds([-1]);
  }, []);

  const isPlantSelected = useCallback(
    (plantId: number) => {
      if (localSelectedIds.length === 0) return true;
      return localSelectedIds.includes(plantId);
    },
    [localSelectedIds]
  );

  const handleApply = useCallback(() => {
    onApply({
      ...currentFilter,
      selectedPlantIds: localSelectedIds,
    });
    onClose();
  }, [localSelectedIds, currentFilter, onApply, onClose]);

  return (
    <FullScreenPanel visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={mapStyles.filterPanelHeader}>
        <Text style={mapStyles.filterPanelTitle}>Filtrare plante</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            style={mapStyles.filterToggleAllButton}
            onPress={allSelected ? handleDeselectAll : handleSelectAll}
            activeOpacity={0.7}
          >
            <Text style={mapStyles.filterToggleAllText}>
              {allSelected ? 'Deselecteaza tot' : 'Selecteaza tot'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista plante */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={mapStyles.filterList}
        showsVerticalScrollIndicator={false}
      >
        {allPlants.map((plant, index) => {
          const selected = isPlantSelected(plant.id);
          const isLast = index === allPlants.length - 1;
          return (
            <TouchableOpacity
              key={plant.id}
              style={[
                mapStyles.filterItem,
                isLast && mapStyles.filterItemLast,
              ]}
              onPress={() => handleTogglePlant(plant.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  mapStyles.filterColorDot,
                  { backgroundColor: plant.icon_color || '#4CAF50' },
                ]}
              />
              <Text style={mapStyles.filterItemLabel} numberOfLines={1}>
                {plant.name_ro}
              </Text>
              <View
                style={[
                  mapStyles.filterCheckbox,
                  selected && mapStyles.filterCheckboxSelected,
                ]}
              >
                {selected && (
                  <Text style={mapStyles.filterCheckboxTick}>{'✓'}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={mapStyles.filterPanelFooter}>
        <TouchableOpacity
          style={mapStyles.filterCloseButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={mapStyles.filterCloseButtonText}>Inchide</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={mapStyles.filterApplyButton}
          onPress={handleApply}
          activeOpacity={0.7}
        >
          <Text style={mapStyles.filterApplyButtonText}>Aplica</Text>
        </TouchableOpacity>
      </View>
    </FullScreenPanel>
  );
};

export default FilterPanel;
