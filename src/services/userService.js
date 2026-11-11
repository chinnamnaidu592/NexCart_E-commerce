import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage';

const PROFILE_KEY_PREFIX = 'nexcart_demo_profile_';
const PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'dateOfBirth',
  'image',
  'addresses',
  'paymentPreference',
];

const getProfileKey = (userId) => `${PROFILE_KEY_PREFIX}${userId}`;

async function readResponse(response, fallbackMessage) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Unable to process the authentication response.');
  }
  if (!response.ok || data.success === false) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
}

function withLocalProfile(user) {
  if (!user) return null;
  const savedProfile = getStorageItem(getProfileKey(user.id), {});
  const profile = savedProfile && typeof savedProfile === 'object' && !Array.isArray(savedProfile)
    ? Object.fromEntries(
      PROFILE_FIELDS
        .filter((field) => Object.hasOwn(savedProfile, field))
        .map((field) => [field, savedProfile[field]])
    )
    : {};

  return {
    ...user,
    ...profile,
    id: user.id,
    role: user.role,
    username: user.username,
  };
}

export const userService = {
  async loginWithRole(usernameOrEmail, password, requestedRole) {
    if (!['customer', 'merchant', 'admin'].includes(requestedRole)) {
      throw new Error('Choose a valid login role and try again.');
    }

    const response = await fetch(`/api/auth/${requestedRole}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      body: JSON.stringify({ identifier: usernameOrEmail, password }),
    });
    const data = await readResponse(response, 'Authentication failed.');
    if (data.user?.role !== requestedRole) {
      throw new Error(`This account is not registered for ${requestedRole} login.`);
    }
    return { user: withLocalProfile(data.user) };
  },

  async loginCustomer(usernameOrEmail, password) {
    return this.loginWithRole(usernameOrEmail, password, 'customer');
  },

  async loginMerchant(usernameOrEmail, password) {
    return this.loginWithRole(usernameOrEmail, password, 'merchant');
  },

  async loginAdmin(usernameOrEmail, password) {
    return this.loginWithRole(usernameOrEmail, password, 'admin');
  },

  async register(registrationData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      body: JSON.stringify(registrationData),
    });
    const data = await readResponse(response, 'Registration failed.');
    if (!data.user) throw new Error('The demo account could not be created.');
    return { user: withLocalProfile(data.user) };
  },

  async getCurrentUser() {
    const response = await fetch('/api/auth/session', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await readResponse(response, 'Unable to restore the demo session.');
    return withLocalProfile(data.user);
  },

  updateProfile(currentUser, updatedFields) {
    if (!currentUser?.id) throw new Error('Not logged in.');
    if (!updatedFields || typeof updatedFields !== 'object' || Array.isArray(updatedFields)) {
      throw new Error('Profile updates must be an object.');
    }

    const profile = Object.fromEntries(
      PROFILE_FIELDS
        .filter((field) => Object.hasOwn(updatedFields, field))
        .map((field) => [field, updatedFields[field]])
    );
    const nextProfile = {
      ...getStorageItem(getProfileKey(currentUser.id), {}),
      ...profile,
    };
    if (!setStorageItem(getProfileKey(currentUser.id), nextProfile)) {
      throw new Error('Could not save your profile in this browser.');
    }

    return {
      ...currentUser,
      ...profile,
      id: currentUser.id,
      role: currentUser.role,
      username: currentUser.username,
    };
  },

  async logout(currentUser) {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
    });
    await readResponse(response, 'Could not end the demo session.');
    if (currentUser?.id) removeStorageItem(getProfileKey(currentUser.id));
  },

  async getCustomers() {
    const response = await fetch('/api/auth/users', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await readResponse(response, 'Unable to load demo accounts.');
    if (!Array.isArray(data.users)) {
      throw new Error('The demo account response was invalid.');
    }
    return data.users;
  },
};
