// TermsScreen — Termenii și Condițiile de utilizare ale aplicației EcoLocation.

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fonts, spacing } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { ThemeColors } from '../../../shared/styles/theme';

export function TermsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const t = useTranslation();
  const terms = t.auth.terms;

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    );
  }

  function P({ children }: { children: React.ReactNode }) {
    return <Text style={styles.paragraph}>{children}</Text>;
  }

  function Bold({ children }: { children: React.ReactNode }) {
    return <Text style={styles.bold}>{children}</Text>;
  }

  function Warning({ children }: { children: React.ReactNode }) {
    return (
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>{children}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{terms.headerTitle}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>{terms.lastUpdated}</Text>

        <Section title={terms.section1Title}>
          <P>{terms.section1Text}</P>
        </Section>

        <Section title={terms.section2Title}>
          <P>{terms.section2Text}</P>
          <P>{terms.section2Item1}</P>
          <P>{terms.section2Item2}</P>
          <P>{terms.section2Item3}</P>
          <P>{terms.section2Item4}</P>
        </Section>

        <Section title={terms.section3Title}>
          <P>{terms.section3Text1}</P>
          <P>{terms.section3Text2}</P>
        </Section>

        <Section title={terms.section4Title}>
          <P>{terms.section4Item1}</P>
          <P>{terms.section4Item2}</P>
          <P>{terms.section4Item3}</P>
          <P>{terms.section4Item4}</P>
          <P>{terms.section4Item5}</P>
        </Section>

        <Section title={terms.section5Title}>
          <P>{terms.section5Text1}</P>
          <P>{terms.section5Text2}</P>
          <P>{terms.section5Item1}</P>
          <P>{terms.section5Item2}</P>
          <P>{terms.section5Item3}</P>
          <P>{terms.section5Item4}</P>
          <P>{terms.section5Text3}</P>
        </Section>

        <Section title={terms.section6Title}>
          <Warning>{terms.section6Warning}</Warning>
          <P>{terms.section6Text}</P>
          <P>{terms.section6Item1}</P>
          <P>{terms.section6Item2}</P>
          <P>{terms.section6Item3}</P>
          <P>{terms.section6Text2}</P>
        </Section>

        <Section title={terms.section7Title}>
          <P>{terms.section7Text}</P>
          <P>• <Bold>{terms.section7Item1Location}</Bold>{terms.section7Item1Text}</P>
          <P>• <Bold>{terms.section7Item2Camera}</Bold>{terms.section7Item2Text}</P>
          <P>• <Bold>{terms.section7Item3Gallery}</Bold>{terms.section7Item3Text}</P>
          <P>{terms.section7Text2}</P>
        </Section>

        <Section title={terms.section8Title}>
          <P>{terms.section8Text1}</P>
          <P>{terms.section8Text2}</P>
          <P>{terms.section8Text3}</P>
        </Section>

        <Section title={terms.section9Title}>
          <P>{terms.section9Text1}</P>
          <P>{terms.section9Text2}</P>
          <P>{terms.section9Item1}</P>
          <P>{terms.section9Item2}</P>
          <P>{terms.section9Item3}</P>
          <P>{terms.section9Item4}</P>
        </Section>

        <Section title={terms.section10Title}>
          <P>{terms.section10Text}</P>
        </Section>

        <Section title={terms.section11Title}>
          <P>{terms.section11Text}</P>
        </Section>

        <Section title={terms.section12Title}>
          <P>{terms.section12Text}</P>
        </Section>

        <Section title={terms.section13Title}>
          <P>{terms.section13Text}</P>
          <P>{terms.section13Email}<Bold>{terms.section13EmailAddress}</Bold></P>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  updated: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  warningBox: {
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: fonts.sizes.md,
    color: colors.error,
    fontWeight: '600',
    lineHeight: 22,
  },
});
