// SearchBar — input de cautare cu icon lupa, buton clear si debounce integrat.
// Folosit in enciclopedie si pe harta pentru filtrarea plantelor dupa nume.

import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({ placeholder = 'Cauta...', onSearch, debounceMs = 300 }: SearchBarProps) {
  const [text, setText] = useState('');
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    const timer = setTimeout(() => onSearchRef.current(text), debounceMs);
    return () => clearTimeout(timer);
  }, [text, debounceMs]);

  return (
    <View style={styles.container}>
      <Search size={20} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
      {text.length > 0 && (
        <TouchableOpacity onPress={() => setText('')}>
          <X size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
