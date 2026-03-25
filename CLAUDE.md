# EcoLocatie - Instructiuni pentru Claude

## La fiecare conversatie noua, CITESTE OBLIGATORIU aceste fisiere (relative la root-ul proiectului) inainte de orice altceva:
1. `./01_despre_aplicatie.md`
2. `./02_structura_proiect.md`
3. `./03_componente_globale.md`

Aceste fisiere contin specificatiile complete ale proiectului: ce face aplicatia, structura pe module, componente shared, tipuri, conventii.

## Stack tehnic
- React Native + Expo SDK 54
- expo-router (file-based routing)
- react-native-webview + Leaflet/OpenStreetMap (harta)
- expo-location, expo-image-picker
- AsyncStorage pentru persistenta locala
- TypeScript strict
- Date mockup din `data/ecolocatie_data.json` accesat prin `shared/repository/dataProvider.ts`

## Conventii
- Fiecare modul (`modules/`) are structura: components/, hooks/, repository/, screens/, styles/, types/, index.ts
- Shared code in `shared/` — importat de 2+ module
- Repository e singurul loc de acces la date per modul
- Tema si culori din `shared/styles/theme.ts`
- Limba interfata: romana si engleza (sistem i18n)
- Header-ul brand (logo + "EcoLocation" + NotificationButton) se pune cu `<AppHeader />` din `shared/components/AppHeader.tsx` — nu se duplica manual
- Ecranele cu tab bar folosesc `<SafeAreaView edges={['top']}>` si `backgroundColor: colors.surface` pentru a evita bleeding-ul fundalului in zona toolbar-ului de jos

## Reguli obligatorii pentru culori si dark mode
- **Inainte de orice culoare hardcodata**, uita-te in `shared/styles/theme.ts`
- Daca culoarea exista acolo, foloseste variabila (ex: `colors.error`, `colors.primary`)
- Daca culoarea NU exista in tema, **creeaza o variabila noua in AMBELE palete (`lightColors` si `darkColors`) din `theme.ts`** si foloseste-o
- **NICIODATA** nu scrie culori hardcodate direct in stiluri (ex: `'#FF0000'`, `'rgba(0,0,0,0.5)'`, `'white'`)
- **NICIODATA** nu importa `colors` static din `theme.ts` in componente React — foloseste `useThemeColors()` din `shared/hooks/useThemeColors.ts`
- Fisierele de stiluri ale modulelor sunt **factory functions**: `export const createXxxStyles = (colors: ThemeColors) => StyleSheet.create({...})`
- In componente, stilurile se creaza dinamic: `const styles = useMemo(() => createXxxStyles(colors), [colors])`
- `fonts`, `spacing`, `borderRadius` raman importuri statice din `theme.ts` (nu se schimba cu tema)

## Paginare
- Orice lista paginata foloseste `usePagination(items)` din `shared/hooks/usePagination.ts`
- Hook-ul returneaza `{ currentPage, pageSize, totalPages, paginatedItems, onPageChange, onPageSizeChange }`
- Rezultatele se paseaza direct la `<Pagination>` din `shared/components/Pagination.tsx`
- NU duplica logica de paginare (calcul totalPages, slice, handlePageSizeChange) in componente sau ecrane

## Dialoge de confirmare si selectie
- Foloseste `<ConfirmModal>` din `shared/components/ConfirmModal.tsx` pentru orice dialog modal
- `onConfirm` este optional — daca lipseste, se afiseaza un singur buton de inchidere (full-width)
- Prop `children` permite continut custom (ex: liste de optiuni) intre titlu si butoane
- NU folosi `Alert.alert` pentru confirmari vizibile utilizatorului — rezervat doar pentru erori tehnice

## Selectie data
- Foloseste `<DatePickerModal>` din `shared/components/DatePickerModal.tsx` pentru orice input de tip data
- Props: `visible`, `value?: Date`, `onConfirm(date: Date)`, `onCancel`, `maxDate?`, `minDate?`
- NU folosi TextInput pentru date — intotdeauna calendar vizual

## Autentificare si guard de navigare
- Starea de auth e gestionata global prin `AuthContext` din `shared/context/AuthContext.tsx`
- Accesat prin `useAuthContext()` direct sau prin `useAuth()` (re-export din modulul auth)
- `app/_layout.tsx` wrapeaza aplicatia cu `<AuthProvider>` si redirecteaza utilizatorii neautentificati la `/login`
- Paginile publice (accesibile fara autentificare): `login`, `register`, `forgot-password`, `privacy-policy`, `terms`, `about`
- Paginile de la care un utilizator autentificat e redirectat: doar `login` si `register`
- Login se face prin **email** (nu username). Register colecteaza: firstName, lastName, email, password (x2), birthDate (optional), phone (optional)

## Sistem de traduceri (i18n)
- Fiecare modul are un folder `i18n/` cu `ro.ts` si `en.ts`
- Textele shared (taburi, butoane comune, paginare) sunt in `shared/i18n/ro.ts` si `en.ts`
- Hook-ul `useTranslation()` din `shared/i18n/index.ts` returneaza traducerile corecte bazat pe limba selectata
- In componente: `const t = useTranslation();` apoi `t.auth.login.title`, `t.shared.common.save`, `t.map.searchPlaceholder` etc.
- **NICIODATA** nu scrie texte hardcodate in romana/engleza direct in componente — foloseste chei de traducere
- Cand adaugi texte noi, adauga-le in AMBELE fisiere (`ro.ts` si `en.ts`) din modulul corespunzator
- Tipul `Translations` e derivat automat din structura `ro.ts` — `en.ts` trebuie sa respecte aceeasi structura

## Guard de navigare (sightings)
- `shared/utils/sightingGuard.ts` — obiect mutable `{ hasProgress, reset }` pentru a intercepta navigarea
- `CreatePOIForm` seteaza `sightingGuard.hasProgress` via `useEffect`
- `AddSightingScreen` inregistreaza `sightingGuard.reset` si intercepteaza back-ul (Android: `BackHandler`, iOS: `navigation.getParent().addListener('beforeRemove', ...)`)
- `CustomTabBar` verifica `sightingGuard.hasProgress` la tap pe alt tab
- Toate cele 3 puncte de interceptare afiseaza acelasi `<ConfirmModal>` cu `confirmDestructive`
