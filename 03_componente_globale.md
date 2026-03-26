# EcoLocation — Componente și Resurse Globale (shared/)

> **NOTĂ PENTRU CLAUDE/GEMINI:** Actualizează OBLIGATORIU acest fișier ori de câte ori creezi un modul, componentă, hook sau orice resursă nouă semnificativă, pentru a menține documentația sincronizată cu codul.

## CE E SHARED

Folderul `shared/` conține tot ce e reutilizat de 2 sau mai multe module. Niciun modul nu importă direct din alt modul — dacă ceva trebuie partajat, trece prin shared.

## COMPONENTE (shared/components/)

**Button.tsx** — buton reutilizabil cu variante: primary, secondary, danger, ghost. Acceptă props pentru loading state (arată spinner), disabled, icon opțional din lucide. Folosit peste tot: formulare, admin, harta.

**Input.tsx** — câmp text cu label, placeholder, validare vizuală (border roșu pe eroare), mesaj de eroare. Suportă multiline pentru comentarii. Folosit în auth, creare POI, search.

**Card.tsx** — container cu shadow, border radius, padding. Baza vizuală pentru PlantCard, ModerationCard, NotificationCard. Acceptă onPress pentru navigare.

**Badge.tsx** — etichetă mică colorată cu text. Folosit pentru status (aprobat/pending), rol (admin/user), familie plantă.

**LoadingSpinner.tsx** — indicator de încărcare centrat. Folosit în orice ecran care așteaptă date.

**EmptyState.tsx** — placeholder cu icon și mesaj când o listă e goală. Exemplu: "Nu sunt observații în această zonă".

**SearchBar.tsx** — input de căutare cu icon lupă, clear button, debounce integrat și suport pentru control extern via `forwardRef`.

**SwipeableBottomSheet.tsx** — panou glisant de jos în sus, suportă gesturi de swipe. Înlocuiește vechiul `BottomSheet`.

**FullScreenPanel.tsx** — modal/ecran care acoperă tot viewport-ul cu overlay fade + slide de jos. Înlocuiește vechiul `Modal.tsx`. **IMPORTANT:** `slideAnim` folosește intentionat `useNativeDriver: false` — cu `true`, zona de touch urmareste animatia vizuala (porneste off-screen) si primul tap este ratat. Nu schimba la `true`. Interactivitatea e controlata prin `pointerEvents` (nu prin `null` return) pentru a evita problema de first-mount in React Native.

**HorizontalTabs.tsx** — sistem de tab-uri orizontale pentru filtrare sau categorisire conținut.

**ImageViewer.tsx** — componentă pentru vizualizarea imaginilor la dimensiune completă cu suport pentru zoom/pinch.

**Pagination.tsx** — control pentru navigarea între pagini de rezultate. Afișează mereu (nu dispare când e o singură pagină). Layout pe 3 coloane: spațiu gol stânga, navigare pagini centrat, buton selector dimensiune pagină dreapta. Butonul de dimensiune (10/25/50 elemente/pagină) deschide un `ConfirmModal` cu lista opțiunilor și bifă pe opțiunea activă. Props: `currentPage`, `totalPages`, `onPageChange`, `pageSize?`, `onPageSizeChange?` — selectorul apare doar când ambele sunt furnizate.

**AppHeader.tsx** — header-ul brand comun al aplicatiei. Afiseaza logo-ul (`SmallLogoEcoLocation.png`), textul "EcoLocation" (verde+teal) si un slot optional `rightContent` pentru actiuni dreapta (implicit `NotificationButton`). Folosit in MapScreen, EncyclopediaScreen, AddSightingScreen. **Nu se foloseste** in SettingsScreen (care are propriul header simplu cu logo + titlu).

**ConfirmModal.tsx** — dialog de confirmare reutilizabil, modern, cu animatie overlay fade + card spring scale (0.88→1). Props: `visible`, `title`, `message?`, `confirmLabel?`, `cancelLabel?`, `confirmDestructive?` (buton roșu), `icon?` (ReactNode deasupra titlului), `children?` (ReactNode între mesaj și butoane — folosit pentru liste de opțiuni), `onConfirm?` (opțional — dacă lipsește, apare un singur buton de închidere full-width), `onCancel`. Tap pe overlay = cancel.

**DatePickerModal.tsx** — selector de dată din calendar. Modal cu grid lunar, navigare lună/an (săgeți), evidențiere zi azi (border verde) și zi selectată (fundal verde). Props: `visible`, `value?: Date`, `onConfirm(date: Date)`, `onCancel`, `maxDate?`, `minDate?`. Tap pe overlay = anulare. Se resetează la luna corectă la fiecare deschidere. Folosit în RegisterScreen pentru data nașterii. **Întotdeauna folosește această componentă pentru input date — nu TextInput.**

**PlantFilterPanel.tsx** — panou de filtrare plante comun, folosit pe hartă și în enciclopedie. Props: `visible`, `allPlants`, `selectedPlantIds: number[]`, `onApply: (ids: number[]) => void`, `onClose`. Prima opțiune "Toate plantele" selectează tot (`ids=[]`); tap pe o plantă individuală o selectează exclusiv.

**CustomTabBar.tsx** — bara de navigare inferioară personalizată. Tab-uri: Hartă (`Home`), Enciclopedie (`HeartPulse`), Adaugă (`Camera` — buton circular teal ridicat), Plantele mele (`Flower2`), Setări (`Settings`). Interceptează navigarea de pe `add-sighting` dacă `sightingGuard.hasProgress` și afișează `ConfirmModal` de confirmare. Tab-urile `account` și `admin` sunt absente din `TAB_CONFIG` (ascunse).

**CommentSection.tsx** — sectiune completa de comentarii reutilizabila. Props: `poiId` (obligatoriu), `compact?` (pentru integrare in spatii mici). Functionalitati: lista comentarii cu avatar + username + timp relativ, input comentariu nou, reply la comentariu (cu indicator vizual si linie de conectare), stergere comentariu (autor sau admin cu `ConfirmModal`), paginare (buton "Incarca mai multe"), thread-uri (parent_id — raspunsuri apar indentate sub comentariul parinte cu linie verticala). Foloseste `commentsRepository` pentru API calls. Integrata in MapScreen (tab Comentarii) si MyPlantDetailScreen (sub fiecare observatie).

**FilterButton.tsx** — buton specializat pentru deschiderea panoului de filtre.

**NotificationButton.tsx** — buton Bell cu badge roșu care afișează numărul de notificări necitite. La apăsare deschide modal full-screen cu lista notificărilor (FlatList de `NotificationCard`). Header-ul modal-ului conține titlu, buton „Marchează toate ca citite" (vizibil doar când există necitite) și buton close. Folosește `useNotifications()` din `NotificationContext` pentru stare și acțiuni. Empty state cu `BellOff` când nu există notificări.

## CONTEXT (shared/context/)

**SettingsContext.tsx** — context global pentru preferintele aplicatiei. Gestioneaza limba (`ro`/`en`) si tema (`light`/`dark`/`system`) cu persistare in AsyncStorage. Expune `language`, `themePreference`, `resolvedTheme` (tema efectiva dupa rezolvarea 'system'), `setLanguage()`, `setThemePreference()`. Wrapat in `app/_layout.tsx` prin `<SettingsProvider>`. Accesat prin `useSettings()`.

**AuthContext.tsx** — context global pentru starea de autentificare. Oferă `user`, `loading`, `isAuthenticated`, `isAdmin`, `login(email, password)`, `register(data: RegisterData)`, `logout()`, `updateUser(updates: Partial<User>)`. Wrapat în `app/_layout.tsx` prin `<AuthProvider>`. Accesat prin `useAuthContext()` direct sau prin `useAuth()` din `modules/auth/hooks/useAuth.ts` (re-export pentru compatibilitate cu componentele existente). **Nu crea instanțe locale de useAuth în afara contextului** — starea de auth e globală și unică.

**NotificationContext.tsx** — context global pentru notificările in-app. Polling automat la 30s pentru `unreadCount` + refresh la revenirea din background (`AppState`). Oferă `notifications`, `unreadCount`, `loading`, `fetchNotifications()` (fetch complet lista), `markAsRead(id)`, `markAllAsRead()`, `refreshUnreadCount()`. Wrapat în `app/_layout.tsx` prin `<NotificationProvider>` (între `AuthProvider` și `RootLayoutNav`). Accesat prin `useNotifications()`. Se resetează automat la logout (când `isAuthenticated` devine false).

## HOOKS (shared/hooks/)

**useLocation.ts** — wrapper peste expo-location. Cere permisiuni, preia locația curentă și suportă monitorizarea în timp real (`watching`). Returnează `{ location, error, loading, getLocation, startWatching, watching }`.

**useLocalStorage.ts** — wrapper peste AsyncStorage. Get/set/remove cu serializare JSON automată. Folosit pentru persistarea sesiunii de auth și a datelor locale.

**usePagination.ts** — hook generic reutilizabil pentru orice listă paginată. Acceptă `items: T[]` și `initialPageSize = 10`. Returnează `{ currentPage, pageSize, totalPages, paginatedItems, onPageChange, onPageSizeChange }`. Resetează automat la pagina 1 când referința listei `items` se schimbă (detecție prin `useRef`). Folosit în `EncyclopediaScreen` și `PlantSelector`.

## SERVICES (shared/services/)

**apiClient.ts** — HTTP client pentru comunicarea cu backend-ul. Funcții: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`, `apiUpload()` (FormData). Gestionează automat token-ul JWT (salvat în AsyncStorage) și header-ul `Authorization`. `apiRequest()` e core-ul — face fetch cu error handling.

## REPOSITORY (shared/repository/)

**dataProvider.ts** — punctul unic de acces la date. Folosește `apiClient` pentru a comunica cu API-ul backend. Funcții async: `getPlants()`, `getPlantById()`, `getPOIs()`, `getApprovedPOIs()`, `getPendingPOIs()`, `getPOIById()`, `getConfig()`. Normalizează response-urile API (tabele relaționale → obiecte flat): `ApiPlant` → `Plant`, `ApiPOI` → `PointOfInterest` (include `comment_count`). Fiecare repository de modul importă de aici.

**commentsRepository.ts** — acces la comentariile observațiilor via API. Funcții: `getComments(poiId, page?, limit?)` (listare paginată cu tree-building pentru replies), `addComment(poiId, content, parentId?)` (adaugare comentariu sau reply), `deleteComment(commentId)` (ștergere — owner sau admin). Folosit de `CommentSection`.

## STYLES (shared/styles/)

**theme.ts** — definește culorile aplicației, fonturile, spacing-ul și border radius-ul. Culori disponibile:
- `primary` (#6AAE35), `primaryLight`, `primaryDark` — verde principal
- `secondary` (#FF8F00), `secondaryLight` — portocaliu accent
- `background` (#F5F5F5) — fundal gri deschis pentru scroll content
- `surface` (#FFFFFF) — fundal alb pentru carduri și ecrane
- `text`, `textSecondary`, `textLight` — variante text
- `error`, `success`, `warning` — stări
- `border` — borduri subtile
- `overlay` — fundal semi-transparent pentru modale
- `logoGreen`, `logoTeal` — culorile din logo
- `tabActive` — culoarea tab-ului activ în bara de navigare
- `black`, `flashTorch` — uz specific
- `filterDotBorder` — bordura punctelor colorate din filter panel
- `errorBackground` (#FFEBEE) — fundal roșu deschis pentru mesaje de eroare
- `placeholderText` (#BDBDBD) — culoarea placeholder-elor din TextInput
- `notificationBadge` (#EF4444) — fundal badge notificări necitite
- `notificationUnread` (#F0F7EB light / #1A2E14 dark) — fundal card notificare necitită

**Orice culoare nouă se adaugă OBLIGATORIU în theme.ts ca variabilă — nu se scriu culori hardcodate în stiluri.**

**common.styles.ts** — stiluri reutilizabile: containere centrate, rânduri cu spațiere egală, shadow standard.

## TYPES (shared/types/)

**plant.types.ts** — tipurile globale:
- `POIStatus` — type alias: `'pending' | 'approved' | 'rejected'`
- `Plant` — plantă medicinală completă (include `name_en`, `images[]`)
- `PointOfInterest` — observație pe hartă (folosește `status: POIStatus`, include `address?`, `images?[]`, `comment_count?`)
- `Comment` — comentariu pe o observație (`id`, `user_id`, `poi_id`, `content`, `username`, `profile_image?`, `parent_id?`, `replies?`, `created_at`)
- `User` — utilizator cu câmpuri: `id`, `username`, `email`, `password?`, `role`, `created_at`, `is_active`, `first_name?`, `last_name?`, `phone?`, `birth_date?`, `profile_image?`
- `MapConfig`, `EcoLocationData`

**api.types.ts** — tipuri pentru viitoarele response-uri API (ApiResponse, PaginatedResponse).

## AUTH TYPES (modules/auth/types/auth.types.ts)

- `AuthState` — `{ user, isAuthenticated, isAdmin }`
- `LoginCredentials` — `{ email, password }`
- `RegisterData` — `{ firstName, lastName, email, password, phone?, birthDate? }`

## I18N (shared/i18n/) — MULTILANGUAGE

Aplicația suportă română și engleză. Folderul `shared/i18n/` conține traducerile globale (taburi, butoane comune, paginare, mesaje shared). Fiecare modul are propriul folder `i18n/` cu `ro.ts` și `en.ts` pentru textele specifice.

**Regulă obligatorie:** Orice text nou vizibil utilizatorului (label, placeholder, titlu, mesaj, buton etc.) se adaugă **OBLIGATORIU** în fișierele de traduceri — nu se scrie hardcodat în componente. Dacă textul e specific unui modul → `modules/<modul>/i18n/ro.ts` + `en.ts`. Dacă e folosit de 2+ module → `shared/i18n/ro.ts` + `en.ts`. Adaugă **întotdeauna în ambele limbi**.

**ro.ts** — traducerile în română (structura master — tipul `Translations` se derivă din ea)
**en.ts** — traducerile în engleză (trebuie să respecte exact aceeași structură ca `ro.ts`)
**index.ts** — hook-ul `useTranslation()` care returnează traducerile corecte bazat pe limba selectată + funcția de merge a traducerilor din toate modulele

## UTILS (shared/utils/)

**formatDate.ts** — funcție care primește ISO string și returnează dată formatată în română.

**coordinates.ts** — funcții helper: distanceBetween(coord1, coord2), isInsideBounds(coord, bounds).

**removeDiacritics.ts** — utilitar pentru normalizarea textului în căutări.

**sightingGuard.ts** — obiect mutable singleton `{ hasProgress: boolean, reset: () => void }` pentru coordonarea guard-ului de navigare al flow-ului de creare observație. `CreatePOIForm` setează `hasProgress` via `useEffect`; `AddSightingScreen` înregistrează funcția `reset`; `CustomTabBar` verifică `hasProgress` la tap pe alt tab. Evită React Context pentru că guard-ul trebuie verificat în afara arborelui React (CustomTabBar).

## CONSTANTS (shared/constants/)

**config.ts** — constante globale: GALATI_CENTER, DEFAULT_ZOOM, MAX_ZOOM, MAP_BOUNDS, API_BASE_URL.
