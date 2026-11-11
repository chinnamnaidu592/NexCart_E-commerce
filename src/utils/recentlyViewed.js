import { getStorageItem, setStorageItem } from '@/utils/storage';

export const RECENTLY_VIEWED_PRODUCTS_KEY = 'nexcart_recently_viewed_products';
const MAX_RECENTLY_VIEWED_PRODUCTS = 10;
const RECENTLY_VIEWED_CHANGE_EVENT = 'nexcart:recently-viewed-products-changed';

export function getRecentlyViewedProductIds() {
  const storedIds = getStorageItem(RECENTLY_VIEWED_PRODUCTS_KEY, []);
  if (!Array.isArray(storedIds)) return [];

  const seen = new Set();
  return storedIds
    .filter((id) => typeof id === 'string' || typeof id === 'number')
    .map((id) => String(id).trim())
    .filter((id) => {
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, MAX_RECENTLY_VIEWED_PRODUCTS);
}

export function recordRecentlyViewedProduct(productId) {
  if (typeof productId !== 'string' && typeof productId !== 'number') return;

  const id = String(productId).trim();
  if (!id) return;

  const nextIds = [
    id,
    ...getRecentlyViewedProductIds().filter((recentId) => recentId !== id),
  ].slice(0, MAX_RECENTLY_VIEWED_PRODUCTS);

  if (!setStorageItem(RECENTLY_VIEWED_PRODUCTS_KEY, nextIds)) {
    console.warn('Could not save recently viewed products to this browser.');
    return;
  }

  window.dispatchEvent(new Event(RECENTLY_VIEWED_CHANGE_EVENT));
}

export function subscribeToRecentlyViewedProducts(onChange) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event) => {
    if (event.key === null || event.key === RECENTLY_VIEWED_PRODUCTS_KEY) {
      onChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(RECENTLY_VIEWED_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(RECENTLY_VIEWED_CHANGE_EVENT, onChange);
  };
}

export function getRecentlyViewedProductIdsSnapshot() {
  return JSON.stringify(getRecentlyViewedProductIds());
}
