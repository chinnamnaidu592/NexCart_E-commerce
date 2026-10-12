import { useState, useEffect } from 'react';

/**
 * useDebounce hook delays updating the value until after delay milliseconds
 * have elapsed since the last change. Essential for high-performance search inputs.
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
