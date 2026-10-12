import apiClient from './apiClient';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

const STORAGE_KEYS = {
  CURRENT_USER: 'nexcart_current_user',
  TOKEN: 'nexcart_auth_token',
  REGISTERED_USERS: 'nexcart_registered_users',
};

// Seed demo users for local client fallback
const DEFAULT_SEED_USERS = [
  {
    id: 1,
    username: 'emilys',
    email: 'emilys@example.com',
    password: 'emilyspass',
    firstName: 'Emily',
    lastName: 'Johnson',
    role: 'admin',
    image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    username: 'michaelw',
    email: 'michaelw@example.com',
    password: 'michaelwpass',
    firstName: 'Michael',
    lastName: 'Williams',
    role: 'customer',
    image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 3,
    username: 'merchant',
    email: 'merchant@nexcart.com',
    password: 'merchantpass',
    firstName: 'Marcus',
    lastName: 'Vance',
    storeName: 'NexCart Atelier',
    storeCategory: 'Home & Living',
    role: 'merchant',
    image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 4,
    username: 'partner',
    email: 'partner@nexcart.com',
    password: 'partner123',
    firstName: 'Sophia',
    lastName: 'Laurent',
    storeName: 'Laurent Craft Studio',
    storeCategory: 'Jewelry & Watches',
    role: 'merchant',
    image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-02-10T00:00:00.000Z',
  },
];

export const userService = {
  /**
   * Helper to retrieve all locally known users (seed + dynamically registered)
   */
  getAllLocalUsers() {
    const stored = getStorageItem(STORAGE_KEYS.REGISTERED_USERS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.REGISTERED_USERS, DEFAULT_SEED_USERS);
      return DEFAULT_SEED_USERS;
    }
    // Ensure default seeds are always present in the pool
    const merged = [...stored];
    DEFAULT_SEED_USERS.forEach((seed) => {
      if (!merged.some((u) => u.email?.toLowerCase() === seed.email.toLowerCase())) {
        merged.push(seed);
      }
    });
    return merged;
  },

  /**
   * Customer authentication against /api/auth/customer
   */
  async loginCustomer(usernameOrEmail, password) {
    let networkError = null;
    try {
      const response = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: usernameOrEmail, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        // Must throw the exact server message ("This email does not exist...", "Incorrect password.")
        throw new Error(data.message || 'Authentication failed');
      }
      setStorageItem(STORAGE_KEYS.CURRENT_USER, data.user);
      setStorageItem(STORAGE_KEYS.TOKEN, data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      // If server responded with a business error (401/404/403), rethrow it directly
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      networkError = err;
    }

    // Only if network completely failed, fallback to local database verification
    return this.login(usernameOrEmail, password, 'customer');
  },

  /**
   * Merchant authentication against /api/auth/merchant
   */
  async loginMerchant(usernameOrEmail, password) {
    let networkError = null;
    try {
      const response = await fetch('/api/auth/merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: usernameOrEmail, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        // Must throw the exact server message ("This email does not exist...", "Incorrect password.")
        throw new Error(data.message || 'Authentication failed');
      }
      setStorageItem(STORAGE_KEYS.CURRENT_USER, data.user);
      setStorageItem(STORAGE_KEYS.TOKEN, data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      // If server responded with a business error (401/404/403), rethrow it directly
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      networkError = err;
    }

    // Only if network completely failed, fallback to local database verification
    return this.login(usernameOrEmail, password, 'merchant');
  },

  /**
   * Local verification fallback (checks seeded and registered users)
   * Strictly enforces:
   * 1. Email existence -> "This email does not exist. Please create an account."
   * 2. Password mismatch -> "Incorrect password."
   */
  async login(usernameOrEmail, password, requestedRole = 'customer') {
    const cleanIdentifier = String(usernameOrEmail).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const allUsers = this.getAllLocalUsers();

    // Find user by email or username
    const matchedUser = allUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanIdentifier) ||
        (u.username && u.username.toLowerCase() === cleanIdentifier)
    );

    // ISSUE 1 REQUIREMENT: If email doesn't exist
    if (!matchedUser) {
      throw new Error('This email does not exist. Please create an account.');
    }

    // ISSUE 1 REQUIREMENT: If password hash / password doesn't match
    if (matchedUser.password !== cleanPassword) {
      throw new Error('Incorrect password.');
    }

    // Role check if merchant login requested
    if (requestedRole === 'merchant' && matchedUser.role === 'customer') {
      throw new Error(
        'This account is registered as a customer. Please use Customer Login or register as a merchant partner.'
      );
    }

    const safeUser = { ...matchedUser };
    delete safeUser.password;
    setStorageItem(STORAGE_KEYS.CURRENT_USER, safeUser);
    setStorageItem(STORAGE_KEYS.TOKEN, `local-token-${Date.now()}`);
    return { user: safeUser, token: `local-token-${Date.now()}` };
  },

  /**
   * Registers a new account (Customer or Merchant)
   */
  async register(registrationData) {
    const cleanEmail = String(registrationData.email || '').trim().toLowerCase();
    const role = registrationData.role === 'merchant' ? 'merchant' : 'customer';

    // 1. Attempt API registration
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          email: cleanEmail,
          role,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Sync local storage mirror
      const localUsers = this.getAllLocalUsers();
      if (!localUsers.some((u) => u.email?.toLowerCase() === cleanEmail)) {
        setStorageItem(STORAGE_KEYS.REGISTERED_USERS, [
          ...localUsers,
          { ...data.user, password: registrationData.password },
        ]);
      }

      setStorageItem(STORAGE_KEYS.CURRENT_USER, data.user);
      setStorageItem(STORAGE_KEYS.TOKEN, data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      // If business error (e.g. email exists 409), rethrow
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    // 2. Client-side local fallback
    const localUsers = this.getAllLocalUsers();
    const existing = localUsers.find((u) => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: Date.now(),
      username: registrationData.username || cleanEmail.split('@')[0],
      email: cleanEmail,
      firstName: registrationData.firstName || (role === 'merchant' ? 'Partner' : 'Member'),
      lastName: registrationData.lastName || 'Store',
      password: registrationData.password,
      role,
      storeName: role === 'merchant' ? registrationData.storeName : undefined,
      storeCategory: role === 'merchant' ? (registrationData.storeCategory || 'General') : undefined,
      gstin: role === 'merchant' ? registrationData.gstin : undefined,
      pan: role === 'merchant' ? registrationData.pan : undefined,
      bankAccount: role === 'merchant' ? registrationData.bankAccount : undefined,
      pickupAddress: role === 'merchant' ? registrationData.pickupAddress : undefined,
      image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
      createdAt: new Date().toISOString(),
    };

    setStorageItem(STORAGE_KEYS.REGISTERED_USERS, [...localUsers, newUser]);

    const safeUser = { ...newUser };
    delete safeUser.password;
    setStorageItem(STORAGE_KEYS.CURRENT_USER, safeUser);
    setStorageItem(STORAGE_KEYS.TOKEN, `local-token-${Date.now()}`);

    return { user: safeUser, token: `local-token-${Date.now()}` };
  },

  /**
   * Retrieves active authenticated user session from cache
   */
  getCurrentUser() {
    return getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
  },

  /**
   * Updates user profile fields
   */
  updateProfile(updatedFields) {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');
    const updated = { ...current, ...updatedFields };
    setStorageItem(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  },

  /**
   * Clears session
   */
  logout() {
    removeStorageItem(STORAGE_KEYS.CURRENT_USER);
    removeStorageItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Fetches customer list for Admin dashboard
   */
  async getCustomers({ limit = 30 } = {}) {
    try {
      const response = await fetch('/api/auth/users');
      if (response.ok) {
        const data = await response.json();
        if (data.users?.length) {
          return data.users;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const response = await apiClient.get(`/users?limit=${limit}`);
      const apiUsers = response.data.users || [];
      const localUsers = this.getAllLocalUsers().map((u) => {
        const safe = { ...u };
        delete safe.password;
        return safe;
      });
      return [...localUsers, ...apiUsers];
    } catch {
      return this.getAllLocalUsers().map((u) => {
        const safe = { ...u };
        delete safe.password;
        return safe;
      });
    }
  },
};
