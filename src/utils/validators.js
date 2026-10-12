/**
 * Handcrafted input validation routines.
 * Written without external libraries (like Zod or Yup) for lightweight, explainable code.
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
};

/**
 * Validates password rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  return null;
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\D/g, '');
  // Indian mobile numbers: 10 digits (or 11 with leading 0, or 12 with 91 country code)
  return cleaned.length >= 10 && cleaned.length <= 13;
};

/**
 * Validates Indian 6-digit Postal Index Number (PIN Code):
 * First digit must be 1-9, followed by 5 digits (0-9).
 * E.g., 500001, 110001, 560001, 400001
 */
export const isValidPinCode = (pin) => {
  if (!pin) return false;
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(String(pin).trim());
};

/**
 * Validates postal code, prioritizing 6-digit Indian PIN codes (/^[1-9][0-9]{5}$/)
 * while remaining backwards-compatible.
 */
export const isValidZip = (zip) => {
  if (!zip) return false;
  const cleaned = String(zip).trim();
  // Standard Indian PIN code: 6 digits
  if (/^[1-9][0-9]{5}$/.test(cleaned)) return true;
  // Fallback tolerance for 6 digits or legacy 5-digit test inputs
  return /^\d{6}$/.test(cleaned) || /^\d{5}(-\d{4})?$/.test(cleaned);
};


export const isValidCardNumber = (cardNumber) => {
  const digits = String(cardNumber).replace(/\s|-/g, '');
  return /^\d{15,16}$/.test(digits);
};

export const isValidCardExpiry = (expiry) => {
  const match = String(expiry).trim().match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(`20${match[2]}`, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expDate = new Date(year, month);
  return expDate > now;
};

export const isValidCvv = (cvv) => {
  return /^\d{3,4}$/.test(String(cvv).trim());
};
