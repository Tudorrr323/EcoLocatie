// useLocation — hook pentru gestionarea locatiei GPS a utilizatorului.
// Ofera getLocation() pentru o citire unica si startWatching()/stopWatching() pentru tracking in timp real.
// Folosit de modulul map (buton GPS) si sightings (locatie automata la creare POI).

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  location: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    loading: false,
  });
  const [watching, setWatching] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const getLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ location: null, error: 'Permisiunea de localizare a fost refuzata.', loading: false });
        return null;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setState({ location: coords, error: null, loading: false });
      return coords;
    } catch {
      setState({ location: null, error: 'Nu s-a putut obtine locatia.', loading: false });
      return null;
    }
  }, []);

  const startWatching = useCallback(async () => {
    if (subscriptionRef.current) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState((prev) => ({ ...prev, error: 'Permisiunea de localizare a fost refuzata.' }));
      return;
    }
    setWatching(true);
    subscriptionRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => {
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setState({ location: coords, error: null, loading: false });
      }
    );
  }, []);

  const stopWatching = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setWatching(false);
  }, []);

  useEffect(() => {
    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  return { ...state, getLocation, watching, startWatching, stopWatching };
}
