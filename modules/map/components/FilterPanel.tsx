import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import type { Plant } from '../../../shared/types/plant.types';
import type { MapFilter } from '../types/map.types';
import { mapStyles } from '../styles/map.styles';

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

  const handleTogglePlant = useCallback((plantId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(plantId)) {
        return prev.filter((id) => id !== plantId);
      }
      return [...prev, plantId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    // Empty selectedPlantIds means "show all"
    setLocalSelectedIds([]);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setLocalSelectedIds(allPlants.map((p) => p.id));
    // Actually deselect all means show none — use a sentinel approach:
    // We'll track "explicitly none" as a full list of plant ids that effectively matches nothing
    // but the repository filters by inclusion, so passing all ids = show all.
    // To "deselect all" (show nothing) we could use a negative approach.
    // The cleaner semantic: selectedPlantIds=[] means "no filter applied / all visible".
    // To show none: we'd need a different flag. For UX, deselect all clears individual
    // plant checkboxes so none are individually checked, effectively selecting none.
    // We set it to a special empty-but-not-unfiltered state by using a placeholder
    // that will match zero plants. Using [-1] as sentinel for "explicitly none":
    setLocalSelectedIds([-1]);
  }, [allPlants]);

  const isPlantSelected = useCallback(
    (plantId: number) => {
      if (localSelectedIds.length === 0) return true; // "all" mode
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

  const handleOpen = useCallback(() => {
    setLocalSelectedIds(currentFilter.selectedPlantIds);
  }, [currentFilter.selectedPlantIds]);

  React.useEffect(() => {
    if (visible) {
      handleOpen();
    }
  }, [visible, handleOpen]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={mapStyles.filterPanelOverlay} onPress={onClose} />

      <View style={mapStyles.filterPanel}>
        <View style={mapStyles.filterPanelHandle} />

        <View style={mapStyles.filterPanelHeader}>
          <Text style={mapStyles.filterPanelTitle}>Filtrare plante</Text>
          <TouchableOpacity
            style={mapStyles.filterToggleAllButton}
            onPress={allSelected ? handleDeselectAll : handleSelectAll}
            activeOpacity={0.7}
          >
            <Text style={mapStyles.filterToggleAllText}>
              {allSelected ? 'Deselecteaza tot' : 'Selecteaza tot'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
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
      </View>
    </Modal>
  );
};

export default FilterPanel;
