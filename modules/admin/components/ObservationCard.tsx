// ObservationCard — card pentru o observație din lista completă de observații admin.

import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, Clock, MapPin } from 'lucide-react-native';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { formatDate } from '../../../shared/utils/formatDate';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import type { PointOfInterest } from '../../../shared/types/plant.types';
import type { ModerationAction } from '../types/admin.types';
import { TranslatableText } from '../../../shared/components/TranslatableText';

interface ObservationCardProps {
  poi: PointOfInterest;
  plantName: string;
  userName: string;
  onModerate: (poiId: number, action: ModerationAction, reason?: string) => void;
}

export function ObservationCard({ poi, plantName, userName, onModerate }: ObservationCardProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isPending = poi.status === 'pending';
  const confidencePercent = Math.round((poi.ai_confidence ?? 0) * 100);
  const confidenceColor = poi.ai_confidence >= 0.85 ? colors.success : poi.ai_confidence >= 0.6 ? colors.warning : colors.error;

  const statusConfig = {
    approved: { color: colors.success, icon: <CheckCircle size={14} color={colors.success} />, label: t.admin.charts.approved },
    pending: { color: colors.warning, icon: <Clock size={14} color={colors.warning} />, label: t.admin.charts.pending },
    rejected: { color: colors.error, icon: <XCircle size={14} color={colors.error} />, label: t.admin.charts.rejected },
  };

  const status = statusConfig[poi.status] ?? statusConfig.pending;

  const handleRejectConfirm = () => {
    onModerate(poi.id, 'reject', rejectReason.trim() || undefined);
    setRejectModalVisible(false);
    setRejectReason('');
  };

  const handleApproveConfirm = () => {
    onModerate(poi.id, 'approve');
    setApproveModalVisible(false);
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          {poi.image_url ? (
            <Image source={{ uri: poi.image_url }} style={styles.thumbnail} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <MapPin size={20} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.plantName} numberOfLines={1}>
              {plantName || t.admin.observations.noPlant}
            </Text>
            <Text style={styles.userName} numberOfLines={1}>
              {userName || t.admin.observations.unknownUser}
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                {status.icon}
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
              <Text style={styles.date}>{formatDate(poi.created_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.admin.moderation.confidence}</Text>
            <Text style={[styles.detailValue, { color: confidenceColor }]}>{confidencePercent}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.admin.moderation.coordinates}</Text>
            <Text style={styles.detailValue}>
              {(poi.latitude ?? 0).toFixed(4)}, {(poi.longitude ?? 0).toFixed(4)}
            </Text>
          </View>
        </View>

        {poi.comment ? (
          <View style={styles.commentBox}>
            <TranslatableText text={poi.comment} style={styles.commentText} numberOfLines={2} />
          </View>
        ) : null}

        {isPending && (
          <View style={styles.actions}>
            <Button
              title={t.admin.moderation.approve}
              variant="primary"
              onPress={() => setApproveModalVisible(true)}
              style={styles.approveBtn}
            />
            <Button
              title={t.admin.moderation.reject}
              variant="danger"
              onPress={() => setRejectModalVisible(true)}
              style={styles.rejectBtn}
            />
          </View>
        )}
      </Card>

      {/* Approve modal */}
      <ConfirmModal
        visible={approveModalVisible}
        title={t.admin.moderation.approveTitle}
        message={t.admin.moderation.approveMessage}
        confirmLabel={t.admin.moderation.approveConfirm}
        cancelLabel={t.shared.common.cancel}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalVisible(false)}
      />

      {/* Reject modal with reason */}
      <ConfirmModal
        visible={rejectModalVisible}
        title={t.admin.moderation.rejectTitle}
        message={t.admin.moderation.rejectMessage}
        confirmLabel={t.admin.moderation.rejectConfirm}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={handleRejectConfirm}
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }}
      >
        <TextInput
          style={styles.reasonInput}
          placeholder={t.admin.moderation.rejectPlaceholder}
          placeholderTextColor={colors.placeholderText}
          value={rejectReason}
          onChangeText={setRejectReason}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </ConfirmModal>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
  },
  thumbnailPlaceholder: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  plantName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  userName: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  commentBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  commentText: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: colors.success,
  },
  rejectBtn: {
    flex: 1,
  },
  reasonInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    fontSize: fonts.sizes.md,
    color: colors.text,
    minHeight: 80,
    marginTop: spacing.sm,
  },
});
