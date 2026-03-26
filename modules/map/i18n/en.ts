import type { mapRo } from './ro';

export const mapEn: typeof mapRo = {
  searchPlaceholder: 'Search plants...',
  gpsButton: 'My location',
  compassButton: 'Reset orientation',
  recenterGalati: 'Recenter on Galati',
  tabs: {
    overview: 'Overview',
    benefits: 'Benefits',
    contraindications: 'Contraindications',
    details: 'Details',
    comments: 'Comments',
  },
  sections: {
    comment: 'Comment',
    habitat: 'Habitat',
    harvestPeriod: 'Harvest period',
    preparation: 'Preparation method',
    partsUsed: 'Parts used',
  },
  chat: {
    title: 'EcoLocation Assistant',
    placeholder: 'Ask about medicinal plants...',
    send: 'Send',
    thinking: 'Thinking...',
    welcome: "Hi! I'm the EcoLocation assistant. You can ask me anything about medicinal plants in the Galați area.",
    errorMessage: 'Could not get a response. Check your internet connection.',
    sources: 'Sources',
    history: 'Conversations',
    newChat: 'New conversation',
    noChats: 'No conversations yet.',
    editTitle: 'Edit title',
    editTitlePlaceholder: 'Conversation title...',
    deleteChat: 'Delete conversation',
    deleteConfirm: 'Are you sure you want to delete this conversation?',
    defaultTitle: 'New conversation',
  },
  locationPicker: {
    latitude: 'Latitude',
    longitude: 'Longitude',
    confirmLocation: 'Confirm location',
  },
};
