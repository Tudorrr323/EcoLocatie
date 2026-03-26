import type { myPlantsRo } from './ro';

export const myPlantsEn: typeof myPlantsRo = {
  title: 'My Plants',
  tabs: {
    plants: 'Plants',
    history: 'History',
  },
  empty: {
    plantsTitle: 'No Favorite Plants',
    plantsMessage: 'Add plants to favorites by tapping the heart icon.',
    historyTitle: 'You Have No History',
    historyMessage: "You haven't made any observations yet.",
  },
  observations: 'observations',
  observation: 'observation',
  fab: {
    addObservation: 'Add observation',
    searchPlants: 'Search plants',
  },
  detail: {
    title: 'My Plant',
    family: 'Family',
    scientificName: 'Scientific Name',
    tabs: {
      observations: 'Observations',
      plantInfo: 'Plant Info',
    },
    removeTitle: 'Remove from My Plants',
    removeMessage: 'Are you sure you want to remove this plant from your list?',
    removeConfirm: 'Yes, Remove',
    removedSuccess: 'Plant has been removed from your list!',
    noObservations: 'No observations for this plant.',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
    confidence: 'AI Confidence',
    description: 'Description',
    benefits: 'Benefits',
    contraindications: 'Contraindications',
    habitat: 'Habitat',
    harvestPeriod: 'Harvest Period',
    preparation: 'Preparation',
    partsUsed: 'Parts Used',
  },
  menu: {
    remove: 'Remove from My Plants',
  },
  dateToday: 'Today',
  dateYesterday: 'Yesterday',
};
