// PrivacyPolicyScreen — Politica de Confidentialitate a aplicatiei EcoLocation.

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

export function PrivacyPolicyScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Politica de Confidentialitate</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>Ultima actualizare: 25 martie 2026</Text>

        <Section title="1. Despre EcoLocation">
          <P>EcoLocation este o aplicatie mobila dedicata identificarii si cartografierii plantelor medicinale din judetul Galati. Ne angajam sa protejam confidentialitatea utilizatorilor nostri si sa prelucram datele personale cu respectarea Regulamentului (UE) 2016/679 (GDPR) si a legislatiei romane aplicabile.</P>
        </Section>

        <Section title="2. Date pe care le colectam">
          <P><Bold>Date de cont:</Bold> prenume, nume de familie, adresa de email, numar de telefon (optional), data nasterii (optional). Aceste date sunt furnizate voluntar la crearea contului.</P>
          <P><Bold>Date de localizare:</Bold> coordonate GPS utilizate exclusiv pentru marcarea observatiilor pe harta. Localizarea este solicitata explicit si poate fi refuzata.</P>
          <P><Bold>Imagini:</Bold> fotografii ale plantelor capturate cu camera sau selectate din galerie, asociate observatiilor adaugate.</P>
          <P><Bold>Continut generat:</Bold> observatii, comentarii, descrieri de habitate si perioade de recoltare introduse de utilizator.</P>
          <P><Bold>Date tehnice:</Bold> informatii despre dispozitiv si sistem de operare, necesare pentru functionarea corecta a aplicatiei.</P>
        </Section>

        <Section title="3. Scopul prelucrarii datelor">
          <P>Datele colectate sunt utilizate pentru:</P>
          <P>• Gestionarea si autentificarea contului de utilizator</P>
          <P>• Afisarea observatiilor botanice pe harta interactiva</P>
          <P>• Identificarea automata a plantelor prin servicii AI</P>
          <P>• Moderarea continutului adaugat de utilizatori</P>
          <P>• Imbunatatirea functionalitatilor aplicatiei</P>
          <P>• Respectarea obligatiilor legale</P>
        </Section>

        <Section title="4. Stocarea si securitatea datelor">
          <P>In versiunea actuala, datele de sesiune sunt stocate local pe dispozitivul dumneavoastra prin mecanisme securizate (AsyncStorage). Nu sunt transmise catre servere externe fara consimtamantul explicit al utilizatorului.</P>
          <P>Versiunile viitoare ale aplicatiei vor utiliza servere securizate cu criptare in tranzit (HTTPS/TLS) si in repaus. Vom notifica utilizatorii inainte de orice modificare a modului de stocare.</P>
          <P>Implementam masuri tehnice si organizatorice adecvate pentru a proteja datele impotriva accesului neautorizat, pierderii sau divulgarii.</P>
        </Section>

        <Section title="5. Partajarea datelor cu terti">
          <P>Nu vindem, nu inchiram si nu transferam datele dumneavoastra personale catre terti in scop comercial.</P>
          <P>Datele pot fi dezvaluite exclusiv in urmatoarele situatii:</P>
          <P>• La solicitarea autoritatilor competente, in baza obligatiilor legale</P>
          <P>• Catre furnizori de servicii tehnici care actioneaza in calitate de operatori asociati, cu garantii contractuale adecvate</P>
          <P>• Cu consimtamantul dumneavoastra explicit</P>
        </Section>

        <Section title="6. Drepturile dumneavoastra">
          <P>In conformitate cu GDPR, aveti urmatoarele drepturi:</P>
          <P>• <Bold>Dreptul la acces:</Bold> puteti solicita o copie a datelor personale detinute despre dumneavoastra</P>
          <P>• <Bold>Dreptul la rectificare:</Bold> puteti corecta datele inexacte sau incomplete</P>
          <P>• <Bold>Dreptul la stergere:</Bold> puteti solicita stergerea datelor in conditiile prevazute de lege</P>
          <P>• <Bold>Dreptul la portabilitate:</Bold> puteti primi datele intr-un format structurat, uzual si lizibil</P>
          <P>• <Bold>Dreptul la opozitie:</Bold> va puteti opune prelucrarii datelor in anumite circumstante</P>
          <P>• <Bold>Dreptul de a retrage consimtamantul:</Bold> retragerea nu afecteaza legalitatea prelucrarii anterioare</P>
          <P>Pentru exercitarea acestor drepturi, contactati-ne la adresa de mai jos.</P>
        </Section>

        <Section title="7. Cookies si tehnologii similare">
          <P>Aplicatia nu utilizeaza cookies de urmarire sau publicitate. Pot fi utilizate mecanisme locale de stocare exclusiv pentru functionalitatea aplicatiei (sesiune, preferinte).</P>
        </Section>

        <Section title="8. Varsta minima">
          <P>Aplicatia EcoLocation este destinata persoanelor cu varsta de minimum 13 ani. Nu colectam intentionat date personale de la minori sub aceasta varsta. Daca aflam ca am colectat astfel de date, le vom sterge imediat.</P>
        </Section>

        <Section title="9. Modificari ale politicii">
          <P>Ne rezervam dreptul de a actualiza aceasta Politica de Confidentialitate. Modificarile semnificative vor fi comunicate utilizatorilor prin notificari in aplicatie. Continuarea utilizarii aplicatiei dupa publicarea modificarilor constituie acceptul acestora.</P>
        </Section>

        <Section title="10. Contact">
          <P>Pentru orice intrebari, solicitari sau reclamatii privind prelucrarea datelor personale, ne puteti contacta la:</P>
          <P>Email: <Bold>ecolocation.galati@gmail.com</Bold></P>
          <P>De asemenea, aveti dreptul de a depune o plangere la Autoritatea Nationala de Supraveghere a Prelucrarii Datelor cu Caracter Personal (ANSPDCP), www.dataprotection.ro.</P>
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
