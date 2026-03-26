// PlantFilterPanel — panou de filtrare a plantelor, folosit pe harta si in enciclopedie.
// Prima optiune "Toate plantele" selecteaza tot; tap pe o planta individuala o selecteaza exclusiv.

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { BottomPanel } from './BottomPanel';
import { spacing, borderRadius, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../i18n';
import { getPlantName } from '../context/SettingsContext';
import type { Plant } from '../types/plant.types';

interface PlantFilterPanelProps {
  visible: boolean;
  allPlants: Plant[];
  selectedPlantIds: number[];
  onApply: (ids: number[]) => void;
  onClose: () => void;
}

const PlantFilterPanel: React.FC<PlantFilterPanelProps> = ({
  visible,
  allPlants,
  selectedPlantIds,
  onApply,
  onClose,
}) => {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(selectedPlantIds);

  const allSelected = localSelectedIds.length === 0;

  const prevVisibleRef = useRef(false);
  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      setLocalSelectedIds(selectedPlantIds);
    }
    prevVisibleRef.current = visible;
  }, [visible, selectedPlantIds]);

  const handleToggle = useCallback((plantId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.length === 0) {
        return [plantId];
      }
      return prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId];
    });
  }, []);

  const handleSelectAll = useCallback(() => setLocalSelectedIds([]), []);

  const isSelected = useCallback(
    (plantId: number) => localSelectedIds.includes(plantId),
    [localSelectedIds],
  );

  const handleApply = useCallback(() => {
    onApply(localSelectedIds);
    onClose();
  }, [localSelectedIds, onApply, onClose]);

  return (
    <BottomPanel visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={styles.filterPanelHeader}>
        <Text style={styles.filterPanelTitle}>{t.shared.plantFilter.title}</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <X size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Lista plante */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.filterList}
        showsVerticalScrollIndicator={false}
      >
        {/* Prima optiune: Toate plantele */}
        <TouchableOpacity
          style={styles.filterItem}
          onPress={handleSelectAll}
          activeOpacity={0.7}
        >
          <View style={[styles.filterColorDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.filterItemLabel, { fontWeight: '700' }]} numberOfLines={1}>
            {t.shared.plantFilter.allPlants}
          </Text>
          <View style={[styles.filterCheckbox, allSelected && styles.filterCheckboxSelected]}>
            {allSelected && <Text style={styles.filterCheckboxTick}>{'✓'}</Text>}
          </View>
        </TouchableOpacity>

        {allPlants.map((plant, index) => {
          const selected = isSelected(plant.id);
          const isLast = index === allPlants.length - 1;
          return (
            <TouchableOpacity
              key={plant.id}
              style={[styles.filterItem, isLast && styles.filterItemLast]}
              onPress={() => handleToggle(plant.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.filterColorDot,
                  { backgroundColor: plant.icon_color || colors.primary },
                ]}
              />
              <Text style={styles.filterItemLabel} numberOfLines={1}>
                {getPlantName(plant)}
              </Text>
              <View
                style={[
                  styles.filterCheckbox,
                  selected && styles.filterCheckboxSelected,
                ]}
              >
                {selected && (
                  <Text style={styles.filterCheckboxTick}>{'✓'}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.filterPanelFooter}>
        <TouchableOpacity
          style={styles.filterCloseButton}
          onPress={() => { handleSelectAll(); onApply([]); onClose(); }}
          activeOpacity={0.7}
        >
          <Text style={styles.filterCloseButtonText}>{t.shared.plantFilter.resetFilters}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterApplyButton}
          onPress={handleApply}
          activeOpacity={0.7}
        >
          <Text style={styles.filterApplyButtonText}>{t.shared.plantFilter.apply}</Text>
        </TouchableOpacity>
      </View>
    </BottomPanel>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterPanelTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterItemLast: {
    borderBottomWidth: 0,
  },
  filterColorDot: {
    width: 14,
    height: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.filterDotBorder,
  },
  filterItemLabel: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  filterCheckbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterCheckboxTick: {
    color: colors.textLight,
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    lineHeight: 14,
  },
  filterPanelFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  filterApplyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  filterApplyButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.textLight,
  },
  filterCloseButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterCloseButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
});

export default PlantFilterPanel;
