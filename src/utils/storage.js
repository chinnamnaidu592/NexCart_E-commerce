/**
 * Safe localStorage wrapper with try/catch blocks to avoid runtime crashes
 * in restricted environments, private browsing modes, or during SSR.
 */

export const getStorageItem = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Failed reading key "${key}" from localStorage:`, error);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed saving key "${key}" to localStorage:`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed removing key "${key}" from localStorage:`, error);
    return false;
  }
};
