// Pagination — componenta reutilizabila de paginare.
// Afiseaza butoane pentru navigarea intre pagini cu indicatorul paginii curente.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowButton, !canGoPrev && styles.buttonDisabled]}
        onPress={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        activeOpacity={0.7}
      >
        <ChevronLeft size={20} color={canGoPrev ? colors.primary : colors.border} />
      </TouchableOpacity>

      {getPageNumbers(currentPage, totalPages).map((page, index) =>
        page === '...' ? (
          <Text key={`dots-${index}`} style={styles.dots}>...</Text>
        ) : (
          <TouchableOpacity
            key={page}
            style={[styles.pageButton, page === currentPage && styles.pageButtonActive]}
            onPress={() => onPageChange(page as number)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageText, page === currentPage && styles.pageTextActive]}>
              {page}
            </Text>
          </TouchableOpacity>
        ),
      )}

      <TouchableOpacity
        style={[styles.arrowButton, !canGoNext && styles.buttonDisabled]}
        onPress={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        activeOpacity={0.7}
      >
        <ChevronRight size={20} color={canGoNext ? colors.primary : colors.border} />
      </TouchableOpacity>
    </View>
  );
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  pageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pageText: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.text,
  },
  pageTextActive: {
    color: colors.textLight,
    fontWeight: '700',
  },
  dots: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
  },
});
