/**
 * Application-wide configuration settings
 * Includes API endpoints and business thresholds.
 */
export const API_BASE_URL =
  (typeof process !== 'undefined' &&
    (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://dummyjson.com')) ||
  'https://dummyjson.com';

export const APP_CONFIG = {
  name: 'NexCart',
  tagline: 'Smart Shopping, Delivered Faster.',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 999, // Free shipping if cart subtotal is >= ₹999
  standardShippingFee: 99, // Standard courier dispatch fee ₹99
  taxRate: 0.18, // 18% GST (Goods and Services Tax)

  promoCodes: {
    SAVE10: { code: 'SAVE10', discountPercent: 10, description: '10% off your entire order' },
    WELCOME20: { code: 'WELCOME20', discountPercent: 20, description: '20% off for first-time shoppers' },
    FREESHIP: { code: 'FREESHIP', freeShipping: true, description: 'Free shipping on any order' },
  },
  pagination: {
    defaultPageSize: 12,
  },
};
