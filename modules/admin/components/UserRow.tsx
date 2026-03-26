// UserRow — rând în lista de utilizatori din panoul admin.
// Afișează username, email, rol, status și meniu 3 puncte cu acțiuni.

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Card } from '../../../shared/components/Card';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { formatDate } from '../../../shared/utils/formatDate';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { User } from '../../../shared/types/plant.types';

interface UserRowProps {
  user: User;
  onToggle: (userId: number, reason?: string) => void;
}

export function UserRow({ user, onToggle }: UserRowProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createUserRowStyles(colors), [colors]);
  const isAdmin = user.role === 'admin';
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onToggle(user.id, user.is_active ? reason.trim() || undefined : undefined);
    setModalVisible(false);
    setReason('');
  };

  return (
    <>
      <Card style={{ ...styles.card, ...(!user.is_active ? styles.inactiveCard : {}) }}>
        <View style={styles.row}>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text
                style={[styles.username, !user.is_active && styles.inactiveText]}
                numberOfLines={1}
              >
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </Text>
              <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser]}>
                <Text style={styles.roleBadgeText}>
                  {isAdmin ? t.admin.users.admin : t.admin.users.user}
                </Text>
              </View>
            </View>
            <Text style={[styles.email, !user.is_active && styles.inactiveText]} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.date}>
                {t.admin.users.registered}: {formatDate(user.created_at)}
              </Text>
              <View style={[styles.statusBadge, user.is_active ? styles.statusActive : styles.statusInactive]}>
                <Text style={[styles.statusText, { color: user.is_active ? colors.success : colors.error }]}>
                  {user.is_active ? t.admin.users.active : t.admin.users.inactive}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setModalVisible(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.6}
          >
            <MoreVertical size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Deactivate with reason / Activate confirmation */}
      <ConfirmModal
        visible={modalVisible}
        title={user.is_active ? t.admin.users.deactivateTitle : t.admin.users.activateTitle}
        message={user.is_active ? t.admin.users.deactivateMessage : t.admin.users.activateMessage}
        confirmLabel={user.is_active ? t.admin.users.deactivateConfirm : t.admin.users.activateConfirm}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive={user.is_active}
        onConfirm={handleConfirm}
        onCancel={() => { setModalVisible(false); setReason(''); }}
      >
        {user.is_active && (
          <TextInput
            style={styles.reasonInput}
            placeholder={t.admin.users.deactivatePlaceholder}
            placeholderTextColor={colors.placeholderText}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        )}
      </ConfirmModal>
    </>
  );
}

const createUserRowStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: colors.primary,
  },
  roleBadgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusActive: {
    backgroundColor: colors.success + '20',
  },
  statusInactive: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  reasonInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    fontSize: fonts.sizes.md,
    color: colors.text,
    minHeight: 80,
    marginTop: spacing.sm,
  },
});
