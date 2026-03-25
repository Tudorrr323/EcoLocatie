// sightingGuard — obiect mutable care tine minte daca observatia in curs are progres.
// Setat de CreatePOIForm, citit de CustomTabBar pentru a afisa alerta la navigare.

export const sightingGuard: {
  hasProgress: boolean;
  reset: () => void;
} = {
  hasProgress: false,
  reset: () => {},
};
