// UserRow — rand in lista de utilizatori din panoul admin.
// Afiseaza username, email, rol si un switch pentru activare/dezactivare cont.

import React, { useMemo } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { formatDate } from '../../../shared/utils/formatDate';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { User } from '../../../shared/types/plant.types';

interface UserRowProps {
  user: User;
  onToggle: (userId: number) => void;
}

export function UserRow({ user, onToggle }: UserRowProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createUserRowStyles(colors), [colors]);
  const isAdmin = user.role === 'admin';

  return (
    <Card style={[styles.card, !user.is_active && styles.inactiveCard].reduce((a, b) => ({ ...a, ...(b || {}) }), {}) as any}>
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.username, !user.is_active && styles.inactiveText]}
              numberOfLines={1}
            >
              {user.username}
            </Text>
            <View
              style={[
                styles.roleBadge,
                isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
              ]}
            >
              <Text style={styles.roleBadgeText}>
                {isAdmin ? t.admin.users.admin : t.admin.users.user}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.email, !user.is_active && styles.inactiveText]}
            numberOfLines={1}
          >
            {user.email}
          </Text>
          <Text style={styles.date}>
            {t.admin.users.registered}: {formatDate(user.created_at)}
          </Text>
        </View>
        <Switch
          value={user.is_active}
          onValueChange={() => onToggle(user.id)}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={user.is_active ? colors.primary : colors.textSecondary}
        />
      </View>
    </Card>
  );
}

const createUserRowStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  inactiveCard: {
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  username: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  inactiveText: {
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.success,
  },
  roleBadgeUser: {
    backgroundColor: '#1565C0',
  },
  roleBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  date: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
});
