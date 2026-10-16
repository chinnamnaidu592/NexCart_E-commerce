import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { stripSensitiveFields } from '@/utils/sanitize';

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
  const storedAdded = getStorageItem(OVERLAY_KEYS.ADDED, []);
  const storedUpdated = getStorageItem(OVERLAY_KEYS.UPDATED, {});
  const storedDeleted = getStorageItem(OVERLAY_KEYS.DELETED, []);

  return {
    added: Array.isArray(storedAdded)
      ? storedAdded.filter((product) => product && typeof product === 'object' && !Array.isArray(product))
      : [],
    updated: storedUpdated && typeof storedUpdated === 'object' && !Array.isArray(storedUpdated)
      ? Object.fromEntries(
        Object.entries(storedUpdated)
          .filter(([, product]) => product && typeof product === 'object' && !Array.isArray(product))
      )
      : {},
    deleted: Array.isArray(storedDeleted)
      ? storedDeleted.filter((id) => typeof id === 'string' || typeof id === 'number')
      : [],
  };
};

const getMerchantId = (merchantUser) => {
  if (merchantUser?.role !== 'merchant' || merchantUser.id === undefined || merchantUser.id === null) {
    throw new Error('A signed-in Merchant with a stable user ID is required.');
  }
  const merchantId = String(merchantUser.id).trim();
  if (!merchantId) {
    throw new Error('A signed-in Merchant with a stable user ID is required.');
  }
  return merchantId;
};

const saveOverlayValue = (key, value) => {
  if (!setStorageItem(key, value)) {
    throw new Error('Could not save product changes to this browser.');
  }
};

const withoutOwnershipFields = (data, fieldNames) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Product data must be an object.');
  }
  const safeData = stripSensitiveFields(data);
  fieldNames.forEach((fieldName) => delete safeData[fieldName]);
  return safeData;
};

const mergeProductUpdates = (product, updates) => ({
  ...product,
  ...withoutOwnershipFields(updates, ['id', 'merchantId', 'ownerId', 'ownershipType']),
  ...(product.ownershipType === 'merchant'
    ? { merchantId: product.merchantId, ownershipType: 'merchant' }
    : {}),
});

const getMerchantProductRecord = (productId) => {
  const { added, updated, deleted } = getOverlayState();
  const product = added.find((item) => String(item.id) === String(productId));
  if (
    !product ||
    product.ownershipType !== 'merchant' ||
    deleted.some((id) => String(id) === String(productId))
  ) return null;
  const productUpdates = updated[String(productId)];
  return productUpdates && typeof productUpdates === 'object' && !Array.isArray(productUpdates)
    ? mergeProductUpdates(product, productUpdates)
    : product;
};

const getProductMerchantId = (productId) => {
  const product = getMerchantProductRecord(productId);
  return product?.merchantId === undefined || product?.merchantId === null
    ? null
    : String(product.merchantId);
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
        return mergeProductUpdates(normalized, updated[p.id]);
      }
      return normalized;
    });

  // 2. Prepend locally created products that haven't been deleted
  const filteredAdded = added
    .filter((p) => !deletedSet.has(String(p.id)))
    .map((p) => (updated[p.id] ? mergeProductUpdates(p, updated[p.id]) : p));

  return [...filteredAdded, ...mergedApi];
};

export const productService = {
  getMerchantProducts(merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    const { added, updated, deleted } = getOverlayState();
    const deletedIds = new Set(deleted.map(String));

    return added
      .filter((product) =>
        product.ownershipType === 'merchant' &&
        String(product.merchantId ?? '') === merchantId &&
        !deletedIds.has(String(product.id))
      )
      .map((product) => ({
        ...product,
        ...(updated[String(product.id)] && typeof updated[String(product.id)] === 'object' && !Array.isArray(updated[String(product.id)])
          ? withoutOwnershipFields(updated[String(product.id)], ['id', 'merchantId', 'ownerId', 'ownershipType'])
          : {}),
        merchantId: product.merchantId,
        ownershipType: product.ownershipType,
      }));
  },

  async addMerchantProduct(productData, merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    const safeProductData = withoutOwnershipFields(productData, ['merchantId', 'ownerId', 'ownershipType']);
    const { added } = getOverlayState();
    const fallbackImage = '/images/category_craft_objects_1791282688777.jpg';
    const image = safeProductData.thumbnail || safeProductData.images?.[0] || fallbackImage;
    const newProduct = {
      ...safeProductData,
      id: `merchant-${merchantId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      merchantId,
      ownershipType: 'merchant',
      isLocal: true,
      rating: safeProductData.rating || 4.5,
      stock: Number(safeProductData.stock ?? 20),
      price: Number(safeProductData.price || 0),
      discountPercentage: Number(safeProductData.discountPercentage || 0),
      thumbnail: image,
      images: safeProductData.images?.length ? safeProductData.images : [image],
    };

    saveOverlayValue(OVERLAY_KEYS.ADDED, [newProduct, ...added]);
    return newProduct;
  },

  async updateMerchantProduct(productId, updateData, merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    const currentProduct = getMerchantProductRecord(productId);
    if (!currentProduct || String(currentProduct.merchantId ?? '') !== merchantId) {
      throw new Error('Product not found in your store or you do not have permission to update it.');
    }

    const safeUpdateData = withoutOwnershipFields(updateData, [
      'id',
      'merchantId',
      'ownerId',
      'ownershipType',
    ]);
    const { updated } = getOverlayState();
    const productKey = String(productId);
    const nextUpdates = { ...(updated[productKey] || {}), ...safeUpdateData };
    saveOverlayValue(OVERLAY_KEYS.UPDATED, { ...updated, [productKey]: nextUpdates });

    return { ...currentProduct, ...safeUpdateData };
  },

  async deleteMerchantProduct(productId, merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    const product = getMerchantProductRecord(productId);
    if (!product || String(product.merchantId ?? '') !== merchantId) {
      throw new Error('Product not found in your store or you do not have permission to delete it.');
    }

    const { deleted } = getOverlayState();
    const deletedIds = new Set(deleted.map(String));
    deletedIds.add(String(productId));
    saveOverlayValue(OVERLAY_KEYS.DELETED, [...deletedIds]);
    return { success: true, id: productId };
  },

  getProductMerchantId,

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
      return updated[strId] && typeof updated[strId] === 'object' && !Array.isArray(updated[strId])
        ? mergeProductUpdates(localProduct, updated[strId])
        : localProduct;
    }

    // Fetch from DummyJSON
    const response = await apiClient.get(`/products/${id}`);
    const product = normalizeProductPrice(response.data);

    if (updated[strId]) {
      return mergeProductUpdates(product, updated[strId]);
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
    const safeProductData = withoutOwnershipFields(productData, [
      'merchantId',
      'ownerId',
      'ownershipType',
    ]);
    let apiResult = {};
    try {
      const response = await apiClient.post('/products/add', safeProductData);
      apiResult = response.data;
    } catch {
      // Continue even if network simulated endpoint fails
    }

    const { added } = getOverlayState();
    const newProduct = {
      ...safeProductData,
      id: apiResult.id || Date.now(),
      rating: safeProductData.rating || 4.5,
      stock: Number(safeProductData.stock || 20),
      price: Number(safeProductData.price || 0),
      discountPercentage: Number(safeProductData.discountPercentage || 0),
      thumbnail: safeProductData.thumbnail || safeProductData.images?.[0] || '/images/category_craft_objects_1791282688777.jpg',
      images: safeProductData.images?.length ? safeProductData.images : [safeProductData.thumbnail || '/images/category_craft_objects_1791282688777.jpg'],
    };

    saveOverlayValue(OVERLAY_KEYS.ADDED, [newProduct, ...added]);
    return newProduct;
  },

  /**
   * Updates product and saves override to localStorage
   */
  async updateProduct(id, updateData) {
    const safeUpdateData = withoutOwnershipFields(updateData, [
      'id',
      'merchantId',
      'ownerId',
      'ownershipType',
    ]);
    try {
      await apiClient.put(`/products/${id}`, safeUpdateData);
    } catch {
      // Simulated endpoint error handled gracefully
    }

    const { updated } = getOverlayState();
    const currentUpdates = updated[id] || {};
    const nextUpdates = { ...currentUpdates, ...safeUpdateData };

    saveOverlayValue(OVERLAY_KEYS.UPDATED, {
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
    const deletedIds = new Set(deleted.map(String));
    deletedIds.add(String(id));
    saveOverlayValue(OVERLAY_KEYS.DELETED, [...deletedIds]);

    return { success: true, id };
  },
};
