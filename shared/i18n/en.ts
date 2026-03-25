import type { sharedRo } from './ro';

export const sharedEn: typeof sharedRo = {
  tabs: {
    map: 'Map',
    encyclopedia: 'Encyclopedia',
    myPlants: 'My Plants',
    settings: 'Settings',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    apply: 'Apply',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    noResults: 'No results',
  },
  appHeader: {
    title: 'EcoLocation',
  },
  pagination: {
    itemsPerPage: 'items/page',
  },
  plantFilter: {
    title: 'Plant Filters',
    allPlants: 'All plants',
    resetFilters: 'Reset filters',
    apply: 'Apply',
  },
  sightingGuard: {
    title: 'Discard observation?',
    message: 'You have unsaved changes. If you leave now, you will lose all progress.',
    confirm: 'Discard',
    cancel: 'Keep editing',
  },
  notifications: {
    title: 'Notifications',
    empty: 'No new notifications.',
  },
};
