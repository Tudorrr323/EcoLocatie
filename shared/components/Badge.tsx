import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, spacing, borderRadius } from '../styles/theme';

interface BadgeProps {
  text: string;
  color: string;
  textColor?: string;
}

export function Badge({ text, color, textColor = '#FFFFFF' }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
  },
});
