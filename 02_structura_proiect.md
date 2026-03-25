# EcoLocație — Structura Proiectului

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
│   │   └── admin.tsx                       # → admin module → AdminScreen
│   ├── plant/[id].tsx                      # → plants module → PlantDetailScreen
│   ├── login.tsx                           # → auth module → LoginScreen
│   ├── register.tsx                        # → auth module → RegisterScreen
│   └── _layout.tsx
│
├── modules/
│   ├── map/
│   │   ├── components/
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── PlantMarker.tsx
│   │   │   ├── FilterPanel.tsx
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
│   │   │   ├── PhotoCapture.tsx
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
│   └── auth/
│       ├── components/
│       │   └── AuthForm.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── repository/
│       │   └── authRepository.ts
│       ├── screens/
│       │   ├── LoginScreen.tsx
│       │   └── RegisterScreen.tsx
│       ├── styles/
│       │   └── auth.styles.ts
│       ├── types/
│       │   └── auth.types.ts
│       └── index.ts
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── repository/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── data/
│   └── ecolocatie_data.json
│
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
