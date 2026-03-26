// LanguageSwitcher — buton compact de schimbare limba (glob + "RO"/"EN").
// Deschide ConfirmModal cu optiunile de limba. Folosit pe ecranele de login/register.

import React, { useState, useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Globe, Check } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useSettings, type Language } from '../context/SettingsContext';
import { useTranslation } from '../i18n';
import { ConfirmModal } from './ConfirmModal';
import { fonts, spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';

export function LanguageSwitcher() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { language, setLanguage } = useSettings();
  const t = useTranslation();
  const [visible, setVisible] = useState(false);

  const languageLabels: Record<Language, string> = {
    ro: t.account.settings.languageRo,
    en: t.account.settings.languageEn,
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Globe size={16} color={colors.textSecondary} />
        <Text style={styles.label}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={visible}
        title={t.account.settings.selectLanguage}
        cancelLabel={t.shared.common.close}
        onCancel={() => setVisible(false)}
      >
        {(['ro', 'en'] as Language[]).map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.optionRow}
            onPress={() => { setLanguage(lang); setVisible(false); }}
            activeOpacity={0.6}
          >
            <Text style={styles.optionFlag}>{lang === 'ro' ? '\u{1F1F7}\u{1F1F4}' : '\u{1F1EC}\u{1F1E7}'}</Text>
            <Text style={styles.optionText}>{languageLabels[lang]}</Text>
            {language === lang && <Check size={20} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </ConfirmModal>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  optionFlag: {
    fontSize: 22,
  },
  optionText: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    fontWeight: '500',
  },
});
