# EcoLocație — Componente și Resurse Globale (shared/)

## CE E SHARED

Folderul `shared/` conține tot ce e reutilizat de 2 sau mai multe module. Niciun modul nu importă direct din alt modul — dacă ceva trebuie partajat, trece prin shared.

## COMPONENTE (shared/components/)

**Button.tsx** — buton reutilizabil cu variante: primary, secondary, danger, ghost. Acceptă props pentru loading state (arată spinner), disabled, icon opțional din lucide. Folosit peste tot: formulare, admin, harta.

**Input.tsx** — câmp text cu label, placeholder, validare vizuală (border roșu pe eroare), mesaj de eroare. Suportă multiline pentru comentarii. Folosit în auth, creare POI, search.

**Modal.tsx** — modal full-screen sau half-sheet. Overlay semi-transparent, buton close, conținut scrollabil. Folosit pentru detalii plantă, confirmare acțiuni admin.

**Card.tsx** — container cu shadow, border radius, padding. Baza vizuală pentru PlantCard, ModerationCard, NotificationCard. Acceptă onPress pentru navigare.

**Badge.tsx** — etichetă mică colorată cu text. Folosit pentru status (aprobat/pending), rol (admin/user), familie plantă.

**LoadingSpinner.tsx** — indicator de încărcare centrat. Folosit în orice ecran care așteaptă date.

**EmptyState.tsx** — placeholder cu icon și mesaj când o listă e goală. Exemplu: "Nu sunt observații în această zonă".

**SearchBar.tsx** — input de căutare cu icon lupă, clear button, debounce integrat. Folosit în enciclopedie și filtre hartă.

**BottomSheet.tsx** — panou glisant de jos în sus. Folosit pentru FilterPanel pe hartă și detalii rapide.

## HOOKS (shared/hooks/)

**useLocation.ts** — wrapper peste expo-location. Cere permisiuni cu requestForegroundPermissionsAsync(), preia locația cu getCurrentPositionAsync({ accuracy: High }). Returnează `{ location, error, loading, getLocation }`. Folosit de modulul map (buton "Locația mea") și de modulul sightings (locație automată la creare POI).

**useLocalStorage.ts** — wrapper peste AsyncStorage. Get/set/remove cu serializare JSON automată. Folosit de auth (salvare token/user) și de orice modul care persistă state local.

## REPOSITORY (shared/repository/)

**dataProvider.ts** — punctul unic de acces la date. Importă `ecolocatie_data.json` și expune funcții: getPlants(), getUsers(), getPOIs(), getConfig(). Fiecare repository de modul (mapRepository, plantsRepository etc.) importă de aici. Când vine backend-ul real, se schimbă DOAR acest fișier de la import static la fetch/axios — niciun alt fișier nu se atinge.

## STYLES (shared/styles/)

**theme.ts** — definește culorile aplicației (primary, secondary, background, surface, text, error, success), fonturile (regular, medium, bold cu mărimile sm, md, lg, xl), spacing (xs=4, sm=8, md=16, lg=24, xl=32), border radius. Toate stilurile din module importă valorile de aici ca să fie consistente.

**common.styles.ts** — stiluri reutilizabile: container centrat, row cu space-between, shadow standard, separator linie. Evită duplicarea în stilurile modulelor.

## TYPES (shared/types/)

**plant.types.ts** — tipurile globale: interfața Plant (id, name_ro, name_latin, family, description, parts_used, benefits, contraindications, habitat, harvest_period, preparation, image_url, icon_color), interfața POI (id, user_id, plant_id, latitude, longitude, comment, ai_confidence, is_approved, created_at, image_url), interfața User (id, username, email, role, created_at, is_active).

**api.types.ts** — tipuri pentru viitoarele response-uri API: ApiResponse<T>, PaginatedResponse<T>, ErrorResponse. Pregătite pentru când vine backend-ul.

## UTILS (shared/utils/)

**formatDate.ts** — funcție care primește ISO string și returnează dată formatată în română ("15 iunie 2025"). Folosită în callout-urile de pe hartă și în detalii POI.

**coordinates.ts** — funcții helper: distanceBetween(coord1, coord2) calculează distanța între două puncte în km, isInsideBounds(coord, bounds) verifică dacă un punct e în limitele Galațiului.

## CONSTANTS (shared/constants/)

**config.ts** — constante ale aplicației: GALATI_CENTER ([45.4353, 28.0080]), DEFAULT_ZOOM (13), MAX_ZOOM (18), MAP_BOUNDS, API_BASE_URL (pregătit pentru backend). Importate de modulul map și sightings.
