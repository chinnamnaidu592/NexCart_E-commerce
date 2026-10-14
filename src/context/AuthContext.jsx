import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration safety: restore user session from localStorage only after client mounts
  useEffect(() => {
    try {
      const activeUser = userService.getCurrentUser();
      if (activeUser) {
        setUser(activeUser);
      }
    } catch (e) {
      console.error('Failed reading auth state from storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = async (usernameOrEmail, password, role = 'customer') => {
    try {
      setLoading(true);
      if (!['customer', 'merchant', 'admin'].includes(role)) {
        throw new Error('Choose a valid login role and try again.');
      }
      const loginMethods = {
        customer: userService.loginCustomer,
        merchant: userService.loginMerchant,
        admin: userService.loginAdmin,
      };
      const loginMethod = loginMethods[role];
      if (!loginMethod) {
        throw new Error('Choose a valid login role and try again.');
      }

      const { user: loggedInUser } = await loginMethod.call(
        userService,
        usernameOrEmail,
        password
      );
      setUser(loggedInUser);
      toast.success(
        role === 'merchant'
          ? `Welcome to Merchant Console, ${loggedInUser.firstName || loggedInUser.username}!`
          : role === 'admin'
            ? `Welcome to Admin, ${loggedInUser.firstName || loggedInUser.username}!`
            : `Welcome back, ${loggedInUser.firstName || loggedInUser.username}!`
      );
      return loggedInUser;
    } catch (error) {
      toast.error(error.message || 'Login failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registrationData, { autoLogin = true } = {}) => {
    try {
      setLoading(true);
      const { user: newUser } = await userService.register(registrationData, { autoLogin });
      if (autoLogin) setUser(newUser);
      const isRegisteredMerchant = newUser.role === 'merchant';
      toast.success(
        isRegisteredMerchant
          ? `Welcome Partner! Your merchant store "${newUser.storeName || 'Atelier'}" is active.`
          : `Account created! Welcome to NexCart, ${newUser.firstName}!`
      );
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (fields) => {
    try {
      const updated = userService.updateProfile(fields);
      setUser(updated);
      toast.success('Profile updated successfully.');
      return updated;
    } catch (error) {
      toast.error(error.message || 'Could not update profile.');
      throw error;
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success('You have been logged out.');
  };

  const isAdmin = Boolean(user && user.role === 'admin');
  const isMerchant = Boolean(user && user.role === 'merchant');
  const isCustomer = Boolean(!user || user.role === 'customer');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isHydrated,
        isAdmin,
        isMerchant,
        isCustomer,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
