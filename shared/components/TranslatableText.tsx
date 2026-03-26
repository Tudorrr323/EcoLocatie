// TranslatableText — afișează text cu opțiune de traducere.
// Când limba curentă diferă de limba originală, arată buton "Translate" / "Show original".
// Folosește API-ul gratuit MyMemory pentru traducere.

import React, { useState, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Languages } from 'lucide-react-native';
import { fonts, spacing } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { getCurrentLanguage } from '../context/SettingsContext';

interface TranslatableTextProps {
  /** Textul original */
  text: string;
  /** Limba originală a textului (default: 'ro') */
  originalLang?: 'ro' | 'en';
  /** Stilul textului */
  style?: any;
  /** Număr maxim de linii */
  numberOfLines?: number;
}

// Cache traduceri pentru a nu repeta requesturi
const translationCache = new Map<string, string>();

async function translateText(text: string, from: string, to: string): Promise<string> {
  const cacheKey = `${from}|${to}|${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

  try {
    const encoded = encodeURIComponent(text);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${from}|${to}`
    );
    const data = await response.json();
    const translated = data?.responseData?.translatedText ?? text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

export function TranslatableText({ text, originalLang = 'ro', style, numberOfLines }: TranslatableTextProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const currentLang = getCurrentLanguage();
  const needsTranslation = currentLang !== originalLang;

  const [showTranslated, setShowTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (translatedText) {
      setShowTranslated(true);
      return;
    }
    setLoading(true);
    const result = await translateText(text, originalLang, currentLang);
    setTranslatedText(result);
    setShowTranslated(true);
    setLoading(false);
  }, [text, originalLang, currentLang, translatedText]);

  const handleShowOriginal = useCallback(() => {
    setShowTranslated(false);
  }, []);

  // Dacă limba e aceeași, afișează direct fără buton
  if (!needsTranslation || !text) {
    return <Text style={style} numberOfLines={numberOfLines}>{text}</Text>;
  }

  return (
    <View>
      <Text style={style} numberOfLines={numberOfLines}>
        {showTranslated ? translatedText : text}
      </Text>
      <TouchableOpacity
        style={styles.translateBtn}
        onPress={showTranslated ? handleShowOriginal : handleTranslate}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size={12} color={colors.primary} style={{ marginRight: 4 }} />
        ) : (
          <Languages size={13} color={colors.primary} style={{ marginRight: 4 }} />
        )}
        <Text style={styles.translateText}>
          {showTranslated
            ? (currentLang === 'en' ? 'Show original' : 'Arată originalul')
            : (currentLang === 'en' ? 'Translate' : 'Traduce')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: 2,
  },
  translateText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});
