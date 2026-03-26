// mockData — date de test pentru functionare offline.
// Folosite ca fallback in repository-uri cand backend-ul nu e disponibil.

import type { Plant, PointOfInterest, User, Comment } from '../types/plant.types';
import type { AppNotification } from '../../modules/notifications/types/notifications.types';
import type { AdminStats } from '../../modules/admin/types/admin.types';

// ── Plante medicinale ────────────────────────────────────────────

export const MOCK_PLANTS: Plant[] = [
  {
    id: 1,
    name_ro: 'Mușețel',
    name_latin: 'Matricaria chamomilla',
    name_en: 'Chamomile',
    family: 'Asteraceae',
    description: 'Una dintre cele mai populare plante medicinale din România, cunoscută pentru proprietățile calmante și antiinflamatoare.',
    parts_used: ['Flori (capitule florale)'],
    benefits: ['Calmant natural', 'Antiinflamator', 'Ameliorează problemele digestive', 'Reduce anxietatea'],
    contraindications: ['Alergie la plante din familia Asteraceae', 'Nu se recomandă în sarcină în doze mari'],
    habitat: 'Câmpuri, marginea drumurilor, terenuri necultivate',
    harvest_period: 'Mai - Iulie',
    preparation: 'Infuzie: 2-3 lingurițe de flori uscate la 250ml apă fierbinte, se lasă 10 minute.',
    image_url: '',
    images: [],
    icon_color: '#FFD700',
  },
  {
    id: 2,
    name_ro: 'Sunătoare',
    name_latin: 'Hypericum perforatum',
    name_en: "St. John's Wort",
    family: 'Hypericaceae',
    description: 'Plantă medicinală cu proprietăți antidepresive și antiinflamatoare, utilizată tradițional în tratarea anxietății și depresiei ușoare.',
    parts_used: ['Părțile aeriene (flori și frunze)'],
    benefits: ['Antidepresiv natural', 'Antiinflamator', 'Cicatrizant', 'Antiseptic'],
    contraindications: ['Interacțiuni cu medicamente antidepresive', 'Fotosensibilitate', 'Nu se administrează copiilor sub 12 ani'],
    habitat: 'Pajiști, marginea pădurilor, dealuri însorite',
    harvest_period: 'Iunie - August',
    preparation: 'Ulei: flori proaspete macerate în ulei de măsline 40 zile la soare.',
    image_url: '',
    images: [],
    icon_color: '#FF6B35',
  },
  {
    id: 3,
    name_ro: 'Mentă',
    name_latin: 'Mentha piperita',
    name_en: 'Peppermint',
    family: 'Lamiaceae',
    description: 'Plantă aromatică răcoritoare, foarte populară pentru proprietățile digestive și efectul calmant.',
    parts_used: ['Frunze'],
    benefits: ['Ameliorează tulburările digestive', 'Efect răcoritor', 'Calmează durerile de cap', 'Antiseptic'],
    contraindications: ['Reflux gastroesofagian', 'Nu se recomandă sugarilor'],
    habitat: 'Zone umede, malurile apelor, grădini',
    harvest_period: 'Mai - Septembrie',
    preparation: 'Infuzie: 1-2 lingurițe de frunze la 200ml apă fierbinte.',
    image_url: '',
    images: [],
    icon_color: '#2ECC71',
  },
  {
    id: 4,
    name_ro: 'Lavandă',
    name_latin: 'Lavandula angustifolia',
    name_en: 'Lavender',
    family: 'Lamiaceae',
    description: 'Plantă aromatică mediteraneană apreciată pentru proprietățile relaxante și parfumul distinctiv.',
    parts_used: ['Flori'],
    benefits: ['Relaxant și sedativ', 'Antiseptic', 'Ameliorează insomnia', 'Repelent natural de insecte'],
    contraindications: ['Alergie la Lamiaceae', 'Poate interacționa cu sedativele'],
    habitat: 'Terenuri uscate, însorite, soluri calcaroase',
    harvest_period: 'Iunie - August',
    preparation: 'Ulei esențial prin distilare cu abur. Infuzie: 1 lingurită flori la 250ml apă.',
    image_url: '',
    images: [],
    icon_color: '#9B59B6',
  },
  {
    id: 5,
    name_ro: 'Păpădie',
    name_latin: 'Taraxacum officinale',
    name_en: 'Dandelion',
    family: 'Asteraceae',
    description: 'Plantă comună cu proprietăți depurative și hepatoprotectoare, consumată și ca aliment.',
    parts_used: ['Rădăcină', 'Frunze', 'Flori'],
    benefits: ['Depurativ hepatic', 'Diuretic natural', 'Bogată în vitamine A, C, K', 'Stimulează digestia'],
    contraindications: ['Alergie la Asteraceae', 'Calculi biliari'],
    habitat: 'Pajiști, grădini, terenuri vagi, marginea drumurilor',
    harvest_period: 'Aprilie - Octombrie',
    preparation: 'Decoct din rădăcină: 2 lingurițe la 300ml apă, fierbere 5 minute.',
    image_url: '',
    images: [],
    icon_color: '#F1C40F',
  },
  {
    id: 6,
    name_ro: 'Tei',
    name_latin: 'Tilia cordata',
    name_en: 'Linden',
    family: 'Malvaceae',
    description: 'Arbore cu flori parfumate, ceaiul de tei este un remediu clasic pentru răceală, gripă și insomnie.',
    parts_used: ['Flori cu bractee'],
    benefits: ['Calmant și relaxant', 'Diaforetic (induce transpirația)', 'Antiinflamator', 'Ameliorează răceala'],
    contraindications: ['Rareori reacții alergice', 'Consum moderat la hipertensiune'],
    habitat: 'Păduri de foioase, parcuri, aliniamente stradale',
    harvest_period: 'Iunie - Iulie',
    preparation: 'Infuzie: 2 lingurițe flori la 250ml apă fierbinte, 10-15 minute.',
    image_url: '',
    images: [],
    icon_color: '#27AE60',
  },
];

// ── Utilizatori ──────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ecolocation.ro',
    role: 'admin',
    created_at: '2026-01-15T10:00:00Z',
    is_active: true,
    first_name: 'Admin',
    last_name: 'EcoLocation',
    phone: '+40700000001',
  },
  {
    id: 2,
    username: 'tudor_baranga',
    email: 'tb173@student.ugal.ro',
    role: 'user',
    created_at: '2026-02-01T09:00:00Z',
    is_active: true,
    first_name: 'Tudor',
    last_name: 'Barangă',
    phone: '+40712345678',
    birth_date: '2003-05-15',
  },
  {
    id: 3,
    username: 'claudiu_craciun',
    email: 'cc642@student.ugal.ro',
    role: 'user',
    created_at: '2026-02-01T09:30:00Z',
    is_active: true,
    first_name: 'Claudiu',
    last_name: 'Crăciun',
    phone: '+40798765432',
    birth_date: '2003-08-22',
  },
  {
    id: 4,
    username: 'maria_ionescu',
    email: 'maria.ionescu@gmail.com',
    role: 'user',
    created_at: '2026-03-10T14:00:00Z',
    is_active: true,
    first_name: 'Maria',
    last_name: 'Ionescu',
  },
  {
    id: 5,
    username: 'andrei_pop',
    email: 'andrei.pop@gmail.com',
    role: 'user',
    created_at: '2026-03-12T11:00:00Z',
    is_active: false,
    first_name: 'Andrei',
    last_name: 'Pop',
  },
];

// ── Observatii (POI) ─────────────────────────────────────────────

export const MOCK_POIS: PointOfInterest[] = [
  {
    id: 1, user_id: 2, plant_id: 1,
    latitude: 45.4400, longitude: 28.0200,
    address: 'Grădina Publică, Galați',
    comment: 'Mușețel sălbatic găsit lângă aleea principală din Grădina Publică.',
    ai_confidence: 0.94, status: 'approved',
    created_at: '2026-03-20T08:30:00Z',
    image_url: '', comment_count: 3,
  },
  {
    id: 2, user_id: 3, plant_id: 2,
    latitude: 45.4833, longitude: 28.0667,
    address: 'Pădurea Gârboavele',
    comment: 'Sunătoare pe marginea potecii din pădurea Gârboavele, zona sudică.',
    ai_confidence: 0.87, status: 'approved',
    created_at: '2026-03-21T10:15:00Z',
    image_url: '', comment_count: 1,
  },
  {
    id: 3, user_id: 2, plant_id: 3,
    latitude: 45.4200, longitude: 28.0300,
    address: 'Faleza Dunării, Galați',
    comment: 'Mentă sălbatică pe malul Dunării, zonă umedă lângă debarcader.',
    ai_confidence: 0.91, status: 'approved',
    created_at: '2026-03-22T14:00:00Z',
    image_url: '', comment_count: 0,
  },
  {
    id: 4, user_id: 4, plant_id: 5,
    latitude: 45.4390, longitude: 28.0100,
    address: 'Parcul Eminescu, Galați',
    comment: 'Păpădii în Parcul Eminescu, lângă statuia lui Eminescu.',
    ai_confidence: 0.96, status: 'approved',
    created_at: '2026-03-23T09:45:00Z',
    image_url: '', comment_count: 2,
  },
  {
    id: 5, user_id: 3, plant_id: 4,
    latitude: 45.4370, longitude: 28.0150,
    address: 'Str. Brăilei, Galați',
    comment: 'Lavandă plantată în fața blocului, pare să fie varietate medicinală.',
    ai_confidence: 0.78, status: 'pending',
    created_at: '2026-03-24T16:20:00Z',
    image_url: '', comment_count: 0,
  },
  {
    id: 6, user_id: 2, plant_id: 6,
    latitude: 45.4420, longitude: 28.0250,
    address: 'Parcul Central, Galați',
    comment: 'Tei bătrân lângă fântâna arteziană, flori abundente.',
    ai_confidence: 0.99, status: 'approved',
    created_at: '2026-03-24T11:00:00Z',
    image_url: '', comment_count: 1,
  },
  {
    id: 7, user_id: 4, plant_id: 1,
    latitude: 45.3900, longitude: 28.0500,
    address: 'Lacul Brateș',
    comment: 'Mușețel pe malul lacului, cantitate mare.',
    ai_confidence: 0.88, status: 'pending',
    created_at: '2026-03-25T07:30:00Z',
    image_url: '', comment_count: 0,
  },
  {
    id: 8, user_id: 3, plant_id: 3,
    latitude: 45.4450, longitude: 28.0180,
    comment: 'Mentă crescută spontan lângă un canal de irigație.',
    ai_confidence: 0.82, status: 'rejected',
    created_at: '2026-03-25T13:00:00Z',
    image_url: '', comment_count: 0,
  },
];

// ── Comentarii ────────────────────────────────────────────────────

export const MOCK_COMMENTS: Comment[] = [
  // Comentarii pe POI 1 (Mușețel, Grădina Publică)
  { id: 1, user_id: 3, poi_id: 1, content: 'Frumoasă observație! Am mai văzut și eu mușețel acolo vara trecută.', username: 'claudiu_craciun', created_at: '2026-03-20T12:00:00Z', parent_id: null },
  { id: 2, user_id: 4, poi_id: 1, content: 'Se pot culege liber sau e zonă protejată?', username: 'maria_ionescu', created_at: '2026-03-20T14:30:00Z', parent_id: null },
  { id: 3, user_id: 2, poi_id: 1, content: 'Din câte știu, nu e zonă protejată. Dar recomand să culegi cu moderație.', username: 'tudor_baranga', created_at: '2026-03-20T15:00:00Z', parent_id: 2 },

  // Comentarii pe POI 2 (Sunătoare, Gârboavele)
  { id: 4, user_id: 2, poi_id: 2, content: 'Excelentă zonă pentru sunătoare! Mersi pentru localizare.', username: 'tudor_baranga', created_at: '2026-03-21T18:00:00Z', parent_id: null },

  // Comentarii pe POI 4 (Păpădie, Parcul Eminescu)
  { id: 5, user_id: 2, poi_id: 4, content: 'Și eu am observat. Sunt foarte multe primăvara.', username: 'tudor_baranga', created_at: '2026-03-23T11:00:00Z', parent_id: null },
  { id: 6, user_id: 3, poi_id: 4, content: 'Frunzele tinere sunt bune în salată!', username: 'claudiu_craciun', created_at: '2026-03-23T12:30:00Z', parent_id: 5 },

  // Comentariu pe POI 6 (Tei, Parcul Central)
  { id: 7, user_id: 4, poi_id: 6, content: 'Cel mai frumos tei din Galați! Vara miroase incredibil.', username: 'maria_ionescu', created_at: '2026-03-24T17:00:00Z', parent_id: null },
];

// ── Notificari ───────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1, user_id: 2, type: 'poi_approved',
    title: 'Observație aprobată', message: 'Observația ta pentru Mușețel a fost aprobată.',
    is_read: false, poi_id: 1, plant_name: 'Mușețel',
    created_at: '2026-03-25T09:00:00Z',
  },
  {
    id: 2, user_id: 2, type: 'poi_commented',
    title: 'Comentariu nou', message: 'claudiu_craciun a comentat la observația ta pentru Mușețel.',
    is_read: false, poi_id: 1, plant_name: 'Mușețel',
    created_at: '2026-03-25T10:00:00Z',
  },
  {
    id: 3, user_id: 2, type: 'poi_approved',
    title: 'Observație aprobată', message: 'Observația ta pentru Mentă a fost aprobată.',
    is_read: true, poi_id: 3, plant_name: 'Mentă',
    created_at: '2026-03-24T16:00:00Z',
  },
  {
    id: 4, user_id: 2, type: 'poi_rejected',
    title: 'Observație refuzată', message: 'Observația ta pentru Tei a fost refuzată.',
    is_read: true, poi_id: 8, plant_name: 'Tei',
    reason: 'Imaginea nu este suficient de clară pentru identificare.',
    created_at: '2026-03-23T14:00:00Z',
  },
  {
    id: 5, user_id: 1, type: 'poi_created',
    title: 'Observație nouă', message: 'maria_ionescu a adăugat o observație nouă pentru Păpădie.',
    is_read: false, poi_id: 4, plant_name: 'Păpădie',
    created_at: '2026-03-25T11:00:00Z',
  },
  {
    id: 6, user_id: 1, type: 'poi_created',
    title: 'Observație nouă', message: 'claudiu_craciun a adăugat o observație nouă pentru Lavandă.',
    is_read: false, poi_id: 5, plant_name: 'Lavandă',
    created_at: '2026-03-25T12:00:00Z',
  },
];

// ── Admin Stats ──────────────────────────────────────────────────

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 5,
  activeUsers: 4,
  totalPOIs: 8,
  approvedPOIs: 5,
  pendingPOIs: 2,
  rejectedPOIs: 1,
  totalPlants: 6,
};

// ── Helpers ──────────────────────────────────────────────────────

export function getMockCommentsForPOI(poiId: number): Comment[] {
  return MOCK_COMMENTS.filter((c) => c.poi_id === poiId);
}

export function getMockNotificationsForUser(userId: number): AppNotification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId);
}

export function getMockUnreadCount(userId: number): number {
  return MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId && !n.is_read).length;
}
