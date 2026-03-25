// i18n/index.ts — sistemul de traduceri al aplicatiei.
// Combina traducerile shared + module si expune hook-ul useTranslation().
// In componente: const t = useTranslation(); apoi t.shared.common.save, t.map.searchPlaceholder etc.

import { useSettings } from '../context/SettingsContext';

import { sharedRo } from './ro';
import { sharedEn } from './en';
import { mapRo } from '../../modules/map/i18n/ro';
import { mapEn } from '../../modules/map/i18n/en';
import { plantsRo } from '../../modules/plants/i18n/ro';
import { plantsEn } from '../../modules/plants/i18n/en';
import { sightingsRo } from '../../modules/sightings/i18n/ro';
import { sightingsEn } from '../../modules/sightings/i18n/en';
import { adminRo } from '../../modules/admin/i18n/ro';
import { adminEn } from '../../modules/admin/i18n/en';
import { accountRo } from '../../modules/account/i18n/ro';
import { accountEn } from '../../modules/account/i18n/en';
import { authRo } from '../../modules/auth/i18n/ro';
import { authEn } from '../../modules/auth/i18n/en';

const ro = {
  shared: sharedRo,
  map: mapRo,
  plants: plantsRo,
  sightings: sightingsRo,
  admin: adminRo,
  account: accountRo,
  auth: authRo,
};

const en: Translations = {
  shared: sharedEn,
  map: mapEn,
  plants: plantsEn,
  sightings: sightingsEn,
  admin: adminEn,
  account: accountEn,
  auth: authEn,
};

export type Translations = typeof ro;

const translations = { ro, en } as const;

export function useTranslation(): Translations {
  const { language } = useSettings();
  return translations[language];
}
