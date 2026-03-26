# EcoLocation

Aplicatie mobila pentru identificarea si cartografierea plantelor medicinale din judetul Galati.

Realizata in **48 de ore** la **Concursul de Creativitate IT "Severin Bumbaru"** de catre:
- **Baranga Tudor**
- **Craciun Claudiu**

---

## Despre proiect

EcoLocation permite utilizatorilor sa descopere, identifice si cartografieze plantele medicinale din judetul Galati printr-o harta interactiva. Aplicatia combina tehnologia GPS, inteligenta artificiala pentru recunoasterea plantelor si o enciclopedie botanica completa pentru a crea o platforma colaborativa de cunoastere a florei medicinale locale.

### Functionalitati principale

- **Harta interactiva** — vizualizare puncte de interes cu plante medicinale pe harta OpenStreetMap, centrata pe Galati, cu markere colorate per specie, filtre, cautare si geolocalizare GPS
- **Adaugare observatie** — flow in 4 pasi: fotografiere cu camera in-app, identificare AI a plantei (top 3 rezultate cu scor de incredere), alegere locatie GPS sau manual pe harta, comentariu si salvare
- **Enciclopedia plantelor** — catalog complet cu descriere, parti utilizabile, beneficii, contraindicatii, habitat, perioada de recoltare si mod de preparare
- **Plantele mele** — colectia personala cu plantele observate si istoricul tuturor observatiilor, timeline cu detalii si status moderare
- **Panel administrare** — gestionare utilizatori, moderare observatii (aprobare/respingere), statistici
- **Sistem de comentarii** — comentarii cu reply-uri si thread-uri pe fiecare observatie
- **Notificari in-app** — alerte pentru observatii create, aprobate, respinse, editate si comentate
- **Chatbot AI** — asistent conversational RAG pentru intrebari despre plante medicinale
- **Favorite** — salvare plante si observatii favorite
- **Autentificare completa** — login, inregistrare, resetare parola, editare profil, securitate cont
- **Multilanguage** — interfata in romana si engleza
- **Dark mode** — suport complet pentru tema light si dark

---

## Stack tehnic

### Frontend (Mobile)

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| React Native | 0.81.5 | Framework UI mobil cross-platform |
| Expo SDK | 54 | Platform de dezvoltare, build si acces la API-uri native |
| TypeScript | 5.9.2 (strict) | Tipizare statica |
| expo-router | 6.0.23 | Navigare file-based |
| react-native-webview + Leaflet | 13.15.0 | Harta interactiva OpenStreetMap |
| NativeWind (Tailwind CSS) | 4.2.3 | Styling utility-first |
| react-native-reanimated | 4.1.1 | Animatii native performante |
| react-native-gesture-handler | 2.28.0 | Gesturi (swipe, pan, pinch) |
| lucide-react-native | 1.6.0 | Iconite SVG |
| AsyncStorage | 2.2.0 | Persistenta locala |
| expo-camera | 17.0.10 | Camera in-app |
| expo-image-picker | 17.0.10 | Selectie foto din galerie |
| expo-location | 19.0.8 | GPS si permisiuni locatie |
| react-native-svg | 15.12.1 | Randare SVG |
| react-native-safe-area-context | 5.6.0 | Safe area management |
| react-native-screens | 4.16.0 | Navigare nativa optimizata |

### Backend

| Tehnologie | Rol |
|------------|-----|
| Node.js + Express | Server REST API |
| MySQL | Baza de date relationala |
| JWT | Autentificare si autorizare |
| Multer | Upload imagini (JPG/PNG/WebP, max 10MB) |
| Python (CNN / ResNet50 / DenseNet121) | Model AI clasificare plante |
| Ollama + Gemma | Chatbot RAG pentru intrebari despre plante |

---

## Arhitectura

### Principii

- **Modulara** — fiecare functionalitate este izolata in propriul modul cu componente, hooks, repository, screens, styles, types si i18n
- **Shared** — codul reutilizat de 2+ module se afla in `shared/`
- **Repository pattern** — fiecare modul acceseaza datele exclusiv prin propriul repository, care importa din `dataProvider.ts`
- **Context global** — `AuthContext`, `SettingsContext`, `NotificationContext`, `FavoritesContext`, `POIFavoritesContext` gestioneaza starea globala
- **Factory styles** — stilurile sunt functii `createXxxStyles(colors)` pentru suport dark mode dinamic
- **i18n complet** — orice text vizibil trece prin sistemul de traduceri (romana + engleza)

### Flux de date

```
[Backend MySQL + AI]
        |
        | HTTP + JWT
        v
  apiClient.ts ──── fetch wrapper cu token management
        |
        v
  dataProvider.ts ── normalizare response-uri API → tipuri frontend
        |
        v
  module/repository/ ── functii specifice per modul
        |
        v
  module/hooks/ ──── state management + logica
        |
        v
  module/screens/ ── compunere componente modul + shared
```

---

## Structura proiect

```
ecolocatie/
├── app/                                # Expo Router (file-based routing)
│   ├── (tabs)/                         # Tab navigator — 5 tab-uri vizibile
│   │   ├── _layout.tsx                 # Configurare tab bar + CustomTabBar
│   │   ├── index.tsx                   # → MapScreen (Harta)
│   │   ├── encyclopedia.tsx            # → EncyclopediaScreen (Enciclopedie)
│   │   ├── add-sighting.tsx            # → AddSightingScreen (Adauga — buton central teal)
│   │   ├── my-plants.tsx               # → MyPlantsScreen (Plantele mele)
│   │   ├── settings.tsx                # → SettingsScreen (Setari)
│   │   ├── account.tsx                 # → AccountScreen [href: null, ascuns]
│   │   └── admin.tsx                   # → AdminScreen [href: null, ascuns]
│   ├── plant/[id].tsx                  # Detalii planta (enciclopedie)
│   ├── my-plant/[id].tsx               # Detalii planta mea (colectie)
│   ├── admin-poi/[id].tsx              # Admin — detalii observatie
│   ├── admin-user/[id].tsx             # Admin — detalii utilizator
│   ├── notifications.tsx               # Ecran notificari
│   ├── login.tsx                       # Autentificare
│   ├── register.tsx                    # Inregistrare
│   ├── forgot-password.tsx             # Resetare parola (3 pasi)
│   ├── edit-profile.tsx                # Editare profil
│   ├── account-security.tsx            # Securitate cont
│   ├── privacy-policy.tsx              # Politica confidentialitate [publica]
│   ├── terms.tsx                       # Termeni si conditii [publica]
│   ├── about.tsx                       # Despre aplicatie [publica]
│   └── _layout.tsx                     # Root: AuthProvider + guard navigare
│
├── modules/
│   ├── map/                            # Harta interactiva Leaflet/OSM
│   │   ├── components/
│   │   │   ├── InteractiveMap.tsx       # WebView + Leaflet
│   │   │   ├── PlantMarker.tsx          # Marker custom pe harta
│   │   │   ├── LocationPicker.tsx       # Alegere locatie manuala
│   │   │   └── ChatScreen.tsx           # Chatbot AI integrat
│   │   ├── hooks/
│   │   │   └── useMapFilters.ts
│   │   ├── repository/
│   │   │   └── mapRepository.ts
│   │   ├── screens/
│   │   │   └── MapScreen.tsx
│   │   ├── styles/
│   │   │   └── map.styles.ts
│   │   ├── types/
│   │   │   └── map.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── plants/                         # Enciclopedia plantelor
│   │   ├── components/
│   │   │   ├── PlantCard.tsx            # Card planta cu imagine + nume
│   │   │   ├── PlantList.tsx            # FlatList paginata
│   │   │   └── PlantSelector.tsx        # Picker alegere manuala planta
│   │   ├── hooks/
│   │   │   └── usePlantSearch.ts
│   │   ├── repository/
│   │   │   └── plantsRepository.ts
│   │   ├── screens/
│   │   │   ├── EncyclopediaScreen.tsx
│   │   │   └── PlantDetailScreen.tsx
│   │   ├── styles/
│   │   │   └── plants.styles.ts
│   │   ├── types/
│   │   │   └── plants.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── sightings/                      # Flow adaugare observatie (4 pasi)
│   │   ├── components/
│   │   │   ├── CreatePOIForm.tsx        # Formular creare observatie
│   │   │   ├── PhotoCapture.tsx         # expo-image-picker integration
│   │   │   ├── CameraScreen.tsx         # Camera in-app cu viewfinder
│   │   │   ├── AIResultsPreview.tsx     # Top 3 rezultate AI cu confidence
│   │   │   └── POICallout.tsx           # Callout marker pe harta
│   │   ├── hooks/
│   │   │   ├── useImagePicker.ts
│   │   │   └── useMockIdentify.ts
│   │   ├── repository/
│   │   │   └── sightingsRepository.ts
│   │   ├── screens/
│   │   │   └── AddSightingScreen.tsx
│   │   ├── styles/
│   │   │   └── sightings.styles.ts
│   │   ├── types/
│   │   │   └── sightings.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── myplants/                       # Colectia personala + istoric
│   │   ├── components/
│   │   │   ├── MyPlantCard.tsx          # Card planta (imagine, nume, nr observatii)
│   │   │   ├── HistoryCard.tsx          # Card observatie in istoric
│   │   │   └── MyPlantFAB.tsx           # FAB expandabil
│   │   ├── hooks/
│   │   │   └── useMyPlants.ts
│   │   ├── repository/
│   │   │   └── myPlantsRepository.ts
│   │   ├── screens/
│   │   │   ├── MyPlantsScreen.tsx        # Tab-uri Plante / Istoric
│   │   │   └── MyPlantDetailScreen.tsx   # Timeline observatii + info planta
│   │   ├── styles/
│   │   │   └── myplants.styles.ts
│   │   ├── types/
│   │   │   └── myplants.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── admin/                          # Panel administrare
│   │   ├── components/
│   │   │   ├── UserRow.tsx              # Rand utilizator cu switch
│   │   │   ├── ObservationCard.tsx      # Card observatie cu navigare
│   │   │   ├── ModerationCard.tsx       # Card moderare approve/reject
│   │   │   └── StatChart.tsx            # Statistici
│   │   ├── hooks/
│   │   │   └── useModeration.ts
│   │   ├── repository/
│   │   │   └── adminRepository.ts
│   │   ├── screens/
│   │   │   ├── AdminScreen.tsx           # Dashboard admin
│   │   │   ├── AdminPOIDetailScreen.tsx  # Detalii observatie + approve/reject
│   │   │   └── AdminUserDetailScreen.tsx # Detalii utilizator + activare/dezactivare
│   │   ├── styles/
│   │   │   └── admin.styles.ts
│   │   ├── types/
│   │   │   └── admin.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── settings/                       # Setari + profil
│   │   ├── screens/
│   │   │   ├── SettingsScreen.tsx        # Ecran principal setari
│   │   │   ├── EditProfileScreen.tsx     # Editare profil (avatar, nume, telefon, data nasterii)
│   │   │   ├── AccountSecurityScreen.tsx # Schimba parola, dezactivare cont
│   │   │   ├── AboutScreen.tsx           # Despre EcoLocation
│   │   │   └── AccountScreen.tsx         # Profil vechi (ascuns)
│   │   ├── styles/
│   │   │   └── account.styles.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── notifications/                  # Notificari in-app
│   │   ├── components/
│   │   │   └── NotificationCard.tsx     # Card notificare cu icon per tip
│   │   ├── repository/
│   │   │   └── notificationsRepository.ts
│   │   ├── screens/
│   │   │   └── NotificationsScreen.tsx  # Lista notificari
│   │   ├── styles/
│   │   │   └── notifications.styles.ts
│   │   ├── types/
│   │   │   └── notifications.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   └── auth/                           # Autentificare
│       ├── components/
│       │   └── AuthForm.tsx             # Formular legacy
│       ├── hooks/
│       │   └── useAuth.ts              # Re-export din AuthContext
│       ├── repository/
│       │   └── authRepository.ts       # Login, register, forgot password
│       ├── screens/
│       │   ├── LoginScreen.tsx          # Email + parola + loading overlay
│       │   ├── RegisterScreen.tsx       # Inregistrare cu validare completa
│       │   ├── ForgotPasswordScreen.tsx # Flow 3 pasi
│       │   ├── PrivacyPolicyScreen.tsx  # 10 sectiuni GDPR
│       │   └── TermsScreen.tsx          # 13 sectiuni T&C
│       ├── styles/
│       │   └── auth.styles.ts
│       ├── types/
│       │   └── auth.types.ts
│       ├── i18n/
│       │   ├── ro.ts
│       │   └── en.ts
│       └── index.ts
│
├── shared/                             # Cod partajat intre module
│   ├── components/
│   │   ├── AppHeader.tsx                # Header brand (logo + titlu + notificari)
│   │   ├── Button.tsx                   # primary / secondary / danger / ghost + loading
│   │   ├── Input.tsx                    # Text input cu validare
│   │   ├── Card.tsx                     # Container cu shadow
│   │   ├── Badge.tsx                    # Eticheta colorata
│   │   ├── SearchBar.tsx                # Cautare cu debounce + forwardRef
│   │   ├── Pagination.tsx               # Paginare + selector dimensiune pagina
│   │   ├── ConfirmModal.tsx             # Dialog confirmare animat
│   │   ├── DatePickerModal.tsx          # Calendar picker
│   │   ├── PlantFilterPanel.tsx         # Filtre plante (harta + enciclopedie)
│   │   ├── CustomTabBar.tsx             # Tab bar custom (5 tab-uri)
│   │   ├── CommentSection.tsx           # Comentarii cu reply-uri si thread-uri
│   │   ├── SwipeableBottomSheet.tsx     # Bottom sheet cu gesturi
│   │   ├── BottomPanel.tsx              # Panel inferior
│   │   ├── FullScreenPanel.tsx          # Modal full-screen cu slide
│   │   ├── HorizontalTabs.tsx           # Tab-uri orizontale
│   │   ├── ImageViewer.tsx              # Zoom / pinch pe imagini
│   │   ├── LoadingSpinner.tsx           # Indicator incarcare
│   │   ├── EmptyState.tsx               # Placeholder lista goala
│   │   ├── FilterButton.tsx             # Buton deschidere filtre
│   │   ├── NotificationButton.tsx       # Bell + badge necitite
│   │   ├── FavoriteButton.tsx           # Buton toggle favorit
│   │   ├── LanguageSwitcher.tsx         # Selector limba ro/en
│   │   ├── Snackbar.tsx                 # Toast / snackbar mesaje
│   │   └── TranslatableText.tsx         # Text cu traducere automata
│   │
│   ├── context/
│   │   ├── AuthContext.tsx              # Autentificare globala (user, login, register, logout)
│   │   ├── SettingsContext.tsx           # Limba (ro/en) + tema (light/dark/system)
│   │   ├── NotificationContext.tsx       # Polling 30s + unread count
│   │   ├── FavoritesContext.tsx          # Favorite plante
│   │   └── POIFavoritesContext.tsx       # Favorite observatii
│   │
│   ├── hooks/
│   │   ├── useLocation.ts              # GPS (expo-location)
│   │   ├── useLocalStorage.ts          # AsyncStorage wrapper
│   │   ├── usePagination.ts            # Paginare generica
│   │   ├── useFavorites.ts             # Hook favorite
│   │   └── useThemeColors.ts           # Culori dark mode
│   │
│   ├── services/
│   │   ├── apiClient.ts                # HTTP client: GET/POST/PUT/DELETE/Upload + JWT
│   │   └── favoritesService.ts         # Serviciu favorite API
│   │
│   ├── repository/
│   │   ├── dataProvider.ts             # Punct unic acces date + normalizare API
│   │   └── commentsRepository.ts       # CRUD comentarii
│   │
│   ├── styles/
│   │   ├── theme.ts                    # Culori (light + dark), fonts, spacing, borderRadius
│   │   └── common.styles.ts            # Stiluri reutilizabile
│   │
│   ├── types/
│   │   ├── plant.types.ts              # Plant, PointOfInterest, Comment, User, POIStatus
│   │   └── api.types.ts                # ApiResponse, PaginatedResponse
│   │
│   ├── utils/
│   │   ├── formatDate.ts               # Formatare data
│   │   ├── coordinates.ts              # Calcule distanta GPS (Haversine)
│   │   ├── removeDiacritics.ts         # Normalizare text cautare
│   │   ├── sightingGuard.ts            # Guard navigare singleton
│   │   └── favoriteTarget.ts           # Utilitare target favorit
│   │
│   ├── constants/
│   │   └── config.ts                   # GALATI_CENTER, DEFAULT_ZOOM, API_BASE_URL
│   │
│   └── i18n/                           # Traduceri globale
│       ├── ro.ts                       # Romana (structura master)
│       ├── en.ts                       # Engleza
│       └── index.ts                    # useTranslation() hook
│
├── assets/
│   ├── LogoEcoLocation.png             # Logo aplicatie
│   ├── SmallLogoEcoLocation.png        # Logo mic (header, splash)
│   ├── icon.png                        # Icon app
│   ├── splash-icon.png                 # Splash screen
│   ├── favicon.png                     # Favicon web
│   ├── android-icon-background.png     # Android adaptive icon
│   ├── android-icon-foreground.png
│   └── android-icon-monochrome.png
│
├── app.json                            # Configurare Expo
├── package.json                        # Dependente
├── tsconfig.json                       # TypeScript config (strict, path aliases)
└── .gitignore
```

---

## API Backend — 9 grupuri de rute

| Grup | Prefix | Descriere |
|------|--------|-----------|
| Auth | `/api/auth` | Register, login, profil, parola, dezactivare, avatar |
| Plants | `/api/plants` | CRUD plante, cautare, sortare, suport `?lang=ro\|en` |
| POIs | `/api/pois` | CRUD observatii, filtrare GPS (Haversine), moderare, notificari automate |
| Comments | `/api/pois/:id/comments` | Comentarii cu reply-uri (parent_id), notificari |
| AI | `/api/identify`, `/api/chat` | Identificare planta din imagine, chatbot RAG |
| Admin | `/api/admin` | Utilizatori, pending POIs, statistici, config harta, model AI |
| Config | `/api/config/map` | Setari harta publice (centru, zoom, bounds) |
| Notifications | `/api/notifications` | Lista, unread count, marcare ca citite |
| Favorites | `/api/favorites` | Toggle favorite pe plante |

---

## Rulare

```bash
# Instalare dependente
npm install

# Start development server
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

### Cerinte

- Node.js 18+
- Expo CLI
- Expo Go pe telefon (pentru testare rapida) sau emulator Android/iOS
- Backend-ul rulat separat (Node.js + MySQL)

---

## Coordonate Galati

| Locatie | Latitudine | Longitudine |
|---------|-----------|-------------|
| Centru oras | 45.4353 | 28.0080 |
| Gradina Publica | 45.4400 | 28.0200 |
| Padurea Garboavele | 45.4833 | 28.0667 |
| Faleza Dunarii | 45.4200 | 28.0300 |
| Parcul Eminescu | 45.4390 | 28.0100 |
| Lacul Brates | 45.3900 | 28.0500 |

---

**Concursul de Creativitate IT "Severin Bumbaru" — 48 de ore — Baranga Tudor & Craciun Claudiu**
