// Pagination — componenta reutilizabila de paginare.
// Afiseaza butoane de navigare intre pagini. Optional, un buton in dreapta deschide un
// ConfirmModal cu lista de optiuni pentru numarul de elemente afisate pe pagina.

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react-native';
import { spacing, borderRadius, fonts } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../i18n';
import { ConfirmModal } from './ConfirmModal';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const hasPageSizeSelector = !!onPageSizeChange && !!pageSize;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <View style={styles.row}>
      {/* Spacer stanga pentru a centra paginarea */}
      <View style={styles.sideSlot} />

      {/* Navigare pagini */}
      <View style={styles.pagesContainer}>
        {totalPages > 1 ? (
          <>
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
          </>
        ) : (
          <Text style={styles.singlePageLabel}>1 / 1</Text>
        )}
      </View>

      {/* Buton marime pagina — dreapta */}
      <View style={styles.sideSlot}>
        {hasPageSizeSelector && (
          <TouchableOpacity
            style={styles.pageSizeButton}
            onPress={() => setSizeModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.pageSizeButtonText}>{pageSize}</Text>
            <ChevronDown size={12} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal selectie marime */}
      <ConfirmModal
        visible={sizeModalVisible}
        title={t.shared.pagination.modalTitle}
        cancelLabel={t.shared.common.close}
        onCancel={() => setSizeModalVisible(false)}
      >
        {pageSizeOptions.map((option, index) => {
          const isActive = option === pageSize;
          const isLast = index === pageSizeOptions.length - 1;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionRow, !isLast && styles.optionRowBorder]}
              onPress={() => {
                onPageSizeChange!(option);
                setSizeModalVisible(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {option} {t.shared.pagination.perPage}
              </Text>
              {isActive && <Check size={18} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </ConfirmModal>
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  sideSlot: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  singlePageLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm,
  },
  pageSizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pageSizeButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.text,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
});
