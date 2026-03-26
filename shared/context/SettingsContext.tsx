// SettingsContext — context global pentru preferintele aplicatiei.
// Gestioneaza limba (ro/en) si tema (light/dark/system) cu persistare in AsyncStorage.

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';

export type Language = 'ro' | 'en';
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface SettingsContextType {
  language: Language;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  colors: ThemeColors;
  setLanguage: (lang: Language) => void;
  setThemePreference: (theme: ThemePreference) => void;
}

const LANG_KEY = '@ecolocatie_language';
const THEME_KEY = '@ecolocatie_theme';

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('ro');
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [storedLang, storedTheme] = await Promise.all([
        AsyncStorage.getItem(LANG_KEY),
        AsyncStorage.getItem(THEME_KEY),
      ]);
      if (storedLang === 'ro' || storedLang === 'en') { setLanguageState(storedLang); _setCurrentLanguage(storedLang); }
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') setThemePreferenceState(storedTheme);
      setLoaded(true);
    })();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    _setCurrentLanguage(lang);
    AsyncStorage.setItem(LANG_KEY, lang);
  }, []);

  const setThemePreference = useCallback((theme: ThemePreference) => {
    setThemePreferenceState(theme);
    AsyncStorage.setItem(THEME_KEY, theme);
  }, []);

  const resolvedTheme: ResolvedTheme =
    themePreference === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themePreference;

  const themeColors = useMemo(
    () => (resolvedTheme === 'dark' ? darkColors : lightColors),
    [resolvedTheme],
  );

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={{ language, themePreference, resolvedTheme, colors: themeColors, setLanguage, setThemePreference }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings trebuie folosit in interiorul SettingsProvider');
  return ctx;
}

// --- Non-hook language getter (for use outside React components like dataProvider) ---
let _currentLanguage: Language = 'ro';

export function _setCurrentLanguage(lang: Language) {
  _currentLanguage = lang;
}

export function getCurrentLanguage(): Language {
  return _currentLanguage;
}

/** Returnează numele plantei în limba curentă (name_en dacă e engleză și disponibil, altfel name_ro). */
export function getPlantName(plant: { name_ro: string; name_en?: string }): string {
  if (_currentLanguage === 'en' && plant.name_en) return plant.name_en;
  return plant.name_ro;
}
