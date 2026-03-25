# EcoLocație — Despre Aplicație

> **NOTĂ PENTRU CLAUDE/GEMINI:** Actualizează OBLIGATORIU acest fișier ori de câte ori creezi un modul, componentă, hook sau orice resursă nouă semnificativă, pentru a menține documentația sincronizată cu codul.

## CE E PROIECTUL

Aplicație mobilă pentru identificarea și cartografierea plantelor medicinale din județul Galați. Un coleg se ocupă de backend și AI — tu faci doar frontend-ul mobil cu date mockup din JSON.

Aplicația are 5 module principale: o hartă interactivă unde utilizatorii văd punctele de interes cu plante medicinale, un flow de creare observație nouă (fotografiere cu camera, identificare plantă, alegere locație GPS, comentariu), o enciclopedie cu toate plantele și detaliile lor, un panel de administrare și o pagină de setări.

## LIBRĂRII

React Native + Expo (SDK 54) pentru development rapid și testare pe telefon fără build nativ. react-native-webview + Leaflet/OpenStreetMap pentru harta interactivă (alternativă flexibilă la Google/Apple Maps). expo-location pentru GPS. expo-image-picker pentru camera și galerie. expo-router pentru navigare file-based. nativewind (Tailwind pentru RN) pentru styling. lucide-react-native pentru iconițe.

## SURSA DE DATE

Fișierul `ecolocatie_data.json` atașat conține tot: `plants` (20 plante medicinale complete), `users` (5 utilizatori mockup), `points_of_interest` (16 observații demo pe harta Galațiului), `config` (centru hartă, zoom defaults, limite Galați). Se accesează printr-un singur dataProvider din shared/repository. Când backend-ul e gata, se schimbă doar dataProvider de la import JSON la fetch API — restul aplicației nu se atinge.

## CE FACE FIECARE MODUL

**map** — Hartă interactivă centrată pe Galați [45.4353, 28.0080]. Randată prin WebView cu Leaflet. Markere custom colorate per plantă, callout la tap cu detalii rapide, buton GPS "Locația mea" cu flyTo(), panou filtre (`PlantFilterPanel` din shared) ca FullScreenPanel, buton recentrare pe Galați. Sugestiile din SearchBar apar ca dropdown absolut poziționat peste hartă (nu împing harta în jos).

**sightings** — Flow-ul de adăugare observație în 4 pași. User deschide camera in-app (CameraScreen cu viewfinder animat, buton flash 3 stări: off/on/torch, buton galerie, buton flip) sau alege din galerie → mock identificare AI (top 3 rezultate random cu confidence) → fallback alegere manuală din picker (cu SearchBar full-width deasupra listei și paginare cu selector de mărime) → locație GPS automat sau long press pe hartă → comentariu → salvare în state local → apare pe hartă. La pasul 1 (foto) apare buton coș de gunoi roșu peste preview pentru ștergere rapidă. **Guard de navigare:** dacă utilizatorul a făcut cel puțin o fotografie sau a avansat un pas, orice tentativă de navigare (tap tab, back Android, swipe iOS) deschide un `ConfirmModal` de avertizare; la confirmare, observația se resetează automat.

**plants** — Enciclopedia plantelor. FlatList de carduri cu imagine + nume, paginată cu `usePagination` (selector 10/25/50 plante pe pagină). La tap se navighează la pagina de detalii cu descriere, părți utilizabile, beneficii, contraindicații, habitat, perioadă recoltare, mod preparare. SearchBar pentru filtrare. Panou de filtrare (`PlantFilterPanel` din shared) cu prima opțiune "Toate plantele" (selectează tot), filtrare individuală per plantă, buton "Resetează filtre" (resetează + închide) și buton "Aplică". Logica de selecție: `selectedIds=[]` înseamnă toate plantele afișate; plantele individuale apar nebifate când "Toate plantele" e activ — primul tap pe o plantă o selectează exclusiv.

**account** — Modulul de cont și setări. Tab-ul activ în bara de navigare este **Setări** (`SettingsScreen`) care conține: card profil utilizator (navigabil spre `EditProfileScreen`), setări generale (notificări, cont & securitate, contact), secțiunea "Despre" (`AboutScreen`), secțiunea "Legal" (Politica de Confidențialitate, Termeni și Condiții) și butonul de deconectare. `EditProfileScreen` — ecran de editare profil cu avatar (schimbare poză din galerie cu expo-image-picker), câmpuri editabile (prenume, nume, telefon, dată naștere din `DatePickerModal`), email read-only, buton "Salvează". `AccountScreen` (vechiul ecran de profil) există în continuare dar este ascuns din navigare (href: null). Modulul mai include `MyPlantsScreen` (observațiile proprii ale utilizatorului).

**admin** — Tab vizibil doar pentru admin. Lista utilizatori cu switch active/inactive. Lista observații neaprobate cu butoane Approve/Reject. Stats simple.

**auth** — Sistem complet de autentificare mock cu AsyncStorage. Două roluri: user și admin. **Login** prin email + parolă, design modern cu loading overlay modal, link subliniat "Ai uitat parola?" care deschide flow-ul de resetare. **Register** cu câmpuri: prenume, nume, email, parolă (x2 confirmare), dată naștere (selectată din `DatePickerModal`), număr telefon — toate cu validare. **Forgot Password** — flow în 3 pași: (1) introduce email → verificare existență cont, (2) parola nouă + confirmare, (3) ecran succes cu redirect la login. **Pagini publice:** `PrivacyPolicyScreen` (10 secțiuni GDPR), `TermsScreen` (13 secțiuni T&C cu avertisment medical), `AboutScreen`, `ForgotPasswordScreen`. **Guard global** în `app/_layout.tsx` via `AuthContext` — utilizatorii neautentificați sunt redirectați automat la `/login`; paginile `privacy-policy`, `terms`, `about`, `forgot-password` sunt accesibile fără autentificare și fără a redirecta utilizatorii autentificați.

## BARA DE NAVIGARE (tab bar)

5 tab-uri vizibile: **Hartă** (index), **Enciclopedie** (encyclopedia), **Adaugă** (add-sighting — buton circular teal centrat, ridicat), **Plantele mele** (my-plants), **Setări** (settings). Tab-urile `account` și `admin` există în routing dar sunt ascunse (href: null); admin-ul poate accesa panoul din SettingsScreen.

## COORDONATE GALAȚI

Centru oraș [45.4353, 28.0080], Grădina Publică [45.4400, 28.0200], Pădurea Gârboavele [45.4833, 28.0667], Faleza Dunării [45.4200, 28.0300], Parcul Eminescu [45.4390, 28.0100], Lacul Brateș [45.3900, 28.0500].
