// DatePickerModal — componenta globala de selectie data din calendar.
// Afiseaza un modal cu grid lunar, navigare luna/an, selectie zi.
// Utilizare: visible, value?: Date, onConfirm(date), onCancel, maxDate?

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { fonts, spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import { useThemeColors } from '../hooks/useThemeColors';

const MONTHS_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

const DAYS_RO = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

interface DatePickerModalProps {
  visible: boolean;
  value?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  maxDate?: Date;
  minDate?: Date;
}

export function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  maxDate,
  minDate,
}: DatePickerModalProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearListRef = useRef<FlatList>(null);

  const currentYear = new Date().getFullYear();
  const minYear = minDate ? minDate.getFullYear() : currentYear - 120;
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 10;
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y--) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  // Sincronizeaza starea la fiecare deschidere a modalului
  useEffect(() => {
    if (visible) {
      const ref = value ?? new Date();
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setSelectedDate(value);
      setShowYearPicker(false);
    }
  }, [visible]);

  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Returneaza indexul primei zile din luna (0=Lu, 6=Du)
  function getFirstWeekdayOfMonth(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay(); // 0=Du, 1=Lu...
    return day === 0 ? 6 : day - 1;
  }

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function isDayDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    if (maxDate && d > maxDate) return true;
    if (minDate && d < minDate) return true;
    return false;
  }

  function isDaySelected(day: number): boolean {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  }

  function isDayToday(day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function handleDayPress(day: number) {
    if (isDayDisabled(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
  }

  function handleConfirm() {
    if (selectedDate) onConfirm(selectedDate);
  }

  const canGoPrev = !minDate || new Date(viewYear, viewMonth - 1, 1) >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canGoNext = !maxDate || new Date(viewYear, viewMonth + 1, 1) <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstWeekday = getFirstWeekdayOfMonth(viewYear, viewMonth);

  // Construieste celulele grid-ului (null = celula goala de padding)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        {/* Stopeaza propagarea tapului pe card catre overlay */}
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>

          {/* Navigare luna */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
              onPress={goToPrevMonth}
              disabled={!canGoPrev}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={canGoPrev ? colors.text : colors.border} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowYearPicker((v) => !v)} activeOpacity={0.7}>
              <Text style={styles.monthYearText}>
                {MONTHS_RO[viewMonth]} {viewYear}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
              onPress={goToNextMonth}
              disabled={!canGoNext}
              activeOpacity={0.7}
            >
              <ChevronRight size={20} color={canGoNext ? colors.text : colors.border} />
            </TouchableOpacity>
          </View>

          {showYearPicker ? (
            /* Grid selectie an */
            <FlatList
              ref={yearListRef}
              data={years}
              keyExtractor={(item) => String(item)}
              numColumns={3}
              style={styles.yearList}
              contentContainerStyle={styles.yearListContent}
              showsVerticalScrollIndicator={false}
              onLayout={() => {
                const idx = years.indexOf(viewYear);
                if (idx > 0) {
                  const rowIndex = Math.floor(idx / 3);
                  yearListRef.current?.scrollToOffset({ offset: Math.max(0, rowIndex * 52 - 80), animated: false });
                }
              }}
              renderItem={({ item: year }) => {
                const isActive = year === viewYear;
                return (
                  <TouchableOpacity
                    style={[styles.yearCell, isActive && styles.yearCellActive]}
                    onPress={() => {
                      setViewYear(year);
                      setShowYearPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.yearText, isActive && styles.yearTextActive]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <>
              {/* Antet zile saptamana */}
              <View style={styles.weekdayRow}>
                {DAYS_RO.map((d) => (
                  <View key={d} style={styles.weekdayCell}>
                    <Text style={styles.weekdayText}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Grid zile */}
              <View style={styles.grid}>
                {cells.map((day, i) => {
                  const selected = day !== null && isDaySelected(day);
                  const today = day !== null && isDayToday(day);
                  const disabled = day !== null && isDayDisabled(day);

                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.dayCell,
                        selected && styles.dayCellSelected,
                        today && !selected && styles.dayCellToday,
                      ]}
                      onPress={() => day && handleDayPress(day)}
                      activeOpacity={day && !disabled ? 0.7 : 1}
                      disabled={!day || disabled}
                    >
                      {day !== null && (
                        <Text
                          style={[
                            styles.dayText,
                            selected && styles.dayTextSelected,
                            today && !selected && styles.dayTextToday,
                            disabled && styles.dayTextDisabled,
                          ]}
                        >
                          {day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Butoane actiune */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Anulare</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !selectedDate && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selectedDate}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmText}>Confirma</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const CELL_SIZE = 38;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    width: '100%',
    maxWidth: 360,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  monthYearText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekdayText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  dayTextSelected: {
    color: colors.textLight,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: colors.border,
  },
  yearList: {
    maxHeight: 240,
  },
  yearListContent: {
    paddingVertical: spacing.xs,
  },
  yearCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    margin: 2,
    borderRadius: borderRadius.lg,
    height: 48,
  },
  yearCellActive: {
    backgroundColor: colors.primary,
  },
  yearText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  yearTextActive: {
    color: colors.textLight,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.border,
  },
  confirmText: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    fontWeight: '600',
  },
});
