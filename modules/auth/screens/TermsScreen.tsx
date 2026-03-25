// TermsScreen — Termenii si Conditiile de utilizare ale aplicatiei EcoLocation.

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fonts, spacing } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import type { ThemeColors } from '../../../shared/styles/theme';

export function TermsScreen() {
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
        <Text style={styles.headerTitle}>Termeni si Conditii</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>Ultima actualizare: 25 martie 2026</Text>

        <Section title="1. Acceptarea termenilor">
          <P>Prin descarcarea, instalarea sau utilizarea aplicatiei EcoLocation, confirmati ca ati citit, inteles si acceptat in totalitate prezentii Termeni si Conditii. Daca nu sunteti de acord cu acesti termeni, va rugam sa nu utilizati aplicatia.</P>
        </Section>

        <Section title="2. Descrierea serviciului">
          <P>EcoLocation este o aplicatie mobila care permite utilizatorilor sa identifice, sa cartografieze si sa documenteze plante medicinale din judetul Galati. Aplicatia ofera:</P>
          <P>• Harta interactiva cu observatii botanice verificate</P>
          <P>• Identificare automata a plantelor prin tehnologie AI</P>
          <P>• Enciclopedie cu informatii despre plante medicinale locale</P>
          <P>• Posibilitatea de a adauga observatii proprii</P>
        </Section>

        <Section title="3. Eligibilitatea utilizatorilor">
          <P>Aplicatia este destinata persoanelor cu varsta de minimum 13 ani. Utilizatorii cu varsta intre 13 si 18 ani trebuie sa aiba acordul unui parinte sau tutore legal pentru utilizarea aplicatiei.</P>
          <P>Prin crearea unui cont, confirmati ca aveti varsta minima necesara sau ca detineti acordul parental corespunzator.</P>
        </Section>

        <Section title="4. Contul de utilizator">
          <P>• Sunteti responsabil pentru mentinerea confidentialitatii credentialelor de acces (email si parola)</P>
          <P>• Nu permiteti accesul tertilor la contul dumneavoastra</P>
          <P>• Informatiile furnizate la inregistrare trebuie sa fie reale si exacte</P>
          <P>• Ne rezervam dreptul de a suspenda sau sterge conturile care incalca prezentii termeni</P>
          <P>• Notificati-ne imediat la ecolocation.galati@gmail.com in cazul unui acces neautorizat la contul dumneavoastra</P>
        </Section>

        <Section title="5. Continut generat de utilizatori">
          <P>Prin adaugarea de observatii, fotografii sau alte informatii in aplicatie, acordati EcoLocation o licenta neexclusiva, gratuita, pentru a afisa, distribui si utiliza acel continut in scopul functionarii serviciului.</P>
          <P>Va angajati sa nu publicati continut care:</P>
          <P>• Este fals, inexact sau inselator</P>
          <P>• Incalca drepturile de proprietate intelectuala ale tertilor</P>
          <P>• Contine materiale ofensatoare, abuzive sau ilegale</P>
          <P>• Promoveaza utilizarea necorespunzatoare sau periculoasa a plantelor</P>
          <P>Echipa EcoLocation isi rezerva dreptul de a modera si elimina orice continut care incalca aceste reguli.</P>
        </Section>

        <Section title="6. Avertisment medical important">
          <Warning>ATENTIE: Informatiile despre plante medicinale furnizate de aceasta aplicatie au exclusiv scop educational si informativ. Ele NU constituie sfaturi medicale, diagnostic sau recomandari terapeutice.</Warning>
          <P>Inainte de a utiliza orice planta medicinala, consultati obligatoriu un medic sau farmacist autorizat. EcoLocation nu isi asuma responsabilitatea pentru:</P>
          <P>• Identificari incorecte ale plantelor realizate prin intermediul aplicatiei</P>
          <P>• Efecte adverse, alergii sau intoxicatii rezultate din utilizarea plantelor</P>
          <P>• Interactiuni medicamentoase ale plantelor medicinale</P>
          <P>Unele plante pot fi toxice sau daunatoare daca sunt identificate gresit sau utilizate incorect. Utilizati intotdeauna discernamantul propriu si sfatul specialistilor.</P>
        </Section>

        <Section title="7. Permisiuni si acces la dispozitiv">
          <P>Pentru a functiona corect, aplicatia poate solicita urmatoarele permisiuni:</P>
          <P>• <Bold>Localizare:</Bold> pentru marcarea observatiilor pe harta si activarea functiei GPS</P>
          <P>• <Bold>Camera:</Bold> pentru fotografierea plantelor in vederea identificarii</P>
          <P>• <Bold>Galerie foto:</Bold> pentru selectarea imaginilor existente</P>
          <P>Fiecare permisiune este solicitata explicit si poate fi revocata din setarile dispozitivului. Refuzul unor permisiuni poate limita anumite functionalitati.</P>
        </Section>

        <Section title="8. Proprietate intelectuala">
          <P>Aplicatia EcoLocation, inclusiv interfata, grafica, textele, logoul si codul sursa, sunt protejate de drepturile de autor si alte drepturi de proprietate intelectuala apartinand echipei de dezvoltare.</P>
          <P>Este interzisa copierea, modificarea, distribuirea sau utilizarea comerciala a oricarui element al aplicatiei fara acordul scris prealabil al proprietarilor.</P>
          <P>Continutul stiintific despre plante (descrieri, proprietati, contraindicatii) a fost compilat din surse publice si verificat de specialisti in botanica.</P>
        </Section>

        <Section title="9. Limitarea raspunderii">
          <P>EcoLocation este furnizata "ca atare", fara garantii explicite sau implicite privind acuratetea, disponibilitatea sau potrivirea pentru un anumit scop.</P>
          <P>In masura maxima permisa de lege, echipa EcoLocation nu raspunde pentru:</P>
          <P>• Daune directe sau indirecte rezultate din utilizarea sau incapacitatea de utilizare a aplicatiei</P>
          <P>• Pierderi de date sau intreruperi ale serviciului</P>
          <P>• Informatii inexacte despre plante sau locatii</P>
          <P>• Actiunile altor utilizatori in cadrul aplicatiei</P>
        </Section>

        <Section title="10. Disponibilitatea serviciului">
          <P>Ne rezervam dreptul de a modifica, suspenda sau intrerupe partial sau total serviciul EcoLocation, temporar sau permanent, cu sau fara notificare prealabila, pentru motive tehnice, de securitate sau comerciale.</P>
        </Section>

        <Section title="11. Modificari ale termenilor">
          <P>Ne rezervam dreptul de a actualiza prezentii Termeni si Conditii. Modificarile vor fi publicate in aplicatie, iar data actualizarii va fi revizuita. Continuarea utilizarii aplicatiei dupa publicarea modificarilor constituie acceptul noilor termeni.</P>
        </Section>

        <Section title="12. Legea aplicabila">
          <P>Prezentii Termeni si Conditii sunt guvernati de legislatia romana. Orice dispute vor fi solutionate pe cale amiabila sau, in lipsa unui acord, de instantele judecatoresti competente din Romania.</P>
        </Section>

        <Section title="13. Contact">
          <P>Pentru orice intrebari sau solicitari legate de acesti termeni:</P>
          <P>Email: <Bold>ecolocation.galati@gmail.com</Bold></P>
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
