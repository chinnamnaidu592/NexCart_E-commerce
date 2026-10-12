import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useRouter } from '@/router/RouterContext';
import { getOrCreateGuestSessionId, regenerateGuestSessionId } from '@/utils/session';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isHydrated: authHydrated } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState(null);
  const { addToCart } = useCart();

  const prevUserRef = useRef(undefined);

  const getStorageKey = (currentUser, currentGuestId) => {
    if (currentUser?.id) {
      return `nexcart_wishlist_user_${currentUser.id}`;
    }
    const gId = currentGuestId || getOrCreateGuestSessionId();
    return `nexcart_wishlist_guest_${gId}`;
  };

  // Initial load and user transition handler (Guest <-> User mapping)
  useEffect(() => {
    if (!authHydrated) return;

    const gId = getOrCreateGuestSessionId();
    setGuestSessionId(gId);

    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    // CASE 1: Initial Mount
    if (prevUser === undefined) {
      const key = getStorageKey(user, gId);
      const saved = getStorageItem(key, []);
      setItems(saved);
      setIsHydrated(true);
      return;
    }

    // CASE 2: User Logged In (Guest -> Authenticated)
    if (!prevUser && user) {
      const guestKey = getStorageKey(null, gId);
      const guestItems = getStorageItem(guestKey, []);
      const userKey = getStorageKey(user, null);
      const userItems = getStorageItem(userKey, []);

      // Merge unique items from guest wishlist into user wishlist
      let mergedItems = [...userItems];
      if (guestItems.length > 0) {
        guestItems.forEach((gItem) => {
          if (!mergedItems.some((uItem) => String(uItem.id) === String(gItem.id))) {
            mergedItems.push({
              ...gItem,
              userId: user.id,
              guestSessionId: null,
            });
          }
        });

        removeStorageItem(guestKey);
        setStorageItem(userKey, mergedItems);
      }

      setItems(mergedItems);
      return;
    }

    // CASE 3: User Logged Out (Authenticated -> Guest)
    if (prevUser && !user) {
      const newGuestId = regenerateGuestSessionId();
      setGuestSessionId(newGuestId);
      setItems([]);
      return;
    }

    // CASE 4: Different user logged in
    if (prevUser && user && prevUser.id !== user.id) {
      const userKey = getStorageKey(user, null);
      const saved = getStorageItem(userKey, []);
      setItems(saved);
    }
  }, [user, authHydrated]);

  // Sync state changes to scoped localStorage once hydrated
  useEffect(() => {
    if (isHydrated && authHydrated) {
      const key = getStorageKey(user, guestSessionId);
      setStorageItem(key, items);
    }
  }, [items, isHydrated, authHydrated, user, guestSessionId]);

  const isInWishlist = (id) => {
    return items.some((item) => String(item.id) === String(id));
  };

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error('Please log in to add items to your wishlist.');
      router.push('/login?role=customer');
      return;
    }

    if (isInWishlist(product.id)) {
      setItems((prev) => prev.filter((item) => String(item.id) !== String(product.id)));
      toast.success(`Removed "${product.title}" from wishlist`);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          rating: product.rating,
          thumbnail: product.thumbnail || product.images?.[0] || '',
          category: product.category,
          stock: product.stock,
          userId: user?.id || null,
          guestSessionId: null,
        },
      ]);
      toast.success(`Saved "${product.title}" to wishlist ❤️`);
    }
  };

  const removeFromWishlist = (id, title = '') => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    toast.success(title ? `Removed "${title}" from wishlist` : 'Removed from wishlist');
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success(`Moved "${product.title}" to cart`);
  };

  const clearWishlist = () => {
    setItems([]);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        guestSessionId,
        wishlistUserId: user?.id || null,
        isGuest: !user,
        isHydrated,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
