# EcoLocație — Despre Aplicație

## CE E PROIECTUL

Aplicație mobilă pentru identificarea și cartografierea plantelor medicinale din județul Galați. Un coleg se ocupă de backend și AI — tu faci doar frontend-ul mobil cu date mockup din JSON.

Aplicația are 4 module principale: o hartă interactivă unde utilizatorii văd punctele de interes cu plante medicinale, un flow de creare observație nouă (fotografiere cu camera, identificare plantă, alegere locație GPS, comentariu), o enciclopedie cu toate plantele și detaliile lor, și un panel de administrare.

## LIBRĂRII

React Native + Expo (SDK 51) pentru development rapid și testare pe telefon fără build nativ. react-native-maps pentru hartă interactivă (Google Maps pe Android, Apple Maps pe iOS). expo-location pentru GPS. expo-image-picker pentru camera și galerie. expo-router pentru navigare file-based. nativewind (Tailwind pentru RN) pentru styling.

## SURSA DE DATE

Fișierul `ecolocatie_data.json` atașat conține tot: `plants` (20 plante medicinale complete), `users` (5 utilizatori mockup), `points_of_interest` (16 observații demo pe harta Galațiului), `config` (centru hartă, zoom defaults, limite Galați). Se accesează printr-un singur dataProvider din shared/repository. Când backend-ul e gata, se schimbă doar dataProvider de la import JSON la fetch API — restul aplicației nu se atinge.

## CE FACE FIECARE MODUL

**map** — Hartă interactivă centrată pe Galați [45.4353, 28.0080]. MapView din react-native-maps cu markere custom colorate per plantă, callout la tap cu detalii, buton GPS "Locația mea" cu animateToRegion(), panou filtre ca bottom sheet, buton recentrare pe Galați.

**sightings** — Flow-ul de adăugare observație. User deschide camera cu expo-image-picker sau alege din galerie → mock identificare AI (top 3 rezultate random cu confidence) → fallback alegere manuală din picker → locație GPS automat sau long press pe hartă → comentariu → salvare în state local → apare pe hartă.

**plants** — Enciclopedia plantelor. FlatList de carduri cu imagine + nume. La tap se navighează la pagina de detalii cu descriere, părți utilizabile, beneficii, contraindicații, habitat, perioadă recoltare, mod preparare. SearchBar pentru filtrare.

**admin** — Tab vizibil doar pentru admin. Lista utilizatori cu switch active/inactive. Lista observații neaprobate cu butoane Approve/Reject. Stats simple.

**auth** — Mock login/register cu AsyncStorage. Două roluri: user și admin.

## COORDONATE GALAȚI

Centru oraș [45.4353, 28.0080], Grădina Publică [45.4400, 28.0200], Pădurea Gârboavele [45.4833, 28.0667], Faleza Dunării [45.4200, 28.0300], Parcul Eminescu [45.4390, 28.0100], Lacul Brateș [45.3900, 28.0500].
