// CustomTabBar — bara de navigare inferioara personalizata cu iconuri lucide.
// Afiseaza tab-urile: Harta, Enciclopedie, Adauga, Plantele mele, Cont. Inlocuieste tab bar-ul default Expo.
// Intercepteaza navigarea de pe add-sighting daca observatia are progres si afiseaza ConfirmModal.

import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Home, HeartPulse, Camera, Flower2, Settings, LogOut } from 'lucide-react-native';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { sightingGuard } from '../utils/sightingGuard';
import { ConfirmModal } from './ConfirmModal';
import { useTranslation } from '../i18n';

const TAB_ICONS: Record<string, typeof Home> = {
  index: Home,
  encyclopedia: HeartPulse,
  'add-sighting': Camera,
  'my-plants': Flower2,
  settings: Settings,
};

export function CustomTabBar({ state, navigation }: any) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const tabLabels: Record<string, string> = {
    index: t.shared.tabs.map,
    encyclopedia: t.shared.tabs.encyclopedia,
    'add-sighting': '',
    'my-plants': t.shared.tabs.myPlants,
    settings: t.shared.tabs.settings,
  };

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const handleConfirmLeave = () => {
    if (!pendingRoute) return;
    sightingGuard.reset();
    navigation.navigate(pendingRoute);
    setPendingRoute(null);
  };

  const handleCancelLeave = () => {
    setPendingRoute(null);
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'add-sighting';
        const Icon = TAB_ICONS[route.name];
        if (!Icon) return null;

        const label = tabLabels[route.name] ?? '';
        const color = isFocused ? colors.tabActive : colors.textSecondary;

        const onPress = () => {
          const isLeavingAddSighting =
            !isFocused &&
            state.routes[state.index]?.name === 'add-sighting' &&
            sightingGuard.hasProgress;

          if (isLeavingAddSighting) {
            setPendingRoute(route.name);
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.centerTab}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <View style={styles.centerButton}>
                <Icon size={30} color={colors.textLight} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Icon size={26} color={color} />
            {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
          </TouchableOpacity>
        );
      })}

      <ConfirmModal
        visible={pendingRoute !== null}
        title="Parasesti observatia?"
        message="Daca iesi acum, progresul observatiei va fi pierdut si nu poate fi recuperat."
        confirmLabel="Ies"
        cancelLabel="Raman"
        confirmDestructive
        icon={<LogOut size={36} color={colors.error} />}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
  },
  centerButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.logoTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.logoTeal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
