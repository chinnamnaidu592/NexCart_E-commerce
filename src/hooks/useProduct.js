import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

/**
 * Custom hook to fetch a single product by ID along with its category related items.
 * Manages Loading, Success, Empty (404), and Error states with retry.
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);

      // Fetch related products in the same category
      if (data.category) {
        try {
          const categoryRes = await productService.getProductsByCategory(data.category);
          const filtered = (categoryRes.products || [])
            .filter((p) => String(p.id) !== String(productId))
            .slice(0, 4);
          setRelatedProducts(filtered);
        } catch {
          setRelatedProducts([]);
        }
      }
    } catch (err) {
      console.error(`Error loading product #${productId}:`, err);
      setError(err.message || 'Unable to load product details.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    product,
    relatedProducts,
    loading,
    error,
    isNotFound: !loading && !product && !error,
    refetch: fetchDetail,
  };
};
