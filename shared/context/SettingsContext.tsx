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
      if (storedLang === 'ro' || storedLang === 'en') setLanguageState(storedLang);
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') setThemePreferenceState(storedTheme);
      setLoaded(true);
    })();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
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
