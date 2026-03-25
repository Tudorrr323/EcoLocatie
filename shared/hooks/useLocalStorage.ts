import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key).then((item) => {
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
      setLoading(false);
    });
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    },
    [key, storedValue]
  );

  const removeValue = useCallback(async () => {
    setStoredValue(initialValue);
    await AsyncStorage.removeItem(key);
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue, loading };
}
