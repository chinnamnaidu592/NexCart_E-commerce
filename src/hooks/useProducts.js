import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

/**
 * Custom hook to fetch the product catalog.
 * Manages all four required API states: Loading, Success, Empty, Error with retry function.
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes || []);
    } catch (err) {
      console.error('Failed fetching products:', err);
      setError(err.message || 'Could not load products catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return {
    products,
    categories,
    loading,
    error,
    isEmpty: !loading && !error && products.length === 0,
    refetch: fetchCatalog,
  };
};
