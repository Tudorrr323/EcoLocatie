// PlantDetailScreen — ecranul de detalii complet al unei plante medicinale.
// Afiseaza descrierea, partile utilizabile, beneficiile, contraindicatiile,
// habitatul, perioada de recoltare si modul de preparare.
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, FlaskConical, Leaf } from 'lucide-react-native';
import { Badge } from '../../../shared/components/Badge';
import { colors } from '../../../shared/styles/theme';
import { getPlantById } from '../repository/plantsRepository';
import { plantsStyles } from '../styles/plants.styles';

export function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const plant = getPlantById(Number(id));

  if (!plant) {
    return (
      <View style={[plantsStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={plantsStyles.detailScroll} showsVerticalScrollIndicator={false}>
      {/* Hero image */}
      <View>
        <Image
          source={{ uri: plant.image_url }}
          style={plantsStyles.detailHeroImage}
          resizeMode="cover"
          accessibilityLabel={plant.name_ro}
        />

        {/* Back button */}
        <TouchableOpacity
          style={plantsStyles.detailBackButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityLabel="Inapoi"
        >
          <ArrowLeft size={22} color={colors.textLight} />
        </TouchableOpacity>

        {/* Name overlay */}
        <View style={plantsStyles.detailHeaderOverlay}>
          <Text style={plantsStyles.detailNameRo}>{plant.name_ro}</Text>
          <Text style={plantsStyles.detailNameLatin}>{plant.name_latin}</Text>
          <Badge text={plant.family} color={plant.icon_color} />
        </View>
      </View>

      <View style={plantsStyles.detailContent}>
        {/* Descriere */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Descriere</Text>
          <Text style={plantsStyles.sectionText}>{plant.description}</Text>
        </View>

        {/* Parti utilizabile */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Parti utilizabile</Text>
          {plant.parts_used.map((part: string, index: number) => (
            <View key={index} style={plantsStyles.bulletRow}>
              <View style={plantsStyles.bullet} />
              <Text style={plantsStyles.bulletText}>{part}</Text>
            </View>
          ))}
        </View>

        {/* Beneficii */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Beneficii</Text>
          {plant.benefits.map((benefit: string, index: number) => (
            <View key={index} style={plantsStyles.bulletRow}>
              <View style={plantsStyles.bullet} />
              <Text style={plantsStyles.bulletText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Contraindicatii */}
        {plant.contraindications.length > 0 && (
          <View style={plantsStyles.sectionCard}>
            <Text style={[plantsStyles.sectionTitle, { color: colors.error, borderBottomColor: colors.error }]}>
              Contraindicatii
            </Text>
            {plant.contraindications.map((contra: string, index: number) => (
              <View key={index} style={plantsStyles.bulletRow}>
                <View style={[plantsStyles.bullet, plantsStyles.bulletWarning]} />
                <Text style={[plantsStyles.bulletText, plantsStyles.bulletTextWarning]}>
                  {contra}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Habitat */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Habitat</Text>
          <View style={plantsStyles.infoRow}>
            <MapPin size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
            <Text style={plantsStyles.infoText}>{plant.habitat}</Text>
          </View>
        </View>

        {/* Perioada de recoltare */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Perioada de recoltare</Text>
          <View style={plantsStyles.infoRow}>
            <Calendar size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
            <Text style={plantsStyles.infoText}>{plant.harvest_period}</Text>
          </View>
        </View>

        {/* Mod de preparare */}
        <View style={plantsStyles.sectionCard}>
          <Text style={plantsStyles.sectionTitle}>Mod de preparare</Text>
          <View style={plantsStyles.infoRow}>
            <FlaskConical size={18} color={colors.primaryLight} style={plantsStyles.infoIcon} />
            <Text style={plantsStyles.infoText}>{plant.preparation}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
