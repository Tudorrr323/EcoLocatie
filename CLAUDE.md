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
- Limba interfata: romana
