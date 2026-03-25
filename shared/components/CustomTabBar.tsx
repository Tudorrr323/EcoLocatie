// CustomTabBar — bara de navigare inferioara personalizata cu iconuri lucide.
// Afiseaza tab-urile: Harta, Enciclopedie, Adauga, Plantele mele, Cont. Inlocuieste tab bar-ul default Expo.

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Home, HeartPulse, Camera, Flower2, User } from 'lucide-react-native';
import { colors } from '../styles/theme';

const TAB_CONFIG: Record<string, { icon: typeof Home; label: string }> = {
  index: { icon: Home, label: 'Harta' },
  encyclopedia: { icon: HeartPulse, label: 'Enciclopedie' },
  'add-sighting': { icon: Camera, label: '' },
  'my-plants': { icon: Flower2, label: 'Plantele mele' },
  account: { icon: User, label: 'Contul meu' },
};

export function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'add-sighting';
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const { icon: Icon, label } = config;
        const color = isFocused ? colors.tabActive : colors.textSecondary;

        const onPress = () => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
