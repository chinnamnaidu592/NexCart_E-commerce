import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import {
  calculateCartSubtotal,
  calculatePromoDiscount,
  calculateShippingFee,
  calculateTax,
  calculateFinalTotal,
} from '@/utils/calculations';
import { useAuth } from './AuthContext';
import { useRouter } from '@/router/RouterContext';
import { getOrCreateGuestSessionId, regenerateGuestSessionId } from '@/utils/session';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  INCREASE_QTY: 'INCREASE_QTY',
  DECREASE_QTY: 'DECREASE_QTY',
  CLEAR_CART: 'CLEAR_CART',
  SET_PROMO: 'SET_PROMO',
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        promoCode: action.payload.promoCode || null,
      };

    case CART_ACTIONS.ADD_ITEM: {
      const product = action.payload.product;
      const quantityToAdd = Number(action.payload.quantity || 1);
      const userId = action.payload.userId || null;
      const guestSessionId = action.payload.guestSessionId || null;

      const existingIndex = state.items.findIndex((item) => String(item.id) === String(product.id));

      let updatedItems;
      if (existingIndex > -1) {
        updatedItems = state.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantityToAdd;
            return {
              ...item,
              quantity: product.stock ? Math.min(newQty, product.stock) : newQty,
              userId,
              guestSessionId,
            };
          }
          return item;
        });
      } else {
        updatedItems = [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: Number(product.price || 0),
            discountPercentage: Number(product.discountPercentage || 0),
            thumbnail: product.thumbnail || product.images?.[0] || '',
            stock: product.stock ?? 50,
            quantity: quantityToAdd,
            userId,
            guestSessionId,
          },
        ];
      }
      return { ...state, items: updatedItems };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const filtered = state.items.filter((item) => String(item.id) !== String(action.payload.id));
      return { ...state, items: filtered };
    }

    case CART_ACTIONS.INCREASE_QTY: {
      const updated = state.items.map((item) => {
        if (String(item.id) === String(action.payload.id)) {
          const maxStock = item.stock || 99;
          const newQty = Math.min(item.quantity + 1, maxStock);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return { ...state, items: updated };
    }

    case CART_ACTIONS.DECREASE_QTY: {
      const updated = state.items
        .map((item) => {
          if (String(item.id) === String(action.payload.id)) {
            const newQty = item.quantity - 1;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
      return { ...state, items: updated };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [], promoCode: null };

    case CART_ACTIONS.SET_PROMO:
      return { ...state, promoCode: action.payload.promoCode };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user, isHydrated: authHydrated } = useAuth();
  const router = useRouter();
  const [state, dispatch] = useReducer(cartReducer, { items: [], promoCode: null });
  const [isHydrated, setIsHydrated] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState(null);

  // Track previous user to detect Login / Logout transitions
  const prevUserRef = useRef(undefined);

  // Computes the isolated storage keys for user vs guest session
  const getStorageKeys = (currentUser, currentGuestId) => {
    if (currentUser?.id) {
      return {
        cartKey: `nexcart_cart_user_${currentUser.id}`,
        promoKey: `nexcart_promo_user_${currentUser.id}`,
      };
    }
    const gId = currentGuestId || getOrCreateGuestSessionId();
    return {
      cartKey: `nexcart_cart_guest_${gId}`,
      promoKey: `nexcart_promo_guest_${gId}`,
    };
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
      const { cartKey, promoKey } = getStorageKeys(user, gId);
      const savedItems = getStorageItem(cartKey, []);
      const savedPromo = getStorageItem(promoKey, null);
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items: savedItems, promoCode: savedPromo },
      });
      setIsHydrated(true);
      return;
    }

    // CASE 2: User Just Logged In (Guest -> Authenticated)
    if (!prevUser && user) {
      const guestKeys = getStorageKeys(null, gId);
      const guestItems = getStorageItem(guestKeys.cartKey, []);
      const userKeys = getStorageKeys(user, null);
      const userItems = getStorageItem(userKeys.cartKey, []);

      // Merge guest items into user cart
      let mergedItems = [...userItems];
      if (guestItems.length > 0) {
        guestItems.forEach((gItem) => {
          const existingIdx = mergedItems.findIndex((uItem) => String(uItem.id) === String(gItem.id));
          if (existingIdx > -1) {
            const combined = mergedItems[existingIdx].quantity + gItem.quantity;
            mergedItems[existingIdx] = {
              ...mergedItems[existingIdx],
              quantity: gItem.stock ? Math.min(combined, gItem.stock) : combined,
              userId: user.id,
              guestSessionId: null,
            };
          } else {
            mergedItems.push({
              ...gItem,
              userId: user.id,
              guestSessionId: null,
            });
          }
        });

        // Clear guest cart after successful migration
        removeStorageItem(guestKeys.cartKey);
        removeStorageItem(guestKeys.promoKey);
        toast.success('Your guest cart items were saved to your account.');
      }

      const savedPromo = getStorageItem(userKeys.promoKey, null);
      setStorageItem(userKeys.cartKey, mergedItems);
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items: mergedItems, promoCode: savedPromo },
      });
      return;
    }

    // CASE 3: User Logged Out (Authenticated -> Guest)
    if (prevUser && !user) {
      // Create new clean guest session ID
      const newGuestId = regenerateGuestSessionId();
      setGuestSessionId(newGuestId);
      // Reset in-memory cart for the new guest session
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items: [], promoCode: null },
      });
      return;
    }

    // CASE 4: Different user logged in
    if (prevUser && user && prevUser.id !== user.id) {
      const { cartKey, promoKey } = getStorageKeys(user, null);
      const savedItems = getStorageItem(cartKey, []);
      const savedPromo = getStorageItem(promoKey, null);
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items: savedItems, promoCode: savedPromo },
      });
    }
  }, [user, authHydrated]);

  // Sync state changes to scoped localStorage once hydrated
  useEffect(() => {
    if (isHydrated && authHydrated) {
      const { cartKey, promoKey } = getStorageKeys(user, guestSessionId);
      setStorageItem(cartKey, state.items);
      setStorageItem(promoKey, state.promoCode);
    }
  }, [state.items, state.promoCode, isHydrated, authHydrated, user, guestSessionId]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      router.push('/login?role=customer');
      return;
    }

    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: {
        product,
        quantity,
        userId: user?.id || null,
        guestSessionId: null,
      },
    });
    toast.success(`Added "${product.title}" to cart`);
  };

  const removeFromCart = (id, title = '') => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id },
    });
    toast.success(title ? `Removed "${title}" from cart` : 'Item removed from cart');
  };

  const increaseQty = (id) => {
    dispatch({ type: CART_ACTIONS.INCREASE_QTY, payload: { id } });
  };

  const decreaseQty = (id) => {
    dispatch({ type: CART_ACTIONS.DECREASE_QTY, payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const applyPromoCode = (code) => {
    const upper = String(code).trim().toUpperCase();
    if (upper === 'SAVE10' || upper === 'WELCOME20' || upper === 'FREESHIP') {
      dispatch({ type: CART_ACTIONS.SET_PROMO, payload: { promoCode: upper } });
      toast.success(`Promo code "${upper}" applied!`);
      return true;
    }
    toast.error('Invalid promo code. Try "SAVE10" or "WELCOME20"');
    return false;
  };

  const removePromoCode = () => {
    dispatch({ type: CART_ACTIONS.SET_PROMO, payload: { promoCode: null } });
    toast('Promo code removed.');
  };

  // Derived financial metrics
  const totalItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateCartSubtotal(state.items);
  const promoDiscount = calculatePromoDiscount(subtotal, state.promoCode);
  const shippingFee = calculateShippingFee(subtotal, state.promoCode);
  const tax = calculateTax(subtotal, promoDiscount);
  const total = calculateFinalTotal(subtotal, promoDiscount, shippingFee, tax);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        guestSessionId,
        cartUserId: user?.id || null,
        isGuest: !user,
        totalItemsCount,
        subtotal,
        promoDiscount,
        shippingFee,
        tax,
        total,
        isHydrated,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
