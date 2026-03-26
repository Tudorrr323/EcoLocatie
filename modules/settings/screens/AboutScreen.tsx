// AboutScreen — pagina "Despre EcoLocation" cu informații despre aplicație.

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Leaf, Users, ShieldCheck, Trophy, Mail, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { ThemeColors } from '../../../shared/styles/theme';

export function AboutScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const t = useTranslation();
  const about = t.account.about;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{about.headerTitle}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo și versiune */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../../assets/SmallLogoEcoLocation.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>EcoLocation</Text>
          <Text style={styles.version}>{about.version}</Text>
        </View>

        {/* Descriere */}
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {about.description}
          </Text>
        </View>

        {/* Caracteristici */}
        <Text style={styles.sectionLabel}>{about.featuresTitle}</Text>
        <View style={styles.card}>
          <Feature
            icon={<MapPin size={20} color={colors.primary} />}
            title={about.featureMapTitle}
            desc={about.featureMapDesc}
            styles={styles}
          />
          <FeatureDivider styles={styles} />
          <Feature
            icon={<Leaf size={20} color={colors.primary} />}
            title={about.featureAITitle}
            desc={about.featureAIDesc}
            styles={styles}
          />
          <FeatureDivider styles={styles} />
          <Feature
            icon={<Users size={20} color={colors.primary} />}
            title={about.featureCommunityTitle}
            desc={about.featureCommunityDesc}
            styles={styles}
          />
          <FeatureDivider styles={styles} />
          <Feature
            icon={<ShieldCheck size={20} color={colors.primary} />}
            title={about.featureVerifiedTitle}
            desc={about.featureVerifiedDesc}
            styles={styles}
          />
        </View>

        {/* Echipa */}
        <Text style={styles.sectionLabel}>{about.teamTitle}</Text>
        <View style={styles.card}>
          <View style={styles.teamDescription}>
            <Trophy size={18} color={colors.secondary} />
            <Text style={styles.teamDescText}>{about.teamDescription}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.teamMember}>
            <User size={18} color={colors.primary} />
            <Text style={styles.teamMemberName}>{about.teamMember1}</Text>
          </View>
          <View style={styles.teamMember}>
            <User size={18} color={colors.primary} />
            <Text style={styles.teamMemberName}>{about.teamMember2}</Text>
          </View>
        </View>

        {/* Avertisment */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>{about.warningTitle}</Text>
          <Text style={styles.warningText}>
            {about.warningText}
          </Text>
        </View>

        {/* Info tehnic */}
        <Text style={styles.sectionLabel}>{about.technicalTitle}</Text>
        <View style={styles.card}>
          <InfoRow label={about.versionLabel} value="1.0.0" styles={styles} />
          <InfoDivider styles={styles} />
          <InfoRow label={about.platformLabel} value={about.platformValue} styles={styles} />
          <InfoDivider styles={styles} />
          <InfoRow label={about.builtWithLabel} value={about.builtWithValue} styles={styles} />
        </View>

        {/* Contact */}
        <Text style={styles.sectionLabel}>{about.contactTitle}</Text>
        <View style={styles.card}>
          <View style={styles.contactRow}>
            <Mail size={16} color={colors.primary} />
            <Text style={styles.contactEmail}>{about.contactEmail1}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Mail size={16} color={colors.primary} />
            <Text style={styles.contactEmail}>{about.contactEmail2}</Text>
          </View>
        </View>

        <Text style={styles.copyright}>{about.copyright}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, title, desc, styles }: { icon: React.ReactNode; title: string; desc: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function FeatureDivider({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.divider} />;
}

function InfoRow({ label, value, styles }: { label: string; value: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function InfoDivider({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.divider} />;
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  cardText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: colors.errorBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    marginBottom: spacing.lg,
  },
  warningTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: fonts.sizes.md,
    color: colors.error,
    lineHeight: 20,
  },
  feature: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  teamDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  teamDescText: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  teamMemberName: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  contactEmail: {
    fontSize: fonts.sizes.md,
    color: colors.primary,
    fontWeight: '500',
  },
  copyright: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
