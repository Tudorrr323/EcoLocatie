# EcoLocație — Structura Proiectului

> **NOTĂ PENTRU CLAUDE/GEMINI:** Actualizează OBLIGATORIU acest fișier ori de câte ori creezi un modul, componentă, hook sau orice resursă nouă semnificativă, pentru a menține documentația sincronizată cu codul.

## ARHITECTURA

Proiectul e organizat pe module. Fiecare modul e o funcționalitate izolată cu propriile componente, hooks, repository, screens, styles și types. Tot ce e reutilizabil între module stă în `shared/`. Fișierele `index.ts` din fiecare modul exportă doar ce trebuie expus, restul rămâne intern.

Regulă: dacă un component, hook, repository, tip sau stil e folosit doar într-un modul, stă în folderul acelui modul. Dacă e folosit de 2+ module, se mută în `shared/`.

## STRUCTURA COMPLETĂ

```
ecolocatie/
├── app/                                    # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx                       # → map module → MapScreen
│   │   ├── encyclopedia.tsx                # → plants module → EncyclopediaScreen
│   │   ├── add-sighting.tsx                # → sightings module → AddSightingScreen
│   │   ├── my-plants.tsx                   # → account module → MyPlantsScreen
│   │   ├── settings.tsx                    # → account module → SettingsScreen [TAB ACTIV]
│   │   ├── account.tsx                     # → account module → AccountScreen [href: null, ascuns]
│   │   └── admin.tsx                       # → admin module → AdminScreen [href: null, ascuns]
│   ├── plant/[id].tsx                      # → plants module → PlantDetailScreen
│   ├── login.tsx                           # → auth module → LoginScreen
│   ├── register.tsx                        # → auth module → RegisterScreen
│   ├── privacy-policy.tsx                  # → auth module → PrivacyPolicyScreen [publica]
│   ├── terms.tsx                           # → auth module → TermsScreen [publica]
│   ├── about.tsx                           # → account module → AboutScreen [publica]
│   ├── forgot-password.tsx                 # → auth module → ForgotPasswordScreen [publica]
│   ├── edit-profile.tsx                    # → account module → EditProfileScreen
│   ├── account-security.tsx                # → account module → AccountSecurityScreen
│   └── _layout.tsx                         # AuthProvider + guard navigare
│
├── modules/
│   ├── map/
│   │   ├── components/
│   │   │   ├── InteractiveMap.tsx          # WebView + Leaflet
│   │   │   ├── PlantMarker.tsx
│   │   │   └── LocationPicker.tsx
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
│   │   └── index.ts
│   │
│   ├── plants/
│   │   ├── components/
│   │   │   ├── PlantCard.tsx
│   │   │   ├── PlantList.tsx
│   │   │   └── PlantSelector.tsx
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
│   │   └── index.ts
│   │
│   ├── sightings/
│   │   ├── components/
│   │   │   ├── CreatePOIForm.tsx
│   │   │   ├── PhotoCapture.tsx            # expo-image-picker integration
│   │   │   ├── CameraScreen.tsx            # expo-camera implementation
│   │   │   ├── AIResultsPreview.tsx
│   │   │   └── POICallout.tsx
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
│   │   └── index.ts
│   │
│   ├── admin/
│   │   ├── components/
│   │   │   ├── UserRow.tsx
│   │   │   └── ModerationCard.tsx
│   │   ├── hooks/
│   │   │   └── useModeration.ts
│   │   ├── repository/
│   │   │   └── adminRepository.ts
│   │   ├── screens/
│   │   │   └── AdminScreen.tsx
│   │   ├── styles/
│   │   │   └── admin.styles.ts
│   │   ├── types/
│   │   │   └── admin.types.ts
│   │   └── index.ts
│   │
│   ├── account/
│   │   ├── screens/
│   │   │   ├── AccountScreen.tsx           # profil simplu (ascuns din navigare)
│   │   │   ├── SettingsScreen.tsx          # tab Setări activ — profil + setări + legal + logout
│   │   │   ├── EditProfileScreen.tsx       # editare profil: avatar, nume, email (readonly), telefon, data nasterii
│   │   │   ├── AccountSecurityScreen.tsx   # cont & securitate: schimba parola, dezactivare cont
│   │   │   └── AboutScreen.tsx             # pagina Despre EcoLocation
│   │   ├── styles/
│   │   │   └── account.styles.ts
│   │   └── index.ts
│   │
│   └── auth/
│       ├── components/
│       │   └── AuthForm.tsx                # formular legacy (nefolosit activ)
│       ├── hooks/
│       │   └── useAuth.ts                  # re-export din shared/context/AuthContext
│       ├── repository/
│       │   └── authRepository.ts           # login prin email, register cu date complete
│       ├── screens/
│       │   ├── LoginScreen.tsx             # design modern, email+parola, loading overlay
│       │   ├── RegisterScreen.tsx          # firstName, lastName, email, parola x2, DatePicker, phone
│       │   ├── ForgotPasswordScreen.tsx    # flow 3 pasi: email, parola noua, succes
│       │   ├── PrivacyPolicyScreen.tsx     # 10 sectiuni GDPR
│       │   └── TermsScreen.tsx             # 13 sectiuni T&C + avertisment medical
│       ├── styles/
│       │   └── auth.styles.ts
│       ├── types/
│       │   └── auth.types.ts               # AuthState, LoginCredentials, RegisterData
│       └── index.ts
│
├── shared/
│   ├── components/                         # Common UI (Button, Input, Badge, DatePickerModal etc.)
│   ├── context/                            # React Context (AuthContext)
│   ├── hooks/                              # Global hooks (useLocation, useLocalStorage, usePagination, useThemeColors)
│   ├── i18n/                               # Traduceri shared + hook useTranslation
│   │   ├── ro.ts                           # Traduceri romana (tabs, common, pagination, etc.)
│   │   ├── en.ts                           # Traduceri engleza
│   │   └── index.ts                        # Hook useTranslation() + merge toate traducerile
│   ├── repository/                         # Centralized data (dataProvider)
│   ├── styles/                             # Theme (colors, fonts, spacing, borderRadius)
│   ├── types/                              # Global interfaces (Plant, User, POI)
│   ├── utils/                              # Helpers (formatDate, coordinates, sightingGuard)
│   └── constants/                          # Global config (GALATI_CENTER)
│
├── assets/
│   └── SmallLogoEcoLocation.png            # Logo aplicatie (folosit in AppHeader, SettingsScreen)
├── data/
│   └── ecolocatie_data.json
├── app.json
├── package.json
└── tsconfig.json
```

## CUM ARATĂ UN MODUL NOU

Când adaugi un modul nou, creezi un folder în `modules/` cu exact aceeași structură. Exemplu pentru un modul ipotetic `notifications`:

```
modules/
└── notifications/
    ├── components/          # componente vizuale specifice modulului
    │   ├── NotificationCard.tsx
    │   └── NotificationBadge.tsx
    ├── hooks/               # logică stateful specifică modulului
    │   └── useNotifications.ts
    ├── repository/          # acces la date, apeluri API, transformări
    │   └── notificationsRepository.ts
    ├── screens/             # ecranele/paginile modulului
    │   └── NotificationsScreen.tsx
    ├── styles/              # stiluri specifice modulului
    │   └── notifications.styles.ts
    ├── types/               # tipuri TypeScript specifice modulului
    │   └── notifications.types.ts
    └── index.ts             # barrel export — expune doar ce folosesc alte module
```

**index.ts** exportă doar interfața publică a modulului. Exemplu:

```typescript
export { NotificationsScreen } from './screens/NotificationsScreen';
export { NotificationBadge } from './components/NotificationBadge';
export type { Notification } from './types/notifications.types';
```

Restul (repository, hooks interne, componente helper) rămân interne — alte module nu le importă direct.

**repository** e singurul loc unde modulul accesează date. Importă de la `shared/repository/dataProvider.ts` și expune funcții specifice modulului. Când vine backend-ul real, se schimbă doar dataProvider, nu repository-urile modulelor.

**hooks** conțin logica stateful specifică modulului. Dacă un hook e necesar în 2+ module, se mută în `shared/hooks/`.

**screens** sunt compuneri de componente — importă din components/ propriu și din shared/components/.

**styles** folosesc tema din `shared/styles/theme.ts` ca bază.

**types** definesc interfețele specifice modulului. Tipurile folosite global (Plant, User, POI) stau în `shared/types/`.
