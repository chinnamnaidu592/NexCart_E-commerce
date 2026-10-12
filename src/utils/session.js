/**
 * Session management utilities for Guest Sessions and User Mapping.
 * Ensures every cart, wishlist, and interaction is properly scoped to a
 * persistent guest session ID or authenticated user ID.
 */

const GUEST_SESSION_KEY = 'nexcart_guest_session_id';

/**
 * Generates a unique guest session identifier.
 */
function createGuestId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `guest_${timestamp}_${random}`;
}

/**
 * Retrieves the active guest session ID from localStorage, or creates one if absent.
 */
export function getOrCreateGuestSessionId() {
  if (typeof window === 'undefined') return 'guest_ssr_session';
  try {
    let sessionId = window.localStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionId) {
      sessionId = createGuestId();
      window.localStorage.setItem(GUEST_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (error) {
    console.warn('Failed accessing localStorage for guest session ID:', error);
    return createGuestId();
  }
}

/**
 * Gets the current guest session ID without generating a new one if not present.
 */
export function getGuestSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(GUEST_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Resets and regenerates the guest session ID (e.g. after user logout).
 */
export function regenerateGuestSessionId() {
  if (typeof window === 'undefined') return 'guest_ssr_session';
  try {
    const newSessionId = createGuestId();
    window.localStorage.setItem(GUEST_SESSION_KEY, newSessionId);
    return newSessionId;
  } catch {
    return createGuestId();
  }
}

/**
 * Clears the guest session ID completely.
 */
export function clearGuestSessionId() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(GUEST_SESSION_KEY);
  } catch {
    // Ignore in restricted environments
  }
}
