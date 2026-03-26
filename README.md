# EcoLocation — Brief Frontend (Aplicație Mobilă)

## CE E PROIECTUL

Aplicație mobilă pentru identificarea și cartografierea plantelor medicinale din județul Galați. Un coleg se ocupă de backend și AI — tu faci doar frontend-ul mobil cu date mockup din JSON.

Aplicația are 4 module: hartă interactivă cu puncte de interes, flow de creare observație (cameră, identificare plantă, locație GPS, comentariu), enciclopedie cu toate plantele, și administrare.

## STACK TEHNIC

React Native + Expo (SDK 51) pentru development rapid și testare pe telefon cu Expo Go. react-native-maps pentru hartă (Google Maps pe Android, Apple Maps pe iOS). expo-location pentru GPS. expo-image-picker pentru cameră și galerie. expo-router pentru navigare. nativewind (Tailwind pentru RN) pentru styling.

## SURSA DE DATE

Fișierul `ecolocatie_data.json` atașat conține tot: `plants` (20 plante medicinale complete), `users` (5 utilizatori mockup), `points_of_interest` (16 observații demo pe harta Galațiului), `config` (centru hartă, zoom defaults, limite Galați). Se importă direct din JSON, când backend-ul e gata se înlocuiește cu fetch-uri API.

## STRUCTURA PROIECT

```
ecolocatie/
├── app/                                    # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx                       # → MapScreen
│   │   ├── encyclopedia.tsx                # → PlantListScreen
│   │   ├── add-sighting.tsx                # → CreateSightingScreen
│   │   └── admin.tsx                       # → AdminDashboardScreen
│   ├── plant/[id].tsx                      # → PlantDetailScreen
│   ├── login.tsx
│   ├── register.tsx
│   └── _layout.tsx
│
├── modules/
│   ├── map/                                # MODUL HARTĂ
│   │   ├── screens/
│   │   │   └── MapScreen.tsx
│   │   ├── components/
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── PlantMarker.tsx
│   │   │   ├── POICallout.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── LocationPicker.tsx
│   │   ├── hooks/
│   │   │   └── useMapFilters.ts
│   │   ├── repository/
│   │   │   └── poiRepository.ts
│   │   ├── styles/
│   │   │   └── map.styles.ts
│   │   └── types/
│   │       └── map.types.ts
│   │
│   ├── plants/                             # MODUL ENCICLOPEDIE
│   │   ├── screens/
│   │   │   ├── PlantListScreen.tsx
│   │   │   └── PlantDetailScreen.tsx
│   │   ├── components/
│   │   │   ├── PlantCard.tsx
│   │   │   ├── PlantGrid.tsx
│   │   │   └── PlantSearchBar.tsx
│   │   ├── hooks/
│   │   │   └── usePlantSearch.ts
│   │   ├── repository/
│   │   │   └── plantRepository.ts
│   │   ├── styles/
│   │   │   └── plants.styles.ts
│   │   └── types/
│   │       └── plants.types.ts
│   │
│   ├── sighting/                           # MODUL CREARE OBSERVAȚIE
│   │   ├── screens/
│   │   │   └── CreateSightingScreen.tsx
│   │   ├── components/
│   │   │   ├── PhotoPicker.tsx
│   │   │   ├── AIResultCard.tsx
│   │   │   ├── PlantSelector.tsx
│   │   │   ├── CommentInput.tsx
│   │   │   └── SightingSummary.tsx
│   │   ├── hooks/
│   │   │   └── useMockIdentify.ts
│   │   ├── repository/
│   │   │   └── sightingRepository.ts
│   │   ├── styles/
│   │   │   └── sighting.styles.ts
│   │   └── types/
│   │       └── sighting.types.ts
│   │
│   ├── admin/                              # MODUL ADMIN
│   │   ├── screens/
│   │   │   └── AdminDashboardScreen.tsx
│   │   ├── components/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserRow.tsx
│   │   │   ├── ModerationList.tsx
│   │   │   ├── ModerationCard.tsx
│   │   │   └── StatsBar.tsx
│   │   ├── hooks/
│   │   │   └── useModeration.ts
│   │   ├── repository/
│   │   │   └── adminRepository.ts
│   │   ├── styles/
│   │   │   └── admin.styles.ts
│   │   └── types/
│   │       └── admin.types.ts
│   │
│   └── auth/                               # MODUL AUTH
│       ├── screens/
│       │   ├── LoginScreen.tsx
│       │   └── RegisterScreen.tsx
│       ├── components/
│       │   └── AuthForm.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── repository/
│       │   └── authRepository.ts
│       ├── styles/
│       │   └── auth.styles.ts
│       └── types/
│           └── auth.types.ts
│
├── shared/                                 # COMPONENTE ȘI LOGICĂ REUTILIZABILĂ
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useLocation.ts                 # GPS hook (folosit de map + sighting)
│   │   └── useLocalData.ts                # CRUD pe JSON mock (folosit de toate modulele)
│   ├── repository/
│   │   └── baseRepository.ts              # Logică comună citire/scriere JSON
│   ├── styles/
│   │   ├── theme.ts                       # Culori, fonturi, spacing
│   │   └── common.styles.ts
│   ├── types/
│   │   └── common.types.ts                # User, Plant, POI — tipuri folosite cross-module
│   └── utils/
│       ├── formatDate.ts
│       └── mockAI.ts                      # Generare mock AI results
│
├── data/
│   └── ecolocatie_data.json
├── assets/
│   └── icons/
├── app.json
├── package.json
└── tsconfig.json
```

Regula: dacă o componentă, un hook sau un tip e folosit doar într-un singur modul, stă în folderul acelui modul. Dacă e folosit de 2+ module, se mută în `shared/`. Zero duplicate.

## FUNCȚIONALITĂȚI

### Harta Interactivă (modulul map)

MapView din react-native-maps centrată pe Galați [45.4353, 28.0080]. Markere custom colorate per tip de plantă (din `icon_color` în JSON). Callout la tap pe marker cu numele plantei, poza, comentariul userului și confidence-ul AI. Buton "Locația mea" care apelează hook-ul shared `useLocation` și face animateToRegion(). Panou de filtre (bottom sheet sau modal) cu toggle-uri per plantă sau familie care arată/ascunde markerele. Buton de recentrare pe Galați. Pinch to zoom și pan sunt native în MapView.

### Creare Observație (modulul sighting)

User apasă tab-ul "Adaugă" → PhotoPicker deschide camera cu expo-image-picker launchCameraAsync() sau galeria cu launchImageLibraryAsync() → mock identificare AI (din shared/utils/mockAI.ts) arată top 3 rezultate cu confidence → dacă AI "greșește", PlantSelector permite alegere manuală → locația se preia automat prin shared useLocation SAU user apasă lung pe hartă în LocationPicker → CommentInput pentru text → SightingSummary ca review → salvare în state-ul local → apare pe hartă instant.

### GPS / Geolocație (shared hook)

Hook `useLocation` în shared/hooks care wrappează expo-location: cere permisiuni cu requestForegroundPermissionsAsync(), preia locația cu getCurrentPositionAsync({ accuracy: LocationAccuracy.High }). Returnează { location, error, loading, getLocation }. Folosit atât de modulul map cât și de modulul sighting. Fallback: long press pe hartă, coordonate din event.nativeEvent.coordinate.

### Enciclopedia Plantelor (modulul plants)

Tab dedicat cu FlatList de PlantCard-uri, câte un card per plantă din JSON. Imagine + nume pe card. La tap se navighează la PlantDetailScreen plant/[id] cu toate informațiile: descriere, părți utilizabile, beneficii, contraindicații, habitat, perioadă recoltare, mod de preparare. PlantSearchBar în header pentru filtrare după nume.

### Admin Panel (modulul admin)

Tab vizibil doar dacă user.role === 'admin' (mock auth din modulul auth). UserTable cu UserRow-uri și switch toggle active/inactive. ModerationList cu ModerationCard-uri pentru observațiile cu is_approved: false și butoane Approve/Reject. StatsBar cu total useri, total observații, pending moderation.

## COORDONATE GALAȚI

Centru oraș [45.4353, 28.0080], Grădina Publică [45.4400, 28.0200], Pădurea Gârboavele [45.4833, 28.0667], Faleza Dunării [45.4200, 28.0300], Parcul Eminescu [45.4390, 28.0100], Lacul Brateș [45.3900, 28.0500].

## NOTE

Toate datele sunt în `ecolocatie_data.json` — importă-l și folosește-l ca state inițial. Când backend-ul e gata, înlocuiești repository-urile mock cu fetch-uri API reale (fiecare modul își are propriul repository, deci schimbi doar acolo). Nu pierde timp pe auth reală — mock cu AsyncStorage e suficient. Testează pe telefon real cu Expo Go. Harta e partea cea mai importantă a aplicației.