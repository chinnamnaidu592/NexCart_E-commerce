import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';

/**
 * useLocalStorage hook with hydration safety.
 * Initializes with fallback value, then loads from localStorage on client mount.
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = getStorageItem(key, initialValue);
    setStoredValue(saved);
    setIsHydrated(true);
  }, [key, initialValue]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setStorageItem(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isHydrated];
};
