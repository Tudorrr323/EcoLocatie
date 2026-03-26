// PrivacyPolicyScreen — Politica de Confidențialitate a aplicației EcoLocation.

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { ThemeColors } from '../../../shared/styles/theme';

export function PrivacyPolicyScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const t = useTranslation();
  const privacy = t.auth.privacy;

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{privacy.headerTitle}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>{privacy.lastUpdated}</Text>

        <Section title={privacy.section1Title}>
          <P>{privacy.section1Text}</P>
        </Section>

        <Section title={privacy.section2Title}>
          <P><Bold>{privacy.section2Account}</Bold>{privacy.section2AccountText}</P>
          <P><Bold>{privacy.section2Location}</Bold>{privacy.section2LocationText}</P>
          <P><Bold>{privacy.section2Images}</Bold>{privacy.section2ImagesText}</P>
          <P><Bold>{privacy.section2Content}</Bold>{privacy.section2ContentText}</P>
          <P><Bold>{privacy.section2Technical}</Bold>{privacy.section2TechnicalText}</P>
        </Section>

        <Section title={privacy.section3Title}>
          <P>{privacy.section3Text}</P>
          <P>{privacy.section3Item1}</P>
          <P>{privacy.section3Item2}</P>
          <P>{privacy.section3Item3}</P>
          <P>{privacy.section3Item4}</P>
          <P>{privacy.section3Item5}</P>
          <P>{privacy.section3Item6}</P>
        </Section>

        <Section title={privacy.section4Title}>
          <P>{privacy.section4Text1}</P>
          <P>{privacy.section4Text2}</P>
          <P>{privacy.section4Text3}</P>
        </Section>

        <Section title={privacy.section5Title}>
          <P>{privacy.section5Text1}</P>
          <P>{privacy.section5Text2}</P>
          <P>{privacy.section5Item1}</P>
          <P>{privacy.section5Item2}</P>
          <P>{privacy.section5Item3}</P>
        </Section>

        <Section title={privacy.section6Title}>
          <P>{privacy.section6Text}</P>
          <P>• <Bold>{privacy.section6Access}</Bold>{privacy.section6AccessText}</P>
          <P>• <Bold>{privacy.section6Rectification}</Bold>{privacy.section6RectificationText}</P>
          <P>• <Bold>{privacy.section6Erasure}</Bold>{privacy.section6ErasureText}</P>
          <P>• <Bold>{privacy.section6Portability}</Bold>{privacy.section6PortabilityText}</P>
          <P>• <Bold>{privacy.section6Opposition}</Bold>{privacy.section6OppositionText}</P>
          <P>• <Bold>{privacy.section6Withdraw}</Bold>{privacy.section6WithdrawText}</P>
          <P>{privacy.section6Footer}</P>
        </Section>

        <Section title={privacy.section7Title}>
          <P>{privacy.section7Text}</P>
        </Section>

        <Section title={privacy.section8Title}>
          <P>{privacy.section8Text}</P>
        </Section>

        <Section title={privacy.section9Title}>
          <P>{privacy.section9Text}</P>
        </Section>

        <Section title={privacy.section10Title}>
          <P>{privacy.section10Text}</P>
          <P>{privacy.section10Email}<Bold>{privacy.section10EmailAddress}</Bold></P>
          <P>{privacy.section10Footer}</P>
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
});
