import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '@/utils/storage';

/**
 * Storage keys for simulating persistent CRUD operations.
 * DummyJSON is a read-only mockup API; write endpoints (/products/add, PUT, DELETE)
 * only return simulated responses without saving changes on their servers.
 * To provide a realistic, persistent Admin and storefront experience across page reloads,
 * we maintain a client-side overlay cache in localStorage.
 */
const OVERLAY_KEYS = {
  ADDED: 'nexcart_products_overlay_added',
  UPDATED: 'nexcart_products_overlay_updated',
  DELETED: 'nexcart_products_overlay_deleted',
};

const getOverlayState = () => {
  return {
    added: getStorageItem(OVERLAY_KEYS.ADDED, []),
    updated: getStorageItem(OVERLAY_KEYS.UPDATED, {}),
    deleted: getStorageItem(OVERLAY_KEYS.DELETED, []),
  };
};

/**
 * Normalizes DummyJSON product prices into realistic Indian Rupee (INR) amounts.
 * Conversion standard: 1 USD ≈ ₹85.
 * E.g., $9.99 becomes ₹849, $19.99 becomes ₹1,699, $1,899.99 becomes ₹1,61,499.
 * Locally created products (already in INR) or already processed items are preserved.
 */
export const normalizeProductPrice = (product) => {
  if (!product) return product;
  if (product._isConvertedToInr || product.isLocal) {
    return product;
  }
  const rawPrice = Number(product.price || 0);
  const inrPrice = Math.round(rawPrice * 85);
  return {
    ...product,
    price: inrPrice,
    _isConvertedToInr: true,
  };
};

/**
 * Applies local mutations (additions, overrides, and soft-deletes) to the API product array
 */
const applyLocalOverlay = (apiProducts = []) => {
  const { added, updated, deleted } = getOverlayState();
  const deletedSet = new Set(deleted.map(String));

  // 1. Filter out deleted products and apply updates to existing ones
  const mergedApi = apiProducts
    .filter((p) => !deletedSet.has(String(p.id)))
    .map((p) => {
      const normalized = normalizeProductPrice(p);
      if (updated[p.id]) {
        return { ...normalized, ...updated[p.id] };
      }
      return normalized;
    });

  // 2. Prepend locally created products that haven't been deleted
  const filteredAdded = added
    .filter((p) => !deletedSet.has(String(p.id)))
    .map((p) => (updated[p.id] ? { ...p, ...updated[p.id] } : p));

  return [...filteredAdded, ...mergedApi];
};

export const productService = {
  /**
   * Retrieves products from DummyJSON with optional pagination/sorting
   */
  async getProducts({ limit = 30, skip = 0, sortBy = '', order = 'asc' } = {}) {
    let url = `/products?limit=${limit}&skip=${skip}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    const response = await apiClient.get(url);
    const modifiedProducts = applyLocalOverlay(response.data.products || []);
    return {
      ...response.data,
      products: modifiedProducts,
      total: modifiedProducts.length,
    };
  },

  /**
   * Fetches all products (limit=0) to enable robust client-side filtering, sorting, and stats
   */
  async getAllProducts() {
    const response = await apiClient.get('/products?limit=0');
    const products = applyLocalOverlay(response.data.products || []);
    return {
      products,
      total: products.length,
    };
  },

  /**
   * Retrieves a single product by ID, checking local additions/overrides first
   */
  async getProductById(id) {
    const { added, updated, deleted } = getOverlayState();
    const strId = String(id);

    if (deleted.some((d) => String(d) === strId)) {
      const notFoundError = new Error(`Product #${id} was not found.`);
      notFoundError.status = 404;
      throw notFoundError;
    }

    // Check if created locally
    const localProduct = added.find((p) => String(p.id) === strId);
    if (localProduct) {
      return updated[strId] ? { ...localProduct, ...updated[strId] } : localProduct;
    }

    // Fetch from DummyJSON
    const response = await apiClient.get(`/products/${id}`);
    const product = normalizeProductPrice(response.data);

    if (updated[strId]) {
      return { ...product, ...updated[strId] };
    }
    return product;
  },

  /**
   * Search query endpoint
   */
  async searchProducts(query) {
    const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
    const filtered = applyLocalOverlay(response.data.products || []);
    return {
      ...response.data,
      products: filtered,
      total: filtered.length,
    };
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category) {
    const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`);
    const filtered = applyLocalOverlay(response.data.products || []);
    return {
      ...response.data,
      products: filtered,
      total: filtered.length,
    };
  },

  /**
   * Retrieves category list
   */
  async getCategories() {
    const response = await apiClient.get('/products/categories');
    // Normalize format since DummyJSON returns objects with { slug, name, url } in newer versions
    const rawData = response.data || [];
    return rawData.map((item) => {
      if (typeof item === 'string') {
        return { slug: item, name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ') };
      }
      return { slug: item.slug || item.name, name: item.name };
    });
  },

  /**
   * Adds product: calls DummyJSON endpoint and caches locally for persistence
   */
  async addProduct(productData) {
    let apiResult = {};
    try {
      const response = await apiClient.post('/products/add', productData);
      apiResult = response.data;
    } catch {
      // Continue even if network simulated endpoint fails
    }

    const { added } = getOverlayState();
    const newProduct = {
      ...productData,
      id: apiResult.id || Date.now(),
      rating: productData.rating || 4.5,
      stock: Number(productData.stock || 20),
      price: Number(productData.price || 0),
      discountPercentage: Number(productData.discountPercentage || 0),
      thumbnail: productData.thumbnail || productData.images?.[0] || '/src/assets/images/category_craft_objects_1791282688777.jpg',
      images: productData.images?.length ? productData.images : [productData.thumbnail || '/src/assets/images/category_craft_objects_1791282688777.jpg'],
    };

    setStorageItem(OVERLAY_KEYS.ADDED, [newProduct, ...added]);
    return newProduct;
  },

  /**
   * Updates product and saves override to localStorage
   */
  async updateProduct(id, updateData) {
    try {
      await apiClient.put(`/products/${id}`, updateData);
    } catch {
      // Simulated endpoint error handled gracefully
    }

    const { updated } = getOverlayState();
    const currentUpdates = updated[id] || {};
    const nextUpdates = { ...currentUpdates, ...updateData };

    setStorageItem(OVERLAY_KEYS.UPDATED, {
      ...updated,
      [id]: nextUpdates,
    });

    return { id, ...nextUpdates };
  },

  /**
   * Deletes product and registers ID into deleted set
   */
  async deleteProduct(id) {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch {
      // Gracefully proceed
    }

    const { deleted } = getOverlayState();
    if (!deleted.includes(id)) {
      setStorageItem(OVERLAY_KEYS.DELETED, [...deleted, id]);
    }

    return { success: true, id };
  },
};
