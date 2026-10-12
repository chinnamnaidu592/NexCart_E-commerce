import { APP_CONFIG } from '@/constants/config';

/**
 * Pure calculation utilities for e-commerce cart and checkout
 * Enforces round-to-2-decimals to prevent floating-point calculation errors.
 */

export const roundMoney = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates item subtotal given item price and quantity
 */
export const calculateItemSubtotal = (price, quantity) => {
  return roundMoney(Number(price || 0) * Number(quantity || 1));
};

/**
 * Calculates raw subtotal of items in cart
 */
export const calculateCartSubtotal = (items = []) => {
  const sum = items.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
  return roundMoney(sum);
};

/**
 * Computes promotional discount based on coupon rules
 */
export const calculatePromoDiscount = (subtotal, promoCode) => {
  if (!promoCode || !APP_CONFIG.promoCodes[promoCode]) return 0;
  const config = APP_CONFIG.promoCodes[promoCode];
  if (config.discountPercent) {
    return roundMoney(subtotal * (config.discountPercent / 100));
  }
  return 0;
};

/**
 * Determines shipping fee based on cart value and promo code
 */
export const calculateShippingFee = (subtotal, promoCode) => {
  if (promoCode && APP_CONFIG.promoCodes[promoCode]?.freeShipping) {
    return 0;
  }
  if (subtotal >= APP_CONFIG.freeShippingThreshold || subtotal === 0) {
    return 0;
  }
  return APP_CONFIG.standardShippingFee;
};

/**
 * Estimates tax based on subtotal minus promo discount
 */
export const calculateTax = (subtotal, discount = 0) => {
  const taxableAmount = Math.max(0, subtotal - discount);
  return roundMoney(taxableAmount * APP_CONFIG.taxRate);
};

/**
 * Calculates final total payable
 */
export const calculateFinalTotal = (subtotal, discount, shipping, tax) => {
  const total = Math.max(0, subtotal - discount + shipping + tax);
  return roundMoney(total);
};
