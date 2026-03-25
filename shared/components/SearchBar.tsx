// SearchBar — input de cautare cu icon lupa, buton clear si debounce integrat.
// Folosit in enciclopedie si pe harta pentru filtrarea plantelor dupa nume.

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { spacing, borderRadius, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { removeDiacritics } from '../utils/removeDiacritics';

export interface SearchBarRef {
  blur: () => void;
  focus: () => void;
  clear: () => void;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  initialValue?: string;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  ({ placeholder = 'Cauta...', onSearch, debounceMs = 300, initialValue = '' }, ref) => {
    const colors = useThemeColors();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [text, setText] = useState(initialValue);
    const inputRef = useRef<TextInput>(null);
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    useImperativeHandle(ref, () => ({
      blur: () => inputRef.current?.blur(),
      focus: () => inputRef.current?.focus(),
      clear: () => setText(''),
    }));

    useEffect(() => {
      const timer = setTimeout(
        () => onSearchRef.current(removeDiacritics(text.toLowerCase())),
        debounceMs,
      );
      return () => clearTimeout(timer);
    }, [text, debounceMs]);

    return (
      <View style={styles.container}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={() => setText('')}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fonts.sizes.lg,
    color: colors.text,
  },
});
