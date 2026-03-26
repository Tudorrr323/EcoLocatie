// HistoryCard — card orizontal pentru o observatie din istoricul utilizatorului.
// Afiseaza imaginea POI-ului, numele plantei, familia si badge-ul de status.

import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { createMyPlantsStyles } from '../styles/myplants.styles';
import { getPlantName } from '../../../shared/context/SettingsContext';
import { FavoriteButton } from '../../../shared/components/FavoriteButton';
import { usePOIFavorites } from '../../../shared/context/POIFavoritesContext';
import { spacing, fonts, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import type { HistoryEntry } from '../types/myplants.types';
import type { POIStatus } from '../../../shared/types/plant.types';

interface HistoryCardProps {
  entry: HistoryEntry;
}

export function HistoryCard({ entry }: HistoryCardProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const styles = useMemo(() => createMyPlantsStyles(colors), [colors]);
  const badgeStyles = useMemo(() => createBadgeStyles(colors), [colors]);
  const router = useRouter();
  const { isPoiFavorite, togglePoiFavorite } = usePOIFavorites();

  const { poi, plant } = entry;

  const statusConfig = getStatusConfig(poi.status, colors, t);

  return (
    <View style={styles.historyCard}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        activeOpacity={0.7}
        onPress={() => router.push(`/my-plant/${plant.id}`)}
      >
        <View>
          <Image
            source={{ uri: poi.image_url || plant.image_url }}
            style={styles.historyCardImage}
            resizeMode="cover"
          />
          <View style={[badgeStyles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            {statusConfig.icon}
            <Text style={[badgeStyles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
        <View style={styles.historyCardInfo}>
          <Text style={styles.historyCardName} numberOfLines={1}>{getPlantName(plant)}</Text>
          <Text style={styles.historyCardLatin} numberOfLines={1}>{plant.name_latin}</Text>
          <Text style={styles.historyCardFamily}>{plant.family}</Text>
        </View>
      </TouchableOpacity>
      <FavoriteButton isFavorite={isPoiFavorite(poi.id)} onToggle={() => togglePoiFavorite(poi.id)} />
    </View>
  );
}

function getStatusConfig(
  status: POIStatus,
  colors: ReturnType<typeof useThemeColors>,
  t: ReturnType<typeof useTranslation>,
) {
  switch (status) {
    case 'approved':
      return {
        label: t.myPlants.detail.approved,
        color: colors.success,
        bg: colors.success + '18',
        icon: <CheckCircle2 size={12} color={colors.success} />,
      };
    case 'rejected':
      return {
        label: t.myPlants.detail.rejected,
        color: colors.error,
        bg: colors.error + '18',
        icon: <XCircle size={12} color={colors.error} />,
      };
    case 'pending':
    default:
      return {
        label: t.myPlants.detail.pending,
        color: colors.warning,
        bg: colors.warning + '18',
        icon: <Clock size={12} color={colors.warning} />,
      };
  }
}

const createBadgeStyles = (colors: ThemeColors) => ({
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 3,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
  },
});
