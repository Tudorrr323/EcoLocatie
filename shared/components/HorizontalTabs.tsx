// HorizontalTabs — lista orizontala scrollabila de taburi.
// Fiecare tab afiseaza un label, tab-ul activ e evidentiat. Continutul se schimba la apasare.

import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { spacing, borderRadius, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

export interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface HorizontalTabsProps {
  tabs: Tab[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export function HorizontalTabs({ tabs, activeKey, onTabChange }: HorizontalTabsProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const scrollRef = useRef<ScrollView>(null);
  const tabPositions = useRef<Record<string, { x: number; width: number }>>({});

  const handleTabLayout = useCallback((key: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabPositions.current[key] = { x, width };
  }, []);

  const handleTabPress = useCallback((key: string) => {
    onTabChange(key);
    const pos = tabPositions.current[key];
    if (pos && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: Math.max(0, pos.x - 16),
        animated: true,
      });
    }
  }, [onTabChange]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleTabPress(tab.key)}
              onLayout={(e) => handleTabLayout(tab.key, e)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  tabsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.textLight,
  },
});
