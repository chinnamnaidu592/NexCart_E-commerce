/**
 * Central route path constants to avoid magic strings across the codebase
 */
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  DEALS: '/deals',
  TOP_DEALS: '/top-deals',
  BESTSELLERS: '/bestsellers',
  BEST_SELLERS: '/best-sellers',
  DEPARTMENT: (slug) => `/department/${slug}`,
  DEPARTMENTS: '/departments',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  CART: '/cart',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CHECKOUT: '/checkout',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_EDIT: (id) => `/admin/products/${id}/edit`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
};
