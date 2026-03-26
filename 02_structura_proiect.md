# EcoLocation — Structura Proiectului

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
│   │   ├── my-plants.tsx                   # → myplants module → MyPlantsScreen
│   │   ├── settings.tsx                    # → settings module → SettingsScreen [TAB ACTIV]
│   │   ├── account.tsx                     # → settings module → AccountScreen [href: null, ascuns]
│   │   └── admin.tsx                       # → admin module → AdminScreen [href: null, ascuns]
│   ├── plant/[id].tsx                      # → plants module → PlantDetailScreen
│   ├── my-plant/[id].tsx                   # → myplants module → MyPlantDetailScreen
│   ├── admin-poi/[id].tsx                  # → admin module → AdminPOIDetailScreen
│   ├── admin-user/[id].tsx                 # → admin module → AdminUserDetailScreen
│   ├── login.tsx                           # → auth module → LoginScreen
│   ├── register.tsx                        # → auth module → RegisterScreen
│   ├── privacy-policy.tsx                  # → auth module → PrivacyPolicyScreen [publica]
│   ├── terms.tsx                           # → auth module → TermsScreen [publica]
│   ├── about.tsx                           # → settings module → AboutScreen [publica]
│   ├── forgot-password.tsx                 # → auth module → ForgotPasswordScreen [publica]
│   ├── edit-profile.tsx                    # → settings module → EditProfileScreen
│   ├── account-security.tsx                # → settings module → AccountSecurityScreen
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
│   │   │   ├── ObservationCard.tsx            # card observație cu navigare la detalii
│   │   │   ├── ModerationCard.tsx
│   │   │   └── StatChart.tsx
│   │   ├── hooks/
│   │   │   └── useModeration.ts
│   │   ├── repository/
│   │   │   └── adminRepository.ts
│   │   ├── screens/
│   │   │   ├── AdminScreen.tsx
│   │   │   ├── AdminPOIDetailScreen.tsx       # detalii observație: hero, tabs, approve/reject, diff editare
│   │   │   └── AdminUserDetailScreen.tsx      # detalii utilizator: profil, info, dezactivare/activare
│   │   ├── styles/
│   │   │   └── admin.styles.ts
│   │   ├── types/
│   │   │   └── admin.types.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── myplants/
│   │   ├── components/
│   │   │   ├── MyPlantCard.tsx             # card orizontal planta (imagine, nume, latin, dot colorat, nr observatii)
│   │   │   ├── HistoryCard.tsx             # card orizontal observatie (imagine POI, nume planta, familie)
│   │   │   └── MyPlantFAB.tsx              # FAB expandabil (adauga observatie, cauta plante)
│   │   ├── hooks/
│   │   │   └── useMyPlants.ts              # state management (tab, plante, istoric, remove)
│   │   ├── repository/
│   │   │   └── myPlantsRepository.ts       # getUserMyPlants, getUserHistory, getMyPlantById
│   │   ├── screens/
│   │   │   ├── MyPlantsScreen.tsx           # ecran principal cu tab-uri Plante/Istoric
│   │   │   └── MyPlantDetailScreen.tsx      # detalii planta cu observatii timeline + info
│   │   ├── styles/
│   │   │   └── myplants.styles.ts
│   │   ├── types/
│   │   │   └── myplants.types.ts           # MyPlant, HistoryGroup, HistoryEntry, MyPlantsTab
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── settings/                            # (fost account)
│   │   ├── screens/
│   │   │   ├── AccountScreen.tsx           # profil simplu (ascuns din navigare)
│   │   │   ├── SettingsScreen.tsx          # tab Setări activ — profil + setări + legal + logout
│   │   │   ├── EditProfileScreen.tsx       # editare profil: avatar, nume, email (readonly), telefon, data nasterii
│   │   │   ├── AccountSecurityScreen.tsx   # cont & securitate: schimba parola, dezactivare cont
│   │   │   └── AboutScreen.tsx             # pagina Despre EcoLocation
│   │   ├── styles/
│   │   │   └── account.styles.ts
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
│   │   └── index.ts
│   │
│   ├── notifications/
│   │   ├── components/
│   │   │   └── NotificationCard.tsx          # card notificare cu icon per tip, titlu, mesaj, timp relativ
│   │   ├── repository/
│   │   │   └── notificationsRepository.ts    # getNotifications, getUnreadCount, markAsRead, markAllAsRead
│   │   ├── styles/
│   │   │   └── notifications.styles.ts
│   │   ├── types/
│   │   │   └── notifications.types.ts        # AppNotification, NotificationType
│   │   ├── i18n/
│   │   │   ├── ro.ts
│   │   │   └── en.ts
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
│   ├── repository/                         # Centralized data (dataProvider — async, API-based)
│   ├── services/                           # HTTP client (apiClient — fetch + JWT auth)
│   ├── styles/                             # Theme (colors, fonts, spacing, borderRadius)
│   ├── types/                              # Global interfaces (Plant, User, POI)
│   ├── utils/                              # Helpers (formatDate, coordinates, sightingGuard)
│   └── constants/                          # Global config (GALATI_CENTER)
│
├── assets/
│   └── SmallLogoEcoLocation.png            # Logo aplicatie (folosit in AppHeader, SettingsScreen)
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

**i18n** conține traducerile specifice modulului în `ro.ts` și `en.ts`. Aplicația este multilanguage — orice text nou vizibil utilizatorului se adaugă aici (sau în `shared/i18n/` dacă e folosit de 2+ module), **obligatoriu în ambele limbi**. Nu se scriu texte hardcodate în componente.

**styles** folosesc tema din `shared/styles/theme.ts` ca bază.

**types** definesc interfețele specifice modulului. Tipurile folosite global (Plant, User, POI) stau în `shared/types/`.
