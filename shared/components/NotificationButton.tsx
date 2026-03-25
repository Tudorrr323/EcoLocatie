// NotificationButton — buton rotund cu icon de notificari (Bell).
// La apasare deschide un modal full-screen cu lista de notificari sau EmptyState.
// Folosit in header-ul ecranelor principale pentru consistenta vizuala.

import React, { useState, useMemo } from 'react';
import { TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native';
import { Bell, BellOff, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../i18n';
import { EmptyState } from './EmptyState';

export function NotificationButton() {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Bell size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.shared.notifications.title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
              activeOpacity={0.7}
            >
              <X size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <EmptyState
            message={t.shared.notifications.empty}
            icon={<BellOff size={48} color={colors.textSecondary} />}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
