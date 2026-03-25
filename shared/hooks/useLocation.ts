import { useState, useCallback } from 'react';
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

  return { ...state, getLocation };
}
